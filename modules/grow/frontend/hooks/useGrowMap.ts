import { useEffect, useCallback, useRef } from 'react';
import { useGrowStore } from '../store/growStore';
import { useMapInitialization } from './useMapInitialization';
import { useMapLayers } from './useMapLayers';
import { useMapEvents } from './useMapEvents';
import { useMapScoring } from './useMapScoring';
import { useMapControls } from './useMapControls';
import { useMapOverlays } from './useMapOverlays';
import type { StrategyPreset } from '../types';

export interface GrowMapRef {
  zoomToSuburb: (suburbName: string) => void;
  highlightSearchedSuburb: (lng: number, lat: number) => void;
  clearSearchHighlight: () => void;
}

export interface GrowMapConfig {
  onMapReady?: (map: mapboxgl.Map) => void;
  onSuburbClick?: (suburb: { 
    name: string; 
    code: string; 
    score: number; 
    kpis: any; 
    position: { x: number; y: number } 
  }) => void;
  selectedSuburbId?: string | null;
  editingStrategy?: StrategyPreset | null;
}

export const useGrowMap = (config: GrowMapConfig) => {
  const {
    onMapReady,
    onSuburbClick
  } = config;

  // Get store data
  const { activeStrategyId, presets, locationScope } = useGrowStore();

  // Track initialization state
  const layersInitialized = useRef(false);

  // Initialize map first
  const { map, mapContainer } = useMapInitialization({
    onMapReady: (map) => {
      if (onMapReady) {
        onMapReady(map);
      }
    }
  });

  // Initialize layers
  const mapLayers = useMapLayers(map);

  // Initialize events
  const mapEvents = useMapEvents(map, {
    minHoverZoom: 6,
    fillLayerId: 'suburbs-fill',
    onSuburbClick
  });

  // Initialize scoring
  const mapScoring = useMapScoring(map, {
    outlineLayerId: 'suburbs-outline',
    sourceId: 'suburbs'
  });

  // Initialize controls
  const mapControls = useMapControls(map, {
    sourceId: 'suburbs'
  });

  // Initialize overlays
  const mapOverlays = useMapOverlays(map, {
    schoolCatchmentsLayerId: 'school-catchments',
    schoolCatchmentsSourceId: 'school-catchments'
  });

  // Localities layers are now handled directly in GrowMap.tsx
  // This prevents duplicate initialization and flickering

  // Initialize layers when map is ready
  useEffect(() => {
    if (!map.current || !mapLayers.initializeLayers || layersInitialized.current) return;
    
    // Wait for map to be fully loaded before initializing layers
    if (!map.current.isStyleLoaded()) {
      const handleStyleLoad = () => {
        if (layersInitialized.current) return; // Prevent multiple initializations
        layersInitialized.current = true;
        
        mapLayers.initializeLayers().then(() => {
          // Apply basic colors to show suburbs (without complex strategy logic)
          if (mapScoring.updateSuburbColors && mapLayers.suburbData.current) {
            const activeStrategy = presets.find(p => p.id === activeStrategyId);
            if (activeStrategy) {
              mapScoring.updateSuburbColors(
                activeStrategy,
                mapLayers.suburbData.current,
                mapEvents.searchedSuburbId,
                mapEvents.hoveredSuburbId,
                locationScope
              );
            }
          }
        }).catch((error) => {
          console.error('❌ Error initializing layers:', error);
          layersInitialized.current = false; // Reset on error
        });
      };
      
      map.current.once('idle', handleStyleLoad);
      return;
    }
    
    layersInitialized.current = true;
    
    mapLayers.initializeLayers().then(() => {
      // Apply basic colors to show suburbs (without complex strategy logic)
      if (mapScoring.updateSuburbColors && mapLayers.suburbData.current) {
        const activeStrategy = presets.find(p => p.id === activeStrategyId);
        if (activeStrategy) {
          mapScoring.updateSuburbColors(
            activeStrategy,
            mapLayers.suburbData.current,
            mapEvents.searchedSuburbId,
            mapEvents.hoveredSuburbId,
            locationScope
          );
        }
      }
    }).catch((error) => {
      console.error('❌ Error initializing layers:', error);
      layersInitialized.current = false; // Reset on error
    });
  }, []); // Empty dependency array - only run once on mount

  // TODO: Re-enable these effects once basic map is working
  // Strategy-based map recolouring effect - supports live preview
  // useEffect(() => {
  //   if (!map.current || !mapLayers.suburbData.current) return;
  //   
  //   // Use editingStrategy for live preview, fallback to active strategy
  //   const strategyToUse = editingStrategy || presets.find(p => p.id === activeStrategyId);
  //   if (!strategyToUse) return;

  //   // Update suburb colors based on strategy
  //   if (mapScoring.updateSuburbColors) {
  //     mapScoring.updateSuburbColors(
  //       strategyToUse,
  //       mapLayers.suburbData.current,
  //       mapEvents.searchedSuburbId,
  //       mapEvents.hoveredSuburbId,
  //       locationScope
  //     );
  //   }
  // }, [editingStrategy, activeStrategyId, presets, locationScope]);

  // // School catchments overlay effect
  // useEffect(() => {
  //   if (!map.current) return;
  //   
  //   const schoolCatchmentsLayer = map.current.getLayer('school-catchments');
  //   if (!schoolCatchmentsLayer) return;

  //   if (layers.schoolCatchments) {
  //     // Show school catchments overlay
  //     map.current.setFilter('school-catchments', ['!=', ['get', 'code'], '']);
  //     map.current.setPaintProperty('school-catchments', 'fill-opacity', 0.3);
  //   } else {
  //     // Hide school catchments overlay
  //     map.current.setFilter('school-catchments', ['==', ['get', 'code'], '']);
  //     map.current.setPaintProperty('school-catchments', 'fill-opacity', 0);
  //   }
  // }, [layers.schoolCatchments]);

  // // Selected suburb highlight effect
  // useEffect(() => {
  //   if (mapScoring.updateSelectedSuburbHighlight && selectedSuburbId) {
  //     mapScoring.updateSelectedSuburbHighlight(selectedSuburbId);
  //   }
  // }, [selectedSuburbId]);

  // // School catchments layer toggle effect
  // useEffect(() => {
  //   if (mapOverlays.toggleSchoolCatchments) {
  //     mapOverlays.toggleSchoolCatchments(layers.schoolCatchments);
  //   }
  // }, [layers.schoolCatchments]);

  // // Search highlight effect
  // useEffect(() => {
  //   if (mapScoring.updateSearchHighlight) {
  //     mapScoring.updateSearchHighlight(mapEvents.searchedSuburbId, 6);
  //   }
  // }, [mapEvents.searchedSuburbId]);

  // Expose functions to parent component
  const zoomToSuburb = useCallback((suburbName: string) => {
    return mapControls.zoomToSuburb(suburbName, mapLayers.suburbData.current);
  }, [mapControls, mapLayers.suburbData]);

  const highlightSearchedSuburb = useCallback((lng: number, lat: number) => {
    mapEvents.highlightSearchedSuburb(lng, lat, mapLayers.suburbData.current);
  }, [mapEvents, mapLayers.suburbData]);

  const clearSearchHighlight = useCallback(() => {
    mapEvents.clearSearchHighlight();
  }, [mapEvents]);

  return {
    // Map container ref
    mapContainer,
    
    // Map instance
    map,
    
    // Layer management
    mapLayers,
    
    // Event handling
    mapEvents,
    
    // Scoring
    mapScoring,
    
    // Controls
    mapControls,
    
    // Overlays
    mapOverlays,
    
    // Exposed functions
    zoomToSuburb,
    highlightSearchedSuburb,
    clearSearchHighlight
  };
};
