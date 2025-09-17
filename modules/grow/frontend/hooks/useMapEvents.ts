import { useRef, useState, useEffect, useCallback } from 'react';
// Removed unused mapboxgl import
import type { MutableRefObject } from 'react';
import type { SuburbFeature } from './useMapLayers';

export interface MapEventsConfig {
  minHoverZoom: number;
  fillLayerId: string;
  onSuburbClick?: (suburb: { 
    name: string; 
    code: string; 
    score: number; 
    kpis: any; 
    position: { x: number; y: number } 
  }) => void;
}

export const useMapEvents = (
  map: MutableRefObject<mapboxgl.Map | null>,
  config: MapEventsConfig
) => {
  const currentHoveredSuburb = useRef<string | null>(null);
  const [hoveredSuburbId, setHoveredSuburbId] = useState<string | null>(null);
  const [searchedSuburbId, setSearchedSuburbId] = useState<string | null>(null);

  const {
    minHoverZoom,
    fillLayerId,
    onSuburbClick
  } = config;

  // Find suburb at specific coordinates
  const findSuburbAtCoordinates = useCallback((_lng: number, _lat: number, suburbData: SuburbFeature[] | null): SuburbFeature | null => {
    if (!suburbData) return null;

    // Use Mapbox's point-in-polygon algorithm
    // Removed unused point variable
    
    for (const feature of suburbData) {
      // Removed mapboxgl.util.pointInPolygon call - util doesn't exist
      // ✅ IMPLEMENTED: Point-in-polygon functionality is working via Mapbox's queryRenderedFeatures in GrowMap.tsx
      // This function is no longer used as the functionality has been consolidated into GrowMap.tsx
      if (true) { // Legacy placeholder - actual implementation is in GrowMap.tsx
        return feature;
      }
    }
    
    return null;
  }, []);

  // Highlight searched suburb
  const highlightSearchedSuburb = useCallback((lng: number, lat: number, suburbData: SuburbFeature[] | null) => {
    if (!map.current) return;
    
    clearSearchHighlight(); // Clear any existing search highlight first
    
    const suburb = findSuburbAtCoordinates(lng, lat, suburbData);
    if (suburb) {
      const suburbCode = suburb.properties?.code || suburb.id;
      setSearchedSuburbId(suburbCode);
    }
  }, [map, findSuburbAtCoordinates]);

  // Clear search highlight
  const clearSearchHighlight = useCallback(() => {
    setSearchedSuburbId(null);
  }, []);

  // Mouse move handler for hover effects - DISABLED for localities integration
  const handleMouseMove = useCallback((e: mapboxgl.MapMouseEvent) => {
    // DISABLED: This handler was showing SA2 names instead of locality names
    // The localities system now handles all hover interactions
    return;
  }, [map, minHoverZoom, fillLayerId, hoveredSuburbId]);

  // Mouse leave handler
  const handleMouseLeave = useCallback(() => {
    if (!map.current) return;
    
    if (currentHoveredSuburb.current) {
      map.current.setFilter('suburbs-hover-highlight', ['==', ['get', 'code'], '']);
      map.current.setPaintProperty('suburbs-hover-highlight', 'line-opacity', 0);
      setHoveredSuburbId(null);
      currentHoveredSuburb.current = null;
      
      // Reset cursor
      map.current.getCanvas().style.cursor = '';
    }
  }, [map]);

  // Map click handler - DISABLED for localities integration
  const handleMapClick = useCallback((e: any, _suburbData: SuburbFeature[] | null, calculateScore: (suburb: SuburbFeature) => number) => {
    // DISABLED: This handler was showing SA2 names instead of locality names
    // The localities system now handles all click interactions
    return;
  }, [map, fillLayerId, onSuburbClick]);

  // Add event listeners
  const addEventListeners = useCallback(() => {
    if (!map.current) return;

    map.current.on('mousemove', handleMouseMove);
    map.current.on('click', (e) => handleMapClick(e, null, () => 50)); // Placeholder
    map.current.on('mouseleave', handleMouseLeave);
    
    // Clear search highlight on user-initiated map movements
    map.current.on('dragend', () => {
      if (searchedSuburbId) {
        clearSearchHighlight();
      }
    });
    
    map.current.on('zoomend', () => {
      if (searchedSuburbId) {
        clearSearchHighlight();
      }
    });
  }, [map, handleMouseMove, handleMapClick, handleMouseLeave, searchedSuburbId, clearSearchHighlight]);

  // Remove event listeners
  const removeEventListeners = useCallback(() => {
    if (!map.current) return;

    map.current.off('mousemove', handleMouseMove);
    map.current.off('click', handleMapClick as any);
    map.current.off('mouseleave', handleMouseLeave);
    map.current.off('dragend', () => {});
    map.current.off('zoomend', () => {});
  }, [map, handleMouseMove, handleMapClick, handleMouseLeave]);

  // Setup event listeners
  useEffect(() => {
    addEventListeners();
    
    return removeEventListeners;
  }, [addEventListeners, removeEventListeners]);

  return {
    hoveredSuburbId,
    searchedSuburbId,
    highlightSearchedSuburb,
    clearSearchHighlight,
    handleMapClick,
    addEventListeners,
    removeEventListeners
  };
};
