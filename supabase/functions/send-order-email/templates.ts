// Turkish HTML email templates for ARASOUNDS transactional emails.
//
// Designed with table-based inline-styled layout for maximum email-client
// compatibility (Gmail, Outlook, Apple Mail, mobile clients). Pure HTML — no
// frameworks. Each template returns `{ subject, html, text }`.

import { formatTRY, formatDate, truncateId } from "./_shared.ts";

const BRAND = "ARASOUNDS";
const PRIMARY = "#dc2626"; // Match the storefront primary
const FOREGROUND = "#0f172a";
const MUTED = "#64748b";
const BORDER = "#e2e8f0";
const BG = "#ffffff";
const ACCENT_BG = "#fef2f2";

interface OrderItem {
    quantity: number;
    price_at_purchase: number;
    product?: { name?: string };
}

interface Order {
    id: string;
    customer_name: string;
    customer_email: string;
    total_amount: number;
    discount_amount?: number | null;
    shipping_address: string;
    status: string;
    payment_method?: string | null;
    created_at: string;
    order_items?: OrderItem[];
}

const wrapper = (innerHtml: string, preheader: string) => `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${BRAND}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:${FOREGROUND};">
<div style="display:none;font-size:1px;color:#f1f5f9;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f1f5f9;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background-color:${BG};border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.04);">
<tr><td style="padding:32px 32px 24px;background-color:${ACCENT_BG};border-bottom:1px solid ${BORDER};">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
<tr>
<td style="font-family:'Helvetica Neue',Arial,sans-serif;font-weight:900;font-size:22px;letter-spacing:0.04em;color:${FOREGROUND};text-transform:uppercase;">${BRAND}</td>
<td align="right" style="font-size:11px;color:${MUTED};letter-spacing:0.1em;text-transform:uppercase;font-weight:700;">Müzik · Enstrüman</td>
</tr>
</table>
</td></tr>
${innerHtml}
<tr><td style="padding:24px 32px 32px;background-color:#f8fafc;border-top:1px solid ${BORDER};font-size:11px;color:${MUTED};line-height:1.6;">
<p style="margin:0 0 8px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:${FOREGROUND};">${BRAND}</p>
<p style="margin:0 0 4px;">Bu e-posta, sipariş veya hesap işlemleriniz nedeniyle gönderilmiştir.</p>
<p style="margin:0;">Sorularınız için <a href="mailto:destek@arasounds.com" style="color:${PRIMARY};text-decoration:none;font-weight:600;">destek@arasounds.com</a></p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

const button = (label: string, href: string) =>
    `<a href="${href}" style="display:inline-block;padding:12px 24px;background-color:${PRIMARY};color:#ffffff;font-weight:700;text-decoration:none;border-radius:8px;font-size:14px;letter-spacing:0.04em;">${label}</a>`;

const itemsTable = (items: OrderItem[]) => `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:16px 0;">
<tr>
<td style="padding:8px 0;border-bottom:2px solid ${BORDER};font-size:11px;color:${MUTED};text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">Ürün</td>
<td align="right" style="padding:8px 0;border-bottom:2px solid ${BORDER};font-size:11px;color:${MUTED};text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">Adet</td>
<td align="right" style="padding:8px 0;border-bottom:2px solid ${BORDER};font-size:11px;color:${MUTED};text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">Tutar</td>
</tr>
${items
    .map(
        (it) => `<tr>
<td style="padding:12px 0;border-bottom:1px solid ${BORDER};font-size:14px;font-weight:600;">${
            it.product?.name ?? "Ürün"
        }</td>
<td align="right" style="padding:12px 0;border-bottom:1px solid ${BORDER};font-size:14px;color:${MUTED};">${it.quantity}</td>
<td align="right" style="padding:12px 0;border-bottom:1px solid ${BORDER};font-size:14px;font-weight:600;">${formatTRY(
            Number(it.price_at_purchase) * it.quantity,
        )}</td>
</tr>`,
    )
    .join("")}
</table>`;

export const orderConfirmationTemplate = (order: Order) => {
    const items = order.order_items ?? [];
    const discountRow = order.discount_amount && Number(order.discount_amount) > 0
        ? `<tr><td style="padding:6px 0;font-size:13px;color:#16a34a;">İndirim</td><td align="right" style="padding:6px 0;font-size:13px;color:#16a34a;">-${formatTRY(Number(order.discount_amount))}</td></tr>`
        : "";

    const itemsSubtotal = items.reduce(
        (a, it) => a + Number(it.price_at_purchase) * it.quantity,
        0,
    );

    const inner = `
