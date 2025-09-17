import { useCallback } from 'react';
import type { SuburbFeature } from './useMapLayers';
import type { StrategyPreset } from '../types';

export interface ScoringConfig {
  outlineLayerId: string;
  sourceId: string;
}

export const useMapScoring = (
  map: React.MutableRefObject<mapboxgl.Map | null>,
  config: ScoringConfig
) => {
  // Calculate suburb score based on strategy weights
  const calculateSuburbScore = useCallback((suburb: SuburbFeature, strategy: StrategyPreset): number => {
    // Mock scoring algorithm - in real implementation, this would use actual suburb data
    // For now, we'll create a pseudo-random but consistent score based on suburb properties
    
    if (!suburb.properties) return 50; // Default score
    
    // Use suburb code as seed for consistent scoring
    const seed = suburb.properties.code || suburb.id;
    const hash = seed.split('').reduce((a: number, b: string) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    // Generate score based on strategy weights
    const baseScore = Math.abs(hash) % 100; // 0-99 base score
    
    // Apply strategy adjustments
    let adjustedScore = baseScore;
    
    if (strategy.weights) {
      // Growth preference affects score (using growth5y weight)
      if (strategy.weights.growth5y > 25) {
        adjustedScore += 15; // Boost for growth-focused strategies
      } else if (strategy.weights.growth5y < 15) {
        adjustedScore -= 10; // Reduce for income-focused strategies
      }
      
      // Risk tolerance affects score variation (using yield weight as proxy for risk)
      if (strategy.weights.yield > 30) {
        adjustedScore += Math.random() * 20 - 10; // High yield = more variation
      } else if (strategy.weights.yield < 20) {
        adjustedScore += Math.random() * 10 - 5; // Low yield = less variation
      }
    }
    
    // Ensure score is within 0-100 range
    return Math.max(0, Math.min(100, Math.round(adjustedScore)));
  }, []);

  // Update suburb colors based on active strategy
  const updateSuburbColors = useCallback((
    strategy: StrategyPreset,
    suburbData: SuburbFeature[] | null,
    searchedSuburbId: string | null,
    hoveredSuburbId: string | null,
    locationScope: { type: string }
  ) => {
    if (!map.current || !suburbData) return;

    const suburbsLayer = map.current.getLayer(config.outlineLayerId);
    if (!suburbsLayer) return;

    // Create a color scale from red (low score) to green (high score)
        // Removed unused getScoreColor function

    // Update the paint property to use data-driven colors
    map.current.setPaintProperty(config.outlineLayerId, 'line-color', [
      'case',
      ['has', 'code'],
      [
        'case',
        ['==', ['get', 'code'], searchedSuburbId || ''],
        '#10b981', // Green for searched suburb (highest priority)
        [
          'case',
          ['==', ['get', 'code'], hoveredSuburbId || ''],
          '#ff8c00', // Orange for hovered suburb
          [
            'case',
            ['==', locationScope.type, 'suburb'],
            '#3b82f6', // Blue for selected suburb
            [
              'interpolate',
              ['linear'],
              ['get', 'strategyScore'],
              0, '#ef4444',   // Red for score 0
              25, '#f97316',  // Orange for score 25
              50, '#eab308',  // Yellow for score 50
              75, '#84cc16',  // Lime for score 75
              100, '#10b981'  // Green for score 100
            ]
          ]
        ]
      ],
      '#3b82f6' // Default blue for suburbs without code
    ]);

    // Update suburb data with calculated scores
    if (suburbData) {
      suburbData.forEach((suburb: SuburbFeature) => {
        if (suburb.properties && suburb.properties.code) {
          const score = calculateSuburbScore(suburb, strategy);
          suburb.properties.strategyScore = score;
        }
      });

      // Update the source data to trigger repaint
      const source = map.current!.getSource(config.sourceId) as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData(suburbData as any);
      }
    }
  }, [map, config.outlineLayerId, config.sourceId, calculateSuburbScore]);

  // Update search highlight layer
  const updateSearchHighlight = useCallback((searchedSuburbId: string | null, minHoverZoom: number) => {
    if (!map.current) return;
    
    const searchHighlightLayer = map.current.getLayer('suburbs-search-highlight');
    if (!searchHighlightLayer) return;

    const currentZoom = map.current.getZoom();
    
    if (currentZoom < minHoverZoom) {
      map.current.setFilter('suburbs-search-highlight', ['==', ['get', 'code'], '']);
      map.current.setPaintProperty('suburbs-search-highlight', 'line-opacity', 0);
      return;
    }

    if (searchedSuburbId) {
      map.current.setFilter('suburbs-search-highlight', ['==', ['get', 'code'], searchedSuburbId]);
      map.current.setPaintProperty('suburbs-search-highlight', 'line-opacity', 1);
    } else {
      map.current.setFilter('suburbs-search-highlight', ['==', ['get', 'code'], '']);
      map.current.setPaintProperty('suburbs-search-highlight', 'line-opacity', 0);
    }
  }, [map]);

  // Update selected suburb highlight
  const updateSelectedSuburbHighlight = useCallback((selectedSuburbId: string | null) => {
    if (!map.current) return;
    
    const selectedHighlightLayer = map.current.getLayer('suburbs-selected-highlight');
    if (!selectedHighlightLayer) return;

    if (selectedSuburbId) {
      // Show selected suburb highlight
      map.current.setFilter('suburbs-selected-highlight', ['==', ['get', 'code'], selectedSuburbId]);
      map.current.setPaintProperty('suburbs-selected-highlight', 'line-opacity', 1);
    } else {
      // Hide selected suburb highlight
      map.current.setFilter('suburbs-selected-highlight', ['==', ['get', 'code'], '']);
      map.current.setPaintProperty('suburbs-selected-highlight', 'line-opacity', 0);
    }
  }, [map]);

  return {
    calculateSuburbScore,
    updateSuburbColors,
    updateSearchHighlight,
    updateSelectedSuburbHighlight
  };
};
