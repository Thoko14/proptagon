import { useCallback, useRef, useState } from 'react';
import { SuburbFeature, StrategyPreset } from '../types';

export const useMapInteractions = () => {
  const currentHoveredSuburb = useRef<string | null>(null);
  const [hoveredSuburbId, setHoveredSuburbId] = useState<string | null>(null);
  const [searchedSuburbId, setSearchedSuburbId] = useState<string | null>(null);

  // Configuration constants
  const MIN_HOVER_ZOOM = 6;
  const SUBURB_SOURCE_ID = 'suburbs';
  const SUBURB_LAYER_ID = 'suburbs-outline';
  const SUBURB_FILL_LAYER_ID = 'suburbs-fill';

  // Calculate suburb score based on strategy weights
  const calculateSuburbScore = useCallback((suburb: SuburbFeature, strategy: StrategyPreset): number => {
    if (!suburb.properties || !strategy) return 50;

    // Mock KPI values - in real implementation these would come from actual data
    const mockKPIs = {
      yield: Math.floor(Math.random() * 8) + 2, // 2-10%
      vacancy: Math.floor(Math.random() * 5) + 1, // 1-6%
      growth5y: Math.floor(Math.random() * 15) + 5, // 5-20%
      seifa: Math.floor(Math.random() * 10) + 1, // 1-10
      stock: Math.floor(Math.random() * 30) + 5, // 5-35
      infra: Math.floor(Math.random() * 10) + 1 // 1-10
    };

    // Calculate weighted score
    let totalScore = 0;
    let totalWeight = 0;

    Object.entries(strategy.weights).forEach(([key, weight]) => {
      const kpiValue = mockKPIs[key as keyof typeof mockKPIs] || 0;
      totalScore += (kpiValue / 10) * weight; // Normalize KPI to 0-10 scale
      totalWeight += weight;
    });

    // Return normalized score (0-100)
    return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 10) : 50;
  }, []);

  // Get score color based on value
  const getScoreColor = useCallback((score: number): string => {
    if (score >= 80) return '#10b981'; // Green for high scores
    if (score >= 60) return '#84cc16'; // Lime for good scores
    if (score >= 40) return '#eab308'; // Yellow for average scores
    if (score >= 20) return '#f97316'; // Orange for below average
    return '#ef4444'; // Red for low scores
  }, []);

  // Find suburb at specific coordinates
  const findSuburbAtCoordinates = useCallback((lng: number, lat: number, map: any): SuburbFeature | null => {
    if (!map) return null;

    const features = map.queryRenderedFeatures([lng, lat], {
      layers: [SUBURB_FILL_LAYER_ID]
    });

    if (features.length > 0) {
      return features[0] as SuburbFeature;
    }

    return null;
  }, []);

  // Highlight searched suburb
  const highlightSearchedSuburb = useCallback((lng: number, lat: number, map: any) => {
    if (!map) return;

    const suburb = findSuburbAtCoordinates(lng, lat, map);
    if (suburb && suburb.properties?.code) {
      setSearchedSuburbId(suburb.properties.code);
      
      // Update map filter to highlight the searched suburb
      map.setFilter('suburbs-search-highlight', ['==', ['get', 'code'], suburb.properties.code]);
      map.setPaintProperty('suburbs-search-highlight', 'line-opacity', 1);
    }
  }, [findSuburbAtCoordinates]);

  // Clear search highlight
  const clearSearchHighlight = useCallback((map: any) => {
    if (!map) return;

    setSearchedSuburbId(null);
    map.setFilter('suburbs-search-highlight', ['==', ['get', 'code'], '']);
    map.setPaintProperty('suburbs-search-highlight', 'line-opacity', 0);
  }, []);

  // Handle mouse move for hover effects
  const handleMouseMove = useCallback((e: any, map: any) => {
    if (!map) return;
    
    const currentZoom = map.getZoom();
    if (currentZoom < MIN_HOVER_ZOOM) {
      if (hoveredSuburbId) {
        setHoveredSuburbId(null);
        currentHoveredSuburb.current = null;
      }
      return;
    }

    const features = map.queryRenderedFeatures(e.point, {
      layers: [SUBURB_FILL_LAYER_ID]
    });

    if (features.length > 0) {
      const feature = features[0];
      const suburbCode = feature.properties?.code || feature.id;
      
      if (suburbCode !== currentHoveredSuburb.current) {
        if (currentHoveredSuburb.current) {
          map.setFilter('suburbs-hover-highlight', ['==', ['get', 'code'], '']);
          map.setPaintProperty('suburbs-hover-highlight', 'line-opacity', 0);
        }
        
        if (suburbCode) {
          map.setFilter('suburbs-hover-highlight', ['==', ['get', 'code'], suburbCode]);
          map.setPaintProperty('suburbs-hover-highlight', 'line-opacity', 1);
          setHoveredSuburbId(suburbCode);
          currentHoveredSuburb.current = suburbCode;
          
          // Change cursor to pointer
          map.getCanvas().style.cursor = 'pointer';
        }
      }
    } else {
      if (currentHoveredSuburb.current) {
        map.setFilter('suburbs-hover-highlight', ['==', ['get', 'code'], '']);
        map.setPaintProperty('suburbs-hover-highlight', 'line-opacity', 0);
        setHoveredSuburbId(null);
        currentHoveredSuburb.current = null;
        
        // Reset cursor
        map.getCanvas().style.cursor = '';
      }
    }
  }, [hoveredSuburbId]);

  // Handle mouse leave
  const handleMouseLeave = useCallback((map: any) => {
    if (!map) return;
    
    if (currentHoveredSuburb.current) {
      map.setFilter('suburbs-hover-highlight', ['==', ['get', 'code'], '']);
      map.setPaintProperty('suburbs-hover-highlight', 'line-opacity', 0);
      setHoveredSuburbId(null);
      currentHoveredSuburb.current = null;
      
      // Reset cursor
      map.getCanvas().style.cursor = '';
    }
  }, []);

  // Handle map click
  const handleMapClick = useCallback((e: any, map: any, onSuburbClick?: Function, presets?: any[], activeStrategyId?: string) => {
    if (!map) return;
    
    const features = map.queryRenderedFeatures(e.point, {
      layers: [SUBURB_FILL_LAYER_ID]
    });

    if (features.length > 0) {
      const feature = features[0];
      const suburbCode = feature.properties?.code || feature.id;
      const suburbName = feature.properties?.name || feature.properties?.SA2_NAME21 || 'Unknown Suburb';
      
      // Calculate suburb score for the toolkit
      const activeStrategy = presets?.find(p => p.id === activeStrategyId);
      const score = activeStrategy ? calculateSuburbScore(feature as SuburbFeature, activeStrategy) : 50;
      
      // Mock KPIs - in real implementation, these would come from actual data
      const kpis = {
        yield: Math.floor(Math.random() * 8) + 2, // 2-10%
        growth5y: Math.floor(Math.random() * 15) + 5, // 5-20%
        vacancy: Math.floor(Math.random() * 5) + 1 // 1-6%
      };
      
      // Call the callback to show the toolkit
      if (onSuburbClick) {
        onSuburbClick({
          name: suburbName,
          code: suburbCode,
          score,
          kpis,
          position: { x: e.point.x, y: e.point.y }
        });
      }
    }
  }, [calculateSuburbScore]);

  return {
    // State
    hoveredSuburbId,
    searchedSuburbId,
    
    // Constants
    MIN_HOVER_ZOOM,
    SUBURB_SOURCE_ID,
    SUBURB_LAYER_ID,
    SUBURB_FILL_LAYER_ID,
    
    // Functions
    calculateSuburbScore,
    getScoreColor,
    findSuburbAtCoordinates,
    highlightSearchedSuburb,
    clearSearchHighlight,
    handleMouseMove,
    handleMouseLeave,
    handleMapClick,
    
    // Setters
    setHoveredSuburbId,
    setSearchedSuburbId,
  };
};
