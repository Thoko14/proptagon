import React from 'react';
import GrowMap from './GrowMap';
import { SuburbStrategyView } from './SuburbStrategyView';
import { PropertyFilterView } from './PropertyFilterView';
import { PropertyView } from './PropertyView';
import { CompareView } from './CompareView';
import { SuburbListView } from './SuburbListView';
import { SuburbDetailView } from './SuburbDetailView';
import { useGrowState } from '../hooks/useGrowState';

/**
 * GrowViewManager - Handles switching between different views in the Grow application
 * This component was deleted during refactoring but is essential for the app to function
 */
export const GrowViewManager: React.FC = () => {
  const { navigation } = useGrowState();
  const { viewMode, selectedSuburb, selectedProperty } = navigation;

  // Render the appropriate view based on the current view mode
  const renderView = () => {
    switch (viewMode) {
      case 'map':
        return <GrowMap />;
      
      case 'strategy':
        return (
          <SuburbStrategyView 
            onBackToMap={navigation.backToMap}
            onCompareView={navigation.navigateToCompare}
          />
        );
      
      case 'property-filters':
        return (
          <PropertyFilterView 
            onApplyFilters={() => {/* TODO: implement */}}
            onBack={navigation.backToMap}
          />
        );
      
      case 'properties':
        return (
          <PropertyView 
            propertyId=""
            onBack={navigation.backToMap}
            onViewSuburb={navigation.navigateToSuburbDetail}
            onAddToCompare={() => {/* TODO: implement */}}
            onSaveProperty={() => {/* TODO: implement */}}
          />
        );
      
      case 'property-detail':
        return selectedProperty ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">Property detail view for: {selectedProperty}</p>
            <button 
              onClick={navigation.backToMap}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Map
            </button>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-600">No property selected</p>
          </div>
        );
      
      case 'compare':
        return (
          <CompareView 
            onBack={navigation.backToMap}
            mode="suburbs"
            items={[]}
            onRemoveItem={() => {/* TODO: implement */}}
            onReorderItems={() => {/* TODO: implement */}}
          />
        );
      
      case 'suburb-list':
        return (
          <SuburbListView 
            onBackToMap={navigation.backToMap}
            onViewSuburb={navigation.navigateToSuburbDetail}
            onCenterOnMap={() => {/* TODO: implement */}}
            onAddToCompare={() => {/* TODO: implement */}}
          />
        );
      
      case 'suburb-detail':
        return selectedSuburb ? (
          <SuburbDetailView 
            suburbId={selectedSuburb}
            onBackToMap={navigation.backToMap}
            onShowProperties={() => {/* TODO: implement */}}
            onAddToCompare={() => {/* TODO: implement */}}
            onAdjustStrategy={() => {/* TODO: implement */}}
          />
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-600">No suburb selected</p>
          </div>
        );
      
      default:
        return <GrowMap />;
    }
  };

  return (
    <div className="flex-1 overflow-hidden">
      {renderView()}
    </div>
  );
};
