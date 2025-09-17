import { useCallback } from 'react';
import type { MutableRefObject } from 'react';
// Removed unused mapboxgl import

export interface MapOverlaysConfig {
  schoolCatchmentsLayerId: string;
  schoolCatchmentsSourceId: string;
}

export const useMapOverlays = (
  map: MutableRefObject<mapboxgl.Map | null>,
  config: MapOverlaysConfig
) => {
  // Toggle school catchments overlay
  const toggleSchoolCatchments = useCallback((visible: boolean) => {
    if (!map.current) return;

    const schoolCatchmentsLayer = map.current.getLayer(config.schoolCatchmentsLayerId);
    if (!schoolCatchmentsLayer) return;

    if (visible) {
      // Show school catchments
      map.current.setFilter(config.schoolCatchmentsLayerId, ['!=', ['get', 'code'], '']);
      map.current.setPaintProperty(config.schoolCatchmentsLayerId, 'fill-opacity', 0.3);
      map.current.setPaintProperty(config.schoolCatchmentsLayerId, 'fill-color', '#3b82f6');
    } else {
      // Hide school catchments
      map.current.setFilter(config.schoolCatchmentsLayerId, ['==', ['get', 'code'], '']);
      map.current.setPaintProperty(config.schoolCatchmentsLayerId, 'fill-opacity', 0);
    }
  }, [map, config.schoolCatchmentsLayerId]);

  // Add school catchments data source
  const addSchoolCatchmentsSource = useCallback((data: any) => {
    if (!map.current) return;

    // Check if source already exists
    const existingSource = map.current.getSource(config.schoolCatchmentsSourceId);
    if (existingSource) {
      // Update existing source
      (existingSource as mapboxgl.GeoJSONSource).setData(data);
    } else {
      // Add new source
      map.current.addSource(config.schoolCatchmentsSourceId, {
        type: 'geojson',
        data: data
      });
    }
  }, [map, config.schoolCatchmentsSourceId]);

  // Add school catchments layer
  const addSchoolCatchmentsLayer = useCallback(() => {
    if (!map.current) return;

    // Check if layer already exists
    const existingLayer = map.current.getLayer(config.schoolCatchmentsLayerId);
    if (existingLayer) return;

    // Add school catchments layer
    map.current.addLayer({
      id: config.schoolCatchmentsLayerId,
      type: 'fill',
      source: config.schoolCatchmentsSourceId,
      paint: {
        'fill-color': '#3b82f6',
        'fill-opacity': 0,
        'fill-outline-color': '#1e40af'
      },
      filter: ['==', ['get', 'code'], ''] // Hidden by default
    });
  }, [map, config.schoolCatchmentsLayerId, config.schoolCatchmentsSourceId]);

  // Remove school catchments layer
  const removeSchoolCatchmentsLayer = useCallback(() => {
    if (!map.current) return;

    const schoolCatchmentsLayer = map.current.getLayer(config.schoolCatchmentsLayerId);
    if (schoolCatchmentsLayer) {
      map.current.removeLayer(config.schoolCatchmentsLayerId);
    }

    const schoolCatchmentsSource = map.current.getSource(config.schoolCatchmentsSourceId);
    if (schoolCatchmentsSource) {
      map.current.removeSource(config.schoolCatchmentsSourceId);
    }
  }, [map, config.schoolCatchmentsLayerId, config.schoolCatchmentsSourceId]);

  // Initialize overlays
  const initializeOverlays = useCallback(() => {
    // For now, we'll just add the school catchments layer
    // In the future, this could handle other overlays like:
    // - Transport routes
    // - Planning zones
    // - Flood zones
    // - Heritage areas
    addSchoolCatchmentsLayer();
  }, [addSchoolCatchmentsLayer]);

  // Cleanup overlays
  const cleanupOverlays = useCallback(() => {
    removeSchoolCatchmentsLayer();
  }, [removeSchoolCatchmentsLayer]);

  return {
    toggleSchoolCatchments,
    addSchoolCatchmentsSource,
    addSchoolCatchmentsLayer,
    removeSchoolCatchmentsLayer,
    initializeOverlays,
    cleanupOverlays
  };
};
