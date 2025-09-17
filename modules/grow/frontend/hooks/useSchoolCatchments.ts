import { useCallback, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

interface SchoolCatchmentsConfig {
  sourceId: string;
  fillLayerId: string;
  lineLayerId: string;
  dataUrl: string;
}

const CATCHMENTS_CONFIG: SchoolCatchmentsConfig = {
  sourceId: 'catchments',
  fillLayerId: 'catchments-fill',
  lineLayerId: 'catchments-line',
  dataUrl: '/geojson/aus_catchments_2023_2025.geojson',
};

const TYPE_COLORS = {
  Primary: '#4F8DFB',
  'Junior Secondary': '#F4A640',
  'Senior Secondary': '#B23A7F',
  'Single Sex': '#6E56CF',
  Secondary: '#2CA6A4',
};

export const useSchoolCatchments = (map: React.MutableRefObject<mapboxgl.Map | null>) => {
  const sourceAdded = useRef(false);
  const layersAdded = useRef(false);

  // Add catchments source (only once)
  const addCatchmentsSource = useCallback(async () => {
    if (!map.current || sourceAdded.current) return;

    try {
      console.log('📥 Loading school catchments data...');
      const response = await fetch(CATCHMENTS_CONFIG.dataUrl);
      if (!response.ok) {
        throw new Error(`Failed to load catchments data: ${response.status}`);
      }
      const data = await response.json();
      console.log('📊 Catchments data loaded:', data.features?.length, 'features');

      // Add source
      map.current.addSource(CATCHMENTS_CONFIG.sourceId, {
        type: 'geojson',
        data: data,
      });

      sourceAdded.current = true;
      console.log('✅ Catchments source added');
    } catch (error) {
      console.error('❌ Error loading catchments data:', error);
      // Show non-blocking toast (you can implement this later)
      // showToast('Catchments failed to load. Check your connection and try again.');
    }
  }, [map]);

  // Add catchments layers (only once)
  const addCatchmentsLayers = useCallback(() => {
    if (!map.current || !sourceAdded.current || layersAdded.current) return;

    // Add fill layer
    map.current.addLayer({
      id: CATCHMENTS_CONFIG.fillLayerId,
      type: 'fill',
      source: CATCHMENTS_CONFIG.sourceId,
      paint: {
        'fill-color': [
          'case',
          ['==', ['get', 'type'], 'Primary'], TYPE_COLORS.Primary,
          ['==', ['get', 'type'], 'Junior Secondary'], TYPE_COLORS['Junior Secondary'],
          ['==', ['get', 'type'], 'Senior Secondary'], TYPE_COLORS['Senior Secondary'],
          ['==', ['get', 'type'], 'Single Sex'], TYPE_COLORS['Single Sex'],
          ['==', ['get', 'type'], 'Secondary'], TYPE_COLORS.Secondary,
          '#999999' // fallback color
        ],
        'fill-opacity': 0.18,
      },
      filter: ['==', ['get', 'code'], ''], // Hidden by default
    });

    // Add line layer
    map.current.addLayer({
      id: CATCHMENTS_CONFIG.lineLayerId,
      type: 'line',
      source: CATCHMENTS_CONFIG.sourceId,
      paint: {
        'line-color': '#3a3a3a',
        'line-width': 1,
      },
      filter: ['==', ['get', 'code'], ''], // Hidden by default
    });

    layersAdded.current = true;
    console.log('✅ Catchments layers added');
  }, [map]);

  // Apply filter to both layers
  const applyFilter = useCallback((state: any) => {
    if (!map.current || !layersAdded.current) return;

    console.log('🔍 Applying catchments filter with state:', state);

    // Check if state is in the expected format
    if (!state || typeof state !== 'object' || Array.isArray(state)) {
      console.log('❌ Invalid state format, expected object but got:', typeof state);
      return;
    }

    // Build filter expression based on state
    const conditions = [];

    // Check global types
    if (state.globalTypes) {
      const typeConditions = [];
      if (state.globalTypes.primary) {
        typeConditions.push(['==', ['get', 'type'], 'Primary']);
      }
      if (state.globalTypes.secondary) {
        typeConditions.push(['in', ['get', 'type'], ['literal', ['Secondary', 'Junior Secondary', 'Senior Secondary', 'Single Sex']]]);
      }
      if (typeConditions.length > 0) {
        conditions.push(['any', ...typeConditions]);
      }
    }

    // Check state-specific filters
    if (state.stateSelections) {
      const stateConditions: any[] = [];
      Object.entries(state.stateSelections).forEach(([stateCode, stateData]: [string, any]) => {
        if (stateData && Object.keys(stateData).length > 0) {
          const stateTypeConditions: any[] = [];
          
          // First, collect all selected types and years for this state
          const selectedTypes: string[] = [];
          const selectedYears: number[] = [];
          
          Object.entries(stateData).forEach(([typeName, isSelected]: [string, any]) => {
            if (isSelected) {
              if (typeName.startsWith('year_')) {
                const year = parseInt(typeName.replace('year_', ''));
                selectedYears.push(year);
              } else {
                selectedTypes.push(typeName);
              }
            }
          });
          
          // Create precise filter conditions
          if (selectedTypes.length > 0 && selectedYears.length > 0) {
            // If both types and years are selected, we need to be more specific
            // For VIC: match specific type + year combinations
            // For NSW: match Secondary type + any selected year
            if (stateCode === 'VIC') {
              // VIC logic: be specific about type + year combinations
              selectedTypes.forEach(type => {
                if (type === 'Junior Secondary') {
                  // Junior Secondary: years 7-9
                  selectedYears.filter(year => year >= 7 && year <= 9).forEach(year => {
                    stateTypeConditions.push(['all', 
                      ['==', ['get', 'state'], 'VIC'],
                      ['==', ['get', 'type'], 'Junior Secondary'],
                      ['==', ['get', 'year_level'], year]
                    ]);
                  });
                } else if (type === 'Senior Secondary') {
                  // Senior Secondary: years 10-12
                  selectedYears.filter(year => year >= 10 && year <= 12).forEach(year => {
                    stateTypeConditions.push(['all', 
                      ['==', ['get', 'state'], 'VIC'],
                      ['==', ['get', 'type'], 'Senior Secondary'],
                      ['==', ['get', 'year_level'], year]
                    ]);
                  });
                } else if (type === 'Single Sex') {
                  // Single Sex: year 7 only
                  if (selectedYears.includes(7)) {
                    stateTypeConditions.push(['all', 
                      ['==', ['get', 'state'], 'VIC'],
                      ['==', ['get', 'type'], 'Single Sex'],
                      ['==', ['get', 'year_level'], 7]
                    ]);
                  }
                }
              });
            } else if (stateCode === 'NSW') {
              // NSW logic: Secondary type + any selected year
              if (selectedTypes.includes('Secondary')) {
                // If all years 7-12 are selected, show only year 7 to avoid overlapping polygons
                if (selectedYears.length === 6 && selectedYears.every(year => year >= 7 && year <= 12)) {
                  stateTypeConditions.push(['all', 
                    ['==', ['get', 'state'], 'NSW'],
                    ['==', ['get', 'type'], 'Secondary'],
                    ['==', ['get', 'year_level'], 7]
                  ]);
                } else {
                  // Otherwise, show selected years
                  selectedYears.forEach(year => {
                    stateTypeConditions.push(['all', 
                      ['==', ['get', 'state'], 'NSW'],
                      ['==', ['get', 'type'], 'Secondary'],
                      ['==', ['get', 'year_level'], year]
                    ]);
                  });
                }
              }
            } else if (stateCode === 'SA') {
              // SA logic: Senior Secondary type (whole-of-secondary, no year granularity)
              if (selectedTypes.includes('Senior Secondary')) {
                // SA Senior Secondary schools have year_level: null, so show them when no specific years are selected
                if (selectedYears.length === 0) {
                  stateTypeConditions.push(['all', 
                    ['==', ['get', 'state'], 'SA'],
                    ['==', ['get', 'type'], 'Senior Secondary'],
                    ['==', ['get', 'year_level'], null]
                  ]);
                }
              }
            }
          } else if (selectedTypes.length > 0) {
            // Only types selected (no specific years)
            selectedTypes.forEach(type => {
              stateTypeConditions.push(['all', 
                ['==', ['get', 'state'], stateCode.toUpperCase()],
                ['==', ['get', 'type'], type]
              ]);
            });
          } else if (selectedYears.length > 0) {
            // Only years selected (fallback to showing all types for those years)
            selectedYears.forEach(year => {
              stateTypeConditions.push(['all', 
                ['==', ['get', 'state'], stateCode.toUpperCase()],
                ['==', ['get', 'year_level'], year]
              ]);
            });
          }
          
          if (stateTypeConditions.length > 0) {
            stateConditions.push(['any', ...stateTypeConditions]);
          }
        }
      });
      if (stateConditions.length > 0) {
        conditions.push(['any', ...stateConditions]);
      }
    }

    // Check if any filters are active
    const hasActiveFilters = conditions.length > 0;

    if (hasActiveFilters) {
      // Show catchments, hide suburbs
      console.log('🏫 Showing school catchments, hiding suburbs');
      
      // Hide suburb layers
      map.current.setLayoutProperty('suburbs-fill', 'visibility', 'none');
      map.current.setLayoutProperty('suburbs-outline', 'visibility', 'none');
      map.current.setLayoutProperty('suburbs-hover-highlight', 'visibility', 'none');
      map.current.setLayoutProperty('suburbs-search-highlight', 'visibility', 'none');
      
      // Show catchment layers with filter
      const filterExpression = ['any', ...conditions];
      map.current.setFilter(CATCHMENTS_CONFIG.fillLayerId, filterExpression);
      map.current.setFilter(CATCHMENTS_CONFIG.lineLayerId, filterExpression);
      map.current.setLayoutProperty(CATCHMENTS_CONFIG.fillLayerId, 'visibility', 'visible');
      map.current.setLayoutProperty(CATCHMENTS_CONFIG.lineLayerId, 'visibility', 'visible');
      
      console.log('🔍 Applied catchments filter expression:', filterExpression);
    } else {
      // Hide catchments, show suburbs
      console.log('🏘️ Showing suburbs, hiding school catchments');
      
      // Show suburb layers
      map.current.setLayoutProperty('suburbs-fill', 'visibility', 'visible');
      map.current.setLayoutProperty('suburbs-outline', 'visibility', 'visible');
      map.current.setLayoutProperty('suburbs-hover-highlight', 'visibility', 'visible');
      map.current.setLayoutProperty('suburbs-search-highlight', 'visibility', 'visible');
      
      // Hide catchment layers
      map.current.setLayoutProperty(CATCHMENTS_CONFIG.fillLayerId, 'visibility', 'none');
      map.current.setLayoutProperty(CATCHMENTS_CONFIG.lineLayerId, 'visibility', 'none');
      
      console.log('🔍 Hidden all catchments, showing suburbs');
    }
  }, [map]);

  // Initialize catchments (add source and layers)
  const initializeCatchments = useCallback(async () => {
    await addCatchmentsSource();
    addCatchmentsLayers();
  }, [addCatchmentsSource, addCatchmentsLayers]);

  // Add hover interactions
  const addHoverInteractions = useCallback(() => {
    if (!map.current || !layersAdded.current) return;

    let hoveredFeatureId: string | number | undefined = undefined;

    const handleMouseMove = (e: mapboxgl.MapMouseEvent) => {
      if (!map.current) return;

      const features = map.current.queryRenderedFeatures(e.point, {
        layers: [CATCHMENTS_CONFIG.fillLayerId],
      });

      // Reset hover state
      if (hoveredFeatureId !== undefined) {
        map.current.setFeatureState(
          { source: CATCHMENTS_CONFIG.sourceId, id: hoveredFeatureId },
          { hover: false }
        );
      }

      // Set new hover state
      if (features.length > 0) {
        hoveredFeatureId = features[0].id;
        if (hoveredFeatureId !== undefined) {
          map.current.setFeatureState(
            { source: CATCHMENTS_CONFIG.sourceId, id: hoveredFeatureId },
            { hover: true }
          );
        }
        map.current.getCanvas().style.cursor = 'pointer';
      } else {
        hoveredFeatureId = undefined;
        map.current.getCanvas().style.cursor = '';
      }
    };

    const handleMouseLeave = () => {
      if (!map.current || hoveredFeatureId === undefined) return;

      map.current.setFeatureState(
        { source: CATCHMENTS_CONFIG.sourceId, id: hoveredFeatureId },
        { hover: false }
      );
      map.current.getCanvas().style.cursor = '';
      hoveredFeatureId = undefined;
    };

    const handleClick = (e: mapboxgl.MapMouseEvent) => {
      if (!map.current) return;

      const features = map.current.queryRenderedFeatures(e.point, {
        layers: [CATCHMENTS_CONFIG.fillLayerId],
      });

      if (features.length > 0) {
        const feature = features[0];
        const properties = feature.properties;
        
        // Determine school type for display
        const schoolType = properties?.type === 'Primary' ? 'Primary' : 'Secondary';
        
        // Determine grades coverage
        let gradesDisplay = 'Coverage not specified';
        if (properties?.grades) {
          gradesDisplay = properties.grades;
        } else if (properties?.year_level) {
          gradesDisplay = `Year ${properties.year_level}`;
        }
        
        // Create popup with new format
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`
            <div class="p-3 min-w-[200px]">
              <h3 class="font-semibold text-gray-900 text-base mb-1">${properties?.school_name || 'Unknown School'}</h3>
              <p class="text-sm text-gray-700 mb-1">${schoolType}</p>
              <p class="text-sm text-gray-600 mb-2">Grades: ${gradesDisplay}</p>
              <div class="text-xs text-gray-500 space-y-1">
                <div>State: ${properties?.state || 'Unknown'}</div>
                <div>Source: ${properties?.source || 'Unknown'}</div>
                <div>Year: ${properties?.year || 'Unknown'}</div>
              </div>
            </div>
          `)
          .addTo(map.current);
      }
    };

    // Add event listeners
    map.current.on('mousemove', CATCHMENTS_CONFIG.fillLayerId, handleMouseMove);
    map.current.on('mouseleave', CATCHMENTS_CONFIG.fillLayerId, handleMouseLeave);
    map.current.on('click', CATCHMENTS_CONFIG.fillLayerId, handleClick);

    // Cleanup function
    return () => {
      if (!map.current) return;
      map.current.off('mousemove', CATCHMENTS_CONFIG.fillLayerId, handleMouseMove);
      map.current.off('mouseleave', CATCHMENTS_CONFIG.fillLayerId, handleMouseLeave);
      map.current.off('click', CATCHMENTS_CONFIG.fillLayerId, handleClick);
    };
  }, [map]);

  // Update line width on hover
  const updateLineWidth = useCallback(() => {
    if (!map.current || !layersAdded.current) return;

    map.current.setPaintProperty(CATCHMENTS_CONFIG.lineLayerId, 'line-width', [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      2, // Hovered
      1  // Default
    ]);
  }, [map]);

  // Initialize everything
  useEffect(() => {
    if (!map.current) {
      console.log('🚫 Map not ready for catchments initialization');
      return;
    }

    console.log('🚀 Initializing school catchments...');

    const initialize = async () => {
      try {
        // Wait for map to be fully loaded
        if (!map.current?.isStyleLoaded()) {
          console.log('⏳ Waiting for map style to load...');
          await new Promise<void>((resolve) => {
            const checkStyle = () => {
              if (map.current?.isStyleLoaded()) {
                resolve();
              } else {
                setTimeout(checkStyle, 100);
              }
            };
            checkStyle();
          });
        }

        // Add a small delay to ensure map is fully ready
        await new Promise(resolve => setTimeout(resolve, 500));

        await initializeCatchments();
        console.log('✅ Catchments initialization complete');
        const cleanup = addHoverInteractions();
        updateLineWidth();

        return cleanup;
      } catch (error) {
        console.error('❌ Error initializing catchments:', error);
        return undefined;
      }
    };

    let cleanup: (() => void) | undefined;
    initialize().then(cleanupFn => {
      cleanup = cleanupFn;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [map.current, initializeCatchments, addHoverInteractions, updateLineWidth]);

  return {
    initializeCatchments,
    applyFilter,
    config: CATCHMENTS_CONFIG,
  };
};
