import React, { useState } from 'react';
import Button from '../../../../platform/src/components/Button';
import { useGrowStore } from '../store/growStore';

interface SuburbDetailViewProps {
  suburbId: string;
  onBackToMap: () => void;
  onShowProperties: () => void;
  onAddToCompare: () => void;
  onAdjustStrategy: () => void;
}

interface SuburbDetail {
  id: string;
  name: string;
  state: string;
  postcode: string;
  score: number;
  yield: number;
  vacancy: number;
  growth5y: number;
  seifa: number;
  stock: number;
  medianPrice: number;
  medianRent: number;
  population: number;
  avgAge: number;
  householdIncome: number;
  watchlisted: boolean;
}

export const SuburbDetailView: React.FC<SuburbDetailViewProps> = ({
  suburbId,
  onBackToMap,
  onShowProperties,
  onAddToCompare,
  onAdjustStrategy
}) => {
  const { presets, activeStrategyId } = useGrowStore();
  const activeStrategy = presets.find(p => p.id === activeStrategyId);
  
  // Mock suburb data - in real implementation this would come from the store or API
  const [suburb] = useState<SuburbDetail>({
    id: suburbId,
    name: 'Red Hill',
    state: 'QLD',
    postcode: '4059',
    score: 85,
    yield: 4.2,
    vacancy: 2.1,
    growth5y: 12.5,
    seifa: 8,
    stock: 15,
    medianPrice: 850000,
    medianRent: 650,
    population: 12500,
    avgAge: 38,
    householdIncome: 125000,
    watchlisted: false
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'demographics' | 'infrastructure'>('overview');
  const [isWatchlisted, setIsWatchlisted] = useState(suburb.watchlisted);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'trends', label: 'Trends' },
    { id: 'demographics', label: 'Demographics' },
    { id: 'infrastructure', label: 'Infrastructure' }
  ];

  const handleWatchlistToggle = () => {
    setIsWatchlisted(!isWatchlisted);
    // In real implementation, this would call an API to update the watchlist
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-600">Median Price</div>
          <div className="text-2xl font-bold text-gray-900">${suburb.medianPrice.toLocaleString()}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-600">Median Rent</div>
          <div className="text-2xl font-bold text-gray-900">${suburb.medianRent}/week</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-600">Population</div>
          <div className="text-2xl font-bold text-gray-900">{suburb.population.toLocaleString()}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-600">Avg Age</div>
          <div className="text-2xl font-bold text-gray-900">{suburb.avgAge}</div>
        </div>
      </div>

      {/* KPI Scores */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">KPI Performance</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{suburb.score}</div>
            <div className="text-sm text-gray-600">Overall Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{suburb.yield}%</div>
            <div className="text-sm text-gray-600">Yield</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{suburb.growth5y}%</div>
            <div className="text-sm text-gray-600">5Y Growth</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{suburb.vacancy}%</div>
            <div className="text-sm text-gray-600">Vacancy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{suburb.seifa}/10</div>
            <div className="text-sm text-gray-600">SEIFA</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">{suburb.stock}</div>
            <div className="text-sm text-gray-600">Stock</div>
          </div>
        </div>
      </div>

      {/* Property Market Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Property Market</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Properties on Market:</span>
            <span className="font-medium">{suburb.stock}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Price Range:</span>
            <span className="font-medium">$650k - $1.2M</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Rent Range:</span>
            <span className="font-medium">$500 - $800/week</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Days on Market:</span>
            <span className="font-medium">28 days</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTrendsTab = () => (
    <div className="space-y-6">
      {/* Price Trends Chart Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Price Trends (5 Years)</h4>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-gray-500 text-center">
            <div className="text-2xl mb-2">📈</div>
            <div>Price Trends Chart</div>
            <div className="text-sm">Interactive chart showing median price changes over time</div>
          </div>
        </div>
      </div>

      {/* Growth Metrics */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Growth Metrics</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Capital Growth (5Y)</div>
            <div className="text-xl font-bold text-green-600">+{suburb.growth5y}%</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Rental Growth (1Y)</div>
            <div className="text-xl font-bold text-blue-600">+8.2%</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Population Growth</div>
            <div className="text-xl font-bold text-purple-600">+2.1%</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Infrastructure Investment</div>
            <div className="text-xl font-bold text-orange-600">$45M</div>
          </div>
        </div>
      </div>

      {/* Market Forecast */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Market Forecast</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">12 Month Outlook:</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Positive</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Expected Price Growth:</span>
            <span className="font-medium">+6-8%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Rental Demand:</span>
            <span className="font-medium">High</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Supply Pipeline:</span>
            <span className="font-medium">Limited</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDemographicsTab = () => (
    <div className="space-y-6">
      {/* Population Demographics */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Population Demographics</h4>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-2">Age Distribution</div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">18-34:</span>
                <span className="font-medium">28%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">35-49:</span>
                <span className="font-medium">32%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">50-64:</span>
                <span className="font-medium">25%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">65+:</span>
                <span className="font-medium">15%</span>
              </div>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-2">Household Composition</div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Families:</span>
                <span className="font-medium">45%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Couples:</span>
                <span className="font-medium">28%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Singles:</span>
                <span className="font-medium">27%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Economic Profile */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Economic Profile</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Median Household Income</div>
            <div className="text-xl font-bold text-gray-900">${suburb.householdIncome.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Employment Rate</div>
            <div className="text-xl font-bold text-gray-900">94.2%</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Education Level (Bachelor+)</div>
            <div className="text-xl font-bold text-gray-900">68%</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Home Ownership Rate</div>
            <div className="text-xl font-bold text-gray-900">72%</div>
          </div>
        </div>
      </div>

      {/* SEIFA Analysis */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">SEIFA Analysis</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Overall SEIFA Score:</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {suburb.seifa}/10
            </span>
          </div>
          <div className="text-sm text-gray-600">
            SEIFA (Socio-Economic Indexes for Areas) measures relative socio-economic advantage and disadvantage.
            A higher score indicates greater advantage.
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <div className="text-sm text-gray-600">Economic Resources</div>
              <div className="text-lg font-medium">8/10</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Education & Occupation</div>
              <div className="text-lg font-medium">7/10</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInfrastructureTab = () => (
    <div className="space-y-6">
      {/* Transport */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Transport & Connectivity</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Distance to CBD</div>
            <div className="text-lg font-medium">4.2 km</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Public Transport</div>
            <div className="text-lg font-medium">Excellent</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Bus Routes</div>
            <div className="text-lg font-medium">12 routes</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Train Stations</div>
            <div className="text-lg font-medium">2 stations</div>
          </div>
        </div>
      </div>

      {/* Education */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Education</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Primary Schools:</span>
            <span className="font-medium">3 (within 2km)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Secondary Schools:</span>
            <span className="font-medium">2 (within 3km)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Universities:</span>
            <span className="font-medium">2 (within 5km)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">NAPLAN Performance:</span>
            <span className="font-medium">Above Average</span>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Amenities & Services</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Shopping Centers</div>
            <div className="text-lg font-medium">3 major centers</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Hospitals</div>
            <div className="text-lg font-medium">2 hospitals</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Parks & Recreation</div>
            <div className="text-lg font-medium">8 parks</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Restaurants</div>
            <div className="text-lg font-medium">45+ venues</div>
          </div>
        </div>
      </div>

      {/* Future Development */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Future Development</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Infrastructure Projects:</span>
            <span className="font-medium">3 active</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Investment Value:</span>
            <span className="font-medium">$45M</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Completion Timeline:</span>
            <span className="font-medium">2025-2027</span>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Major projects include road upgrades, new community center, and enhanced public transport links.
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'trends':
        return renderTrendsTab();
      case 'demographics':
        return renderDemographicsTab();
      case 'infrastructure':
        return renderInfrastructureTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{suburb.name}</h1>
              <p className="text-gray-600">{suburb.state} {suburb.postcode}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant={isWatchlisted ? "primary" : "outline"}
                size="sm"
                onClick={handleWatchlistToggle}
              >
                {isWatchlisted ? '✓ Watchlisted' : 'Add to Watchlist'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onBackToMap}
              >
                Back to Map
              </Button>
            </div>
          </div>
          
          {/* Score Display */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Overall Score:</span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-bold ${
                suburb.score >= 80 ? 'bg-green-100 text-green-800' :
                suburb.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {suburb.score}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Based on {activeStrategy?.name || 'current'} strategy
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Right Rail */}
      <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        
        <div className="space-y-4">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={onShowProperties}
          >
            Show Properties Here
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={onAddToCompare}
          >
            Add to Compare
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={onAdjustStrategy}
          >
            Adjust Strategy
          </Button>
        </div>

        {/* Suburb Summary */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Suburb Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Median Price:</span>
              <span className="font-medium">${suburb.medianPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Yield:</span>
              <span className="font-medium">{suburb.yield}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Vacancy:</span>
              <span className="font-medium">{suburb.vacancy}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">5Y Growth:</span>
              <span className="font-medium">{suburb.growth5y}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">SEIFA:</span>
              <span className="font-medium">{suburb.seifa}/10</span>
            </div>
          </div>
        </div>

        {/* Market Insights */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Market Insight</h4>
          <p className="text-sm text-blue-800">
            {suburb.name} shows strong fundamentals with above-average yield and growth potential. 
            The suburb benefits from excellent infrastructure and proximity to major employment centers.
          </p>
        </div>
      </div>
    </div>
  );
};
