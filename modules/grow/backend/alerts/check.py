"""
Alert system for important property events
Alert system for important property events
"""

from typing import List, Dict, Any
from datetime import datetime, timedelta

class AlertChecker:
    """
    Checks various conditions and generates alerts
    Checks various conditions and generates alerts
    """
    
    def __init__(self):
        self.alert_thresholds = {
            "price_drop": 0.05,  # 5% price drop
            "market_volatility": 0.15,  # 15% volatility
            "rental_vacancy": 0.1,  # 10% vacancy
            "maintenance_due": 30  # 30 days until maintenance
        }
    
    def check_price_alerts(self, property_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Checks price-related alerts
        Checks price-related alerts
        """
        alerts = []
        
        current_price = property_data.get("current_price", 0)
        previous_price = property_data.get("previous_price", 0)
        
        if previous_price > 0:
            price_change = (current_price - previous_price) / previous_price
            
            if price_change < -self.alert_thresholds["price_drop"]:
                alerts.append({
                    "type": "price_drop",
                    "severity": "high",
                    "message": f"Price drop of {abs(price_change)*100:.1f}% detected",
                    "timestamp": datetime.now(),
                    "property_id": property_data.get("id")
                })
        
        return alerts
    
    def check_market_alerts(self, market_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Checks market-related alerts
        Checks market-related alerts
        """
        alerts = []
        
        volatility = market_data.get("volatility", 0)
        if volatility > self.alert_thresholds["market_volatility"]:
            alerts.append({
                "type": "market_volatility",
                "severity": "medium",
                "message": f"High market volatility: {volatility*100:.1f}%",
                "timestamp": datetime.now(),
                "market_id": market_data.get("id")
            })
        
        return alerts
    
    def check_maintenance_alerts(self, property_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Checks maintenance-related alerts
        Checks maintenance-related alerts
        """
        alerts = []
        
        next_maintenance = property_data.get("next_maintenance_date")
        if next_maintenance:
            days_until_maintenance = (next_maintenance - datetime.now()).days
            
            if days_until_maintenance <= self.alert_thresholds["maintenance_due"]:
                alerts.append({
                    "type": "maintenance_due",
                    "severity": "medium",
                    "message": f"Maintenance due in {days_until_maintenance} days",
                    "timestamp": datetime.now(),
                    "property_id": property_data.get("id")
                })
        
        return alerts
    
    def check_all_alerts(self, property_data: Dict[str, Any], market_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Checks all alert types
        Checks all alert types
        """
        all_alerts = []
        
        all_alerts.extend(self.check_price_alerts(property_data))
        all_alerts.extend(self.check_market_alerts(market_data))
        all_alerts.extend(self.check_maintenance_alerts(property_data))
        
        return all_alerts 