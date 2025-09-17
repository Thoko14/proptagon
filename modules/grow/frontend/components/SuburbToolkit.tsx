import React from 'react';
import { X, MapPin, BarChart3, Building2, TrendingUp } from 'lucide-react';
import { useGrowState } from '../hooks/useGrowState';
// Removed unused import

export const SuburbToolkit: React.FC = () => {
  const { toolkit, navigation, compare } = useGrowState();
  const { toolkitSuburb, toolkitPosition, isToolkitVisible, hideToolkit } = toolkit;
  const { navigateToSuburbDetail, navigateToPropertyFilters } = navigation;

  if (!isToolkitVisible || !toolkitSuburb) return null;

  const handleViewSuburb = () => {
    navigateToSuburbDetail(toolkitSuburb.id);
    hideToolkit();
  };

  const handleShowProperties = () => {
    // TODO: Navigate to properties view with suburb filter
    navigateToPropertyFilters();
    hideToolkit();
  };

  const handleAddToCompare = () => {
    // Convert SuburbToolkitData to Suburb for comparison
    const suburbForCompare = {
      id: toolkitSuburb.id,
      name: toolkitSuburb.name,
      score: toolkitSuburb.score,
      yield: toolkitSuburb.kpis.yield,
      vacancy: toolkitSuburb.kpis.vacancy,
      growth5y: toolkitSuburb.kpis.growth5y,
      seifa: 0, // Mock data
      stockOnMarket: 0, // Mock data
      medianPrice: 0, // Mock data
      state: 'NSW' // Mock data
    };
    compare.addToCompare(suburbForCompare);
  };

  const isInCompare = compare.isInCompare(toolkitSuburb.id);

  return (
    <div
      className="fixed z-40 w-80 bg-white rounded-lg shadow-xl border border-gray-200"
      style={{
        left: toolkitPosition?.x || 0,
        top: toolkitPosition?.y || 0,
        transform: 'translate(-50%, -100%)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {toolkitSuburb.name}
          </h3>
        </div>
        <button
          onClick={hideToolkit}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Score Card */}
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-gray-600">Investment Score</div>
          <div className="text-2xl font-bold text-blue-600">
            {toolkitSuburb.score}/100
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <BarChart3 className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-sm text-gray-600">Yield</div>
            <div className="text-lg font-semibold text-gray-900">
              {toolkitSuburb.kpis.yield}%
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <BarChart3 className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-sm text-gray-600">Growth</div>
            <div className="text-lg font-semibold text-gray-900">
              {toolkitSuburb.kpis.growth5y}%
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Building2 className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <div className="text-sm text-gray-600">Vacancy</div>
            <div className="text-lg font-semibold text-gray-900">
              {toolkitSuburb.kpis.vacancy}%
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={handleViewSuburb}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            View Suburb Details
          </button>
          
          <button
            onClick={handleShowProperties}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Show Properties
          </button>
          
          <button
            onClick={handleAddToCompare}
            disabled={isInCompare}
            className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              isInCompare
                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
            }`}
          >
            {isInCompare ? 'Added to Compare' : 'Add to Compare'}
          </button>
        </div>
      </div>
    </div>
  );
};
