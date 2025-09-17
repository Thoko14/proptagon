"""
Tests for strategy recommendations
Tests for strategy recommendations
"""

import pytest
from unittest.mock import Mock, patch
import sys
import os

# Add backend path to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from strategy.suggest import (
    generate_short_term_strategy,
    generate_medium_term_strategy,
    generate_long_term_strategy,
    get_comprehensive_strategy
)

class TestStrategyRecommendations:
    """Test class for strategy recommendations"""
    
    def test_generate_short_term_strategy_high_score(self):
        """Test for short-term strategy with high score"""
        scoring_data = {
            "overall_score": 85
        }
        
        recommendations = generate_short_term_strategy(scoring_data)
        
        assert isinstance(recommendations, list)
        assert len(recommendations) > 0
        assert "renovation" in " ".join(recommendations).lower()
    
    def test_generate_short_term_strategy_medium_score(self):
        """Test for short-term strategy with medium score"""
        scoring_data = {
            "overall_score": 70
        }
        
        recommendations = generate_short_term_strategy(scoring_data)
        
        assert isinstance(recommendations, list)
        assert len(recommendations) > 0
        assert "maintenance" in " ".join(recommendations).lower()
    
    def test_generate_short_term_strategy_low_score(self):
        """Test for short-term strategy with low score"""
        scoring_data = {
            "overall_score": 45
        }
        
        recommendations = generate_short_term_strategy(scoring_data)
        
        assert isinstance(recommendations, list)
        assert len(recommendations) > 0
        assert "renovation" in " ".join(recommendations).lower()
    
    def test_generate_medium_term_strategy_high_growth(self):
        """Test for medium-term strategy with high growth potential"""
        scoring_data = {
            "growth_potential": "A+"
        }
        
        recommendations = generate_medium_term_strategy(scoring_data)
        
        assert isinstance(recommendations, list)
        assert len(recommendations) > 0
        assert "rental" in " ".join(recommendations).lower()
    
    def test_generate_medium_term_strategy_medium_growth(self):
        """Test for medium-term strategy with medium growth potential"""
        scoring_data = {
            "growth_potential": "B"
        }
        
        recommendations = generate_medium_term_strategy(scoring_data)
        
        assert isinstance(recommendations, list)
        assert len(recommendations) > 0
        assert "diversification" in " ".join(recommendations).lower()
    
    def test_generate_long_term_strategy_strong_trends(self):
        """Test for long-term strategy with strong market trends"""
        scoring_data = {
            "metrics": {
                "market_trends": 85
            }
        }
        
        recommendations = generate_long_term_strategy(scoring_data)
        
        assert isinstance(recommendations, list)
        assert len(recommendations) > 0
        assert "growth" in " ".join(recommendations).lower()
    
    def test_generate_long_term_strategy_weak_trends(self):
        """Test for long-term strategy with weak market trends"""
        scoring_data = {
            "metrics": {
                "market_trends": 45
            }
        }
        
        recommendations = generate_long_term_strategy(scoring_data)
        
        assert isinstance(recommendations, list)
        assert len(recommendations) > 0
        assert "exit" in " ".join(recommendations).lower()
    
    def test_get_comprehensive_strategy(self):
        """Test for comprehensive strategy recommendations"""
        scoring_data = {
            "overall_score": 80,
            "growth_potential": "A+",
            "metrics": {
                "market_trends": 85
            }
        }
        
        strategy = get_comprehensive_strategy(scoring_data)
        
        assert isinstance(strategy, dict)
        assert "short_term" in strategy
        assert "medium_term" in strategy
        assert "long_term" in strategy
        
        assert isinstance(strategy["short_term"], list)
        assert isinstance(strategy["medium_term"], list)
        assert isinstance(strategy["long_term"], list)
        
        assert len(strategy["short_term"]) > 0
        assert len(strategy["medium_term"]) > 0
        assert len(strategy["long_term"]) > 0

if __name__ == "__main__":
    pytest.main([__file__]) 