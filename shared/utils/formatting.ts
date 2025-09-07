/**
 * Shared formatting utilities
 * Shared formatting utilities
 */

/**
 * Formats a number as currency
 * Formats a number as currency
 */
export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Formats a number as percentage
 * Formats a number as percentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Formats an address
 * Formats an address
 */
export const formatAddress = (address: string, suburb: string, postcode: string): string => {
  return `${address}, ${suburb} ${postcode}`;
};

/**
 * Formats a date
 * Formats a date
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

/**
 * Formats a phone number
 * Formats a phone number
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format US phone numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phoneNumber;
};

/**
 * Truncates text to a specific length
 * Truncates text to a specific length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
};

/**
 * Formats a large number with thousand separators
 * Formats a large number with thousand separators
 */
export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('en-US').format(number);
};

/**
 * Formats an area in square meters
 * Formats an area in square meters
 */
export const formatArea = (area: number): string => {
  return `${formatNumber(area)} m²`;
}; 