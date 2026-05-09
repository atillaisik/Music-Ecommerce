import { supabase } from './supabaseClient';

type EmailPayload =
    | { type: 'order_confirmation'; order_id: string }
    | { type: 'shipping_notification'; order_id: string; tracking_number: string; carrier: string }
    | { type: 'password_reset'; email: string; reset_url: string }
    | { type: 'refund_issued'; order_id: string; refund_amount: number };

/**
 * Fire-and-forget invocation of the `send-order-email` edge function.
 *
 * Errors are logged but never thrown — a failed email should not block the
 * user-facing checkout / status update flow. The edge function itself decides
 * whether to send via Resend, n8n, or no-op (dev environment without secrets).
 */
export const sendTransactionalEmail = async (payload: EmailPayload): Promise<void> => {
    try {
        const { error } = await supabase.functions.invoke('send-order-email', {
            body: payload,
        });
        if (error) {
            console.warn('[sendTransactionalEmail] non-fatal error:', error.message);
        }
    } catch (err) {
        console.warn('[sendTransactionalEmail] non-fatal error:', err);
    }
};
