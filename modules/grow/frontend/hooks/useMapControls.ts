import { useCallback } from 'react';
import type { MutableRefObject } from 'react';
// Removed unused mapboxgl import
import type { SuburbFeature } from './useMapLayers';

export interface MapControlsConfig {
  sourceId: string;
}

export const useMapControls = (
  map: MutableRefObject<mapboxgl.Map | null>,
  config: MapControlsConfig
) => {
  // Zoom to specific suburb
  const zoomToSuburb = useCallback((suburbName: string, suburbData: SuburbFeature[] | null) => {
    if (!map.current || !suburbData) return;

    const suburb = suburbData.find((f: SuburbFeature) => 
      f.properties?.name === suburbName || 
      f.properties?.SA2_NAME21 === suburbName
    );

    if (suburb && suburb.geometry) {
      // Calculate bounds for the suburb
      const coordinates = suburb.geometry.coordinates[0]; // First ring of polygon
      let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
      
      coordinates.forEach((coord: number[]) => {
        minLng = Math.min(minLng, coord[0]);
        minLat = Math.min(minLat, coord[1]);
        maxLng = Math.max(maxLng, coord[0]);
        maxLat = Math.max(maxLat, coord[1]);
      });

      // Add padding and fly to bounds
      const bounds = [
        [minLng - 0.01, minLat - 0.01],
        [maxLng + 0.01, maxLat + 0.01]
      ] as [[number, number], [number, number]];

      map.current.fitBounds(bounds, {
        padding: 50,
        duration: 2000
      });

      // Return the suburb code for highlighting
      return suburb.properties?.code || suburb.id;
    }
    
    return null;
  }, [map, config.sourceId]);

  // Fly to coordinates
  const flyToCoordinates = useCallback((lng: number, lat: number, zoom: number = 10) => {
    if (!map.current) return;

    map.current.flyTo({
      center: [lng, lat],
      zoom,
      duration: 2000
    });
  }, [map]);

  // Fly to bounds
  const flyToBounds = useCallback((bounds: [[number, number], [number, number]], padding: number = 50) => {
    if (!map.current) return;

    map.current.fitBounds(bounds, {
      padding,
      duration: 2000
    });
  }, [map]);

  // Reset view to default
  const resetView = useCallback(() => {
    if (!map.current) return;

    map.current.flyTo({
      center: [133.7751, -25.2744], // Australia center
      zoom: 4,
      duration: 2000
    });
  }, [map]);

  // Get current map state
  const getMapState = useCallback(() => {
    if (!map.current) return null;

    return {
      center: map.current.getCenter(),
      zoom: map.current.getZoom(),
      bounds: map.current.getBounds()
    };
  }, [map]);

  // Set map state
  const setMapState = useCallback((center: [number, number], zoom: number) => {
    if (!map.current) return;

    map.current.setCenter(center);
    map.current.setZoom(zoom);
  }, [map]);

  return {
    zoomToSuburb,
    flyToCoordinates,
    flyToBounds,
    resetView,
    getMapState,
    setMapState
  };
};
