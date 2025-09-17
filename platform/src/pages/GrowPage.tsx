import React, { useState, useRef } from 'react';
import Layout from '../components/Layout';
import GrowMap, { GrowMapRef } from '../../../modules/grow/frontend/components/GrowMap';
import { GrowTopBar } from '../../../modules/grow/frontend/components/GrowTopBar';
import { LayersFab } from '../../../modules/grow/frontend/components/LayersFab';
import { SchoolCatchmentsSidebar } from '../../../modules/grow/frontend/components/SchoolCatchmentsSidebar';
import Button from '../components/Button';
// import { MAPBOX_CONFIG } from '../../../modules/grow/frontend/config/mapbox'; // Not used in simplified approach

/**
 * Main page component for the Grow module
 * Renders the Grow module content within the platform layout
 */
const GrowPage: React.FC = () => {
  const [isStrategyMode, setIsStrategyMode] = useState(false);
  const [selectedSuburb, setSelectedSuburb] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [isCatchmentsSidebarOpen, setIsCatchmentsSidebarOpen] = useState(false);

  // Debug map instance setting
  const handleMapReady = (map: any) => {
    // Prevent multiple map instance settings
    if (mapInstance) {
      console.log('🗺️ Map instance already set, skipping...');
      return;
    }
    
    console.log('🗺️ Map instance received:', map);
    
    // Add debug functions to window for easy access
    (window as any).debugSearch = () => {
      if (mapRef.current) {
        mapRef.current.debugSearch();
      }
    };
    (window as any).examineZ12Data = () => {
      if (mapRef.current) {
        mapRef.current.examineZ12Data();
      }
    };
    console.log('🗺️ Map methods available:', {
      flyTo: typeof map.flyTo,
      fitBounds: typeof map.fitBounds,
      getZoom: typeof map.getZoom
    });
    setMapInstance(map);
  };
  const mapRef = useRef<GrowMapRef>(null);

  // Handle suburb search with fallback to geocoding
  const handleSuburbSearch = (suburbName: string, state?: string) => {
    console.log('🏘️ Suburb search for:', suburbName, 'in state:', state);
    console.log('🔍 Map ref status:', { 
      hasMapRef: !!mapRef.current, 
      hasMapInstance: !!mapInstance 
    });
    
    if (!mapRef.current) {
      console.log('⏳ Map ref not ready, skipping suburb search...');
      return;
    }

    if (!mapInstance) {
      console.log('⏳ Map instance not ready, skipping suburb search...');
      return;
    }

    console.log('✅ Map ref and instance ready, executing suburb search...');
    console.log('🗺️ Current map state:', {
      center: mapInstance.getCenter(),
      zoom: mapInstance.getZoom(),
      isMoving: mapInstance.isMoving(),
      isZooming: mapInstance.isZooming()
    });
    
    // Add visual feedback
    console.log('🎯 Starting search animation...');

    // Clear any existing search highlight
    mapRef.current.clearSearchHighlight();

    // Use the zoomToSuburb function which searches in our GeoJSON data
    // The function will handle both zooming and highlighting
    mapRef.current.zoomToSuburb(suburbName, state, (suburbCode: string) => {
      console.log('🏘️ Found suburb code:', suburbCode);
      console.log('✅ Search completed successfully - suburb found in local data');
      // The highlighting is already handled in zoomToSuburb
    });
    
    // Note: Fallback logic removed as per simplified search approach
    // The search now always uses the most detailed layer and should find all localities
  };

  const handleSearchResult = ({ lat, lng, bbox }: { lat: number; lng: number; bbox?: number[] }) => {
    console.log('🔍 Search result received:', { lat, lng, bbox });
    
    if (!mapRef.current) {
      console.log('⏳ Map ref not ready, skipping search...');
      return;
    }

    console.log('✅ Map ref ready, executing search...');

    // Clear any existing search highlight
    mapRef.current.clearSearchHighlight();

    // For suburbs, use flyTo with higher zoom level for better precision
    // For regions/states, use fitBounds with the bbox
    const isSuburb = bbox && bbox.length === 4 && 
                    (Math.abs(bbox[2] - bbox[0]) < 0.5 && Math.abs(bbox[3] - bbox[1]) < 0.5);
    
    if (isSuburb) {
      console.log('🏘️ Using flyTo for suburb with higher zoom:', [lng, lat]);
      mapInstance?.flyTo({
        center: [lng, lat],
        zoom: 12, // Higher zoom for suburbs
        duration: 2000
      });
      
      // Note: Highlighting is now handled inside zoomToSuburb function
    } else if (bbox && bbox.length === 4) {
      console.log('🗺️ Using fitBounds for region with bbox:', bbox);
      try {
        mapInstance?.fitBounds(bbox as [number, number, number, number], {
          padding: 50,
          duration: 2000
        });
        
        // Note: Highlighting is now handled inside zoomToSuburb function
      } catch (error) {
        console.error('❌ fitBounds error:', error);
        // Fallback to flyTo
        mapInstance?.flyTo({
          center: [lng, lat],
          zoom: 10,
          duration: 2000
        });
        
        // Note: Highlighting is now handled inside zoomToSuburb function
      }
    } else {
      console.log('📍 Using flyTo with center:', [lng, lat]);
      mapInstance?.flyTo({
        center: [lng, lat],
        zoom: 10,
        duration: 2000
      });
      
      // Note: Highlighting is now handled inside zoomToSuburb function
    }
  };



  const handleStrategyMode = () => {
    setIsStrategyMode(true);
    setSelectedSuburb(null);
  };

  const handleSuburbSelect = (suburb: string) => {
    setSelectedSuburb(suburb);
    setIsStrategyMode(false);
  };

  // Handle suburb click from map
  const handleSuburbClick = (suburb: { name: string; code: string; score: number; kpis: any; position: { x: number; y: number } }) => {
    setSelectedSuburb(suburb.name);
    
    // Clear search highlight when clicking on a suburb
    if (mapRef.current) {
      mapRef.current.clearSearchHighlight();
    }
  };

  const handleBackToMap = () => {
    setIsStrategyMode(false);
    setSelectedSuburb(null);
  };

  // Handle catchments sidebar toggle
  const handleCatchmentsToggle = () => {
    setIsCatchmentsSidebarOpen(!isCatchmentsSidebarOpen);
  };

  const handleCatchmentsClose = () => {
    setIsCatchmentsSidebarOpen(false);
  };

  // Handle catchments filter changes
  const handleCatchmentsFilterChange = (filter: any) => {
    // Note: applyCatchmentsFilter not implemented in simplified localities approach
    console.log('📊 Catchments filter changed:', filter);
  };

  // Mock suburb data
  const mockSuburbs = [
    'Bondi Beach, NSW',
    'Surry Hills, NSW', 
    'Paddington, NSW',
    'Manly, NSW',
    'Newtown, NSW',
    'Glebe, NSW',
    'Darlinghurst, NSW',
    'Potts Point, NSW'
  ];

  return (
    <Layout>
      <div className="grow-app w-full flex flex-col relative" style={{ height: 'calc(100vh - 140px)' }}>
        <GrowTopBar 
          onSearch={handleSearchResult} 
          onSuburbSearch={handleSuburbSearch}
          onStrategyClick={handleStrategyMode}
        />
        
        {/* Main Content Area */}
        <div className="flex-1 flex">
        {isStrategyMode ? (
          <>
            {/* Left Panel - KPI Sliders */}
            <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Preferences</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capital Growth Priority
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="50"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cash Flow Priority
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="30"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Risk Tolerance
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="40"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => console.log('Update Results')}
                >
                  Update Results
                </Button>
              </div>
            </div>

            {/* Right Panel - Suburb List */}
            <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recommended Suburbs</h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleBackToMap}
                >
                  Back to Map
                </Button>
              </div>
              <ul className="space-y-3">
                {mockSuburbs.map((suburb, index) => (
                  <li
                    key={index}
                    className="bg-white p-4 rounded-lg border border-gray-200 cursor-pointer hover:border-sky-300 hover:shadow-sm transition-all"
                    onClick={() => handleSuburbSelect(suburb)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{suburb}</span>
                      <span className="text-sm text-gray-500">Score: {85 - index * 2}</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Median: $1.2M • Growth: 8.5% • Yield: 3.2%
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          /* Map View */
          <div className="flex-1 relative">
            <GrowMap 
              ref={mapRef}
              onMapReady={handleMapReady} 
              onSuburbClick={handleSuburbClick}
              className="w-full h-full"
            />
            
            {/* School Catchments FAB - Positioned relative to map container */}
            <div className="absolute bottom-16 right-4 z-[9999]">
              <LayersFab 
                isOpen={isCatchmentsSidebarOpen}
                onToggle={handleCatchmentsToggle}
              />
            </div>
            
            {/* School Catchments Sidebar - Positioned relative to map container */}
            <div className="absolute inset-0 z-[9998]" style={{ height: '100%', pointerEvents: 'none' }}>
              <SchoolCatchmentsSidebar
                isOpen={isCatchmentsSidebarOpen}
                onClose={handleCatchmentsClose}
                onFilterChange={handleCatchmentsFilterChange}
              />
            </div>
            
            {/* Suburb Detail Panel (when a suburb is selected) */}
            {selectedSuburb && (
              <div className="absolute top-4 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedSuburb}</h3>
                  <button
                    onClick={() => setSelectedSuburb(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Investment Score</span>
                    <span className="font-semibold text-sky-600">85/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Median Price</span>
                    <span className="font-semibold">$1,250,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Annual Growth</span>
                    <span className="font-semibold text-green-600">+8.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Rental Yield</span>
                    <span className="font-semibold">3.2%</span>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => console.log('View Details')}
                >
                  View Full Details
                </Button>
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </Layout>
  );
};

export default GrowPage;