<tr><td style="padding:32px;">
<h1 style="margin:0 0 8px;font-size:24px;font-weight:800;letter-spacing:-0.02em;">Siparişiniz alındı</h1>
<p style="margin:0 0 24px;font-size:14px;color:${MUTED};line-height:1.6;">Merhaba ${order.customer_name}, ${formatDate(order.created_at)} tarihinde verdiğiniz siparişi aldık. Aşağıda özetini bulabilirsiniz.</p>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${ACCENT_BG};border-radius:12px;padding:16px;margin-bottom:8px;">
<tr><td style="padding:12px 16px;">
<p style="margin:0 0 4px;font-size:11px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:0.1em;">Sipariş No</p>
<p style="margin:0;font-size:18px;font-weight:800;letter-spacing:0.04em;">#${truncateId(order.id)}</p>
</td></tr>
</table>

${itemsTable(items)}

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:16px 0;">
<tr><td style="padding:6px 0;font-size:13px;color:${MUTED};">Ara toplam</td><td align="right" style="padding:6px 0;font-size:13px;">${formatTRY(itemsSubtotal)}</td></tr>
${discountRow}
<tr><td style="padding:6px 0;font-size:13px;color:${MUTED};">Kargo</td><td align="right" style="padding:6px 0;font-size:13px;color:#16a34a;font-weight:600;">DAHİL</td></tr>
<tr><td style="padding:12px 0 0;border-top:2px solid ${BORDER};font-size:16px;font-weight:800;">Toplam (KDV dahil)</td><td align="right" style="padding:12px 0 0;border-top:2px solid ${BORDER};font-size:18px;font-weight:800;color:${PRIMARY};">${formatTRY(Number(order.total_amount))}</td></tr>
</table>

<div style="margin:24px 0;padding:16px;border:1px solid ${BORDER};border-radius:12px;">
<p style="margin:0 0 4px;font-size:11px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:0.1em;">Teslimat Adresi</p>
<p style="margin:0;font-size:14px;line-height:1.6;">${order.shipping_address}</p>
</div>

<p style="margin:24px 0 16px;font-size:14px;line-height:1.7;">Siparişiniz 1–3 iş günü içerisinde kargoya verilecek ve takip numarası size ayrıca e-posta ile iletilecektir.</p>

<p style="margin:0 0 8px;text-align:center;">${button("Siparişi görüntüle", "https://arasounds.com/profile")}</p>
</td></tr>`;

    const text = `Siparişiniz alındı #${truncateId(order.id)}\n\nMerhaba ${order.customer_name},\n\n${formatDate(order.created_at)} tarihindeki siparişinizi aldık.\nToplam: ${formatTRY(Number(order.total_amount))} (KDV dahil)\nTeslimat: ${order.shipping_address}\n\n1-3 iş günü içinde kargoya verilecektir.\n\nARASOUNDS\ndestek@arasounds.com`;

    return {
        subject: `Sipariş onayı · #${truncateId(order.id)} · ARASOUNDS`,
        html: wrapper(inner, `Siparişiniz #${truncateId(order.id)} başarıyla alındı.`),
        text,
    };
};

export const shippingNotificationTemplate = (
    order: Order,
    trackingNumber: string,
    carrier: string,
) => {
    const inner = `
<tr><td style="padding:32px;">
<h1 style="margin:0 0 8px;font-size:24px;font-weight:800;letter-spacing:-0.02em;">📦 Siparişiniz yola çıktı</h1>
<p style="margin:0 0 24px;font-size:14px;color:${MUTED};line-height:1.6;">Merhaba ${order.customer_name}, sipariş #${truncateId(order.id)} kargoya verildi.</p>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${ACCENT_BG};border-radius:12px;padding:8px;margin:16px 0 24px;">
<tr><td style="padding:16px;">
<p style="margin:0 0 4px;font-size:11px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:0.1em;">Kargo Firması</p>
<p style="margin:0 0 12px;font-size:14px;font-weight:600;">${carrier}</p>
<p style="margin:0 0 4px;font-size:11px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:0.1em;">Takip Numarası</p>
<p style="margin:0;font-size:18px;font-weight:800;font-family:'Courier New',monospace;letter-spacing:0.04em;">${trackingNumber}</p>
</td></tr>
</table>

<div style="margin:0 0 24px;padding:16px;border:1px solid ${BORDER};border-radius:12px;">
<p style="margin:0 0 4px;font-size:11px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:0.1em;">Teslimat Adresi</p>
<p style="margin:0;font-size:14px;line-height:1.6;">${order.shipping_address}</p>
</div>

<p style="margin:24px 0 8px;font-size:14px;line-height:1.7;">Tahmini teslimat süresi: <strong>1–4 iş günü</strong>. Doğu illeri için süre uzayabilir.</p>

<p style="margin:24px 0 8px;text-align:center;">${button("Siparişi takip et", `https://arasounds.com/profile`)}</p>
</td></tr>`;

    const text = `Siparişiniz kargoya verildi #${truncateId(order.id)}\n\nKargo firması: ${carrier}\nTakip numarası: ${trackingNumber}\n\nTahmini teslimat: 1-4 iş günü\n\nARASOUNDS`;

    return {
        subject: `Siparişiniz kargoya verildi · #${truncateId(order.id)}`,
        html: wrapper(inner, `Sipariş #${truncateId(order.id)} kargoda — takip numarası: ${trackingNumber}`),
        text,
    };
};

