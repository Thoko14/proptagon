import React from 'react';
import { useGrowState } from '../hooks/useGrowState';
import { GrowTopBar } from './GrowTopBar';
import { StrategyChip } from './StrategyChip';
import { FiltersChip } from './FiltersChip';
import { LocationChip } from './LocationChip';

export const GrowTopNavigation: React.FC = () => {
  const { navigation } = useGrowState();
  const { isMapView } = navigation;

  return (
    <div className="flex flex-col gap-4 p-4 bg-white border-b border-gray-200">
      {/* Top Bar with Search */}
      <GrowTopBar 
        onSearch={() => {}} 
        onSuburbSearch={() => {}}
        onStrategyClick={() => {}}
      />
      
      {/* Navigation Chips */}
      <div className="flex flex-wrap gap-2">
        <StrategyChip />
        <FiltersChip />
        <LocationChip />
      </div>
      
      {/* View Mode Tabs */}
      {isMapView && (
        <div className="flex gap-2">
          <button
            onClick={() => navigation.navigateToStrategy()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Strategy
          </button>
          <button
            onClick={() => navigation.navigateToSuburbList()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Suburb List
          </button>
          <button
            onClick={() => navigation.navigateToCompare()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Compare
          </button>
        </div>
      )}
      
      {/* Layer Controls - removed unavailable controls */}
    </div>
  );
};
