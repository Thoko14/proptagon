import React from 'react';
import { Filter, Settings } from 'lucide-react';
import { Chip, ChipMenuItem } from './Chip';
import { useGrowStore, useActiveSavedSearch } from '../store/growStore';

interface FiltersChipProps {
  className?: string;
  onSwitchSavedSearch?: () => void;
  onManageSearches?: () => void;
  onEditFilters?: () => void;
  isInPropertiesFlow?: boolean;
}

export const FiltersChip: React.FC<FiltersChipProps> = ({
  className = '',
  onSwitchSavedSearch,
  onManageSearches,
  onEditFilters,
  isInPropertiesFlow = false
}) => {
  const { savedSearches, setActiveSavedSearch } = useGrowStore();
  const activeSavedSearch = useActiveSavedSearch();

  const handleSwitchSavedSearch = (searchId: string) => {
    setActiveSavedSearch(searchId);
    if (onSwitchSavedSearch) {
      onSwitchSavedSearch();
    }
  };

  const handleManageSearches = () => {
    if (onManageSearches) {
      onManageSearches();
    }
  };

  const handleEditFilters = () => {
    if (onEditFilters) {
      onEditFilters();
    }
  };

  // Create menu items for each saved search
  const savedSearchItems: ChipMenuItem[] = savedSearches.map((search) => ({
    id: search.id,
    label: search.name,
    onClick: () => handleSwitchSavedSearch(search.id),
    section: 'Switch Saved Search'
  }));

  // Add action items
  const actionItems: ChipMenuItem[] = [
    {
      id: 'manage-searches',
      label: 'Manage searches',
      icon: Settings,
      onClick: handleManageSearches,
      section: 'Actions'
    },
    {
      id: 'edit-filters',
      label: 'Edit filters',
      icon: Filter,
      onClick: handleEditFilters,
      section: 'Actions'
    }
  ];

  // Combine all items
  const allItems = [...savedSearchItems, ...actionItems];

  // If not in properties flow, disable the chip
  if (!isInPropertiesFlow) {
    return (
      <Chip
        icon={Filter}
        label="Filters"
        value="Not available"
        disabled={true}
        className={className}
      />
    );
  }

  return (
    <Chip
      icon={Filter}
      label="Filters"
      value={activeSavedSearch?.name || 'Default Search'}
      items={allItems}
      variant={activeSavedSearch ? 'default' : 'disabled'}
      className={className}
    />
  );
};
