/**
 * Shared constants for the Proptagon project
 * Shared constants for the Proptagon project
 */

// API endpoints
export const API_ENDPOINTS = {
  // Grow module
  SCORING: '/api/scoring',
  STRATEGY: '/api/strategy',
  ALERTS: '/api/alerts',
  
  // Invest module
  INVESTMENT_ANALYSIS: '/api/investment/analysis',
  PORTFOLIO: '/api/investment/portfolio',
  
  // Manage module
  PROPERTIES: '/api/properties',
  TENANTS: '/api/tenants',
  MAINTENANCE: '/api/maintenance',
  
  // Operate module
  OPERATIONS: '/api/operations',
  REPAIRS: '/api/repairs',
  
  // Sell module
  SALES: '/api/sales',
  MARKETING: '/api/marketing',
} as const;

// Scoring thresholds
export const SCORING_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 80,
  AVERAGE: 70,
  BELOW_AVERAGE: 60,
  POOR: 50,
} as const;

// Alert thresholds
export const ALERT_THRESHOLDS = {
  PRICE_DROP: 0.05, // 5%
  MARKET_VOLATILITY: 0.15, // 15%
  RENTAL_VACANCY: 0.1, // 10%
  MAINTENANCE_DUE: 30, // 30 days
} as const;

// Property types
export const PROPERTY_TYPES = {
  RESIDENTIAL: 'residential',
  COMMERCIAL: 'commercial',
  INDUSTRIAL: 'industrial',
  LAND: 'land',
} as const;

// Growth potential ratings
export const GROWTH_POTENTIAL = {
  A_PLUS: 'A+',
  A: 'A',
  B_PLUS: 'B+',
  B: 'B',
  C: 'C',
} as const;

// Risk assessments
export const RISK_LEVELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
} as const;

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  PREMIUM: 'premium',
} as const;

// Alert types
export const ALERT_TYPES = {
  PRICE_DROP: 'price_drop',
  MARKET_VOLATILITY: 'market_volatility',
  MAINTENANCE_DUE: 'maintenance_due',
  RENTAL_VACANCY: 'rental_vacancy',
} as const;

// Alert severity levels
export const ALERT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

// Timeframes for strategies
export const STRATEGY_TIMEFRAMES = {
  SHORT_TERM: 'short_term', // 1-2 years
  MEDIUM_TERM: 'medium_term', // 3-5 years
  LONG_TERM: 'long_term', // 5+ years
} as const;

// Cache times (in seconds)
export const CACHE_TTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 3600, // 1 hour
  LONG: 86400, // 1 day
  VERY_LONG: 604800, // 1 week
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_ADDRESS_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 1000,
} as const; 