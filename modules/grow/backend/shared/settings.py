"""
Settings for the Grow module backend
Settings for the grow module backend
"""

import os
from typing import Dict, Any

class Settings:
    """Central settings class"""
    
    # API Configuration
    API_TITLE = "PropBase Grow API"
    API_VERSION = "1.0.0"
    API_DESCRIPTION = "API for property evaluation and scoring"
    
    # Database Configuration
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/propbase")
    
    # API Keys (from environment variables)
    API_KEYS = {
        "property_data": os.getenv("PROPERTY_DATA_API_KEY", ""),
        "market_data": os.getenv("MARKET_DATA_API_KEY", ""),
        "census_data": os.getenv("CENSUS_API_KEY", "")
    }
    
    # Scoring Configuration
    SCORING_WEIGHTS = {
        "residential": {
            "location": 0.3,
            "infrastructure": 0.25,
            "market_trends": 0.25,
            "rental_yield": 0.2
        },
        "commercial": {
            "location": 0.35,
            "infrastructure": 0.3,
            "market_trends": 0.25,
            "rental_yield": 0.1
        },
        "industrial": {
            "location": 0.4,
            "infrastructure": 0.35,
            "market_trends": 0.2,
            "rental_yield": 0.05
        }
    }
    
    # Alert Thresholds
    ALERT_THRESHOLDS = {
        "price_drop": 0.05,  # 5% price drop
        "market_volatility": 0.15,  # 15% volatility
        "rental_vacancy": 0.1,  # 10% vacancy
        "maintenance_due": 30  # 30 days until maintenance
    }
    
    # Logging Configuration
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # Caching Configuration
    CACHE_TTL = 3600  # 1 hour in seconds
    CACHE_ENABLED = os.getenv("CACHE_ENABLED", "true").lower() == "true"
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS = 100  # Requests per minute
    RATE_LIMIT_WINDOW = 60  # Time window in seconds
    
    @classmethod
    def get_database_config(cls) -> Dict[str, Any]:
        """Returns database configuration"""
        return {
            "url": cls.DATABASE_URL,
            "pool_size": 10,
            "max_overflow": 20,
            "echo": os.getenv("DB_ECHO", "false").lower() == "true"
        }
    
    @classmethod
    def get_api_config(cls) -> Dict[str, Any]:
        """Returns API configuration"""
        return {
            "title": cls.API_TITLE,
            "version": cls.API_VERSION,
            "description": cls.API_DESCRIPTION,
            "docs_url": "/docs",
            "redoc_url": "/redoc"
        } 