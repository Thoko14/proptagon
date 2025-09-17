import React, { useState } from 'react';
import Button from '../../../../platform/src/components/Button';
// Removed unused import
import { useGrowStore } from '../store/growStore';
import { Save, Filter } from 'lucide-react';

interface PropertyFilterViewProps {
  onApplyFilters: () => void;
  onBack: () => void;
}

export const PropertyFilterView: React.FC<PropertyFilterViewProps> = ({
  onApplyFilters,
  onBack
}) => {
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    beds: '',
    baths: '',
    parking: '',
    propertyType: [] as string[],
    landSize: '',
    keywords: '',
    highYield: false,
    underMedian: false,
    longDOM: false,
    devHints: false
  });

  const [searchName, setSearchName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const { 
    addSavedSearch, 
    setDefaultSavedSearch, 
    userPrefs, 
    updateUserPrefs 
  } = useGrowStore();

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePropertyTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setFilters(prev => ({ 
        ...prev, 
        propertyType: [...prev.propertyType, type] 
      }));
    } else {
      setFilters(prev => ({ 
        ...prev, 
        propertyType: prev.propertyType.filter(t => t !== type) 
      }));
    }
  };

  const handleSaveSearch = () => {
    if (!searchName.trim()) return;
    
    const newSearch = {
      id: `search-${Date.now()}`,
      name: searchName,
      filters: {
        ...filters,
        priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
        priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
        beds: filters.beds ? Number(filters.beds) : undefined,
        baths: filters.baths ? Number(filters.baths) : undefined,
        parking: filters.parking ? Number(filters.parking) : undefined,
        landSize: filters.landSize ? Number(filters.landSize) : undefined
      },
      isDefault: false
    };
    
    addSavedSearch(newSearch);
    setSearchName('');
    setShowSaveDialog(false);
  };

  const handleSetAsDefault = () => {
    if (searchName.trim()) {
      const newSearch = {
        id: `search-${Date.now()}`,
        name: searchName,
        filters: {
          ...filters,
          priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
          priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
          beds: filters.beds ? Number(filters.beds) : undefined,
          baths: filters.baths ? Number(filters.baths) : undefined,
          parking: filters.parking ? Number(filters.parking) : undefined,
          landSize: filters.landSize ? Number(filters.landSize) : undefined
        },
        isDefault: true
      };
      
      addSavedSearch(newSearch);
      setDefaultSavedSearch(newSearch.id);
      setSearchName('');
      setShowSaveDialog(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            ← Back
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">Property Filters</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowSaveDialog(true)}
            className="flex items-center gap-2"
          >
            <Save size={16} />
            Save Search
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onApplyFilters}
            className="flex items-center gap-2"
          >
            <Filter size={16} />
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Location Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Location Scope</h3>
        <div className="text-sm text-gray-600">
          Location scope: All suburbs
        </div>
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Price Range */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Price Range</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceMin}
              onChange={(e) => handleFilterChange('priceMin', e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
            />
            <span className="text-gray-500 self-center">to</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.priceMax}
              onChange={(e) => handleFilterChange('priceMax', e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
          <select
            value={filters.beds}
            onChange={(e) => handleFilterChange('beds', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        {/* Bathrooms */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
          <select
            value={filters.baths}
            onChange={(e) => handleFilterChange('baths', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>

        {/* Parking */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Parking</label>
          <select
            value={filters.parking}
            onChange={(e) => handleFilterChange('parking', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
          </select>
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Property Type</label>
          <div className="space-y-2">
            {['house', 'unit', 'townhouse', 'apartment'].map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.propertyType.includes(type)}
                  onChange={(e) => handlePropertyTypeChange(type, e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Land Size */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Land Size (sqm)</label>
          <input
            type="number"
            placeholder="Min size"
            value={filters.landSize}
            onChange={(e) => handleFilterChange('landSize', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        {/* Keywords */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Keywords</label>
          <input
            type="text"
            placeholder="e.g., renovated, pool, views"
            value={filters.keywords}
            onChange={(e) => handleFilterChange('keywords', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>

      {/* Toggle Filters */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 mb-3">Smart Filters</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.highYield}
              onChange={(e) => handleFilterChange('highYield', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-blue-900">High Yield</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.underMedian}
              onChange={(e) => handleFilterChange('underMedian', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-blue-900">Under Median</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.longDOM}
              onChange={(e) => handleFilterChange('longDOM', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-blue-900">Long DOM</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.devHints}
              onChange={(e) => handleFilterChange('devHints', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-blue-900">Dev Hints</span>
          </label>
        </div>
      </div>

      {/* Skip Filters Preference */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Skip Filters When Default</h3>
            <p className="text-sm text-gray-600">
              Automatically skip this screen when a default saved search is set
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={userPrefs.skipFiltersWhenDefault}
              onChange={(e) => updateUserPrefs({ skipFiltersWhenDefault: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
          </label>
        </div>
      </div>

      {/* Save Search Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Save Search</h3>
            <input
              type="text"
              placeholder="Enter search name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSaveDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSaveSearch}
                className="flex-1"
              >
                Save
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSetAsDefault}
                className="flex-1"
              >
                Set as Default
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
