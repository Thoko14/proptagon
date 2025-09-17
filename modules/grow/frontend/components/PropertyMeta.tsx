import React from 'react';
import { PropertyDetail } from '../types';
import { formatDate, formatPrice } from '../utils/propertyFormatters';

interface PropertyMetaProps {
  property: PropertyDetail;
}

export const PropertyMeta: React.FC<PropertyMetaProps> = ({ property }) => {
  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Listing ID</span>
          <span className="text-gray-900">{property.listingId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Listed</span>
          <span className="text-gray-900">{formatDate(property.listingDate)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Days on Market</span>
          <span className="text-gray-900">{property.daysOnMarket}</span>
        </div>
        {property.lastSaleDate && (
          <div className="flex justify-between">
            <span className="text-gray-600">Last Sale</span>
            <span className="text-gray-900">
              {formatDate(property.lastSaleDate)} - {formatPrice(property.lastSalePrice!)}
            </span>
          </div>
        )}
        {property.zoning && (
          <div className="flex justify-between">
            <span className="text-gray-600">Zoning</span>
            <span className="text-gray-900">{property.zoning}</span>
          </div>
        )}
        {property.nbn && (
          <div className="flex justify-between">
            <span className="text-gray-600">NBN</span>
            <span className="text-gray-900">{property.nbn}</span>
          </div>
        )}
      </div>
    </div>
  );
};
