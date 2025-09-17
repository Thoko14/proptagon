// Common formatting utilities for the Grow module

/**
 * Format price with proper currency display
 */
export const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(1)}M`;
  } else if (price >= 1000) {
    return `$${(price / 1000).toFixed(0)}K`;
  } else {
    return `$${price.toLocaleString()}`;
  }
};

/**
 * Format percentage with proper decimal places
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format number with proper thousand separators
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString();
};

/**
 * Format date in a readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Get status badge color and text
 */
export const getStatusBadge = (status: string): { color: string; text: string } => {
  switch (status) {
    case 'for-sale':
      return { color: 'bg-blue-100 text-blue-800', text: 'For Sale' };
    case 'auction':
      return { color: 'bg-orange-100 text-orange-800', text: 'Auction' };
    case 'under-offer':
      return { color: 'bg-yellow-100 text-yellow-800', text: 'Under Offer' };
    default:
      return { color: 'bg-gray-100 text-gray-800', text: status };
  }
};

/**
 * Get score color based on value
 */
export const getScoreColor = (score: number): string => {
  if (score >= 80) return '#10b981'; // Green for high scores
  if (score >= 60) return '#84cc16'; // Lime for good scores
  if (score >= 40) return '#eab308'; // Yellow for average scores
  if (score >= 20) return '#f97316'; // Orange for below average
  return '#ef4444'; // Red for low scores
};

/**
 * Get score color class for Tailwind
 */
export const getScoreColorClass = (score: number): string => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-lime-600';
  if (score >= 40) return 'text-yellow-600';
  if (score >= 20) return 'text-orange-600';
  return 'text-red-600';
};

/**
 * Get score background color class for Tailwind
 */
export const getScoreBgColorClass = (score: number): string => {
  if (score >= 80) return 'bg-green-100';
  if (score >= 60) return 'bg-lime-100';
  if (score >= 40) return 'bg-yellow-100';
  if (score >= 20) return 'bg-orange-100';
  return 'bg-red-100';
};

/**
 * Format property features for display
 */
export const formatPropertyFeatures = (features: string[]): string => {
  if (!features || features.length === 0) return 'No features listed';
  return features.join(', ');
};

/**
 * Format land size with proper units
 */
export const formatLandSize = (size: number): string => {
  if (size >= 10000) {
    return `${(size / 10000).toFixed(1)} hectares`;
  } else if (size >= 1000) {
    return `${(size / 1000).toFixed(1)} acres`;
  } else {
    return `${size} sqm`;
  }
};

/**
 * Format internal size with proper units
 */
export const formatInternalSize = (size: number): string => {
  return `${size} sqm`;
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (text: string): string => {
  return text.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format Australian phone numbers
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)} ${cleaned.substring(6)}`;
  } else if (cleaned.length === 8) {
    return `${cleaned.substring(0, 4)} ${cleaned.substring(4)}`;
  }
  
  return phone;
};

/**
 * Format email for display (truncate if too long)
 */
export const formatEmail = (email: string): string => {
  if (email.length <= 30) return email;
  
  const [localPart, domain] = email.split('@');
  if (localPart.length > 20) {
    return `${localPart.substring(0, 17)}...@${domain}`;
  }
  
  return email;
};
