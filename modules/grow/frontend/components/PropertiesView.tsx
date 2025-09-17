import React, { useState } from 'react';
import Button from '../../../../platform/src/components/Button';
import { StrategyChip } from './StrategyChip';
import { FiltersChip } from './FiltersChip';
import { LocationChip } from './LocationChip';
// Removed unused import
import { Heart, BarChart3 } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  price: number;
  image: string;
  beds: number;
  baths: number;
  parking: number;
  propertyType: string;
  landSize?: number;
  suburbScore: number;
  yieldEstimate: number;
  priceVsMedian: number;
  daysOnMarket: number;
  address: string;
  suburb: string;
}

interface PropertiesViewProps {
  onBack: () => void;
  onPropertyClick: (propertyId: string) => void;
  properties: Property[];
  totalCount: number;
}

export const PropertiesView: React.FC<PropertiesViewProps> = ({
  onBack,
  onPropertyClick,
  properties,
  totalCount
}) => {
  const [sortBy, setSortBy] = useState<'newest' | 'price' | 'yield' | 'priceVsMedian'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Removed unused store variables

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price.toLocaleString()}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriceVsMedianColor = (diff: number) => {
    if (diff <= -10) return 'text-green-600';
    if (diff <= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const sortedProperties = [...properties].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'yield':
        return b.yieldEstimate - a.yieldEstimate;
      case 'priceVsMedian':
        return a.priceVsMedian - b.priceVsMedian;
      case 'newest':
      default:
        return 0; // Assuming properties are already sorted by newest
    }
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            ← Back
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">
            Properties ({totalCount.toLocaleString()})
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Chips Bar */}
      <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
        <StrategyChip />
        <FiltersChip />
        <LocationChip />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Showing {properties.length} of {totalCount} properties
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="newest">Newest</option>
            <option value="price">Price</option>
            <option value="yield">Yield Est.</option>
            <option value="priceVsMedian">Price vs Median</option>
          </select>
        </div>
      </div>

      {/* Properties Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onClick={() => onPropertyClick(property.id)}
              formatPrice={formatPrice}
              getScoreColor={getScoreColor}
              getPriceVsMedianColor={getPriceVsMedianColor}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedProperties.map((property) => (
            <PropertyListCard
              key={property.id}
              property={property}
              onClick={() => onPropertyClick(property.id)}
              formatPrice={formatPrice}
              getScoreColor={getScoreColor}
              getPriceVsMedianColor={getPriceVsMedianColor}
            />
          ))}
        </div>
      )}

      {/* Load More */}
      {properties.length < totalCount && (
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Properties
          </Button>
        </div>
      )}
    </div>
  );
};

// Property Card Component
const PropertyCard: React.FC<{
  property: Property;
  onClick: () => void;
  formatPrice: (price: number) => string;
  getScoreColor: (score: number) => string;
  getPriceVsMedianColor: (diff: number) => string;
}> = ({ property, onClick, formatPrice, getScoreColor, getPriceVsMedianColor }) => {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={property.image || 'https://via.placeholder.com/300x200?text=Property'}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        
        {/* Suburb Score Badge */}
        <div className="absolute top-3 left-3 bg-white rounded-full px-2 py-1 shadow-sm">
          <span className={`text-xs font-semibold ${getScoreColor(property.suburbScore)}`}>
            {property.suburbScore}/100
          </span>
        </div>
        
        {/* Save Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsSaved(!isSaved);
          }}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm hover:bg-gray-50"
        >
          <Heart 
            size={16} 
            className={isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'} 
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {property.title}
        </h3>
        
        <div className="text-2xl font-bold text-gray-900 mb-3">
          {formatPrice(property.price)}
        </div>
        
        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <span>{property.beds} bed</span>
          <span>{property.baths} bath</span>
          <span>{property.parking} car</span>
        </div>
        
        {/* Address */}
        <div className="text-sm text-gray-600 mb-3">
          {property.address}, {property.suburb}
        </div>
        
        {/* KPIs */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-semibold text-gray-900">{property.yieldEstimate}%</div>
            <div className="text-gray-600">Yield</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className={`font-semibold ${getPriceVsMedianColor(property.priceVsMedian)}`}>
              {property.priceVsMedian > 0 ? '+' : ''}{property.priceVsMedian}%
            </div>
            <div className="text-gray-600">vs Median</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-semibold text-gray-900">{property.daysOnMarket}</div>
            <div className="text-gray-600">Days</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Property List Card Component
const PropertyListCard: React.FC<{
  property: Property;
  onClick: () => void;
  formatPrice: (price: number) => string;
  getScoreColor: (score: number) => string;
  getPriceVsMedianColor: (diff: number) => string;
}> = ({ property, onClick, formatPrice, getScoreColor, getPriceVsMedianColor }) => {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex gap-4">
        {/* Image */}
        <div className="relative w-32 h-24 bg-gray-200 rounded-lg flex-shrink-0">
          <img
            src={property.image || 'https://via.placeholder.com/128x96?text=Property'}
            alt={property.title}
            className="w-full h-full object-cover rounded-lg"
          />
          
          {/* Suburb Score Badge */}
          <div className="absolute top-1 left-1 bg-white rounded-full px-2 py-1 shadow-sm">
            <span className={`text-xs font-semibold ${getScoreColor(property.suburbScore)}`}>
              {property.suburbScore}/100
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 line-clamp-2">
              {property.title}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsSaved(!isSaved);
              }}
              className="ml-2 flex-shrink-0"
            >
              <Heart 
                size={16} 
                className={isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'} 
              />
            </button>
          </div>
          
          <div className="text-xl font-bold text-gray-900 mb-2">
            {formatPrice(property.price)}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <span>{property.beds} bed</span>
            <span>{property.baths} bath</span>
            <span>{property.parking} car</span>
            <span className="capitalize">{property.propertyType}</span>
          </div>
          
          <div className="text-sm text-gray-600 mb-3">
            {property.address}, {property.suburb}
          </div>
          
          {/* KPIs Row */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1">
              <BarChart3 size={14} className="text-gray-500" />
              <span className="font-medium">{property.yieldEstimate}% yield</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`font-medium ${getPriceVsMedianColor(property.priceVsMedian)}`}>
                {property.priceVsMedian > 0 ? '+' : ''}{property.priceVsMedian}% vs median
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">{property.daysOnMarket} days on market</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
