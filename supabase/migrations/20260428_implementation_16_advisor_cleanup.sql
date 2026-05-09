-- Migration: IMPLEMENTATION_16 Phase 1 — Advisor cleanup
-- Date: 2026-04-28 (applied immediately after 20260428_implementation_16_rls.sql)
-- Purpose: silence two categories of Supabase advisor WARN findings.
--
-- 1. function_search_path_mutable
--    Pin `search_path = public` on every plpgsql function we own. Defends
--    against schema-shadowing attacks where a malicious search_path could
--    intercept references to public.products etc.
--
-- 2. anon_/authenticated_security_definer_function_executable
--    Trigger-only / definer functions (handle_*, update_product_rating,
--    log_*, protect_*) should never be reachable as `/rest/v1/rpc/<name>`.
--    Postgres' default ACL grants EXECUTE to PUBLIC, which transitively
--    covers anon + authenticated. Revoke from PUBLIC explicitly.
--
-- Triggers continue to fire because the table-owner privilege overrides
-- the EXECUTE check at trigger-invocation time.
--
-- This migration is also additionally applied to functions added by the
-- preceding migrations (20240303_triggers_and_functions has SECURITY
-- DEFINER added to log_order_status_change + log_inventory_change at
-- apply-time; 20260310_product_reviews has SECURITY DEFINER added to
-- update_product_rating at apply-time). The CREATE OR REPLACE in those
-- earlier files was patched in-flight against the new project — see the
-- notes appended at the bottom of this file.

begin;

-- 1. search_path pinning ----------------------------------------------------

alter function public.handle_updated_at()                 set search_path = public;
alter function public.update_updated_at_column()          set search_path = public;
alter function public.log_order_status_change()           set search_path = public;
alter function public.log_inventory_change()              set search_path = public;
alter function public.create_daily_analytics_snapshot()   set search_path = public;
alter function public.update_product_rating()             set search_path = public;
alter function public.handle_new_user_profile()           set search_path = public;
alter function public.protect_profile_immutables()        set search_path = public;

-- 2. EXECUTE revokes --------------------------------------------------------

revoke execute on function public.handle_updated_at()                 from public, anon, authenticated;
revoke execute on function public.update_updated_at_column()          from public, anon, authenticated;
revoke execute on function public.log_order_status_change()           from public, anon, authenticated;
revoke execute on function public.log_inventory_change()              from public, anon, authenticated;
revoke execute on function public.create_daily_analytics_snapshot()   from public, anon, authenticated;
revoke execute on function public.update_product_rating()             from public, anon, authenticated;
revoke execute on function public.handle_new_user_profile()           from public, anon, authenticated;
revoke execute on function public.protect_profile_immutables()        from public, anon, authenticated;

commit;

-- ============================================================
-- APPLY-TIME PATCHES TO PRECEDING MIGRATIONS
-- ============================================================
-- The following CREATE OR REPLACE FUNCTION calls were applied to the new
-- arasounds project on 2026-04-28 via the Supabase MCP, on top of the
-- canonical text in 20240303_triggers_and_functions.sql and
-- 20260310_product_reviews.sql. They add SECURITY DEFINER so the trigger
-- functions can write to their target tables (which now have RLS enabled
-- by the project-wide auto-RLS event trigger).
--
-- For repo fidelity, re-applying this migration is safe: each statement
-- below is idempotent against the current DB state.

-- (a) order audit trail trigger
create or replace function public.log_order_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    if (old.status is null or old.status <> new.status) then
        insert into order_status_history (order_id, status)
        values (new.id, new.status);
    end if;
    return new;
end;
$$;
revoke execute on function public.log_order_status_change() from public, anon, authenticated;

-- (b) inventory log trigger
create or replace function public.log_inventory_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    if (old.stock_quantity <> new.stock_quantity) then
        insert into inventory_logs (product_id, old_quantity, new_quantity)
        values (new.id, old.stock_quantity, new.stock_quantity);
    end if;
    return new;
end;
$$;
revoke execute on function public.log_inventory_change() from public, anon, authenticated;

-- (c) product rating roll-up trigger (must update products which is
--     admin-write-only — needs SECURITY DEFINER to write as table owner)
create or replace function public.update_product_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    v_product_id uuid;
    v_avg_rating numeric;
    v_count integer;
begin
    if tg_op = 'INSERT' then
        v_product_id := new.product_id;
    elsif tg_op = 'UPDATE' then
        v_product_id := new.product_id;
    elsif tg_op = 'DELETE' then
        v_product_id := old.product_id;
    end if;

    select
        coalesce(round(avg(rating)::numeric, 1), 0),
        count(*)
    into v_avg_rating, v_count
    from public.product_reviews
    where product_id = v_product_id;

    update public.products
    set rating = v_avg_rating,
        reviews_count = v_count
    where id = v_product_id;

    if tg_op = 'DELETE' then return old; else return new; end if;
end;
$$;
revoke execute on function public.update_product_rating() from public, anon, authenticated;

-- ============================================================
-- AUDIT-TABLE RLS
-- ============================================================
-- Auto-RLS enabled RLS on order_status_history + inventory_logs. They
-- need an admin-read SELECT policy (the SECURITY DEFINER trigger above
-- handles writes); without it, admins can't view audit trails.

alter table public.order_status_history enable row level security;
do $$
begin
    if not exists (
        select 1 from pg_policies
        where tablename = 'order_status_history'
          and policyname = 'Admins can read order_status_history'
    ) then
        create policy "Admins can read order_status_history" on public.order_status_history
            for select using (
                exists (select 1 from public.admin_users
                        where id = auth.uid() and is_active = true)
            );
    end if;
end $$;

alter table public.inventory_logs enable row level security;
do $$
begin
    if not exists (
        select 1 from pg_policies
        where tablename = 'inventory_logs'
          and policyname = 'Admins can read inventory_logs'
    ) then
        create policy "Admins can read inventory_logs" on public.inventory_logs
            for select using (
                exists (select 1 from public.admin_users
                        where id = auth.uid() and is_active = true)
            );
    end if;
end $$;
