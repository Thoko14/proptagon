import { forwardRef, useImperativeHandle, useRef, useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useLocalitiesLayers } from '../hooks/useLocalitiesLayers';
import { useSchoolCatchments } from '../hooks/useSchoolCatchments';
import { MAPBOX_CONFIG } from '../config/mapbox';

export interface GrowMapRef {
  zoomToSuburb: (suburbName: string, state?: string, onSuburbFound?: (suburbCode: string) => void) => void;
  highlightSearchedSuburb: (suburbName: string) => void;
  clearSearchHighlight: () => void;
  highlightSuburbByCode: (suburbCode: string) => void;
  debugSearch: () => void;
  examineZ12Data: () => void;
  toggleNswCatchments: (opts: { primary?: boolean; secondary?: boolean; future?: boolean }) => void;
  applyCatchmentsFilter: (filter: any) => void;
}

interface GrowMapProps {
  onSuburbClick?: (suburb: any) => void;
  onMapReady?: (map: mapboxgl.Map) => void;
  className?: string;
  currentFilterState?: any;
}

const GrowMap = forwardRef<GrowMapRef, GrowMapProps>(({ onSuburbClick, onMapReady, className = '', currentFilterState }, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const onMapReadyRef = useRef(onMapReady);
  
  // Store the localities layers functions in ref
  const localitiesLayersRef = useRef<any>(null);
  const schoolCatchmentsRef = useRef<any>(null);
  
  // Update ref when onMapReady changes
  useEffect(() => {
    onMapReadyRef.current = onMapReady;
  }, [onMapReady]);
  
  // Initialize localities layers
  const localitiesLayers = useLocalitiesLayers(
    map,
    {
      onLocalityClick: (localityData) => {
        if (onSuburbClick) {
          onSuburbClick(localityData);
        }
      }
    }
  );

  // Store the localities layers functions in ref
  localitiesLayersRef.current = localitiesLayers;
  // Initialize school catchments (NSW vector tiles) and store ref
  const schoolCatchments = useSchoolCatchments(map, (catchmentData) => {
    if (onSuburbClick) {
      onSuburbClick(catchmentData);
    }
  }, currentFilterState);
  schoolCatchmentsRef.current = schoolCatchments;

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: MAPBOX_CONFIG.style,
        center: MAPBOX_CONFIG.center,
        zoom: MAPBOX_CONFIG.zoom,
        renderWorldCopies: MAPBOX_CONFIG.renderWorldCopies,
        maxZoom: MAPBOX_CONFIG.maxZoom,
        minZoom: MAPBOX_CONFIG.minZoom,
        preserveDrawingBuffer: MAPBOX_CONFIG.preserveDrawingBuffer
      });

      // Call onMapReady when map is ready
      if (onMapReadyRef.current) {
        map.current.on('load', () => {
          try {
            const el = mapContainer.current as HTMLDivElement;
            console.log('🧭 Map loaded. Container size:', {
              width: el?.clientWidth,
              height: el?.clientHeight,
              className: el?.className
            });
            // Ensure canvas sizes to container after layout settles
            map.current!.resize();
            setTimeout(() => map.current && map.current.resize(), 300);
          } catch {}
          onMapReadyRef.current!(map.current!);
        });
      }

      // Add error handling
      map.current.on('error', (e) => {
        console.error('❌ Mapbox error:', e);
      });

      // Log initial container size
      try {
        const el = mapContainer.current as HTMLDivElement;
        console.log('📐 Map container mount size:', {
          width: el?.clientWidth,
          height: el?.clientHeight,
          className: el?.className
        });
      } catch {}

      // Force resize on window resize
      const handleWindowResize = () => {
        try { map.current && map.current.resize(); } catch {}
      };
      window.addEventListener('resize', handleWindowResize);

    } catch (error) {
      console.error('❌ Error creating Mapbox map:', error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      window.removeEventListener('resize', () => {});
    };
  }, []); // Empty dependency array to run only once

  const zoomToSuburb = useCallback(async (suburbName: string, state?: string, onSuburbFound?: (suburbCode: string) => void) => {
    if (!map.current) {
      console.log('❌ Map not ready for suburb search');
      return;
    }
    
    console.log('🔍 Searching for locality by name:', suburbName, 'in state:', state);
    
    // Use Geocoding API to find and zoom to the suburb
    console.log('🔍 Using Geocoding API to find location of:', suburbName);
    try {
      const geocodingResponse = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(suburbName + (state ? `, ${state}` : ''))}.json?access_token=${MAPBOX_CONFIG.accessToken}&country=AU&types=place,locality,neighborhood`
      );
      
      const geocodingData = await geocodingResponse.json();
      console.log('🔍 Geocoding results:', geocodingData);
      
      if (geocodingData.features && geocodingData.features.length > 0) {
        console.log('🔍 All Geocoding results:', geocodingData.features.map((f: any) => ({
          place_name: f.place_name,
          center: f.center,
          place_type: f.place_type
        })));
        
        // Find the right Red Hill based on state or default to coastal Red Hill for Queensland
        let feature = geocodingData.features[0]; // Default to first result
        
        if (state && state.toLowerCase().includes('queensland')) {
          // For Queensland searches, look for coastal Red Hill (near Brisbane/Gold Coast)
          const coastalRedHill = geocodingData.features.find((f: any) => {
            const [lng, lat] = f.center;
            // Coastal Red Hill should be around 153°E, -27°S (near Brisbane)
            return lng > 152 && lng < 154 && lat > -28 && lat < -26;
          });
          
          if (coastalRedHill) {
            feature = coastalRedHill;
            console.log('🏖️ Found coastal Red Hill for Queensland:', { 
              lng: feature.center[0], 
              lat: feature.center[1], 
              place_name: feature.place_name 
            });
          } else {
            console.log('🔍 Using first result (no coastal Red Hill found for Queensland):', { 
              lng: feature.center[0], 
              lat: feature.center[1], 
              place_name: feature.place_name 
            });
          }
        } else if (state) {
          // For other states, find the Red Hill in that specific state
          const stateRedHill = geocodingData.features.find((f: any) => {
            return f.place_name.toLowerCase().includes(state.toLowerCase());
          });
          
          if (stateRedHill) {
            feature = stateRedHill;
            console.log(`🏘️ Found Red Hill in ${state}:`, { 
              lng: feature.center[0], 
              lat: feature.center[1], 
              place_name: feature.place_name 
            });
            } else {
            console.log(`🔍 Using first result (no Red Hill found in ${state}):`, { 
              lng: feature.center[0], 
              lat: feature.center[1], 
              place_name: feature.place_name 
            });
          }
        } else {
          // No state specified, use first result
          console.log('🔍 Using first result (no state specified):', { 
            lng: feature.center[0], 
            lat: feature.center[1], 
            place_name: feature.place_name 
          });
        }
        
        const [lng, lat] = feature.center;
        
        // Use bbox if available and reasonable, otherwise use center with appropriate zoom
        if (feature.bbox) {
          const [west, south, east, north] = feature.bbox;
          const bboxWidth = east - west;
          const bboxHeight = north - south;
          
          console.log('🗺️ Bbox details:', {
            bbox: feature.bbox,
            width: bboxWidth,
            height: bboxHeight,
            center: [(west + east) / 2, (south + north) / 2]
          });
          
          // If bbox is too large (more than ~0.5 degrees), use flyTo with dynamic zoom
          if (bboxWidth > 0.5 || bboxHeight > 0.5) {
            console.log('🗺️ Bbox too large, using flyTo with dynamic zoom');
            
            // Calculate appropriate zoom level based on bbox size
            const maxDimension = Math.max(bboxWidth, bboxHeight);
            let dynamicZoom: number;
            
            if (maxDimension > 5) {
              dynamicZoom = 6; // Very large areas (states/territories)
            } else if (maxDimension > 2) {
              dynamicZoom = 8; // Large areas (big suburbs/regions)
            } else if (maxDimension > 1) {
              dynamicZoom = 10; // Medium areas
            } else if (maxDimension > 0.5) {
              dynamicZoom = 12; // Small areas
            } else {
              dynamicZoom = 14; // Very small areas
            }
            
            console.log('🗺️ Dynamic zoom calculation:', { maxDimension, dynamicZoom });
            
            map.current.flyTo({
              center: [lng, lat],
              zoom: dynamicZoom,
              duration: 2000
            });
          } else {
            console.log('🗺️ Using bbox to zoom to suburb');
            map.current.fitBounds(feature.bbox, {
              padding: 60,
              duration: 1000,
              maxZoom: 16 // Prevent zooming in too close
            });
          }
        } else {
          console.log('🗺️ Using center to zoom to suburb:', { lng, lat });
          map.current.flyTo({
            center: [lng, lat],
            zoom: 14,
            duration: 1000
          });
        }
          
          // Call the callback with the suburb code
          if (onSuburbFound) {
          onSuburbFound(feature.id || 'geocoding-' + Date.now());
        }
        
        // Wait for the map to finish zooming before highlighting
        console.log('🎯 Waiting for map to finish zooming before highlighting...');
        const handleMoveEnd = () => {
          console.log('🎯 Map finished moving, highlighting searched suburb:', suburbName);
          highlightSearchedSuburb(suburbName);
          map.current?.off('moveend', handleMoveEnd);
        };
        map.current?.on('moveend', handleMoveEnd);
        
        // Show the toolbox with suburb information
        console.log('📋 Showing toolbox for searched suburb:', feature.place_name);
        if (onSuburbClick) {
          onSuburbClick({
            name: feature.text || suburbName,
            state: state || 'Unknown',
            code: feature.id || 'geocoding-' + Date.now(),
            score: 85, // Mock score
            kpis: {
              yield: 4.2,
              growth5y: 8.5,
              vacancy: 2.1
            }
          });
        }
        
        return;
      } else {
        console.log('❌ No location found via Geocoding API');
      }
    } catch (error) {
      console.log('❌ Error with Geocoding API:', error);
    }
  }, [map, localitiesLayersRef, onSuburbClick]);

  const highlightSearchedSuburb = useCallback((suburbName: string) => {
    if (!map.current) return;
    
    console.log('🔍 NAME-BASED APPROACH: Looking for suburb:', suburbName);
    
    // NAME-BASED APPROACH: Find the specific suburb by name in the viewport
    const features = map.current.queryRenderedFeatures({
      layers: ['localities-outline-z6-9', 'localities-outline-z10-11', 'localities-outline-z12']
    });
    
    console.log('🔍 Found features in viewport:', features.length);
    
    if (features.length > 0) {
      // Find the feature that matches the searched suburb name
      const matchingFeature = features.find(feature => {
        const featureName = feature.properties?.LOC_NAME;
        return featureName && featureName.toLowerCase().includes(suburbName.toLowerCase());
      });
      
      if (matchingFeature) {
        const localityId = matchingFeature.properties?.LOC_PID;
        const localityName = matchingFeature.properties?.LOC_NAME;
        
        if (localityId) {
          // Determine the source layer based on the feature's layer
          let sourceLayer: string | undefined;
          const layerId = matchingFeature.layer?.id;
          if (layerId?.includes('z12')) {
            sourceLayer = 'localities_z12';
          } else if (layerId?.includes('z10-11')) {
            sourceLayer = 'localities_z10_11';
          } else if (layerId?.includes('z6-9')) {
            sourceLayer = 'localities_z6_9';
          }
          
          console.log('🎯 NAME-BASED: Found matching suburb:', localityName, 'ID:', localityId, 'sourceLayer:', sourceLayer);
          localitiesLayersRef.current?.highlightLocality?.(localityId, sourceLayer);
          console.log('✅ NAME-BASED: highlightLocality called');
        } else {
          console.log('❌ No LOC_PID found in matching feature properties');
        }
      } else {
        console.log('❌ No matching suburb found for:', suburbName);
        console.log('🔍 Available suburbs:', features.map(f => f.properties?.LOC_NAME).filter(Boolean));
      }
    } else {
      console.log('❌ No features found in viewport to highlight');
    }
  }, [map, localitiesLayersRef]);

  const clearSearchHighlight = useCallback(() => {
    localitiesLayersRef.current?.clearSearchHighlight?.();
    console.log('✅ Cleared search highlight');
  }, []);

  const highlightSuburbByCode = useCallback((suburbCode: string) => {
    localitiesLayersRef.current?.highlightLocality?.(suburbCode);
    console.log('🎯 Highlighted suburb by code:', suburbCode);
  }, []);

  // Debug function to test search
  const debugSearch = useCallback(() => {
    console.log('🔍 DEBUG: Testing search functionality...');
    console.log('🔍 Map current:', !!map.current);
    if (map.current) {
      const source = map.current.getSource('localities');
      console.log('🔍 Localities source:', !!source);
      if (source) {
        console.log('🔍 Source type:', source.type);
        if (source.type === 'vector') {
          const vectorSource = source as any;
          console.log('🔍 Vector layer IDs:', vectorSource.vectorLayerIds);
        }
      }
      
      // Test querying all source layers
      const sourceLayers = ['localities_z6_9', 'localities_z10_11', 'localities_z12'];
      sourceLayers.forEach(layer => {
        try {
          const features = map.current!.querySourceFeatures('localities', { sourceLayer: layer });
          console.log(`🔍 ${layer}: ${features.length} features`);
          if (features.length > 0) {
            console.log(`🔍 Sample from ${layer}:`, features[0].properties);
          }
        } catch (error) {
          console.log(`❌ Error querying ${layer}:`, error);
        }
      });
      
      // Specifically look for Red Hill in z12 layer
      console.log('🔍 === SEARCHING FOR RED HILL IN Z12 LAYER ===');
      try {
        const z12Features = map.current.querySourceFeatures('localities', { sourceLayer: 'localities_z12' });
        console.log(`🔍 Total features in localities_z12: ${z12Features.length}`);
        
        // Look for Red Hill specifically
        const redHillFeatures = z12Features.filter(feature => {
          const locName = feature.properties?.LOC_NAME || '';
          return locName.toLowerCase().includes('red hill');
        });
        
        console.log(`🔍 Red Hill features found in z12: ${redHillFeatures.length}`);
        
        if (redHillFeatures.length > 0) {
          console.log('🔍 Red Hill data structure in z12:', redHillFeatures[0]);
          console.log('🔍 Red Hill properties:', redHillFeatures[0].properties);
          console.log('🔍 Red Hill geometry type:', redHillFeatures[0].geometry.type);
          console.log('🔍 Red Hill coordinates sample:', (redHillFeatures[0].geometry as any).coordinates?.[0]?.[0]?.slice(0, 3));
        } else {
          console.log('🔍 No Red Hill found in z12 layer');
          
          // Show all locality names in z12 for debugging
          const allNames = z12Features.map(f => f.properties?.LOC_NAME).filter(Boolean);
          console.log('🔍 All locality names in z12 (first 20):', allNames.slice(0, 20));
          
          // Look for similar names
          const similarNames = allNames.filter(name => 
            name.toLowerCase().includes('red') || 
            name.toLowerCase().includes('hill')
          );
          console.log('🔍 Similar names in z12:', similarNames);
        }
        
        // Also check what's in the other layers for comparison
        console.log('🔍 === COMPARING ACROSS ALL LAYERS ===');
        sourceLayers.forEach(layer => {
          try {
            const features = map.current!.querySourceFeatures('localities', { sourceLayer: layer });
            const redHillInLayer = features.filter(feature => {
              const locName = feature.properties?.LOC_NAME || '';
              return locName.toLowerCase().includes('red hill');
            });
            console.log(`🔍 Red Hill in ${layer}: ${redHillInLayer.length} features`);
            if (redHillInLayer.length > 0) {
              console.log(`🔍 Red Hill data in ${layer}:`, redHillInLayer[0].properties);
            }
          } catch (error) {
            console.log(`❌ Error querying ${layer}:`, error);
          }
        });
        
      } catch (error) {
        console.log('❌ Error querying z12 layer:', error);
      }
    }
  }, []);

  // Function to examine z12 data structure when at high zoom
  const examineZ12Data = useCallback(() => {
    if (!map.current) {
      console.log('❌ Map not ready');
      return;
    }
    
    const currentZoom = map.current.getZoom();
    console.log('🔍 Current zoom level:', currentZoom);
    
    if (currentZoom < 12) {
      console.log('🔍 Zoom level too low for z12 data, zooming to 12...');
      map.current.zoomTo(12, { duration: 1000 });
      
      // Wait for zoom and data to load
      setTimeout(() => {
        console.log('🔍 Zoom completed, examining z12 data...');
        examineZ12DataInternal();
      }, 1500);
    } else {
      examineZ12DataInternal();
    }
    
    function examineZ12DataInternal() {
      try {
        const z12Features = map.current!.querySourceFeatures('localities', { sourceLayer: 'localities_z12' });
        console.log('🔍 === Z12 LAYER DATA STRUCTURE ANALYSIS ===');
        console.log(`🔍 Total features in localities_z12: ${z12Features.length}`);
        
        if (z12Features.length > 0) {
          const sampleFeature = z12Features[0];
          console.log('🔍 Sample feature structure:', sampleFeature);
          console.log('🔍 Sample feature properties:', sampleFeature.properties);
          console.log('🔍 Sample feature geometry:', {
            type: sampleFeature.geometry.type,
            coordinatesLength: (sampleFeature.geometry as any).coordinates?.length,
            firstCoordinate: (sampleFeature.geometry as any).coordinates?.[0]?.[0]?.slice(0, 2)
          });
          
          // Look for Red Hill
          const redHillFeatures = z12Features.filter(feature => {
            const locName = feature.properties?.LOC_NAME || '';
            return locName.toLowerCase().includes('red hill');
          });
          
          console.log(`🔍 Red Hill features in z12: ${redHillFeatures.length}`);
          
          if (redHillFeatures.length > 0) {
            console.log('🔍 Red Hill complete data structure:', redHillFeatures[0]);
            console.log('🔍 Red Hill properties breakdown:', {
              LOC_NAME: redHillFeatures[0].properties?.LOC_NAME,
              STATE: redHillFeatures[0].properties?.STATE,
              LOC_PID: redHillFeatures[0].properties?.LOC_PID,
              LOC_CLASS: redHillFeatures[0].properties?.LOC_CLASS,
              DT_CREATE: redHillFeatures[0].properties?.DT_CREATE,
              allProperties: Object.keys(redHillFeatures[0].properties || {})
            });
          } else {
            // Show all names to understand the data
            const allNames = z12Features.map(f => f.properties?.LOC_NAME).filter(Boolean);
            console.log('🔍 All locality names in z12:', allNames);
            
            // Look for any names containing "red" or "hill"
            const redNames = allNames.filter(name => name.toLowerCase().includes('red'));
            const hillNames = allNames.filter(name => name.toLowerCase().includes('hill'));
            console.log('🔍 Names containing "red":', redNames);
            console.log('🔍 Names containing "hill":', hillNames);
          }
        } else {
          console.log('🔍 No features found in z12 layer');
        }
      } catch (error) {
        console.log('❌ Error examining z12 data:', error);
      }
    }
  }, []);

  useImperativeHandle(ref, () => ({
    zoomToSuburb,
    highlightSearchedSuburb,
    clearSearchHighlight,
    highlightSuburbByCode,
    debugSearch,
    examineZ12Data,
    toggleNswCatchments: (opts) => schoolCatchmentsRef.current?.toggleNswCatchments?.(opts),
    applyCatchmentsFilter: (filter) => schoolCatchmentsRef.current?.applyFilter?.(filter)
  }), [zoomToSuburb, highlightSearchedSuburb, clearSearchHighlight, highlightSuburbByCode, debugSearch, examineZ12Data]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
});

GrowMap.displayName = 'GrowMap';

export default GrowMap;
