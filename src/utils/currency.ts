/**
 * Format a number as Nigerian Naira (NGN)
 * Example: 18500000 -> ₦18,500,000
 */
export function formatNaira(amount: number | string): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.]/g, '')) : amount;
  if (isNaN(numericAmount)) return '₦0';

  return `₦${numericAmount.toLocaleString('en-NG', {
    maximumFractionDigits: 0,
  })}`;
}

/**
 * Format price for compact labels if needed
 */
export function formatCompactNaira(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `₦${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `₦${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `₦${(amount / 1_000).toFixed(0)}K`;
  }
  return formatNaira(amount);
}
