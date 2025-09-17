import { useState, useCallback } from 'react';
import { useGrowNavigation } from './useGrowNavigation';
import { useSuburbToolkit } from './useSuburbToolkit';
import { useStrategyProfile } from './useStrategyProfile';
import { useCompareManagement } from './useCompareManagement';
import { usePropertiesFab } from './usePropertiesFab';

export const useGrowState = () => {
  // Initialize all sub-hooks
  const navigation = useGrowNavigation();
  const toolkit = useSuburbToolkit();
  const strategy = useStrategyProfile();
  const compare = useCompareManagement();
  const fab = usePropertiesFab();

  // Additional global state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Loading state management
  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  // Error state management
  const setErrorState = useCallback((errorMessage: string | null) => {
    setError(errorMessage);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Search query management
  const updateSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Filter management
  const addFilter = useCallback((filter: string) => {
    setSelectedFilters(prev => [...prev, filter]);
  }, []);

  const removeFilter = useCallback((filter: string) => {
    setSelectedFilters(prev => prev.filter(f => f !== filter));
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedFilters([]);
  }, []);

  const hasFilters = useCallback(() => {
    return selectedFilters.length > 0;
  }, [selectedFilters]);

  // Reset all state to defaults
  const resetAllState = useCallback(() => {
    navigation.navigateToMap();
    toolkit.hideToolkit();
    strategy.resetToDefaults();
    compare.clearCompare();
    fab.hideFab();
    setSearchQuery('');
    setSelectedFilters([]);
    setError(null);
    setIsLoading(false);
  }, [navigation, toolkit, strategy, compare, fab]);

  // Get current state summary
  const getStateSummary = useCallback(() => {
    return {
      viewMode: navigation.viewMode,
      hasToolkit: toolkit.isToolkitVisible,
      hasCompareItems: !compare.isCompareEmpty,
      hasFab: fab.isFabVisible,
      activeLayers: 0,
      hasFilters: hasFilters(),
      isLoading,
      hasError: error !== null
    };
  }, [
    navigation.viewMode,
    toolkit.isToolkitVisible,
    compare.isCompareEmpty,
    fab.isFabVisible,
    hasFilters,
    isLoading,
    error
  ]);

  return {
    // Sub-hooks
    navigation,
    toolkit,
    strategy,
    compare,
    fab,
    
    // Global state
    isLoading,
    error,
    searchQuery,
    selectedFilters,
    
    // Actions
    setLoading,
    setErrorState,
    clearError,
    updateSearchQuery,
    addFilter,
    removeFilter,
    clearFilters,
    resetAllState,
    
    // Utility functions
    hasFilters,
    getStateSummary,
    
    // Setters
    setIsLoading,
    setError,
    setSearchQuery,
    setSelectedFilters,
  };
};
