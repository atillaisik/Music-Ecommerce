// Edge function: send-order-email
//
// Accepts a typed payload, fetches the relevant order from Supabase using the
// service role, renders a Turkish HTML email template, and dispatches via:
//   - Resend HTTPS API (default) when RESEND_API_KEY is set
//   - n8n webhook   when N8N_WEBHOOK_URL is set (no RESEND_API_KEY)
//
// This deliberately supports both transports so the storefront can keep the
// same client call regardless of whether you run Resend natively or pipe
// through n8n + Airtable.

// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "./_shared.ts";
import {
    orderConfirmationTemplate,
    shippingNotificationTemplate,
    passwordResetTemplate,
    refundIssuedTemplate,
} from "./templates.ts";

type Payload =
    | { type: "order_confirmation"; order_id: string }
    | { type: "shipping_notification"; order_id: string; tracking_number: string; carrier: string }
    | { type: "password_reset"; email: string; reset_url: string }
    | { type: "refund_issued"; order_id: string; refund_amount: number };

const RESEND_KEY = Deno.env.get("RESEND_API_KEY");
const N8N_WEBHOOK = Deno.env.get("N8N_WEBHOOK_URL");
const FROM_EMAIL = Deno.env.get("ORDER_FROM_EMAIL") ?? "ARASOUNDS <siparis@arasounds.com>";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

const fetchOrder = async (orderId: string) => {
    const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(quantity, price_at_purchase, product:products(name))")
        .eq("id", orderId)
        .single();
    if (error || !data) throw new Error(error?.message ?? "Order not found");
    return data;
};

const renderEmail = async (
    payload: Payload,
): Promise<{ to: string; subject: string; html: string; text: string }> => {
    switch (payload.type) {
        case "order_confirmation": {
            const order = await fetchOrder(payload.order_id);
            const t = orderConfirmationTemplate(order);
            return { to: order.customer_email, ...t };
        }
        case "shipping_notification": {
            const order = await fetchOrder(payload.order_id);
            const t = shippingNotificationTemplate(order, payload.tracking_number, payload.carrier);
            return { to: order.customer_email, ...t };
        }
        case "refund_issued": {
            const order = await fetchOrder(payload.order_id);
            const t = refundIssuedTemplate(order, payload.refund_amount);
            return { to: order.customer_email, ...t };
        }
        case "password_reset": {
            const t = passwordResetTemplate(payload.email, payload.reset_url);
            return { to: payload.email, ...t };
        }
        default:
            throw new Error("Unknown email type");
    }
};

const sendViaResend = async (msg: { to: string; subject: string; html: string; text: string }) => {
    const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${RESEND_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: FROM_EMAIL,
            to: [msg.to],
            subject: msg.subject,
            html: msg.html,
            text: msg.text,
        }),
    });
    if (!r.ok) {
        const body = await r.text();
        throw new Error(`Resend ${r.status}: ${body}`);
    }
    return await r.json();
};

const sendViaN8n = async (
    payload: Payload,
    msg: { to: string; subject: string; html: string; text: string },
) => {
    const r = await fetch(N8N_WEBHOOK!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload, message: msg }),
    });
    if (!r.ok) {
        const body = await r.text();
        throw new Error(`n8n ${r.status}: ${body}`);
    }
    return { ok: true };
};

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const payload = (await req.json()) as Payload;
        const message = await renderEmail(payload);

        let result: any;
        if (RESEND_KEY) {
            result = await sendViaResend(message);
        } else if (N8N_WEBHOOK) {
            result = await sendViaN8n(payload, message);
        } else {
            // No transport configured — log payload and succeed so dev doesn't break.
            console.warn("[send-order-email] No RESEND_API_KEY or N8N_WEBHOOK_URL configured. Email skipped.");
            result = { ok: false, reason: "no-transport-configured" };
        }

        return new Response(JSON.stringify({ ok: true, result }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (err) {
        console.error("[send-order-email]", err);
        return new Response(
            JSON.stringify({ ok: false, error: (err as Error).message }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 500,
            },
        );
    }
});