export const passwordResetTemplate = (email: string, resetUrl: string) => {
    const inner = `
<tr><td style="padding:32px;">
<h1 style="margin:0 0 8px;font-size:24px;font-weight:800;letter-spacing:-0.02em;">Şifre sıfırlama isteği</h1>
<p style="margin:0 0 24px;font-size:14px;color:${MUTED};line-height:1.6;">Merhaba, ${email} adresine ait hesabınız için şifre sıfırlama isteği aldık.</p>
<p style="margin:0 0 24px;font-size:14px;line-height:1.7;">Yeni bir şifre belirlemek için aşağıdaki butona tıklayın. Bu bağlantı <strong>1 saat</strong> içinde geçerliliğini yitirir.</p>
<p style="margin:32px 0;text-align:center;">${button("Şifremi sıfırla", resetUrl)}</p>
<p style="margin:24px 0 0;font-size:12px;color:${MUTED};line-height:1.6;">Bu isteği siz yapmadıysanız, bu e-postayı yok sayabilirsiniz. Hesabınız güvende ve şifreniz değişmez.</p>
</td></tr>`;

    const text = `Şifre sıfırlama isteği\n\nYeni şifre belirlemek için: ${resetUrl}\n\nBağlantı 1 saat içinde geçerliliğini yitirir.\n\nARASOUNDS`;

    return {
        subject: "Şifre sıfırlama · ARASOUNDS",
        html: wrapper(inner, "ARASOUNDS hesabınız için şifre sıfırlama bağlantısı."),
        text,
    };
};

export const refundIssuedTemplate = (order: Order, refundAmount: number) => {
    const inner = `
<tr><td style="padding:32px;">
<h1 style="margin:0 0 8px;font-size:24px;font-weight:800;letter-spacing:-0.02em;">İade işleminiz tamamlandı</h1>
<p style="margin:0 0 24px;font-size:14px;color:${MUTED};line-height:1.6;">Merhaba ${order.customer_name}, sipariş #${truncateId(order.id)} için iade tutarı kartınıza/hesabınıza iade edildi.</p>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${ACCENT_BG};border-radius:12px;padding:8px;margin:16px 0 24px;">
<tr><td align="center" style="padding:24px;">
<p style="margin:0 0 8px;font-size:11px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:0.1em;">İade Tutarı</p>
<p style="margin:0;font-size:32px;font-weight:900;color:${PRIMARY};letter-spacing:-0.02em;">${formatTRY(refundAmount)}</p>
</td></tr>
</table>

<p style="margin:0 0 16px;font-size:14px;line-height:1.7;">Bankanızın iadeyi hesabınıza yansıtması <strong>2–10 iş günü</strong> sürebilir. İade tutarı bu süreç içinde hesap özetinizde görüneceğinden lütfen bu süreyi göz önünde bulundurunuz.</p>

<p style="margin:24px 0 0;font-size:13px;color:${MUTED};line-height:1.6;">Sorularınız için <a href="mailto:destek@arasounds.com" style="color:${PRIMARY};font-weight:600;text-decoration:none;">destek@arasounds.com</a></p>
</td></tr>`;

    const text = `İade işleminiz tamamlandı · Sipariş #${truncateId(order.id)}\n\nİade tutarı: ${formatTRY(refundAmount)}\nBankanız 2-10 iş günü içerisinde hesabınıza yansıtacaktır.\n\nARASOUNDS`;

    return {
        subject: `İade tamamlandı · #${truncateId(order.id)}`,
        html: wrapper(inner, `${formatTRY(refundAmount)} tutarındaki iade tamamlandı.`),
        text,
    };
};
