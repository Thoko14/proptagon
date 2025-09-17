import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useGrowState } from '../hooks/useGrowState';

export const BackNavigation: React.FC = () => {
  const { navigation } = useGrowState();
  const { viewMode, isMapView, backToMap } = navigation;

  // Only show back navigation when not on map view
  if (isMapView) return null;

  const getViewTitle = () => {
    switch (viewMode) {
      case 'strategy':
        return 'Strategy';
      case 'property-filters':
        return 'Property Filters';
      case 'properties':
        return 'Properties';
      case 'property-detail':
        return 'Property Details';
      case 'compare':
        return 'Compare';
      case 'suburb-list':
        return 'Suburb List';
      case 'suburb-detail':
        return 'Suburb Details';
      default:
        return 'Back';
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-white border-b border-gray-200">
      <button
        onClick={backToMap}
        className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Map</span>
      </button>
      
      <div className="h-6 w-px bg-gray-300" />
      
      <h1 className="text-lg font-semibold text-gray-900">
        {getViewTitle()}
      </h1>
    </div>
  );
};
