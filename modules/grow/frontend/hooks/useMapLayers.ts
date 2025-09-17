import { useRef, useCallback } from 'react';
import type { MutableRefObject } from 'react';
// Removed unused mapboxgl import

export interface SuburbFeature {
  id: string;
  properties: {
    code?: string;
    name?: string;
    SA2_NAME21?: string;
    strategyScore?: number;
  };
  geometry: {
    coordinates: number[][][];
  };
}

export interface MapLayersConfig {
  sourceId: string;
  layerIds: {
    outline: string;
    fill: string;
    hover: string;
    hoverHighlight: string;
    searchHighlight: string;
    selectedHighlight: string;
    schoolCatchments: string;
  };
}

export const useMapLayers = (map: MutableRefObject<mapboxgl.Map | null>) => {
  const suburbData = useRef<SuburbFeature[] | null>(null);

  // Configuration constants
  const config: MapLayersConfig = {
    sourceId: 'suburbs',
    layerIds: {
      outline: 'suburbs-outline',
      fill: 'suburbs-fill',
      hover: 'suburbs-hover',
      hoverHighlight: 'suburbs-hover-highlight',
      searchHighlight: 'suburbs-search-highlight',
      selectedHighlight: 'suburbs-selected-highlight',
      schoolCatchments: 'school-catchments'
    }
  };

  // Remove existing layers and source
  const cleanupLayers = useCallback(async () => {
    if (!map.current) return;

    const layersToRemove = [
      config.layerIds.outline,
      config.layerIds.fill,
      config.layerIds.hover,
      config.layerIds.hoverHighlight,
      config.layerIds.searchHighlight,
      config.layerIds.selectedHighlight,
      config.layerIds.schoolCatchments,
      'school-catchments' // Also remove the overlay layer
    ];

    layersToRemove.forEach(layerId => {
      if (map.current!.getLayer(layerId)) {
        map.current!.removeLayer(layerId);
      }
    });

    if (map.current.getSource(config.sourceId)) {
      map.current.removeSource(config.sourceId);
    }
  }, [map, config.sourceId, config.layerIds]);

  // Load suburb data - DISABLED for localities integration
  const loadSuburbData = useCallback(async () => {
    // DISABLED: No longer loading SA2 GeoJSON data since we're using localities vector tileset
    console.log('SA2 data loading disabled - using localities vector tileset instead');
    return { features: [] };
  }, []);

  // Add GeoJSON source - DISABLED for localities integration
  const addSource = useCallback((data: any) => {
    // DISABLED: No longer creating SA2 GeoJSON source since we're using localities vector tileset
    console.log('SA2 source creation disabled - using localities vector tileset instead');
    return;
  }, [map, config.sourceId]);

  // Add suburb layers - DISABLED for localities integration
  const addSuburbLayers = useCallback(() => {
    // DISABLED: No longer creating SA2 layers since we're using localities vector tileset
    console.log('SA2 layer creation disabled - using localities vector tileset instead');
    return;
  }, [map, config]);

  // Initialize all layers - DISABLED for localities integration
  const initializeLayers = useCallback(async () => {
    // DISABLED: No longer initializing SA2 layers since we're using localities vector tileset
    console.log('SA2 layer initialization disabled - using localities vector tileset instead');
    return [];
  }, [cleanupLayers, loadSuburbData, addSource, addSuburbLayers]);

  // Update source data
  const updateSourceData = useCallback((data: any) => {
    if (!map.current) return;

    const source = map.current.getSource(config.sourceId) as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData(data);
    }
  }, [map, config.sourceId]);

  // Toggle school catchments visibility
  const toggleSchoolCatchments = useCallback((visible: boolean) => {
    if (!map.current) return;

    const layer = map.current.getLayer(config.layerIds.schoolCatchments);
    if (layer) {
      map.current.setLayoutProperty(config.layerIds.schoolCatchments, 'visibility', visible ? 'visible' : 'none');
    }

    const overlayLayer = map.current.getLayer('school-catchments');
    if (overlayLayer) {
      if (visible) {
        map.current.setFilter('school-catchments', ['!=', ['get', 'code'], '']);
        map.current.setPaintProperty('school-catchments', 'fill-opacity', 0.3);
      } else {
        map.current.setFilter('school-catchments', ['==', ['get', 'code'], '']);
        map.current.setPaintProperty('school-catchments', 'fill-opacity', 0);
      }
    }
  }, [map, config.layerIds.schoolCatchments]);

  return {
    suburbData,
    config,
    initializeLayers,
    cleanupLayers,
    updateSourceData,
    toggleSchoolCatchments
  };
};
