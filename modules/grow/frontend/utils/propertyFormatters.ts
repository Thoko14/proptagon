// Property formatting utilities

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatPriceWithDecimals = (price: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(price);
};

export const getStatusBadge = (status: string) => {
  const statusConfig = {
    'for-sale': { label: 'For Sale', className: 'bg-green-100 text-green-800' },
    'auction': { label: 'Auction', className: 'bg-orange-100 text-orange-800' },
    'under-offer': { label: 'Under Offer', className: 'bg-blue-100 text-blue-800' },
    'sold': { label: 'Sold', className: 'bg-gray-100 text-gray-800' },
    'withdrawn': { label: 'Withdrawn', className: 'bg-red-100 text-red-800' },
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['for-sale'];
  
  return {
    label: config.label,
    className: config.className
  };
};

export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

export const getScoreBackgroundColor = (score: number): string => {
  if (score >= 80) return 'bg-green-100';
  if (score >= 60) return 'bg-yellow-100';
  return 'bg-red-100';
};

export const formatLandSize = (size: number): string => {
  if (size >= 10000) {
    return `${(size / 10000).toFixed(1)} ha`;
  }
  return `${size}m²`;
};

export const formatInternalSize = (size: number): string => {
  return `${size}m²`;
};

export const calculateDaysAgo = (dateString: string): number => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - date.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatShortDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
