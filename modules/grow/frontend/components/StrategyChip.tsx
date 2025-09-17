import React from 'react';
import { SlidersHorizontal, Settings } from 'lucide-react';
import { Chip, ChipMenuItem } from './Chip';
import { useGrowStore, useActiveStrategy } from '../store/growStore';

interface StrategyChipProps {
  className?: string;
  onAdjustStrategy?: () => void;
  onManagePresets?: () => void;
}

export const StrategyChip: React.FC<StrategyChipProps> = ({
  className = '',
  onAdjustStrategy,
  onManagePresets
}) => {
  const { presets, setActiveStrategy } = useGrowStore();
  const activeStrategy = useActiveStrategy();

  const handleSwitchPreset = (strategyId: string) => {
    setActiveStrategy(strategyId);
  };

  const handleAdjustStrategy = () => {
    if (onAdjustStrategy) {
      onAdjustStrategy();
    }
  };

  const handleManagePresets = () => {
    if (onManagePresets) {
      onManagePresets();
    }
  };

  // Create menu items for each preset
  const presetItems: ChipMenuItem[] = presets.map((preset) => ({
    id: preset.id,
    label: preset.name,
    onClick: () => handleSwitchPreset(preset.id),
    section: 'Switch Preset'
  }));

  // Add action items
  const actionItems: ChipMenuItem[] = [
    {
      id: 'adjust-strategy',
      label: 'Adjust Strategy…',
      icon: SlidersHorizontal,
      onClick: handleAdjustStrategy,
      section: 'Actions'
    },
    {
      id: 'manage-presets',
      label: 'Manage Presets…',
      icon: Settings,
      onClick: handleManagePresets,
      section: 'Actions'
    }
  ];

  // Combine all items
  const allItems = [...presetItems, ...actionItems];

  return (
    <Chip
      icon={SlidersHorizontal}
      label="Strategy"
      value={activeStrategy?.name || 'Loading...'}
      items={allItems}
      variant={activeStrategy ? 'default' : 'disabled'}
      className={className}
    />
  );
};
