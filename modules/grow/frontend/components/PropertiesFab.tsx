import React from 'react';
import { MapPin, X } from 'lucide-react';
import { useGrowState } from '../hooks/useGrowState';

export const PropertiesFab: React.FC = () => {
  const { fab, navigation } = useGrowState();
  const { fabState, isFabVisible, hideFab } = fab;
  const { navigateToPropertyFilters } = navigation;

  if (!isFabVisible) return null;

  const handleShowProperties = () => {
    if (fabState.locationScope === 'viewport') {
      navigateToPropertyFilters();
    } else if (fabState.locationScope === 'suburb' && fabState.suburbId) {
      // TODO: Navigate to properties view with suburb filter
      navigateToPropertyFilters();
    }
    hideFab();
  };

  const getFabText = () => {
    if (fabState.locationScope === 'viewport') {
      return 'Show Properties Here';
    } else if (fabState.locationScope === 'suburb') {
      return 'Show Properties in Suburb';
    }
    return 'Show Properties';
  };

  return (
    <div
      className="fixed z-50 flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-all duration-200"
      style={{
        left: fabState.position?.x || 0,
        top: fabState.position?.y || 0,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <MapPin className="w-5 h-5" />
      <span className="text-sm font-medium whitespace-nowrap">
        {getFabText()}
      </span>
      <button
        onClick={hideFab}
        className="ml-2 p-1 hover:bg-blue-500 rounded-full transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      <button
        onClick={handleShowProperties}
        className="ml-2 px-3 py-1 bg-white text-blue-600 text-xs font-medium rounded-full hover:bg-gray-100 transition-colors"
      >
        Go
      </button>
    </div>
  );
};
