import React, { useState, useMemo } from 'react';
import Button from '../../../../platform/src/components/Button';
import { useGrowStore } from '../store/growStore';
// Removed unused import

interface SuburbListViewProps {
  onBackToMap: () => void;
  onViewSuburb: (suburbId: string) => void;
  onCenterOnMap: (suburbId: string) => void;
  onAddToCompare: (suburbId: string) => void;
}

interface SuburbData {
  id: string;
  name: string;
  score: number;
  yield: number;
  vacancy: number;
  growth5y: number;
  seifa: number;
  stock: number;
}

export const SuburbListView: React.FC<SuburbListViewProps> = ({
  onBackToMap,
  onViewSuburb,
  onCenterOnMap,
  onAddToCompare
}) => {
  const { presets, activeStrategyId } = useGrowStore();
  
  const activeStrategy = presets.find(p => p.id === activeStrategyId);
  
  // Mock suburb data - in real implementation this would come from the store or API
  const [suburbs] = useState<SuburbData[]>([
    { id: '1', name: 'Red Hill', score: 85, yield: 4.2, vacancy: 2.1, growth5y: 12.5, seifa: 8, stock: 15 },
    { id: '2', name: 'Paddington', score: 78, yield: 3.8, vacancy: 1.8, growth5y: 15.2, seifa: 9, stock: 8 },
    { id: '3', name: 'New Farm', score: 92, yield: 3.5, vacancy: 1.2, growth5y: 18.7, seifa: 10, stock: 12 },
    { id: '4', name: 'West End', score: 71, yield: 4.8, vacancy: 3.2, growth5y: 8.9, seifa: 6, stock: 22 },
    { id: '5', name: 'Kangaroo Point', score: 88, yield: 3.9, vacancy: 1.5, growth5y: 14.3, seifa: 9, stock: 11 },
  ]);

  // Sorting and filtering state
  const [sortField, setSortField] = useState<keyof SuburbData>('score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState({
    minScore: 0,
    maxScore: 100,
    minYield: 0,
    maxYield: 10,
    minVacancy: 0,
    maxVacancy: 10,
    minGrowth: 0,
    maxGrowth: 25,
    minSeifa: 0,
    maxSeifa: 10,
    minStock: 0,
    maxStock: 50
  });

  // Apply filters and sorting
  const filteredAndSortedSuburbs = useMemo(() => {
    let filtered = suburbs.filter(suburb => 
      suburb.score >= filters.minScore && suburb.score <= filters.maxScore &&
      suburb.yield >= filters.minYield && suburb.yield <= filters.maxYield &&
      suburb.vacancy >= filters.minVacancy && suburb.vacancy <= filters.maxVacancy &&
      suburb.growth5y >= filters.minGrowth && suburb.growth5y <= filters.maxGrowth &&
      suburb.seifa >= filters.minSeifa && suburb.seifa <= filters.maxSeifa &&
      suburb.stock >= filters.minStock && suburb.stock <= filters.maxStock
    );

    // Sort
    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      
      return 0;
    });

    return filtered;
  }, [suburbs, filters, sortField, sortDirection]);

  // Handle sorting
  const handleSort = (field: keyof SuburbData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Handle filter changes
  const handleFilterChange = (field: keyof typeof filters, value: number) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Suburb', 'Score', 'Yield (%)', 'Vacancy (%)', '5Y Growth (%)', 'SEIFA', 'Stock on Market'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedSuburbs.map(suburb => 
        [suburb.name, suburb.score, suburb.yield, suburb.vacancy, suburb.growth5y, suburb.seifa, suburb.stock].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `suburbs-${activeStrategy?.name || 'strategy'}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Get sort indicator
  const getSortIndicator = (field: keyof SuburbData) => {
    if (sortField !== field) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="flex h-full">
      {/* Left Panel - Filters */}
      <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        
        <div className="space-y-4">
          {/* Score Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Score Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max="100"
                value={filters.minScore}
                onChange={(e) => handleFilterChange('minScore', parseInt(e.target.value) || 0)}
                className="w-20 p-2 border border-gray-300 rounded-md text-sm"
                placeholder="Min"
              />
              <span className="text-gray-500 self-center">-</span>
              <input
                type="number"
                min="0"
                max="100"
                value={filters.maxScore}
                onChange={(e) => handleFilterChange('maxScore', parseInt(e.target.value) || 100)}
                className="w-20 p-2 border border-gray-300 rounded-md text-sm"
                placeholder="Max"
              />
            </div>
          </div>

          {/* Yield Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Yield Range (%)</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={filters.minYield}
                onChange={(e) => handleFilterChange('minYield', parseFloat(e.target.value) || 0)}
                className="w-20 p-2 border border-gray-300 rounded-md text-sm"
                placeholder="Min"
              />
              <span className="text-gray-500 self-center">-</span>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={filters.maxYield}
                onChange={(e) => handleFilterChange('maxYield', parseFloat(e.target.value) || 10)}
                className="w-20 p-2 border border-gray-300 rounded-md text-sm"
                placeholder="Max"
              />
            </div>
          </div>

          {/* Vacancy Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vacancy Range (%)</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={filters.minVacancy}
                onChange={(e) => handleFilterChange('minVacancy', parseFloat(e.target.value) || 0)}
                className="w-20 p-2 border border-gray-300 rounded-md text-sm"
                placeholder="Min"
              />
              <span className="text-gray-500 self-center">-</span>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={filters.maxVacancy}
                onChange={(e) => handleFilterChange('maxVacancy', parseFloat(e.target.value) || 10)}
                className="w-20 p-2 border border-gray-300 rounded-md text-sm"
                placeholder="Max"
              />
            </div>
          </div>

          {/* Growth Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">5Y Growth Range (%)</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max="25"
                step="0.1"
                value={filters.minGrowth}
                onChange={(e) => handleFilterChange('minGrowth', parseFloat(e.target.value) || 0)}
                className="w-20 p-2 border border-gray-300 rounded-md text-sm"
                placeholder="Min"
              />
              <span className="text-gray-500 self-center">-</span>
              <input
                type="number"
                min="0"
                max="25"
                step="0.1"
                value={filters.maxGrowth}
                onChange={(e) => handleFilterChange('maxGrowth', parseFloat(e.target.value) || 25)}
                className="w-20 p-2 border border-gray-300 rounded-md text-sm"
                placeholder="Max"
              />
            </div>
          </div>

          {/* SEIFA Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SEIFA Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max="10"
                value={filters.minSeifa}
                onChange={(e) => handleFilterChange('minSeifa', parseInt(e.target.value) || 0)}
                className="w-20 p-2 border border-gray-300 rounded-md text-sm"
                placeholder="Min"
              />
              <span className="text-gray-500 self-center">-</span>
              <input
                type="number"
                min="0"
                max="10"
                value={filters.maxSeifa}
                onChange={(e) => handleFilterChange('maxSeifa', parseInt(e.target.value) || 10)}
                className="w-20 p-2 border border-gray-300 rounded-md text-sm"
                placeholder="Max"
              />
            </div>
          </div>

          {/* Stock Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stock Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max="50"
                value={filters.minStock}
                onChange={(e) => handleFilterChange('minStock', parseInt(e.target.value) || 0)}
                className="w-20 p-2 border border-gray-300 rounded-md text-sm"
                placeholder="Min"
              />
              <span className="text-gray-500 self-center">-</span>
              <input
                type="number"
                min="0"
                max="50"
                value={filters.maxStock}
                onChange={(e) => handleFilterChange('maxStock', parseInt(e.target.value) || 50)}
                className="w-20 p-2 border border-gray-300 rounded-md text-sm"
                placeholder="Max"
              />
            </div>
          </div>

          {/* Results count */}
          <div className="pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {filteredAndSortedSuburbs.length} of {suburbs.length} suburbs
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={exportToCSV}
            >
              Export to CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onBackToMap}
            >
              Back to Map
            </Button>
          </div>
        </div>
      </div>

      {/* Right Panel - Suburb Table */}
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Suburbs - {activeStrategy?.name || 'Strategy'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Ranked by {sortField} ({sortDirection === 'asc' ? 'Low to High' : 'High to Low'})
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>
                    Suburb {getSortIndicator('name')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('score')}>
                    Score {getSortIndicator('score')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('yield')}>
                    Yield % {getSortIndicator('yield')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('vacancy')}>
                    Vacancy % {getSortIndicator('vacancy')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('growth5y')}>
                    5Y Growth % {getSortIndicator('growth5y')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('seifa')}>
                    SEIFA {getSortIndicator('seifa')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('stock')}>
                    Stock {getSortIndicator('stock')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedSuburbs.map((suburb) => (
                  <tr key={suburb.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {suburb.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        suburb.score >= 80 ? 'bg-green-100 text-green-800' :
                        suburb.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {suburb.score}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {suburb.yield}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {suburb.vacancy}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {suburb.growth5y}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {suburb.seifa}/10
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {suburb.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => onViewSuburb(suburb.id)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => onCenterOnMap(suburb.id)}
                        >
                          Center
                        </Button>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => onAddToCompare(suburb.id)}
                        >
                          Compare
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
