import React from 'react';
import { MapPin, X, Search, Eye } from 'lucide-react';
import { Chip, ChipMenuItem } from './Chip';
import { useGrowStore } from '../store/growStore';

interface LocationChipProps {
  className?: string;
  onClearScope?: () => void;
  onSwitchToViewport?: () => void;
  onSwitchToSuburb?: () => void;
  onFocusSearch?: () => void;
}

export const LocationChip: React.FC<LocationChipProps> = ({
  className = '',
  onClearScope,
  onSwitchToViewport,
  onSwitchToSuburb,
  onFocusSearch
}) => {
  const { locationScope, setLocationScope } = useGrowStore();

  const getLocationDisplay = () => {
    switch (locationScope.type) {
      case 'all-suburbs':
        return 'All Suburbs';
      case 'suburb':
        return locationScope.suburbName || 'Selected Suburb';
      case 'map-area':
        return 'Map Area';
      default:
        return 'All Suburbs';
    }
  };

  const getLocationVariant = () => {
    if (locationScope.type === 'all-suburbs') return 'default';
    return 'active';
  };

  const handleClearScope = () => {
    setLocationScope({ type: 'all-suburbs' });
    if (onClearScope) onClearScope();
  };

  const handleSwitchToViewport = () => {
    setLocationScope({ type: 'map-area' });
    if (onSwitchToViewport) onSwitchToViewport();
  };

  const handleSwitchToSuburb = () => {
    if (onSwitchToSuburb) onSwitchToSuburb();
  };

  const handleFocusSearch = () => {
    if (onFocusSearch) onFocusSearch();
  };

  // Create menu items based on current state
  const getMenuItems = (): ChipMenuItem[] => {
    const items: ChipMenuItem[] = [];

    if (locationScope.type !== 'all-suburbs') {
      items.push({
        id: 'clear-scope',
        label: 'Clear scope',
        icon: X,
        onClick: handleClearScope,
        section: 'Actions'
      });
    }

    if (locationScope.type !== 'map-area') {
      items.push({
        id: 'switch-to-viewport',
        label: 'Switch to viewport',
        icon: Eye,
        onClick: handleSwitchToViewport,
        section: 'Actions'
      });
    }

    if (locationScope.type !== 'suburb') {
      items.push({
        id: 'switch-to-suburb',
        label: 'Switch to suburb',
        icon: MapPin,
        onClick: handleSwitchToSuburb,
        section: 'Actions'
      });
    }

    items.push({
      id: 'focus-search',
      label: 'Focus search',
      icon: Search,
      onClick: handleFocusSearch,
      section: 'Actions'
    });

    return items;
  };

  return (
    <Chip
      icon={MapPin}
      label="Location"
      value={getLocationDisplay()}
      items={getMenuItems()}
      variant={getLocationVariant()}
      className={className}
    />
  );
};
