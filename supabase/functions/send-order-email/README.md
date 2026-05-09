# `send-order-email` Edge Function

Renders a Turkish transactional email from a typed payload and dispatches it
via Resend (preferred) or an n8n webhook.

## Supported payloads

```ts
{ type: "order_confirmation", order_id: string }
{ type: "shipping_notification", order_id: string, tracking_number: string, carrier: string }
{ type: "password_reset", email: string, reset_url: string }
{ type: "refund_issued", order_id: string, refund_amount: number }
```

## Environment variables (set as Supabase secrets)

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | yes (auto) | Project URL — Supabase injects this. |
| `SUPABASE_SERVICE_ROLE_KEY` | yes (auto) | Service role — Supabase injects this. |
| `RESEND_API_KEY` | one of | Resend API key. Use this OR `N8N_WEBHOOK_URL`. |
| `N8N_WEBHOOK_URL` | one of | n8n webhook URL. Falls back if `RESEND_API_KEY` not set. |
| `ORDER_FROM_EMAIL` | no | "From" header (default: `ARASOUNDS <siparis@arasounds.com>`). Must be on a Resend-verified domain. |

Set with the Supabase CLI:

```bash
supabase secrets set RESEND_API_KEY=re_xxxxxxx
supabase secrets set ORDER_FROM_EMAIL='ARASOUNDS <siparis@arasounds.com>'
# OR (for n8n)
supabase secrets set N8N_WEBHOOK_URL='https://n8n.example.com/webhook/orders'
```

## Deploy

```bash
cd Music-Ecommerce
supabase functions deploy send-order-email
```

## Test locally

```bash
supabase functions serve send-order-email --env-file ./supabase/.env.local
# In another terminal:
curl -X POST http://127.0.0.1:54321/functions/v1/send-order-email \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"type":"order_confirmation","order_id":"<some-order-uuid>"}'
```

## Calling from the storefront

```ts
import { supabase } from "@/lib/supabaseClient";
await supabase.functions.invoke("send-order-email", {
  body: { type: "order_confirmation", order_id: orderId },
});
```

## Notes

- Templates are HTML with inline styles (max email-client compatibility).
- Currency is formatted in Turkish locale with `₺` suffix.
- Subject lines and preheaders are in Turkish.
- The function fetches the order with the **service role** key, so it works
  for anonymous/guest orders as well as authenticated.
- If neither `RESEND_API_KEY` nor `N8N_WEBHOOK_URL` is set, the function
  logs and returns 200 with `{ ok: false, reason: "no-transport-configured" }` —
  this lets dev environments run without breaking the checkout flow.
