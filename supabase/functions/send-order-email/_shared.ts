// Shared helpers for the send-order-email edge function.
//
// NOTE: This file uses Deno-style imports because Supabase Edge Functions run
// on Deno. It is intentionally NOT loaded by the Vite frontend bundle.

export const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export const formatTRY = (n: number) =>
    `${n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`;

export const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("tr-TR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

export const truncateId = (id: string) => String(id).substring(0, 8).toUpperCase();
