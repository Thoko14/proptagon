/**
 * API functions for the scoring system
 * Fetch functions for property scoring
 */

export interface ScoringRequest {
  address: string;
  suburb: string;
  postcode: string;
  propertyType: string;
}

export interface ScoringResponse {
  overallScore: number;
  growthPotential: string;
  riskLevel: string;
  metrics: {
    location: number;
    infrastructure: number;
    marketTrends: number;
    rentalYield: number;
  };
  recommendations: string[];
}

/**
 * Fetches scoring data for a property
 * Fetches scoring data for a property
 */
export const fetchScore = async (request: ScoringRequest): Promise<ScoringResponse> => {
  try {
    // TODO: Implement real API request
    const response = await fetch('/api/scoring', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Scoring request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching scoring data:', error);
    throw error;
  }
}; 