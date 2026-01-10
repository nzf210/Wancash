/**
 * Formats a hex address to a shortened version.
 */
function formatHexAddress(text: string): string {
  console.log('start Wirh =>', text);
  if (text.startsWith("0x")) {
    const start = text.slice(0, 5);
    const end = text.slice(-4);
    return `${start}...${end}`;
  }
  return text;
}

/**
 * Standardized formatting for tokens (e.g., WCH).
 * Shows 2-4 decimal places based on the value.
 */
function formatTokenBalance(num: number | string): string {
  const value = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(value) || value === 0) return '0.00';

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(value);
}

/**
 * Specialized formatting for native coins (ETH, BNB, etc.).
 * Handles very small values and shows 4-6 decimal places.
 */
function formatNativeBalance(num: number | string): string {
  const value = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(value) || value === 0) return '0.0000';
  if (value < 0.0001) return '< 0.0001';

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6
  }).format(value);
}

/**
 * Formats a number as USD currency without decimal places.
 */
function formatUSD(num: number | string): string {
  const value = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(value)) return '0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.round(value));
}

export { formatHexAddress, formatTokenBalance, formatNativeBalance, formatUSD };
