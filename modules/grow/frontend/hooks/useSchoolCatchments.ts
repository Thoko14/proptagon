import React, { useCallback, useRef, useEffect } from 'react';
import type { Map as MapboxMap } from 'mapbox-gl';

// NSW Vector Tilesets Configuration
const NSW_TILESETS = {
  primary: 'mapbox://tommstar25.dg9ropwk',
  secondary: 'mapbox://tommstar25.cbf6rphf', 
  future: 'mapbox://tommstar25.42l9a1mu',
  schools: 'mapbox://tommstar25.5zha3q9v'
};

const NSW_SOURCE_IDS = {
  primary: 'nsw-catchments-primary',
  secondary: 'nsw-catchments-secondary',
  future: 'nsw-catchments-future',
  schools: 'nsw-schools'
};

const NSW_LAYER_IDS = {
  primary: {
    fill: 'nsw-catchments-primary-fill',
    line: 'nsw-catchments-primary-line'
  },
  secondary: {
    fill: 'nsw-catchments-secondary-fill', 
    line: 'nsw-catchments-secondary-line'
  },
  future: {
    fill: 'nsw-catchments-future-fill',
    line: 'nsw-catchments-future-line'
  },
  schools: {
    points: 'nsw-schools-points',
    labels: 'nsw-schools-labels'
  }
};

const NSW_SOURCE_LAYERS = {
  primary: 'catchments_primary', // Enriched tileset uses 'catchments_primary' layer name
  secondary: 'catchments_secondary', // Enriched tileset uses 'catchments_secondary' layer name
  future: 'catchments', // Future tileset unchanged
  schools: 'schools'
};

// Note: TYPE_COLORS removed as we're using NSW vector tiles with fixed colors

