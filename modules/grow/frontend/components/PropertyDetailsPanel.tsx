import React from 'react';
import { 
  MapPin, 
  // Removed unused Calendar import 
  Home,
  Car,
  Bath,
  Bed,
  Ruler,
  Star
} from 'lucide-react';
import { PropertyDetail } from '../types';

interface PropertyDetailsPanelProps {
  property: PropertyDetail;
  showFullDescription: boolean;
  onToggleDescription: () => void;
  daysAgo: number;
}

export const PropertyDetailsPanel: React.FC<PropertyDetailsPanelProps> = ({
  property,
  showFullDescription,
  onToggleDescription,
  daysAgo
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'for-sale': { label: 'For Sale', className: 'bg-green-100 text-green-800' },
      'auction': { label: 'Auction', className: 'bg-orange-100 text-orange-800' },
      'under-offer': { label: 'Under Offer', className: 'bg-blue-100 text-blue-800' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['for-sale'];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Property Header */}
      <div className="bg-white rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {property.title}
            </h2>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{property.address}, {property.suburb}</span>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(property.status)}
              <span className="text-sm text-gray-500">
                Listed {daysAgo} days ago
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">
              {property.priceDisplay || formatPrice(property.price)}
            </div>
            {property.priceVsMedian !== 0 && (
              <div className={`text-sm ${property.priceVsMedian < 0 ? 'text-green-600' : 'text-red-600'}`}>
                {property.priceVsMedian > 0 ? '+' : ''}{property.priceVsMedian}% vs suburb median
              </div>
            )}
          </div>
        </div>

        {/* Core Facts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Bed className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">{property.beds} beds</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">{property.baths} baths</span>
          </div>
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">{property.parking} parking</span>
          </div>
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600 capitalize">{property.propertyType}</span>
          </div>
        </div>

        {property.landSize && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Ruler className="w-4 h-4" />
            <span>Land: {property.landSize}m²</span>
            {property.internalSize && (
              <>
                <span>•</span>
                <span>Internal: {property.internalSize}m²</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
        <div className="text-gray-700 leading-relaxed">
          {showFullDescription ? (
            property.description
          ) : (
            property.description.length > 200 
              ? `${property.description.substring(0, 200)}...`
              : property.description
          )}
        </div>
        {property.description.length > 200 && (
          <button
            onClick={onToggleDescription}
            className="text-sky-600 hover:text-sky-700 text-sm font-medium mt-2"
          >
            {showFullDescription ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Features */}
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {property.features?.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
              <Star className="w-4 h-4 text-sky-500" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
