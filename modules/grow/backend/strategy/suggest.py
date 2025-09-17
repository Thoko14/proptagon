"""
Strategy recommendations based on scoring results
Strategy recommendations based on scoring results
"""

from typing import List, Dict, Any

def generate_short_term_strategy(scoring_data: Dict[str, Any]) -> List[str]:
    """
    Generates short-term strategy recommendations (1-2 years)
    Generates short-term strategy recommendations
    """
    recommendations = []
    
    if scoring_data.get("overall_score", 0) > 80:
        recommendations.append("Focus on renovation for value appreciation")
        recommendations.append("Optimize rental income")
    elif scoring_data.get("overall_score", 0) > 60:
        recommendations.append("Basic maintenance")
        recommendations.append("Market analysis for sales options")
    else:
        recommendations.append("Urgent renovation measures required")
        recommendations.append("Review investment strategy")
    
    return recommendations

def generate_medium_term_strategy(scoring_data: Dict[str, Any]) -> List[str]:
    """
    Generates medium-term strategy recommendations (3-5 years)
    Generates medium-term strategy recommendations
    """
    recommendations = []
    
    growth_potential = scoring_data.get("growth_potential", "")
    
    if growth_potential in ["A+", "A"]:
        recommendations.append("Long-term rental for stable cash flows")
        recommendations.append("Leverage value appreciation through market growth")
    elif growth_potential in ["B+", "B"]:
        recommendations.append("Moderate renovations for value appreciation")
        recommendations.append("Consider portfolio diversification")
    else:
        recommendations.append("Review holding strategy")
        recommendations.append("Develop exit strategy")
    
    return recommendations

def generate_long_term_strategy(scoring_data: Dict[str, Any]) -> List[str]:
    """
    Generates long-term strategy recommendations (5+ years)
    Generates long-term strategy recommendations
    """
    recommendations = []
    
    market_trends = scoring_data.get("metrics", {}).get("market_trends", 0)
    
    if market_trends > 80:
        recommendations.append("Maximize value appreciation through market growth")
        recommendations.append("Portfolio expansion in the region")
    elif market_trends > 60:
        recommendations.append("Stable rental for consistent returns")
        recommendations.append("Selective renovations for value appreciation")
    else:
        recommendations.append("Exit strategy for weak markets")
        recommendations.append("Reallocation to stronger markets")
    
    return recommendations

def get_comprehensive_strategy(scoring_data: Dict[str, Any]) -> Dict[str, List[str]]:
    """
    Returns comprehensive strategy recommendations for all timeframes
    Returns comprehensive strategy recommendations for all timeframes
    """
    return {
        "short_term": generate_short_term_strategy(scoring_data),
        "medium_term": generate_medium_term_strategy(scoring_data),
        "long_term": generate_long_term_strategy(scoring_data)
    } 