export const useSchoolCatchments = (
  map: React.MutableRefObject<MapboxMap | null>,
  onCatchmentClick?: (data: any) => void,
  currentFilterState?: any
) => {
  
  // Store currentFilterState in a ref so it persists across renders
  const currentFilterStateRef = useRef(currentFilterState);
  React.useEffect(() => {
    currentFilterStateRef.current = currentFilterState;
  }, [currentFilterState]);
  
  const sourcesAdded = useRef(false);
  const layersAdded = useRef(false);

  // Add NSW vector tile sources (only once)
  const addNswSources = useCallback(() => {
    if (!map.current || sourcesAdded.current) return;

    try {
      // Add NSW catchment sources
      if (!map.current.getSource(NSW_SOURCE_IDS.primary)) {
        map.current.addSource(NSW_SOURCE_IDS.primary, {
          type: 'vector',
          url: NSW_TILESETS.primary
        });
        console.log('✅ NSW primary source added');
      }

      if (!map.current.getSource(NSW_SOURCE_IDS.secondary)) {
        map.current.addSource(NSW_SOURCE_IDS.secondary, {
          type: 'vector', 
          url: NSW_TILESETS.secondary
        });
        console.log('✅ NSW secondary source added');
      }

      if (!map.current.getSource(NSW_SOURCE_IDS.future)) {
        map.current.addSource(NSW_SOURCE_IDS.future, {
          type: 'vector',
          url: NSW_TILESETS.future
        });
        console.log('✅ NSW future source added');
      }

      if (!map.current.getSource(NSW_SOURCE_IDS.schools)) {
        map.current.addSource(NSW_SOURCE_IDS.schools, {
          type: 'vector',
          url: NSW_TILESETS.schools
        });
        console.log('✅ NSW schools source added');
      }

      sourcesAdded.current = true;
      console.log('✅ All NSW sources added');
    } catch (error) {
      console.error('❌ Error adding NSW sources:', error);
    }
  }, [map]);


  // Add NSW vector tile layers (only once)
  const addNswLayers = useCallback(() => {
    if (!map.current || !sourcesAdded.current || layersAdded.current) return;

    try {
      const style = map.current.getStyle();
      // Insert after poi-label to ensure catchments appear above roads
      const insertionLayer = style.layers.find(l => l.id === 'poi-label') || style.layers[style.layers.length - 1];

      const ensureLayer = (id: string, spec: any) => {
        if (!map.current!.getLayer(id)) {
          map.current!.addLayer(spec, insertionLayer?.id);
        }
      };

      // Primary catchment layers
      ensureLayer(NSW_LAYER_IDS.primary.fill, {
        id: NSW_LAYER_IDS.primary.fill,
        type: 'fill',
        source: NSW_SOURCE_IDS.primary,
        'source-layer': NSW_SOURCE_LAYERS.primary,
        paint: {
          'fill-color': '#3b82f6',
          'fill-opacity': 0.3,
        },
        layout: {
          visibility: 'none', // Initially hidden
        },
      });
      

      ensureLayer(NSW_LAYER_IDS.primary.line, {
        id: NSW_LAYER_IDS.primary.line,
        type: 'line',
        source: NSW_SOURCE_IDS.primary,
        'source-layer': NSW_SOURCE_LAYERS.primary,
        paint: {
          'line-color': '#1d4ed8',
          'line-width': 1,
        },
        layout: {
          visibility: 'none', // Initially hidden
        },
      });

      // Secondary catchment layers
      ensureLayer(NSW_LAYER_IDS.secondary.fill, {
        id: NSW_LAYER_IDS.secondary.fill,
        type: 'fill',
        source: NSW_SOURCE_IDS.secondary,
        'source-layer': NSW_SOURCE_LAYERS.secondary,
        paint: {
          'fill-color': '#10b981',
          'fill-opacity': 0.3,
        },
        layout: {
          visibility: 'none', // Initially hidden
        },
      });

      ensureLayer(NSW_LAYER_IDS.secondary.line, {
        id: NSW_LAYER_IDS.secondary.line,
        type: 'line',
        source: NSW_SOURCE_IDS.secondary,
        'source-layer': NSW_SOURCE_LAYERS.secondary,
        paint: {
          'line-color': '#059669',
          'line-width': 1,
        },
        layout: {
          visibility: 'none', // Initially hidden
        },
      });

      // Future catchment layers
      ensureLayer(NSW_LAYER_IDS.future.fill, {
        id: NSW_LAYER_IDS.future.fill,
      type: 'fill',
        source: NSW_SOURCE_IDS.future,
        'source-layer': NSW_SOURCE_LAYERS.future,
      paint: {
          'fill-color': '#f59e0b',
          'fill-opacity': 0.3,
        },
        layout: {
          visibility: 'none', // Initially hidden
        },
      });

      ensureLayer(NSW_LAYER_IDS.future.line, {
        id: NSW_LAYER_IDS.future.line,
      type: 'line',
        source: NSW_SOURCE_IDS.future,
        'source-layer': NSW_SOURCE_LAYERS.future,
      paint: {
          'line-color': '#d97706',
        'line-width': 1,
      },
        layout: {
          visibility: 'none', // Initially hidden
        },
      });

      // Schools layers
      ensureLayer(NSW_LAYER_IDS.schools.points, {
        id: NSW_LAYER_IDS.schools.points,
        type: 'circle',
        source: NSW_SOURCE_IDS.schools,
        'source-layer': NSW_SOURCE_LAYERS.schools,
        paint: {
          'circle-color': [
            'case',
            ['==', ['get', 'level'], 'primary'], '#3b82f6',
            ['==', ['get', 'level'], 'secondary'], '#10b981',
            ['==', ['get', 'level'], 'k-12'], '#8b5cf6',
            '#6b7280' // other/default
          ],
          'circle-radius': 6,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 2,
        },
        layout: {
          visibility: 'none', // Initially hidden
        },
      });

      ensureLayer(NSW_LAYER_IDS.schools.labels, {
        id: NSW_LAYER_IDS.schools.labels,
        type: 'symbol',
        source: NSW_SOURCE_IDS.schools,
        'source-layer': NSW_SOURCE_LAYERS.schools,
        paint: {
          'text-color': '#1f2937',
          'text-halo-color': '#ffffff',
          'text-halo-width': 2,
        },
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 14,
          'text-anchor': 'top',
          'text-offset': [0, 1.5],
          'text-allow-overlap': true,
          'text-ignore-placement': false,
          'text-optional': true,
          visibility: 'none', // Initially hidden
        },
      });

    layersAdded.current = true;
      console.log('✅ All NSW layers added');
    } catch (error) {
      console.error('❌ Error adding NSW layers:', error);
    }
  }, [map]);

  // Apply filter to NSW vector layers
  const applyFilter = useCallback((state: any) => {
    if (!map.current || !layersAdded.current) return;

    console.log('🔍 Applying NSW catchments filter with state:', state);

    // Check if state is in the expected format
    if (!state || typeof state !== 'object' || Array.isArray(state)) {
      console.log('❌ Invalid state format, expected object but got:', typeof state);
      return;
    }

    // Check if NSW filters are active
    let hasNswFilters = false;
    let primaryActive = false;
    let secondaryActive = false;
    let futureActive = false;

    // Check NSW state selections
    if (state.stateSelections && state.stateSelections.NSW) {
      const nswData = state.stateSelections.NSW;
      primaryActive = nswData.Primary === true;
      secondaryActive = nswData.Secondary === true;
      futureActive = nswData.Future === true;
      hasNswFilters = primaryActive || secondaryActive || futureActive;
    }

    if (hasNswFilters) {
      // Show NSW catchments, hide suburbs
      console.log('🏫 Showing NSW school catchments, hiding suburbs');
      
      // Hide all localities/suburb layers
      const localitiesLayers = [
        'localities-outline-z6-9',
        'localities-outline-z10-11', 
        'localities-outline-z12',
        'localities-fill-z6-9',
        'localities-fill-z10-11',
        'localities-fill-z12',
        'localities-search-highlight-z6-9',
        'localities-search-highlight-z10-11',
        'localities-search-highlight-z12',
        // Also hide any old suburb layers
        'suburbs-fill',
        'suburbs-outline',
        'suburbs-hover-highlight',
        'suburbs-search-highlight'
      ];
      
      localitiesLayers.forEach(layerId => {
        if (map.current!.getLayer(layerId)) {
          map.current!.setLayoutProperty(layerId, 'visibility', 'none');
          console.log(`🔍 Hidden layer: ${layerId}`);
              } else {
          console.log(`🔍 Layer not found: ${layerId}`);
        }
      });
      
      // Show/hide NSW catchment layers based on selections
      map.current.setLayoutProperty(NSW_LAYER_IDS.primary.fill, 'visibility', primaryActive ? 'visible' : 'none');
      map.current.setLayoutProperty(NSW_LAYER_IDS.primary.line, 'visibility', primaryActive ? 'visible' : 'none');
      map.current.setLayoutProperty(NSW_LAYER_IDS.secondary.fill, 'visibility', secondaryActive ? 'visible' : 'none');
      map.current.setLayoutProperty(NSW_LAYER_IDS.secondary.line, 'visibility', secondaryActive ? 'visible' : 'none');
      map.current.setLayoutProperty(NSW_LAYER_IDS.future.fill, 'visibility', futureActive ? 'visible' : 'none');
      map.current.setLayoutProperty(NSW_LAYER_IDS.future.line, 'visibility', futureActive ? 'visible' : 'none');
      
      // Show schools automatically with catchments, but filter by catchment type
      const showSchools = primaryActive || secondaryActive; // No schools for future
      console.log('🔍 Setting school layers visibility:', showSchools);
      
      map.current.setLayoutProperty(NSW_LAYER_IDS.schools.points, 'visibility', showSchools ? 'visible' : 'none');
      map.current.setLayoutProperty(NSW_LAYER_IDS.schools.labels, 'visibility', showSchools ? 'visible' : 'none');
      
      // Filter schools by catchment type using data-driven styling
      if (showSchools) {
        // Set filter for schools based on active catchment types
        const schoolFilter: any[] = ['any'];
        
        if (primaryActive) {
          schoolFilter.push(['==', ['get', 'level'], 'primary']);
        }
        if (secondaryActive) {
          schoolFilter.push(['==', ['get', 'level'], 'secondary']);
        }
        
        map.current.setFilter(NSW_LAYER_IDS.schools.points, schoolFilter);
        map.current.setFilter(NSW_LAYER_IDS.schools.labels, schoolFilter);
      } else {
        // Clear filter when no schools should be shown
        map.current.setFilter(NSW_LAYER_IDS.schools.points, null);
        map.current.setFilter(NSW_LAYER_IDS.schools.labels, null);
      }
      
      console.log('🔍 NSW catchments visibility:', { primaryActive, secondaryActive, futureActive, showSchools });
    } else {
      // Hide NSW catchments, show suburbs
      console.log('🏘️ Showing suburbs, hiding NSW school catchments');
      
      // Show all localities/suburb layers
      const localitiesLayers = [
        'localities-outline-z6-9',
        'localities-outline-z10-11', 
        'localities-outline-z12',
        'localities-fill-z6-9',
        'localities-fill-z10-11',
        'localities-fill-z12',
        'localities-search-highlight-z6-9',
        'localities-search-highlight-z10-11',
        'localities-search-highlight-z12',
        // Also show any old suburb layers
        'suburbs-fill',
        'suburbs-outline',
        'suburbs-hover-highlight',
        'suburbs-search-highlight'
      ];
      
      localitiesLayers.forEach(layerId => {
        if (map.current!.getLayer(layerId)) {
          map.current!.setLayoutProperty(layerId, 'visibility', 'visible');
        }
      });
      
      // Hide all NSW catchment layers
      map.current.setLayoutProperty(NSW_LAYER_IDS.primary.fill, 'visibility', 'none');
      map.current.setLayoutProperty(NSW_LAYER_IDS.primary.line, 'visibility', 'none');
      map.current.setLayoutProperty(NSW_LAYER_IDS.secondary.fill, 'visibility', 'none');
      map.current.setLayoutProperty(NSW_LAYER_IDS.secondary.line, 'visibility', 'none');
      map.current.setLayoutProperty(NSW_LAYER_IDS.future.fill, 'visibility', 'none');
      map.current.setLayoutProperty(NSW_LAYER_IDS.future.line, 'visibility', 'none');
      map.current.setLayoutProperty(NSW_LAYER_IDS.schools.points, 'visibility', 'none');
      map.current.setLayoutProperty(NSW_LAYER_IDS.schools.labels, 'visibility', 'none');
      
      console.log('🔍 Hidden all NSW catchments, showing suburbs');
    }
  }, [map]);

  // Initialize NSW catchments (add sources and layers)
  const initializeCatchments = useCallback(async () => {
    addNswSources();
    addNswLayers();
  }, [addNswSources, addNswLayers]);

  // Add hover interactions for NSW layers
  const addHoverInteractions = useCallback(() => {
    if (!map.current || !layersAdded.current) return;

    let hoveredFeatureId: string | number | undefined = undefined;

    const allNswLayers = [
      NSW_LAYER_IDS.primary.fill,
      NSW_LAYER_IDS.secondary.fill,
      NSW_LAYER_IDS.future.fill,
    ];

    const handleMouseMove = (e: mapboxgl.MapMouseEvent) => {
      if (!map.current) return;

      const features = map.current.queryRenderedFeatures(e.point, {
        layers: allNswLayers,
      });

      // Reset hover state (feature state not supported for vector tiles)
      if (hoveredFeatureId !== undefined) {
        // Just reset the cursor for vector tiles
        if (map.current) {
          map.current.getCanvas().style.cursor = '';
        }
      }

      // Set new hover state (feature state not supported for vector tiles)
      if (features.length > 0) {
        hoveredFeatureId = features[0].id;
        if (map.current) {
          map.current.getCanvas().style.cursor = 'pointer';
        }
      } else {
        hoveredFeatureId = undefined;
        if (map.current) {
        map.current.getCanvas().style.cursor = '';
        }
      }
    };

    const handleMouseLeave = () => {
      if (!map.current || hoveredFeatureId === undefined) return;

      // Reset cursor for vector tiles (feature state not supported)
      map.current.getCanvas().style.cursor = '';
      hoveredFeatureId = undefined;
    };

    const handleClick = async (e: mapboxgl.MapMouseEvent) => {
      if (!map.current) return;

      const features = map.current.queryRenderedFeatures(e.point, {
        layers: allNswLayers,
      });

      if (features.length > 0) {
        const feature = features[0];
        const properties = feature.properties;
        const layerId = feature.layer?.id || 'unknown';
        
        // Determine catchment type based on sidebar state and layer
        let catchmentId = properties?.catchment_id;
        let catchmentType = 'Unknown';
        
        console.log('🔍 Raw catchment ID from properties:', catchmentId, 'type:', typeof catchmentId);
        
        // Use sidebar state to determine catchment type (mutually exclusive)
        if (currentFilterStateRef.current?.stateSelections?.NSW) {
          const nswState = currentFilterStateRef.current.stateSelections.NSW;
          
          if (nswState.Primary === true) {
            catchmentType = 'Primary';
          } else if (nswState.Secondary === true) {
            catchmentType = 'Secondary';
          } else if (nswState.Future === true) {
            catchmentType = 'Future';
            // Future catchments don't have schools
          }
        } else {
          // Fallback to layer-based detection
          if (layerId.includes('primary')) {
            catchmentType = 'Primary';
          } else if (layerId.includes('secondary')) {
            catchmentType = 'Secondary';
          } else if (layerId.includes('future')) {
            catchmentType = 'Future';
          }
        }
        
        // Get school data directly from enriched catchment properties
        let schoolData = null;
        let associatedSchools = [];
        
        
        if (catchmentType === 'Primary' && properties) {
          // Check for primary school data in enriched catchment
          const schoolIds = properties.primary_school_ids;
          const schoolNames = properties.primary_school_names;
          const schoolLons = properties.primary_school_lons;
          const schoolLats = properties.primary_school_lats;
          
          if (schoolIds && schoolNames) {
            // Parse pipe-separated lists
          const ids = schoolIds.split('|').filter((id: string) => id.trim());
          const names = schoolNames.split('|').filter((name: string) => name.trim());
          const lons = schoolLons ? schoolLons.split('|').filter((lon: string) => lon.trim()) : [] as string[];
          const lats = schoolLats ? schoolLats.split('|').filter((lat: string) => lat.trim()) : [] as string[];
            
            // Create school objects
            associatedSchools = ids.map((sid: string, sIndex: number) => ({
              id: sid.trim(),
              name: (names[sIndex] as string | undefined)?.trim() || 'Unknown School',
              lon: lons[sIndex] ? parseFloat((lons[sIndex] as string).trim()) : null,
              lat: lats[sIndex] ? parseFloat((lats[sIndex] as string).trim()) : null
            }));
            
            // Use first school as primary display
            if (associatedSchools.length > 0) {
              schoolData = {
                name: associatedSchools[0].name,
                level: 'primary',
                id: associatedSchools[0].id
              };
              console.log('🔍 Found primary schools from enriched catchment:', associatedSchools.length);
            }
          }
        } else if (catchmentType === 'Secondary' && properties) {
          // Check for secondary school data in enriched catchment
          const schoolIds = properties.secondary_school_ids;
          const schoolNames = properties.secondary_school_names;
          const schoolLons = properties.secondary_school_lons;
          const schoolLats = properties.secondary_school_lats;
          
          if (schoolIds && schoolNames) {
            // Parse pipe-separated lists
          const ids = schoolIds.split('|').filter((id: string) => id.trim());
          const names = schoolNames.split('|').filter((name: string) => name.trim());
          const lons = schoolLons ? schoolLons.split('|').filter((lon: string) => lon.trim()) : [] as string[];
          const lats = schoolLats ? schoolLats.split('|').filter((lat: string) => lat.trim()) : [] as string[];
            
            // Create school objects
            associatedSchools = ids.map((sid: string, sIndex: number) => ({
              id: sid.trim(),
              name: (names[sIndex] as string | undefined)?.trim() || 'Unknown School',
              lon: lons[sIndex] ? parseFloat((lons[sIndex] as string).trim()) : null,
              lat: lats[sIndex] ? parseFloat((lats[sIndex] as string).trim()) : null
            }));
            
            // Use first school as primary display
            if (associatedSchools.length > 0) {
              schoolData = {
                name: associatedSchools[0].name,
                level: 'secondary',
                id: associatedSchools[0].id
              };
              console.log('🔍 Found secondary schools from enriched catchment:', associatedSchools.length);
            }
          }
        }
        
        // Handle catchments with no associated schools
        if (!schoolData && (catchmentType === 'Primary' || catchmentType === 'Secondary')) {
          console.log('🔍 No schools found in enriched catchment for:', catchmentId);
        }
        
        // Use school data if found, otherwise show catchment info
        let displayName = properties?.name || 'Unknown Catchment';
        let schoolType = catchmentType;
        
        if (schoolData) {
          displayName = schoolData.name || 'Unknown School';
          schoolType = schoolData.level || catchmentType;
          console.log('🔍 Using actual school name:', displayName);
        } else {
          console.log('🔍 No school found, showing catchment name:', displayName);
        }
        
        // Determine grades coverage
        let gradesDisplay = 'Coverage not specified';
        if (properties?.grades) {
          gradesDisplay = properties.grades;
        } else if (properties?.year_level) {
          gradesDisplay = `Year ${properties.year_level}`;
        }
        
        // Create school list display for multiple schools
        let schoolListDisplay = '';
        if (associatedSchools.length > 1) {
          schoolListDisplay = `
            <div class="mt-2">
              <div class="text-xs text-gray-500 uppercase tracking-wide mb-1">All Schools (${associatedSchools.length})</div>
              <div class="space-y-1 max-h-32 overflow-y-auto">
                ${associatedSchools.map((school: { name: string }) => `
                  <div class="text-xs text-gray-700 flex items-center gap-1">
                    <span class="text-blue-500">•</span>
                    <span>${school.name}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }
        
        // Create comprehensive catchment information for the toolkit
        const combinedInfo = `
          <div class="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-gray-200">
            <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span class="text-lg">🎓</span>
              ${displayName}
            </h4>
            <div class="space-y-3">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <div class="text-xs text-gray-500 uppercase tracking-wide">School Type</div>
                  <div class="text-sm font-medium text-gray-900">${schoolType}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500 uppercase tracking-wide">State</div>
                  <div class="text-sm font-medium text-gray-900">NSW</div>
                </div>
              </div>
              
              <div class="border-t border-gray-200 pt-3">
                <div class="text-xs text-gray-500 uppercase tracking-wide mb-2">School Information</div>
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <span class="text-lg">🏫</span>
                    <div>
                      <div class="text-sm font-medium text-gray-900">${displayName}</div>
                      <div class="text-xs text-gray-600">${schoolType} • ${gradesDisplay}</div>
                      <div class="text-xs text-gray-500">Catchment ID: ${catchmentId || 'Unknown'}</div>
                      ${schoolData ? '<div class="text-xs text-green-600">✓ Precomputed school data</div>' : ''}
                    </div>
                  </div>
                  ${schoolListDisplay}
                  ${associatedSchools.length > 0 ? `
                    <div class="mt-3">
                      <button 
                        onclick="fetchSchoolDetails('${associatedSchools.map((s: { id: string }) => s.id).join(',')}')"
                        class="w-full px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors"
                      >
                        📋 More Details (${associatedSchools.length} schools)
                      </button>
                    </div>
                  ` : ''}
                </div>
              </div>
              
              <div class="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
                Data from NSW Education Department
              </div>
            </div>
          </div>
        `;
        
        // Create a comprehensive suburb toolkit entry
        const mockSuburbData = {
          name: displayName,
          code: `catchment-${layerId}`,
          score: 75, // Mock score
          kpis: {
            yield: 4.2,
            growth5y: 8.5,
            vacancy: 2.1
          },
          position: { x: 20, y: 240 }, // Fixed position for top-left
          catchmentInfo: combinedInfo,
          schoolInfo: '', // Combined into catchmentInfo
          isCatchment: true // Flag to indicate this is catchment data
        };
        
        // Trigger the suburb toolkit with comprehensive information
        if (onCatchmentClick) {
          onCatchmentClick(mockSuburbData);
        }
      }
    };

    // Add event listeners for all NSW layers
    if (map.current) {
      allNswLayers.forEach(layerId => {
        if (map.current) {
          map.current.on('mousemove', layerId, handleMouseMove);
          map.current.on('mouseleave', layerId, handleMouseLeave);
          map.current.on('click', layerId, handleClick);
        }
      });
    }

    // Cleanup function
    return () => {
      if (!map.current) return;
      allNswLayers.forEach(layerId => {
        if (map.current) {
          map.current.off('mousemove', layerId, handleMouseMove);
          map.current.off('mouseleave', layerId, handleMouseLeave);
          map.current.off('click', layerId, handleClick);
        }
      });
    };
  }, [map]);

  // Note: Line width hover effects removed for vector tiles (feature state not supported)

  // Global function to fetch school details from DynamoDB
  useEffect(() => {
    // Add global function for fetching school details
    (window as any).fetchSchoolDetails = async (schoolIds: string) => {
      console.log('🔍 Fetching school details for IDs:', schoolIds);
      try {
        // TODO: Implement DynamoDB fetch for full school records
        // This would typically call your backend API to get detailed school information
        const ids = schoolIds.split(',');
        console.log('🔍 Would fetch details for schools:', ids);
        
        // For now, just show an alert - replace with actual API call
        alert(`Would fetch detailed information for ${ids.length} schools:\n${ids.join(', ')}`);
      } catch (error) {
        console.error('❌ Error fetching school details:', error);
        alert('Error fetching school details. Please try again.');
      }
    };
    
    
    return () => {
      // Cleanup global functions
      delete (window as any).fetchSchoolDetails;
    };
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
        console.log('✅ NSW catchments initialization complete');
        const cleanup = addHoverInteractions();

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
  }, [map.current, initializeCatchments, addHoverInteractions]);

  return {
    initializeCatchments,
    applyFilter,
  };
};
