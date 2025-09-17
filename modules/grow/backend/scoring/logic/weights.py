"""
Weighting logic for the scoring system
Weighting logic for the scoring system
"""

from typing import Dict, Any

def get_scoring_weights(property_type: str = "residential") -> Dict[str, float]:
    """
    Returns weights for different scoring criteria
    Returns weights for different scoring criteria
    """
    base_weights = {
        "location": 0.3,
        "infrastructure": 0.25,
        "market_trends": 0.25,
        "rental_yield": 0.2
    }
    
    # Adjustment based on property type
    if property_type == "commercial":
        base_weights.update({
            "location": 0.35,
            "infrastructure": 0.3,
            "market_trends": 0.25,
            "rental_yield": 0.1
        })
    elif property_type == "industrial":
        base_weights.update({
            "location": 0.4,
            "infrastructure": 0.35,
            "market_trends": 0.2,
            "rental_yield": 0.05
        })
    
    return base_weights

def get_risk_weights() -> Dict[str, float]:
    """
    Weights for risk assessment
    Weights for risk assessment
    """
    return {
        "market_volatility": 0.3,
        "location_risk": 0.25,
        "property_condition": 0.2,
        "economic_factors": 0.25
    }

def get_growth_weights() -> Dict[str, float]:
    """
    Weights for growth assessment
    Weights for growth assessment
    """
    return {
        "population_growth": 0.25,
        "infrastructure_development": 0.3,
        "economic_growth": 0.25,
        "market_demand": 0.2
    } 