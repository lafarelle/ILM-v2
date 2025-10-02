export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1) + "M";
  }
  if (num >= 10000) {
    return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + "k";
  }
  return num.toString();
};

export function formatPrice(
  priceCents: number,
  options?: { locale?: string; currency?: string }
): string {
  const { locale = "fr-FR", currency = "EUR" } = options ?? {};
  const euros = priceCents / 100;
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    euros
  );
}
