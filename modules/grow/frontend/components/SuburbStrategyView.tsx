import React, { useState, useEffect } from 'react';
import Button from '../../../../platform/src/components/Button';
import { useGrowStore } from '../store/growStore';
import { StrategyPreset, StrategyProfile } from '../store/growStore';

interface SuburbStrategyViewProps {
  onBackToMap: () => void;
  onCompareView: () => void;
  onStrategyChange?: (strategy: StrategyPreset) => void;
}

export const SuburbStrategyView: React.FC<SuburbStrategyViewProps> = ({
  onBackToMap,
  onCompareView,
  onStrategyChange
}) => {
  const { 
    activeStrategyId, 
    presets, 
    addPreset, 
    updatePreset, 
    setDefaultPreset,
    userPrefs,
    updateUserPrefs
  } = useGrowStore();

  const activeStrategy = presets.find(p => p.id === activeStrategyId);
  
  // Local state for editing (to avoid immediate store updates)
  const [editingStrategy, setEditingStrategy] = useState<StrategyPreset | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Initialize editing strategy when component mounts
  useEffect(() => {
    if (activeStrategy) {
      setEditingStrategy({ ...activeStrategy });
      setIsDirty(false);
    }
  }, [activeStrategy]);

  // Removed unused handleStrategyChange function

  // Handle profile changes
  const handleProfileChange = (updates: Partial<StrategyProfile>) => {
    if (editingStrategy) {
      const updatedStrategy = {
        ...editingStrategy,
        profile: { ...editingStrategy.profile, ...updates }
      };
      setEditingStrategy(updatedStrategy);
      setIsDirty(true);
      
      // Notify parent for live preview
      if (onStrategyChange) {
        onStrategyChange(updatedStrategy);
      }
    }
  };

  // Handle weight changes
  const handleWeightChange = (key: string, value: number) => {
    if (editingStrategy) {
      const newWeights = { ...editingStrategy.weights, [key]: value };
      
      // Normalize weights to sum to 100
      const total = Object.values(newWeights).reduce((sum: number, weight: any) => sum + (weight || 0), 0);
      const normalizedWeights = Object.fromEntries(
        Object.entries(newWeights).map(([k, v]) => [k, Math.round(((v as number) / total) * 100)])
      );
      
      const updatedStrategy = {
        ...editingStrategy,
        weights: {
          yield: normalizedWeights.yield || 0,
          vacancy: normalizedWeights.vacancy || 0,
          growth5y: normalizedWeights.growth5y || 0,
          seifa: normalizedWeights.seifa || 0,
          stock: normalizedWeights.stock || 0,
          infra: normalizedWeights.infra || 0
        }
      };
      
      setEditingStrategy(updatedStrategy);
      setIsDirty(true);
      
      // Notify parent for live preview
      if (onStrategyChange) {
        onStrategyChange(updatedStrategy);
      }
    }
  };

  // Save strategy
  const handleSave = () => {
    if (editingStrategy) {
      updatePreset(editingStrategy.id, editingStrategy);
      setIsDirty(false);
    }
  };

  // Save as new preset
  const handleSaveAsPreset = () => {
    if (editingStrategy) {
      const presetName = prompt('Enter preset name:');
      if (presetName) {
        const newPreset: StrategyPreset = {
          ...editingStrategy,
          id: `preset-${Date.now()}`,
          name: presetName,
          isDefault: false,
          weights: {
            yield: editingStrategy.weights.yield || 0,
            vacancy: editingStrategy.weights.vacancy || 0,
            growth5y: editingStrategy.weights.growth5y || 0,
            seifa: editingStrategy.weights.seifa || 0,
            stock: editingStrategy.weights.stock || 0,
            infra: editingStrategy.weights.infra || 0
          }
        };
        addPreset(newPreset);
        setIsDirty(false);
      }
    }
  };

  // Set as default
  const handleSetAsDefault = () => {
    if (editingStrategy) {
      setDefaultPreset(editingStrategy.id);
    }
  };

  if (!editingStrategy) {
    return <div>Loading strategy...</div>;
  }

  return (
    <div className="flex h-full">
      {/* Left Panel - Strategy Configuration */}
      <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Strategy</h3>
        
        <div className="space-y-6">
          {/* Goal Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Investment Goal
            </label>
            <select
              value={editingStrategy.profile.goal}
              onChange={(e) => handleProfileChange({ goal: e.target.value as 'cashflow' | 'growth' | 'balanced' })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="cashflow">Cash Flow</option>
              <option value="growth">Capital Growth</option>
              <option value="balanced">Balanced</option>
            </select>
          </div>

          {/* Risk Tolerance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Risk Tolerance
            </label>
            <select
              value={editingStrategy.profile.risk}
              onChange={(e) => handleProfileChange({ risk: e.target.value as 'low' | 'med' | 'high' })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="low">Conservative</option>
              <option value="med">Moderate</option>
              <option value="high">Aggressive</option>
            </select>
          </div>

          {/* Investment Horizon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Investment Horizon
            </label>
            <select
              value={editingStrategy.profile.horizon}
              onChange={(e) => handleProfileChange({ horizon: e.target.value as '<3' | '5-7' | '10+' })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="<3">Less than 3 years</option>
              <option value="5-7">5-7 years</option>
              <option value="10+">10+ years</option>
            </select>
          </div>

          {/* Budget Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget Range
            </label>
            <input
              type="number"
              value={editingStrategy.profile.budget || ''}
              onChange={(e) => handleProfileChange({ budget: parseInt(e.target.value) || undefined })}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter budget"
            />
          </div>

          {/* Location Preferences */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location Scope
            </label>
            <select
              value={userPrefs.locationScope || 'national'}
              onChange={(e) => updateUserPrefs({ locationScope: e.target.value as 'national' | 'state' | 'suburb' })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="national">National</option>
              <option value="state">State</option>
              <option value="suburb">Suburb</option>
            </select>
          </div>

          {/* Property Type Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type Preference
            </label>
            <div className="space-y-2">
              {['house', 'unit', 'townhouse'].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingStrategy.profile.propertyType?.includes(type) || false}
                    onChange={(e) => {
                      const currentTypes = editingStrategy.profile.propertyType || [];
                      if (e.target.checked) {
                        handleProfileChange({ propertyType: [...currentTypes, type] });
                      } else {
                        handleProfileChange({ propertyType: currentTypes.filter(t => t !== type) });
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* KPI Weight Sliders */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">KPI Weights</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yield Priority: {editingStrategy.weights.yield || 0}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={editingStrategy.weights.yield || 0}
                onChange={(e) => handleWeightChange('yield', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Growth Priority: {editingStrategy.weights.growth5y || 0}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={editingStrategy.weights.growth5y || 0}
                onChange={(e) => handleWeightChange('growth5y', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vacancy Priority: {editingStrategy.weights.vacancy || 0}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={editingStrategy.weights.vacancy || 0}
                onChange={(e) => handleWeightChange('vacancy', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEIFA Priority: {editingStrategy.weights.seifa || 0}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={editingStrategy.weights.seifa || 0}
                onChange={(e) => handleWeightChange('seifa', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Priority: {editingStrategy.weights.stock || 0}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={editingStrategy.weights.stock || 0}
                onChange={(e) => handleWeightChange('stock', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Infrastructure Priority: {editingStrategy.weights.infra || 0}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={editingStrategy.weights.infra || 0}
                onChange={(e) => handleWeightChange('infra', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Weight total display */}
            <div className="pt-2 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Total: {Object.values(editingStrategy.weights).reduce((sum: number, weight: any) => sum + (weight || 0), 0)}%
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={handleSave}
              disabled={!isDirty}
            >
              Save Strategy
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={handleSaveAsPreset}
            >
              Save as Preset
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleSetAsDefault}
            >
              Set as Default
            </Button>
          </div>
        </div>
      </div>

      {/* Right Panel - Live Preview & Suburb List */}
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Strategy Impact Preview</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onCompareView}
            >
              Compare
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onBackToMap}
            >
              Back to Map
            </Button>
          </div>
        </div>

        {/* Strategy Summary */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <h4 className="font-medium text-gray-900 mb-3">Current Strategy</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Goal:</span>
              <span className="ml-2 font-medium capitalize">{editingStrategy.profile.goal}</span>
            </div>
            <div>
              <span className="text-gray-600">Risk:</span>
              <span className="ml-2 font-medium capitalize">{editingStrategy.profile.risk}</span>
            </div>
            <div>
              <span className="text-gray-600">Horizon:</span>
              <span className="ml-2 font-medium">{editingStrategy.profile.horizon}</span>
            </div>
            <div>
              <span className="text-gray-600">Budget:</span>
              <span className="ml-2 font-medium">
                {editingStrategy.profile.budget ? `$${editingStrategy.profile.budget.toLocaleString()}` : 'Not set'}
              </span>
            </div>
          </div>
        </div>

        {/* Weight Distribution Chart */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <h4 className="font-medium text-gray-900 mb-3">KPI Weight Distribution</h4>
          <div className="space-y-2">
            {Object.entries(editingStrategy.weights).map(([key, weight]) => (
              <div key={key} className="flex items-center">
                <span className="text-sm text-gray-600 w-24 capitalize">{key}:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${weight || 0}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{weight || 0}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Note about live preview */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Live Preview:</strong> Changes to strategy weights will automatically update the map colors 
            to show which suburbs best match your investment preferences. The map will recolour in real-time 
            as you adjust the sliders.
          </p>
        </div>
      </div>
    </div>
  );
};
