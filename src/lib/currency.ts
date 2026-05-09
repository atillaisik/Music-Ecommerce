/**
 * Format a number as Turkish Lira with locale-aware thousands separators
 * and a trailing ₺ symbol. Always two decimal places.
 *
 * Example: formatTRY(1234.5) → "1.234,50 ₺"
 */
export const formatTRY = (n: number | string): string => {
    const num = typeof n === "string" ? Number(n) : n;
    if (!Number.isFinite(num)) return "0,00 ₺";
    return `${num.toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} ₺`;
};

/**
 * Format a number as a compact integer for display in mid-density
 * surfaces (badges, tags). Drops decimals when not significant.
 */
export const formatTRYCompact = (n: number | string): string => {
    const num = typeof n === "string" ? Number(n) : n;
    if (!Number.isFinite(num)) return "0 ₺";
    if (num % 1 === 0) {
        return `${num.toLocaleString("tr-TR")} ₺`;
    }
    return formatTRY(num);
};
