import { useRef, useCallback } from 'react';
import type { MutableRefObject } from 'react';

console.log('📦 useLocalitiesLayers module loaded');

export interface LocalitiesLayersConfig {
  onLocalityClick?: (locality: {
    name: string;
    code: string;
    score: number;
    kpis: any;
    position: { x: number; y: number };
  }) => void;
}

// Global initialization flag to prevent multiple initializations across re-renders
let globalLayersInitialized = false;

export const useLocalitiesLayers = (
  map: MutableRefObject<mapboxgl.Map | null>,
  config: LocalitiesLayersConfig = {}
) => {
  console.log('🚀 useLocalitiesLayers hook called, map.current:', !!map.current, 'globalInit:', globalLayersInitialized);
  
  const { onLocalityClick } = config;
  const hoveredLocalityId = useRef<string | null>(null);
  const lastMouseMoveTime = useRef<number>(0);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const searchHighlightId = useRef<string | null>(null);
  const layersInitialized = useRef<boolean>(false);

  // Configuration constants
  const SOURCE_ID = 'localities';
  const TILESET_URL = 'mapbox://tommstar25.909daqku';
  
  // Check if source exists even when globalInit is true
  if (map.current && globalLayersInitialized) {
    const sourceExists = map.current.getSource(SOURCE_ID);
    console.log('🔍 Source exists check:', !!sourceExists);
    if (!sourceExists) {
      console.log('⚠️ Source missing despite globalInit=true, resetting flags');
      globalLayersInitialized = false;
      layersInitialized.current = false;
    }
  }

  // Clear hover state from all layers
  const clearHoverState = useCallback(() => {
    if (!map.current) return;
    
    // Clear from all possible source layers for any hovered locality
    if (hoveredLocalityId.current) {
      ['localities_z6_9', 'localities_z10_11', 'localities_z12'].forEach(layer => {
        try {
          map.current!.setFeatureState(
            { source: SOURCE_ID, sourceLayer: layer, id: hoveredLocalityId.current! },
            { hover: false }
          );
        } catch (e) {
          // Ignore errors if feature doesn't exist in this source layer
        }
      });
    }
    
    // Also clear any lingering hover states by setting all feature states to false
    // This is more aggressive but ensures no red borders persist
    try {
      const style = map.current.getStyle();
      if (style && style.sources && style.sources[SOURCE_ID]) {
        // Force clear all hover states
        map.current.setFeatureState(
          { source: SOURCE_ID, sourceLayer: 'localities_z6_9', id: hoveredLocalityId.current || '' },
          { hover: false }
        );
        map.current.setFeatureState(
          { source: SOURCE_ID, sourceLayer: 'localities_z10_11', id: hoveredLocalityId.current || '' },
          { hover: false }
        );
        map.current.setFeatureState(
          { source: SOURCE_ID, sourceLayer: 'localities_z12', id: hoveredLocalityId.current || '' },
          { hover: false }
        );
      }
    } catch (e) {
      // Ignore errors
    }
    
    hoveredLocalityId.current = null;
    map.current.getCanvas().style.cursor = '';
  }, [map]);

  // Clear search highlight from all layers
  const clearSearchHighlight = useCallback(() => {
    if (!map.current || !searchHighlightId.current) return;
    
    // Clear from all possible source layers
    ['localities_z6_9', 'localities_z10_11', 'localities_z12'].forEach(layer => {
      try {
        map.current!.setFeatureState(
          { source: SOURCE_ID, sourceLayer: layer, id: searchHighlightId.current! },
          { search: false }
        );
      } catch (e) {
        // Ignore errors if feature doesn't exist in this source layer
      }
    });
    searchHighlightId.current = null;
  }, [map]);
  
  const LAYER_IDS = {
    outline_z6_9: 'localities-outline-z6-9',
    outline_z10_11: 'localities-outline-z10-11', 
    outline_z12: 'localities-outline-z12',
    fill_z6_9: 'localities-fill-z6-9',
    fill_z10_11: 'localities-fill-z10-11',
    fill_z12: 'localities-fill-z12',
    search_highlight_z6_9: 'localities-search-highlight-z6-9',
    search_highlight_z10_11: 'localities-search-highlight-z10-11',
    search_highlight_z12: 'localities-search-highlight-z12'
  };

  // Add localities source
  const addSource = useCallback(() => {
    if (!map.current) {
      console.log('🚫 Localities: Map not ready for source');
      return;
    }
    
    if (map.current.getSource(SOURCE_ID)) {
      console.log('✅ Localities source already exists');
      return;
    }

    console.log('📥 Adding localities source:', TILESET_URL);
    try {
      map.current.addSource(SOURCE_ID, {
        type: 'vector',
        url: TILESET_URL,
        promoteId: 'LOC_PID'
      });
      console.log('✅ Localities source added successfully');
      
      // Verify the source was added
      const source = map.current.getSource(SOURCE_ID);
      if (source) {
        console.log('✅ Verified localities source exists:', source);
        
        // Check if it's a vector source and get layer info
        if (source.type === 'vector') {
          const vectorSource = source as any;
          console.log('🔍 Vector source layer IDs:', vectorSource.vectorLayerIds);
        }
      } else {
        console.error('❌ Localities source was not added properly');
      }
    } catch (error) {
      console.error('❌ Error adding localities source:', error);
    }
  }, [map]);

  // Add localities layers
  const addLayers = useCallback(() => {
    if (!map.current) {
      console.log('🚫 Localities: Map not ready for layers');
      return;
    }

    console.log('🎨 Adding localities layers...');
    
    // Try to add layers immediately first
    console.log('🎯 Attempting to add layers immediately...');
    console.log('🔍 Map style loaded in addLayers:', map.current.isStyleLoaded());
    console.log('🔍 Map ready in addLayers:', map.current.loaded());
    
    try {
      addLayersInternal();
      return;
    } catch (error) {
      console.log('⚠️ Immediate layer addition failed, waiting for styledata event...', error);
    }
    
    // If immediate addition fails, wait for styledata event
    console.log('⏳ Waiting for styledata event to ensure style is fully ready...');
    
    // Use a timeout as fallback in case styledata event doesn't fire
    const timeoutId = setTimeout(() => {
      console.log('⏰ Timeout reached, trying to add layers anyway...');
      addLayersInternal();
    }, 1000);
    
    const handleStyledata = () => {
      console.log('✅ Styledata event fired, now adding layers...');
      clearTimeout(timeoutId);
      addLayersInternal();
    };
    
    map.current.once('styledata', handleStyledata);
    return;
  }, [map]);

  // Internal function to actually add the layers
  const addLayersInternal = useCallback(() => {
    if (!map.current) {
      console.log('🚫 Localities: Map not ready for internal layer addition');
      return;
    }

    console.log('🎨 Adding localities layers internally...');
    console.log('🔍 Map style loaded in addLayersInternal:', map.current.isStyleLoaded());
    console.log('🔍 Map ready in addLayersInternal:', map.current.loaded());
    
    const existingLayers = Object.values(LAYER_IDS).filter(layerId => {
      try {
        return map.current!.getLayer(layerId) !== undefined;
      } catch (e) {
        return false;
      }
    });
    console.log('🔍 Existing layers:', existingLayers);
    
    if (existingLayers.length > 0) {
      console.log('⚠️ Some layers already exist, skipping layer addition');
      return;
    }
    
    // Try to get the style and find insertion point
    let insertionLayer = null;
    try {
      const style = map.current.getStyle();
      console.log('🗺️ Available layers in style:', style.layers.map(l => l.id).slice(0, 10));

      // Find a good insertion point for our layers
      insertionLayer = style.layers.find(l => l.id === 'waterway-label') ||
                      style.layers.find(l => l.id === 'water') ||
                      style.layers.find(l => l.id === 'landcover') ||
                      style.layers[style.layers.length - 1];
      console.log('🗺️ Using insertion layer:', insertionLayer?.id);
      console.log('🗺️ All available layers:', style.layers.map(l => l.id));
    } catch (error) {
      console.log('⚠️ Could not get style, adding layers without insertion point');
    }

    // Define all layers to add
    const layersToAdd = [
      // Layer 1: Zoom 5+ outlines (with hover support)
      {
        id: LAYER_IDS.outline_z6_9,
        type: 'line' as const,
        source: SOURCE_ID,
        'source-layer': 'localities_z6_9',
        minzoom: 5,
        paint: {
          'line-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            '#dc2626', // Red on hover for better visibility
            '#2563eb'  // Blue for better contrast with Standard style
          ],
          'line-width': 2 // Thicker lines for better visibility
        },
        layout: {
          'line-join': 'round' as const,
          'line-cap': 'round' as const
        }
      },
      // Layer 2: Zoom 10+ outlines (with hover support)
      {
        id: LAYER_IDS.outline_z10_11,
        type: 'line' as const,
        source: SOURCE_ID,
        'source-layer': 'localities_z10_11',
        minzoom: 10,
        paint: {
          'line-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            '#dc2626', // Red on hover for better visibility
            '#2563eb'  // Blue for better contrast with Standard style
          ],
          'line-width': 2 // Thicker lines for better visibility
        },
        layout: {
          'line-join': 'round' as const,
          'line-cap': 'round' as const
        }
      },
      // Layer 3: Zoom 12+ outlines (with hover support)
      {
        id: LAYER_IDS.outline_z12,
        type: 'line' as const,
        source: SOURCE_ID,
        'source-layer': 'localities_z12',
        minzoom: 12,
        paint: {
          'line-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            '#dc2626', // Red on hover for better visibility
            '#2563eb'  // Blue for better contrast with Standard style
          ],
          'line-width': 2 // Thicker lines for better visibility
        },
        layout: {
          'line-join': 'round' as const,
          'line-cap': 'round' as const
        }
      },
      // Layer 4: Zoom 5+ fill (with hover support)
      {
        id: LAYER_IDS.fill_z6_9,
        type: 'fill' as const,
        source: SOURCE_ID,
        'source-layer': 'localities_z6_9',
        minzoom: 5,
        paint: {
          'fill-color': '#3b82f6', // More visible blue
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.25, // Higher opacity on hover
            0.1   // Higher default opacity for better visibility
          ]
        }
      },
      // Layer 5: Zoom 10+ fill (with hover support)
      {
        id: LAYER_IDS.fill_z10_11,
        type: 'fill' as const,
        source: SOURCE_ID,
        'source-layer': 'localities_z10_11',
        minzoom: 10,
        paint: {
          'fill-color': '#3b82f6', // More visible blue
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.25, // Higher opacity on hover
            0.1   // Higher default opacity for better visibility
          ]
        }
      },
      // Layer 6: Zoom 12+ fill (with hover support)
      {
        id: LAYER_IDS.fill_z12,
        type: 'fill' as const,
        source: SOURCE_ID,
        'source-layer': 'localities_z12',
        minzoom: 12,
        paint: {
          'fill-color': '#3b82f6', // More visible blue
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.25, // Higher opacity on hover
            0.1   // Higher default opacity for better visibility
          ]
        }
      },
      // Layer 7: Zoom 5+ search highlight
      {
        id: LAYER_IDS.search_highlight_z6_9,
        type: 'line' as const,
        source: SOURCE_ID,
        'source-layer': 'localities_z6_9',
        minzoom: 5,
        paint: {
          'line-color': '#dc2626', // Red for search highlight
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'search'], false],
            3, // Thick line when highlighted
            0  // No line when not highlighted
          ]
        },
        layout: {
          'line-join': 'round' as const,
          'line-cap': 'round' as const
        }
      },
      // Layer 8: Zoom 10+ search highlight
      {
        id: LAYER_IDS.search_highlight_z10_11,
        type: 'line' as const,
        source: SOURCE_ID,
        'source-layer': 'localities_z10_11',
        minzoom: 10,
        paint: {
          'line-color': '#dc2626', // Red for search highlight
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'search'], false],
            3, // Thick line when highlighted
            0  // No line when not highlighted
          ]
        },
        layout: {
          'line-join': 'round' as const,
          'line-cap': 'round' as const
        }
      },
      // Layer 9: Zoom 12+ search highlight
      {
        id: LAYER_IDS.search_highlight_z12,
        type: 'line' as const,
        source: SOURCE_ID,
        'source-layer': 'localities_z12',
        minzoom: 12,
        paint: {
          'line-color': '#dc2626', // Red for search highlight
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'search'], false],
            3, // Thick line when highlighted
            0  // No line when not highlighted
          ]
        },
        layout: {
          'line-join': 'round' as const,
          'line-cap': 'round' as const
        }
      }
    ];

    // Add all layers
    console.log(`🎨 Adding ${layersToAdd.length} layers...`);
    layersToAdd.forEach((layer, index) => {
      try {
        console.log(`🔧 Adding layer ${index + 1}/${layersToAdd.length}: ${layer.id}`);
        map.current!.addLayer(layer, insertionLayer?.id || undefined);
        console.log(`✅ Added ${layer.id} layer`);
        
        // Verify the layer was added
        const addedLayer = map.current!.getLayer(layer.id);
        if (addedLayer) {
          console.log(`✅ Verified ${layer.id} layer exists`);
        } else {
          console.error(`❌ ${layer.id} layer was not added properly`);
        }
      } catch (error) {
        console.error(`❌ Error adding ${layer.id} layer:`, error);
      }
    });
    
    console.log('🎨 All layers added successfully!');

    // Labels removed - no labels will be shown on the map
  }, [map]);

  // Handle mouse move for hover effects
  const handleMouseMove = useCallback((e: mapboxgl.MapMouseEvent) => {
    if (!map.current) return;

    // Clear any existing timeout
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }

    // Throttle mouse move events to reduce flickering
    const now = Date.now();
    if (now - lastMouseMoveTime.current < 16) { // ~60fps
      return;
    }
    lastMouseMoveTime.current = now;

    const currentZoom = map.current.getZoom();
    
    // Determine which layers to query based on zoom level
    let layersToQuery: string[] = [];
    let sourceLayer = '';
    if (currentZoom >= 12) {
      layersToQuery = [LAYER_IDS.outline_z12, LAYER_IDS.fill_z12];
      sourceLayer = 'localities_z12';
    } else if (currentZoom >= 10) {
      layersToQuery = [LAYER_IDS.outline_z10_11, LAYER_IDS.fill_z10_11];
      sourceLayer = 'localities_z10_11';
    } else if (currentZoom >= 5) {
      layersToQuery = [LAYER_IDS.outline_z6_9, LAYER_IDS.fill_z6_9];
      sourceLayer = 'localities_z6_9';
    } else {
      // Clear hover state if zoomed out too far
      if (hoveredLocalityId.current) {
        // Clear from all possible source layers
        ['localities_z6_9', 'localities_z10_11', 'localities_z12'].forEach(layer => {
          try {
            map.current!.setFeatureState(
              { source: SOURCE_ID, sourceLayer: layer, id: hoveredLocalityId.current! },
              { hover: false }
            );
          } catch (e) {
            // Ignore errors if feature doesn't exist in this source layer
          }
        });
        hoveredLocalityId.current = null;
        map.current.getCanvas().style.cursor = '';
      }
      return;
    }

    // Query for localities at current zoom level
    const features = map.current.queryRenderedFeatures(e.point, {
      layers: layersToQuery
    });

    if (features.length > 0) {
      const feature = features[0];
      const localityId = feature.properties?.LOC_PID;

      if (localityId && localityId !== hoveredLocalityId.current) {
        // Clear previous hover state
        if (hoveredLocalityId.current) {
          clearHoverState();
        }

        // Set new hover state for current zoom level
        try {
          map.current.setFeatureState(
            { source: SOURCE_ID, sourceLayer, id: localityId },
            { hover: true }
          );
        } catch (e) {
          console.log('Could not set hover state for zoom level:', currentZoom, 'sourceLayer:', sourceLayer);
        }
        
        hoveredLocalityId.current = localityId;
        map.current.getCanvas().style.cursor = 'pointer';
      }
    } else {
      // Clear hover state if no feature under cursor
      if (hoveredLocalityId.current) {
        clearHoverState();
      }
    }
  }, [map, clearHoverState]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    if (!map.current || !hoveredLocalityId.current) return;
    clearHoverState();
  }, [map, clearHoverState]);


  // Highlight a locality for search results - SIMPLE APPROACH
  const highlightLocality = useCallback((localityId: string, sourceLayer?: string) => {
    if (!map.current) return;

    console.log('🎯 highlightLocality called with:', { localityId, sourceLayer });

    // Clear any existing search highlight
    clearSearchHighlight();

    // Use provided source layer or determine based on zoom
    let targetSourceLayer = sourceLayer;
    if (!targetSourceLayer) {
      const currentZoom = map.current.getZoom();
      
      if (currentZoom >= 12) {
        targetSourceLayer = 'localities_z12';
      } else if (currentZoom >= 10) {
        targetSourceLayer = 'localities_z10_11';
      } else if (currentZoom >= 6) {
        targetSourceLayer = 'localities_z6_9';
      } else {
        console.log('⚠️ Zoom level too low for search highlighting');
        return;
      }
    }

    console.log('🎯 Highlighting locality:', localityId, 'using source layer:', targetSourceLayer);
    
    // SIMPLE APPROACH: Set feature state to show red highlight
    try {
      map.current.setFeatureState(
        { source: SOURCE_ID, sourceLayer: targetSourceLayer, id: localityId },
        { search: true }
      );
      searchHighlightId.current = localityId;
      console.log('✅ Highlighted locality:', localityId, 'in source layer:', targetSourceLayer);
    } catch (error) {
      console.error('❌ Error highlighting locality:', error);
    }
  }, [map, clearSearchHighlight]);

  // Handle map click for popup - works at all zoom levels
  const handleLocalityClick = useCallback((e: mapboxgl.MapMouseEvent) => {
    if (!map.current) return;

    // Clear any existing hover state to prevent red borders from persisting
    // Use a small delay to prevent flickering
    setTimeout(() => {
      clearHoverState();
    }, 50);

    const currentZoom = map.current.getZoom();
    
    // Determine which layers to query based on zoom level
    let layersToQuery: string[] = [];
    if (currentZoom >= 12) {
      layersToQuery = [LAYER_IDS.outline_z12, LAYER_IDS.fill_z12];
    } else if (currentZoom >= 10) {
      layersToQuery = [LAYER_IDS.outline_z10_11, LAYER_IDS.fill_z10_11];
    } else if (currentZoom >= 5) {
      layersToQuery = [LAYER_IDS.outline_z6_9, LAYER_IDS.fill_z6_9];
    } else {
      return; // No click handling below zoom 5
    }

    const features = map.current.queryRenderedFeatures(e.point, {
      layers: layersToQuery
    });

    if (features.length > 0) {
      const feature = features[0];
      const localityName = feature.properties?.LOC_NAME || 'Unknown';
      const state = feature.properties?.STATE || 'Unknown';
      const pid = feature.properties?.LOC_PID || 'Unknown';

      // Debug logging to verify we're getting locality data
      console.log('🏘️ LOCALITY CLICKED:', {
        name: localityName,
        state,
        pid,
        source: 'LOCALITIES_VECTOR_TILESET',
        layer: feature.layer?.id,
        properties: feature.properties
      });

      // Call the callback to show the SuburbToolkit (like the previous SA2 implementation)
      if (onLocalityClick) {
        // Generate deterministic mock data based on suburb name
        const hash = localityName.split('').reduce((a: number, b: string) => {
          a = ((a << 5) - a) + b.charCodeAt(0);
          return a & a;
        }, 0);
        
        // Mock KPIs for the toolkit (deterministic based on name)
        const kpis = {
          yield: Math.abs(hash % 8) + 2, // 2-10%
          growth5y: Math.abs(hash % 15) + 5, // 5-20%
          vacancy: Math.abs(hash % 5) + 1 // 1-6%
        };
        
        onLocalityClick({
          name: localityName,
          code: pid, // Use PID as code
          score: Math.abs(hash % 40) + 60, // 60-100 score
          kpis,
          position: { x: e.point.x, y: e.point.y }
        });
        
        // Highlight the clicked locality
        console.log('🎯 Highlighting clicked locality:', localityName, 'ID:', pid);
        highlightLocality(pid);
      }
    }
  }, [map, onLocalityClick, clearHoverState, highlightLocality]);

  // Clear search highlight
  const clearSearchHighlightPublic = useCallback(() => {
    clearSearchHighlight();
  }, [clearSearchHighlight]);

  // Add event listeners - use layer-specific events to avoid conflicts
  const addEventListeners = useCallback(() => {
    if (!map.current) return;

    // Use layer-specific events for all locality layers
    map.current.on('mousemove', LAYER_IDS.outline_z6_9, handleMouseMove);
    map.current.on('mousemove', LAYER_IDS.outline_z10_11, handleMouseMove);
    map.current.on('mousemove', LAYER_IDS.outline_z12, handleMouseMove);
    map.current.on('mousemove', LAYER_IDS.fill_z6_9, handleMouseMove);
    map.current.on('mousemove', LAYER_IDS.fill_z10_11, handleMouseMove);
    map.current.on('mousemove', LAYER_IDS.fill_z12, handleMouseMove);
    
    map.current.on('mouseleave', LAYER_IDS.outline_z6_9, handleMouseLeave);
    map.current.on('mouseleave', LAYER_IDS.outline_z10_11, handleMouseLeave);
    map.current.on('mouseleave', LAYER_IDS.outline_z12, handleMouseLeave);
    map.current.on('mouseleave', LAYER_IDS.fill_z6_9, handleMouseLeave);
    map.current.on('mouseleave', LAYER_IDS.fill_z10_11, handleMouseLeave);
    map.current.on('mouseleave', LAYER_IDS.fill_z12, handleMouseLeave);
    
    map.current.on('click', LAYER_IDS.outline_z6_9, handleLocalityClick);
    map.current.on('click', LAYER_IDS.outline_z10_11, handleLocalityClick);
    map.current.on('click', LAYER_IDS.outline_z12, handleLocalityClick);
    map.current.on('click', LAYER_IDS.fill_z6_9, handleLocalityClick);
    map.current.on('click', LAYER_IDS.fill_z10_11, handleLocalityClick);
    map.current.on('click', LAYER_IDS.fill_z12, handleLocalityClick);
  }, [map, handleMouseMove, handleMouseLeave, handleLocalityClick]);

  // Remove event listeners
  const removeEventListeners = useCallback(() => {
    if (!map.current) return;

    map.current.off('mousemove', LAYER_IDS.outline_z6_9, handleMouseMove);
    map.current.off('mousemove', LAYER_IDS.outline_z10_11, handleMouseMove);
    map.current.off('mousemove', LAYER_IDS.outline_z12, handleMouseMove);
    map.current.off('mousemove', LAYER_IDS.fill_z6_9, handleMouseMove);
    map.current.off('mousemove', LAYER_IDS.fill_z10_11, handleMouseMove);
    map.current.off('mousemove', LAYER_IDS.fill_z12, handleMouseMove);
    
    map.current.off('mouseleave', LAYER_IDS.outline_z6_9, handleMouseLeave);
    map.current.off('mouseleave', LAYER_IDS.outline_z10_11, handleMouseLeave);
    map.current.off('mouseleave', LAYER_IDS.outline_z12, handleMouseLeave);
    map.current.off('mouseleave', LAYER_IDS.fill_z6_9, handleMouseLeave);
    map.current.off('mouseleave', LAYER_IDS.fill_z10_11, handleMouseLeave);
    map.current.off('mouseleave', LAYER_IDS.fill_z12, handleMouseLeave);
    
    map.current.off('click', LAYER_IDS.outline_z6_9, handleLocalityClick);
    map.current.off('click', LAYER_IDS.outline_z10_11, handleLocalityClick);
    map.current.off('click', LAYER_IDS.outline_z12, handleLocalityClick);
    map.current.off('click', LAYER_IDS.fill_z6_9, handleLocalityClick);
    map.current.off('click', LAYER_IDS.fill_z10_11, handleLocalityClick);
    map.current.off('click', LAYER_IDS.fill_z12, handleLocalityClick);
  }, [map, handleMouseMove, handleMouseLeave, handleLocalityClick]);

  // Initialize localities layers
  const initializeLayers = useCallback(() => {
    if (!map.current) {
      console.log('🚫 Localities: Map not ready');
      return;
    }

    if (layersInitialized.current || globalLayersInitialized) {
      console.log('⚠️ Localities: Layers already initialized, skipping (local:', layersInitialized.current, 'global:', globalLayersInitialized, ')');
      return;
    }

    console.log('🚀 Initializing localities layers...');
    console.log('🔍 Map style loaded:', map.current.isStyleLoaded());
    console.log('🔍 Map ready:', map.current.isStyleLoaded() && map.current.loaded());
    
    try {
      console.log('📥 Step 1: Adding source...');
      addSource();
      
      console.log('🎨 Step 2: Adding layers...');
      addLayers();
      
      console.log('🎯 Step 3: Adding event listeners...');
      addEventListeners();
      
      layersInitialized.current = true;
      globalLayersInitialized = true;
      console.log('✅ Localities layers initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing localities layers:', error);
    }
  }, [addSource, addLayers, addEventListeners]);

  // Cleanup layers and source
  const cleanupLayers = useCallback(() => {
    if (!map.current) return;

    // Clear any pending timeouts
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }

    // Clear hover state
    clearHoverState();

    // Clear search highlight
    clearSearchHighlight();

    // Remove event listeners
    removeEventListeners();


    // Remove layers
    Object.values(LAYER_IDS).forEach(layerId => {
      if (map.current!.getLayer(layerId)) {
        map.current!.removeLayer(layerId);
      }
    });

    // Remove source
    if (map.current.getSource(SOURCE_ID)) {
      map.current.removeSource(SOURCE_ID);
    }

    // Reset initialization flags
    layersInitialized.current = false;
    globalLayersInitialized = false;
  }, [map, removeEventListeners, clearHoverState, clearSearchHighlight]);

  // Initialize layers once when map is ready - no useEffect to prevent re-renders
  if (map.current && !layersInitialized.current && !globalLayersInitialized) {
    console.log('🔄 Localities: Map ready, initializing layers...');
    
    // Wait for map to be fully loaded
    if (!map.current.isStyleLoaded()) {
      console.log('⏳ Localities: Waiting for map style to load...');
      
      // Use a timeout as fallback in case styledata event doesn't fire
      const timeoutId = setTimeout(() => {
        console.log('⏰ Localities: Timeout reached, trying to initialize anyway...');
        if (!layersInitialized.current && !globalLayersInitialized) {
          initializeLayers();
        }
      }, 2000);
      
      const handleStyleLoad = () => {
        console.log('✅ Localities: Map style loaded, initializing...');
        clearTimeout(timeoutId);
        if (!layersInitialized.current && !globalLayersInitialized) {
          initializeLayers();
        }
      };
      
      map.current.once('styledata', handleStyleLoad);
    } else {
      console.log('✅ Localities: Map ready, initializing immediately...');
      initializeLayers();
    }
  }

  return {
    initializeLayers,
    cleanupLayers,
    hoveredLocalityId: hoveredLocalityId.current,
    highlightLocality,
    clearSearchHighlight: clearSearchHighlightPublic
  };
};
