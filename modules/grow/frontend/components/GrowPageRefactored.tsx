import React from 'react';
import { useGrowState } from '../hooks/useGrowState';
import { GrowTopNavigation } from './GrowTopNavigation';
// GrowViewManager was deleted
import { BackNavigation } from './BackNavigation';
import { SuburbToolkit } from './SuburbToolkit';
import { PropertiesFab } from './PropertiesFab';

export const GrowPageRefactored: React.FC = () => {
  const { isLoading, error, clearError } = useGrowState();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Display */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700">Loading...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col h-screen">
        {/* Top Navigation */}
        <GrowTopNavigation />
        
        {/* Back Navigation (when not on map) */}
        <BackNavigation />
        
        {/* Main View Area */}
        <div className="flex-1 overflow-hidden">
          {/* GrowViewManager was deleted - placeholder */}
        </div>
      </div>

      {/* Floating Components */}
      <SuburbToolkit />
      <PropertiesFab />
    </div>
  );
};
