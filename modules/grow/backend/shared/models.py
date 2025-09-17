"""
Shared data models for the Grow module
Shared data models for the grow module
"""

from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
from datetime import datetime
from enum import Enum

class PropertyType(str, Enum):
    RESIDENTIAL = "residential"
    COMMERCIAL = "commercial"
    INDUSTRIAL = "industrial"
    LAND = "land"

class RiskLevel(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"

class GrowthPotential(str, Enum):
    A_PLUS = "A+"
    A = "A"
    B_PLUS = "B+"
    B = "B"
    C = "C"

class PropertyData(BaseModel):
    """Data model for property information"""
    id: Optional[str] = None
    address: str
    suburb: str
    postcode: str
    property_type: PropertyType
    current_price: Optional[float] = None
    previous_price: Optional[float] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    land_size: Optional[float] = None
    build_year: Optional[int] = None
    last_renovation: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class MarketData(BaseModel):
    """Data model for market information"""
    suburb: str
    postcode: str
    median_price: Optional[float] = None
    price_growth_1y: Optional[float] = None
    price_growth_5y: Optional[float] = None
    days_on_market: Optional[int] = None
    auction_clearance_rate: Optional[float] = None
    rental_yield: Optional[float] = None
    vacancy_rate: Optional[float] = None
    volatility: Optional[float] = None

class ScoringMetrics(BaseModel):
    """Data model for scoring metrics"""
    location: float = Field(ge=0, le=100)
    infrastructure: float = Field(ge=0, le=100)
    market_trends: float = Field(ge=0, le=100)
    rental_yield: float = Field(ge=0, le=100)

class ScoringResult(BaseModel):
    """Data model for scoring results"""
    overall_score: float = Field(ge=0, le=100)
    growth_potential: GrowthPotential
    risk_level: RiskLevel
    metrics: ScoringMetrics
    recommendations: List[str] = []
    created_at: datetime = Field(default_factory=datetime.now)

class Alert(BaseModel):
    """Data model for alerts"""
    id: Optional[str] = None
    type: str
    severity: str
    message: str
    timestamp: datetime
    property_id: Optional[str] = None
    market_id: Optional[str] = None
    is_read: bool = False

class StrategyRecommendation(BaseModel):
    """Data model for strategy recommendations"""
    timeframe: str  # short_term, medium_term, long_term
    recommendations: List[str]
    priority: str  # high, medium, low
    created_at: datetime = Field(default_factory=datetime.now) 