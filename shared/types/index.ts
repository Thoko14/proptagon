/**
 * Shared TypeScript types for the PropBase project
 * Shared TypeScript types for the PropBase project
 */

// Base property data
export interface Property {
  id: string;
  address: string;
  suburb: string;
  postcode: string;
  propertyType: PropertyType;
  currentPrice?: number;
  previousPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  landSize?: number;
  buildYear?: number;
  lastRenovation?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Property types
export enum PropertyType {
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  INDUSTRIAL = 'industrial',
  LAND = 'land'
}

// Scoring data
export interface ScoringData {
  overallScore: number;
  growthPotential: GrowthPotential;
  riskLevel: RiskLevel;
  metrics: ScoringMetrics;
  recommendations: string[];
  createdAt: Date;
}

export interface ScoringMetrics {
  location: number;
  infrastructure: number;
  marketTrends: number;
  rentalYield: number;
}

export enum GrowthPotential {
  A_PLUS = 'A+',
  A = 'A',
  B_PLUS = 'B+',
  B = 'B',
  C = 'C'
}

export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

// Market data
export interface MarketData {
  suburb: string;
  postcode: string;
  medianPrice?: number;
  priceGrowth1y?: number;
  priceGrowth5y?: number;
  daysOnMarket?: number;
  auctionClearanceRate?: number;
  rentalYield?: number;
  vacancyRate?: number;
  volatility?: number;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  PREMIUM = 'premium'
}

// Alert types
export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  timestamp: Date;
  propertyId?: string;
  marketId?: string;
  isRead: boolean;
}

export enum AlertType {
  PRICE_DROP = 'price_drop',
  MARKET_VOLATILITY = 'market_volatility',
  MAINTENANCE_DUE = 'maintenance_due',
  RENTAL_VACANCY = 'rental_vacancy'
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
} 