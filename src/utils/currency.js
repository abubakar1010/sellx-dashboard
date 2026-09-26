// SellX is a NOK-only marketplace. Every amount shown in the admin panel is
// Norwegian kroner — keep this the single place that decides how money renders.
export const CURRENCY = "NOK";

const formatter = new Intl.NumberFormat("nb-NO", {
  style: "currency",
  currency: CURRENCY,
  maximumFractionDigits: 0,
});

/** Formats an amount as kroner, e.g. 1509 -> "kr 1 509". */
export const formatPrice = (value) => formatter.format(Number(value) || 0);

/** Same as formatPrice, but renders 0 as "Free". */
export const formatPriceOrFree = (value) =>
  Number(value) === 0 ? "Free" : formatPrice(value);
