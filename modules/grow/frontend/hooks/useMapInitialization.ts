import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_CONFIG } from '../config/mapbox';

export interface MapInitializationConfig {
  onMapReady?: (map: mapboxgl.Map) => void;
  minZoom?: number;
  maxZoom?: number;
}

export const useMapInitialization = (config: MapInitializationConfig = {}) => {
  const map = useRef<mapboxgl.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const configRef = useRef(config);
  
  // Update config ref when config changes
  configRef.current = config;

  // Initialize map on mount (only once)
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize mapbox
    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: MAPBOX_CONFIG.style,
        center: MAPBOX_CONFIG.center,
        zoom: MAPBOX_CONFIG.zoom,
        minZoom: configRef.current.minZoom || 3,
        maxZoom: configRef.current.maxZoom || 15
      });

      // Call onMapReady when map is ready
      if (configRef.current.onMapReady) {
        map.current.on('load', () => {
          configRef.current.onMapReady!(map.current!);
        });
      }

      // Add error handling
      map.current.on('error', (e) => {
        console.error('❌ Mapbox error:', e);
      });

    } catch (error) {
      console.error('❌ Error creating Mapbox map:', error);
    }

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []); // Empty dependency array - only run once

  return {
    map,
    mapContainer
  };
};
