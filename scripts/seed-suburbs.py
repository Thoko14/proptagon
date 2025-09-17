#!/usr/bin/env python3

"""
Script to seed suburb data
Script to seed suburb data
"""

import json
import sys
import os
from typing import List, Dict, Any
from datetime import datetime

# Mock data for German suburbs
SAMPLE_SUBURBS = [
    {
        "suburb": "Berlin-Mitte",
        "postcode": "10115",
        "city": "Berlin",
        "state": "Berlin",
        "region": "East Germany",
        "population": 85000,
        "medianIncome": 45000,
        "crimeRate": 0.02,
        "publicTransportScore": 95,
        "schoolsCount": 12,
        "hospitalsCount": 3,
        "shoppingCentersCount": 8,
        "parksCount": 15
    },
    {
        "suburb": "Hamburg-Altona",
        "postcode": "22765",
        "city": "Hamburg",
        "state": "Hamburg",
        "region": "North Germany",
        "population": 65000,
        "medianIncome": 52000,
        "crimeRate": 0.015,
        "publicTransportScore": 88,
        "schoolsCount": 9,
        "hospitalsCount": 2,
        "shoppingCentersCount": 6,
        "parksCount": 12
    },
    {
        "suburb": "München-Schwabing",
        "postcode": "80799",
        "city": "München",
        "state": "Bayern",
        "region": "South Germany",
        "population": 45000,
        "medianIncome": 75000,
        "crimeRate": 0.01,
        "publicTransportScore": 92,
        "schoolsCount": 7,
        "hospitalsCount": 2,
        "shoppingCentersCount": 5,
        "parksCount": 10
    },
    {
        "suburb": "Köln-Innenstadt",
        "postcode": "50667",
        "city": "Köln",
        "state": "Nordrhein-Westfalen",
        "region": "West Germany",
        "population": 55000,
        "medianIncome": 48000,
        "crimeRate": 0.025,
        "publicTransportScore": 90,
        "schoolsCount": 8,
        "hospitalsCount": 3,
        "shoppingCentersCount": 7,
        "parksCount": 11
    },
    {
        "suburb": "Stuttgart-Mitte",
        "postcode": "70173",
        "city": "Stuttgart",
        "state": "Baden-Württemberg",
        "region": "South Germany",
        "population": 40000,
        "medianIncome": 58000,
        "crimeRate": 0.018,
        "publicTransportScore": 85,
        "schoolsCount": 6,
        "hospitalsCount": 2,
        "shoppingCentersCount": 4,
        "parksCount": 9
    }
]

def seed_suburbs() -> None:
    """
    Seeds the database with suburb data
    Seeds the database with suburb data
    """
    print("Seeding suburb data...")
    
    for suburb_data in SAMPLE_SUBURBS:
        try:
            # TODO: Implement real database operation
            print(f"Creating suburb: {suburb_data['suburb']} ({suburb_data['postcode']})")
            
            # Simulate database operation
            simulate_suburb_creation(suburb_data)
            
        except Exception as e:
            print(f"Error creating suburb {suburb_data['suburb']}: {e}")
    
    print("Suburb seeding completed!")

def simulate_suburb_creation(suburb_data: Dict[str, Any]) -> None:
    """
    Simulates suburb creation in database
    Simulates suburb creation in database
    """
    # Add timestamps
    suburb_data['created_at'] = datetime.now().isoformat()
    suburb_data['updated_at'] = datetime.now().isoformat()
    
    # Simulate API delay
    import time
    time.sleep(0.1)
    
    print(f"✓ Suburb created: {suburb_data['suburb']} in {suburb_data['city']}")

def save_to_json() -> None:
    """
    Saves suburb data to JSON file
    Saves suburb data to JSON file
    """
    output_file = "../data/real/suburbs.json"
    
    # Create directory if not exists
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(SAMPLE_SUBURBS, f, indent=2, ensure_ascii=False)
    
    print(f"Suburb data saved to: {output_file}")

def main() -> None:
    """
    Main function
    Main function
    """
    try:
        seed_suburbs()
        save_to_json()
    except Exception as e:
        print(f"Error running script: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 