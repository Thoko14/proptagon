import React from 'react';
import Button from '../../../../platform/src/components/Button';
import { X, BarChart3, TrendingUp, Home, MapPin, Download, Award } from 'lucide-react';
import type { Suburb, Property } from '../types';

interface CompareViewProps {
  onBack: () => void;
  mode: 'suburbs' | 'properties';
  items: (Suburb | Property)[];
  onRemoveItem: (id: string) => void;
  onReorderItems: (items: (Suburb | Property)[]) => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  onBack,
  mode,
  items,
  onRemoveItem,
  onReorderItems
}) => {
  // Removed unused sortBy state

  // Helper functions to identify best values
  const getBestValue = (items: (Suburb | Property)[], key: string, isHigherBetter: boolean = true) => {
    if (items.length === 0) return null;
    
    const values = items.map(item => {
      const value = item[key as keyof typeof item];
      return typeof value === 'number' ? value : null;
    }).filter(v => v !== null) as number[];
    
    if (values.length === 0) return null;
    
    return isHigherBetter ? Math.max(...values) : Math.min(...values);
  };

  const isBestValue = (value: number, bestValue: number | null, key: string) => {
    if (bestValue === null) return false;
    
    // For some KPIs, lower is better (vacancy, days on market, price vs median)
    const lowerIsBetter = ['vacancy', 'daysOnMarket', 'priceVsMedian'];
    const isLowerBetter = lowerIsBetter.includes(key);
    
    if (isLowerBetter) {
      return value === bestValue;
    } else {
      return value === bestValue;
    }
  };

  const handleRemoveItem = (id: string) => {
    onRemoveItem(id);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newItems = [...items];
    const [removed] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, removed);
    onReorderItems(newItems);
  };

  const handleExport = () => {
    // Enhanced export functionality with best value indicators
    if (mode === 'suburbs') {
      exportSuburbsComparison(items as Suburb[]);
    } else {
      exportPropertiesComparison(items as Property[]);
    }
  };

  const exportSuburbsComparison = (suburbs: Suburb[]) => {
    const kpiRows = [
      { key: 'score', label: 'Investment Score' },
      { key: 'yield', label: 'Rental Yield' },
      { key: 'vacancy', label: 'Vacancy Rate' },
      { key: 'growth5y', label: '5Y Growth' },
      { key: 'seifa', label: 'SEIFA Index' },
      { key: 'stockOnMarket', label: 'Stock on Market' },
      { key: 'medianPrice', label: 'Median Price' }
    ];

    let csvContent = 'KPI,';
    csvContent += suburbs.map(s => s.name).join(',') + '\n';

    kpiRows.forEach(row => {
      const values = suburbs.map(s => s[row.key as keyof Suburb]);
      const bestValue = getBestValue(suburbs, row.key, row.key !== 'vacancy');
      
      csvContent += row.label + ',';
      csvContent += values.map((value) => {
        const isBest = isBestValue(value as number, bestValue, row.key);
        return `${value}${isBest ? ' (BEST)' : ''}`;
      }).join(',') + '\n';
    });

    downloadCSV(csvContent, `suburbs-comparison-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportPropertiesComparison = (properties: Property[]) => {
    const featureRows = [
      { key: 'title', label: 'Title' },
      { key: 'price', label: 'Price' },
      { key: 'suburb', label: 'Suburb' },
      { key: 'suburbScore', label: 'Suburb Score' },
      { key: 'yield', label: 'Yield Est.' },
      { key: 'priceVsMedian', label: 'Price vs Median' },
      { key: 'daysOnMarket', label: 'Days on Market' },
      { key: 'beds', label: 'Bedrooms' },
      { key: 'baths', label: 'Bathrooms' },
      { key: 'parking', label: 'Parking' },
      { key: 'propertyType', label: 'Type' },
      { key: 'address', label: 'Address' }
    ];

    let csvContent = 'Feature,';
    csvContent += properties.map(p => p.title).join(',') + '\n';

    featureRows.forEach(row => {
      const values = properties.map(p => p[row.key as keyof Property]);
      const bestValue = getBestValue(properties, row.key, row.key !== 'daysOnMarket' && row.key !== 'priceVsMedian');
      
      csvContent += row.label + ',';
      csvContent += values.map((value) => {
        const isBest = typeof value === 'number' ? isBestValue(value, bestValue, row.key) : false;
        return `${value}${isBest ? ' (BEST)' : ''}`;
      }).join(',') + '\n';
    });

    downloadCSV(csvContent, `properties-comparison-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  const getGrowthColor = (growth: number) => {
    if (growth >= 5) return 'text-green-600';
    if (growth >= 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (items.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 text-center">
        <div className="bg-gray-50 rounded-lg p-12">
          <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items to compare</h3>
          <p className="text-gray-600 mb-4">
            Add {mode === 'suburbs' ? 'suburbs' : 'properties'} to start comparing
          </p>
          <Button variant="primary" onClick={onBack}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            ← Back
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">
            Compare {mode === 'suburbs' ? 'Suburbs' : 'Properties'}
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6 w-fit">
        <button
          onClick={() => {/* Switch to suburbs mode */}}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'suburbs' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Suburbs
        </button>
        <button
          onClick={() => {/* Switch to properties mode */}}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'properties' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Properties
        </button>
      </div>

      {/* Best Value Legend */}
      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-green-800">
          <Award size={16} className="text-green-600" />
          <span className="font-medium">Best Values Highlighted</span>
          <span className="text-green-600">•</span>
          <span>Green background and award icon indicate the best performance for each metric</span>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {mode === 'suburbs' ? (
          <SuburbsComparisonTable
            suburbs={items as Suburb[]}
            onRemove={handleRemoveItem}
            onReorder={handleReorder}
            formatPrice={formatPrice}
            getScoreColor={getScoreColor}
            getGrowthColor={getGrowthColor}
            getBestValue={getBestValue}
            isBestValue={isBestValue}
          />
        ) : (
          <PropertiesComparisonTable
            properties={items as Property[]}
            onRemove={handleRemoveItem}
            onReorder={handleReorder}
            formatPrice={formatPrice}
            getScoreColor={getScoreColor}
            getBestValue={getBestValue}
            isBestValue={isBestValue}
          />
        )}
      </div>
    </div>
  );
};

// Suburbs Comparison Table
const SuburbsComparisonTable: React.FC<{
  suburbs: Suburb[];
  onRemove: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  formatPrice: (price: number) => string;
  getScoreColor: (score: number) => string;
  getGrowthColor: (growth: number) => string;
  getBestValue: (items: (Suburb | Property)[], key: string, isHigherBetter?: boolean) => number | null;
  isBestValue: (value: number, bestValue: number | null, key: string) => boolean;
}> = ({ suburbs, onRemove, formatPrice, getScoreColor, getGrowthColor, getBestValue, isBestValue }) => {
  const kpiRows = [
    { key: 'score', label: 'Investment Score', icon: BarChart3, format: (value: number) => `${value}/100` },
    { key: 'yield', label: 'Rental Yield', icon: TrendingUp, format: (value: number) => `${value}%` },
    { key: 'vacancy', label: 'Vacancy Rate', icon: Home, format: (value: number) => `${value}%` },
    { key: 'growth5y', label: '5Y Growth', icon: TrendingUp, format: (value: number) => `${value}%` },
    { key: 'seifa', label: 'SEIFA Index', icon: BarChart3, format: (value: number) => value.toString() },
    { key: 'stockOnMarket', label: 'Stock on Market', icon: Home, format: (value: number) => value.toString() },
    { key: 'medianPrice', label: 'Median Price', icon: MapPin, format: formatPrice }
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 w-48">
              KPI
            </th>
            {suburbs.map((suburb) => (
              <th key={suburb.id} className="px-4 py-3 text-center text-sm font-medium text-gray-900 min-w-48">
                <div className="flex items-center justify-between">
                  <span className="truncate">{suburb.name}</span>
                  <button
                    onClick={() => onRemove(suburb.id)}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-1">{suburb.state}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {kpiRows.map((row, rowIndex) => (
            <tr key={row.key} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                <div className="flex items-center gap-2">
                  <row.icon size={16} className="text-gray-500" />
                  {row.label}
                </div>
              </td>
              {suburbs.map((suburb) => {
                const value = suburb[row.key as keyof Suburb] as number;
                const bestValue = getBestValue(suburbs, row.key, row.key !== 'vacancy');
                const isBest = isBestValue(value, bestValue, row.key);
                
                return (
                  <td key={suburb.id} className={`px-4 py-3 text-center text-sm relative ${
                    isBest ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                  }`}>
                    {isBest && (
                      <div className="absolute -top-1 -left-1">
                        <Award size={16} className="text-green-600" />
                      </div>
                    )}
                    {row.key === 'score' ? (
                      <span className={`font-semibold ${getScoreColor(suburb.score)}`}>
                        {row.format(value)}
                      </span>
                    ) : row.key === 'growth5y' ? (
                      <span className={`font-semibold ${getGrowthColor(suburb.growth5y)}`}>
                        {row.format(value)}
                      </span>
                    ) : (
                      <span className="font-medium text-gray-900">
                        {row.format(value)}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Properties Comparison Table
const PropertiesComparisonTable: React.FC<{
  properties: Property[];
  onRemove: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  formatPrice: (price: number) => string;
  getScoreColor: (score: number) => string;
  getBestValue: (items: (Suburb | Property)[], key: string, isHigherBetter?: boolean) => number | null;
  isBestValue: (value: number, bestValue: number | null, key: string) => boolean;
}> = ({ properties, onRemove, formatPrice, getScoreColor, getBestValue, isBestValue }) => {
  const featureRows = [
    { key: 'title', label: 'Title', format: (value: any) => String(value) },
    { key: 'price', label: 'Price', format: formatPrice },
    { key: 'suburb', label: 'Suburb', format: (value: any) => String(value) },
    { key: 'suburbScore', label: 'Suburb Score', format: (value: any) => `${value}/100` },
    { key: 'yield', label: 'Yield Est.', format: (value: any) => `${value}%` },
    { key: 'priceVsMedian', label: 'Price vs Median', format: (value: any) => `${value > 0 ? '+' : ''}${value}%` },
    { key: 'daysOnMarket', label: 'Days on Market', format: (value: any) => String(value) },
    { key: 'beds', label: 'Bedrooms', format: (value: any) => String(value) },
    { key: 'baths', label: 'Bathrooms', format: (value: any) => String(value) },
    { key: 'parking', label: 'Parking', format: (value: any) => String(value) },
    { key: 'propertyType', label: 'Type', format: (value: any) => String(value).charAt(0).toUpperCase() + String(value).slice(1) },
    { key: 'address', label: 'Address', format: (value: any) => String(value) }
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 w-48">
              Feature
            </th>
            {properties.map((property) => (
              <th key={property.id} className="px-4 py-3 text-center text-sm font-medium text-gray-900 min-w-48">
                <div className="flex items-center justify-between">
                  <span className="truncate">{property.title}</span>
                  <button
                    onClick={() => onRemove(property.id)}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-1">{property.suburb}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {featureRows.map((row, rowIndex) => (
            <tr key={row.key} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                {row.label}
              </td>
              {properties.map((property) => {
                const value = property[row.key as keyof Property];
                const bestValue = getBestValue(properties, row.key, row.key !== 'daysOnMarket' && row.key !== 'priceVsMedian');
                const isBest = typeof value === 'number' ? isBestValue(value, bestValue, row.key) : false;
                
                return (
                  <td key={property.id} className={`px-4 py-3 text-center text-sm relative ${
                    isBest ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                  }`}>
                    {isBest && (
                      <div className="absolute -top-1 -left-1">
                        <Award size={16} className="text-green-600" />
                      </div>
                    )}
                    {row.key === 'suburbScore' ? (
                      <span className={`font-semibold ${getScoreColor(property.suburbScore || 0)}`}>
                        {row.format(typeof value === 'number' ? value : 0)}
                      </span>
                    ) : row.key === 'priceVsMedian' ? (
                      <span className={`font-semibold ${
                        ((property.priceVsMedian || 0) <= -10) ? 'text-green-600' : 
                        ((property.priceVsMedian || 0) <= 10) ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {row.format(typeof value === 'number' ? value : 0)}
                      </span>
                    ) : (
                      <span className="font-medium text-gray-900">
                        {row.format(typeof value === 'number' ? value : 0)}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
