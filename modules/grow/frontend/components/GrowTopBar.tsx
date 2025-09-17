import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, MapPin, Globe, Hash } from 'lucide-react';
import { MAPBOX_CONFIG } from '../config/mapbox';
import { StrategyChip } from './StrategyChip';
import { LocationChip } from './LocationChip';
import { FiltersChip } from './FiltersChip';
import { useGrowStore } from '../store/growStore';
import Button from '../../../../platform/src/components/Button';

interface SearchSuggestion {
  id: string;
  text: string;
  place_name: string;
  center: [number, number];
  bbox?: [number, number, number, number];
  place_type: string[];
  properties: {
    postcode?: string;
    state?: string;
  };
}

interface GrowTopBarProps {
  onSearch: (result: { lng: number; lat: number; bbox?: [number, number, number, number] }) => void;
  onSuburbSearch: (suburbName: string, state?: string) => void; // New prop for suburb name search
  onStrategyClick: () => void;
  onSuburbListClick?: () => void;
  isInPropertiesFlow?: boolean;
}

export const GrowTopBar: React.FC<GrowTopBarProps> = ({ 
  onSearch, 
  onSuburbSearch,
  onStrategyClick, 
  onSuburbListClick,
  isInPropertiesFlow = false 
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const searchExecutedRef = useRef(false);
  
  const { setLocationScope, updateMapState } = useGrowStore();

  // Debounced search function
  const debouncedSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    
    try {
      const encodedQuery = encodeURIComponent(query.trim());
      // Remove types restriction to see what the API returns by default
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedQuery}.json?access_token=${MAPBOX_CONFIG.accessToken}&country=AU&limit=12&autocomplete=true`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`API request failed: ${response.status}`);
      
      const data = await response.json();
      
      console.log('🔍 Raw search results for:', query, data.features);
      
      if (data.features && data.features.length > 0) {
        // Prioritize and filter results
        const prioritizedSuggestions = prioritizeSuggestions(data.features);
        console.log('✅ Filtered suggestions:', prioritizedSuggestions);
        setSuggestions(prioritizedSuggestions);
        // Only show suggestions if a search hasn't been executed
        if (!searchExecutedRef.current) {
          setShowSuggestions(true);
          setSelectedIndex(-1);
        }
      } else {
        setSuggestions([]);
        if (!searchExecutedRef.current) {
          setShowSuggestions(false);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Prioritize search suggestions - focus on suburbs and filter out roads/landmarks
  const prioritizeSuggestions = (features: any[]): SearchSuggestion[] => {
    return features
      .map(feature => ({
        id: feature.id,
        text: feature.text,
        place_name: feature.place_name,
        center: feature.center,
        bbox: feature.bbox,
        place_type: feature.place_type,
        properties: feature.properties || {}
      }))
      .filter(feature => {
        // Enhanced filtering - focus on suburbs/locality types while filtering out streets
        const placeName = feature.place_name.toLowerCase();
        const text = feature.text.toLowerCase();
        const placeType = feature.place_type;
        
        // Only exclude if it's too short (less than 2 characters)
        const isTooShort = text.length < 2;
        
        // Check if it contains road-related terms
        const roadTerms = ['road', 'street', 'avenue', 'drive', 'lane', 'court', 'way', 'highway', 'freeway', 'close', 'terrace', 'crescent', 'boulevard'];
        const hasRoadTerms = roadTerms.some(term => placeName.includes(term) || text.includes(term));
        
        // Enhanced filtering: prioritize suburb/locality types
        const isGoodType = placeType.some((type: string) => 
          ['place', 'neighborhood', 'locality', 'suburb', 'postcode', 'district', 'region'].includes(type)
        );
        
        // First check: exclude if too short
        if (isTooShort) {
          console.log('🔍 Excluding too short:', {
            text: feature.text,
            reason: 'Too short (< 2 chars)'
          });
          return false;
        }
        
        // If it's a good type (suburb/locality), include it
        if (isGoodType) {
          console.log('🔍 Including good type:', {
            text: feature.text,
            place_type: feature.place_type,
            reason: 'Good type (suburb/locality)'
          });
          return true;
        }
        
        // If it's not a good type but has road terms, exclude it
        if (hasRoadTerms) {
          console.log('🔍 Excluding street:', {
            text: feature.text,
            place_type: feature.place_type,
            reason: 'Has road terms and not a good type'
          });
          return false;
        }
        
        // For other types without road terms, include them (might be useful)
        console.log('🔍 Including other type:', {
          text: feature.text,
          place_type: feature.place_type,
          reason: 'No road terms, might be useful'
        });
        return true;
      })
      .sort((a, b) => {
        // Priority 1: Exact suburb matches (neighborhood/place)
        const aIsSuburb = a.place_type.includes('neighborhood') || a.place_type.includes('place');
        const bIsSuburb = b.place_type.includes('neighborhood') || b.place_type.includes('place');
        
        if (aIsSuburb && !bIsSuburb) return -1;
        if (!aIsSuburb && bIsSuburb) return 1;
        
        // Priority 2: Postcode matches
        const aHasPostcode = a.properties.postcode;
        const bHasPostcode = b.properties.postcode;
        
        if (aHasPostcode && !bHasPostcode) return -1;
        if (!aHasPostcode && bHasPostcode) return 1;
        
        // Priority 3: Shorter place names (more specific)
        return a.text.length - b.text.length;
      })
      .slice(0, 8); // Limit to top 8 results
  };

  // Handle input changes with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    setShowSuggestions(false);
    searchExecutedRef.current = false; // Reset flag when user starts typing again
    
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Set new timeout for debounced search
    debounceTimeoutRef.current = setTimeout(() => {
      debouncedSearch(value);
    }, 300);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    if (isSearching) return;
    
    console.log('🎯 Selected suggestion:', suggestion);
    
    setSearchInput(suggestion.place_name);
    setShowSuggestions(false);
    setSuggestions([]);
    
    // Update location scope based on suggestion type
    if (suggestion.place_type.includes('neighborhood') || suggestion.place_type.includes('place')) {
      // This is likely a suburb
      setLocationScope({
        type: 'suburb',
        suburbName: suggestion.place_name, // Use full place name including state
        bounds: suggestion.bbox
      });
    } else {
      // This is a region/state, use map area
      setLocationScope({
        type: 'map-area',
        bounds: suggestion.bbox
      });
    }

    // Update map state
    if (suggestion.bbox) {
      updateMapState({ bbox: suggestion.bbox });
    }

    // Use the same approach as manual Enter - tileset search
    // Extract suburb name and state from place_name (e.g., "Red Hill, Queensland, Australia" -> "Red Hill", "Queensland")
    const placeParts = suggestion.place_name.split(', ');
    const suburbName = placeParts[0]; // First part is the suburb name
    const state = placeParts.length >= 2 ? placeParts[placeParts.length - 2] : null;
    
    console.log('🏘️ Using suburb name search for:', suburbName, 'in state:', state);
    console.log('🔍 Full place_name:', suggestion.place_name);
    console.log('🔍 Extracted suburb name:', suburbName);
    onSuburbSearch(suburbName, state || undefined);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        if (!showSuggestions || suggestions.length === 0) return;
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        if (!showSuggestions || suggestions.length === 0) return;
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (showSuggestions && suggestions.length > 0 && selectedIndex >= 0) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        } else {
          // Always allow Enter to trigger search, even if suggestions aren't loaded
          // Immediately hide suggestions to prevent them from appearing after search
          setShowSuggestions(false);
          setSelectedIndex(-1);
          searchExecutedRef.current = true; // Prevent debouncedSearch from showing suggestions
          handleSearchClick();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle search button click (existing functionality)
  const handleSearchClick = async () => {
    if (!searchInput.trim() || isSearching) return;
    
    setIsSearching(true);

    try {
      const encodedQuery = encodeURIComponent(searchInput.trim());
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedQuery}.json?access_token=${MAPBOX_CONFIG.accessToken}&country=AU&limit=12&autocomplete=true`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        // For manual search (Enter key), use the first raw result without aggressive filtering
        // This ensures we get results even if they don't pass the autocomplete filter
        const feature = data.features[0];
        const [lng, lat] = feature.center;
        const bbox = feature.bbox;

        console.log('🔍 Manual search using first raw result:', {
          text: feature.text,
          place_name: feature.place_name,
          place_type: feature.place_type,
          center: feature.center
        });

        // Check if this looks like a suburb (for suburb name search)
        const isLikelySuburb = feature.place_type?.includes('place') || 
                              feature.place_type?.includes('neighborhood') ||
                              feature.place_name.split(',').length >= 2; // Has state info
        
        if (isLikelySuburb) {
          // This is likely a suburb - use suburb name search
          setLocationScope({
            type: 'suburb',
            suburbName: feature.place_name,
            bounds: bbox
          });
          
          // Extract suburb name and state from place_name
          const placeParts = feature.place_name.split(', ');
          const suburbName = placeParts[0]; // First part is the suburb name
          const state = placeParts.length >= 2 ? placeParts[placeParts.length - 2] : null;
          
          console.log('🏘️ Using suburb name search for:', suburbName, 'in state:', state);
          onSuburbSearch(suburbName, state || undefined);
        } else {
          // Use geocoding coordinates for regions/other types
          setLocationScope({
            type: 'map-area',
            bounds: bbox
          });
          
          // Update map state
          if (bbox) {
            updateMapState({ bbox: bbox as [number, number, number, number] });
          }
          
          console.log('🗺️ Using geocoding coordinates for region');
          onSearch({ lat, lng, bbox });
        }
        
        // Clear search input
        setSearchInput('');
        setShowSuggestions(false);
      } else {
        alert('Location not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get icon for suggestion type
  const getSuggestionIcon = (placeType: string[]) => {
    if (placeType.includes('neighborhood')) return <MapPin className="w-4 h-4" />;
    if (placeType.includes('postcode')) return <Hash className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  // Get suggestion display text
  const getSuggestionText = (suggestion: SearchSuggestion) => {
    const parts = suggestion.place_name.split(', ');
    if (parts.length >= 2) {
      return `${parts[0]}, ${parts[parts.length - 1]}`;
    }
    return suggestion.place_name;
  };

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-sky-100 shadow-sm">
      {/* Top Bar - Search */}
      <div className="w-full px-6 py-3">
        <div className="flex items-center justify-center gap-4">
          {/* Search Input with Autocompletion */}
          <div className="relative" style={{ width: '500px' }}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Postcode, suburb, region, state or territory"
              value={searchInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              className="w-full px-4 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400"
            />
            
            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div 
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50"
              >
                {isLoading ? (
                  <div className="px-4 py-3 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sky-500 mx-auto"></div>
                    <span className="ml-2">Searching...</span>
                  </div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => (
                    <div
                      key={suggestion.id}
                      className={`px-4 py-3 cursor-pointer hover:bg-sky-50 transition-colors ${
                        index === selectedIndex ? 'bg-sky-100' : ''
                      }`}
                      onClick={() => handleSuggestionSelect(suggestion)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-sky-600">
                          {getSuggestionIcon(suggestion.place_type)}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {getSuggestionText(suggestion)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {suggestion.place_name}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-center text-gray-500">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Search Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSearchClick}
            className="text-sky-600 border-sky-600 hover:bg-sky-50 px-5 py-[0.55rem] rounded-lg whitespace-nowrap flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </Button>

          {/* Suburb List Button */}
          {onSuburbListClick && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onSuburbListClick}
              className="text-sky-600 border-sky-600 hover:bg-sky-50 px-4 py-2 rounded-lg whitespace-nowrap flex items-center gap-2"
            >
              <Hash className="w-4 h-4" />
              Suburb List
            </Button>
          )}
        </div>
      </div>

      {/* Bottom Bar - Chips */}
      <div className="w-full px-6 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-center gap-6 max-w-5xl mx-auto">
          {/* Strategy Chip */}
          <div className="flex-shrink-0" style={{ minWidth: '260px', maxWidth: '320px' }}>
            <StrategyChip 
              onAdjustStrategy={onStrategyClick}
              onManagePresets={() => {
                // TODO: Implement manage presets modal
                // Manage presets clicked
              }}
            />
          </div>

          {/* Location Chip */}
          <div className="flex-shrink-0" style={{ minWidth: '260px', maxWidth: '320px' }}>
            <LocationChip 
              onFocusSearch={() => searchInputRef.current?.focus()}
              onClearScope={() => {
                setLocationScope({ type: 'all-suburbs' });
              }}
            />
          </div>

          {/* Filters Chip - Only show in properties flow */}
          <div className="flex-shrink-0" style={{ minWidth: '260px', maxWidth: '320px' }}>
            <FiltersChip 
              isInPropertiesFlow={isInPropertiesFlow}
              onEditFilters={() => {
                // TODO: Navigate to property filters view
                // Edit filters clicked
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 