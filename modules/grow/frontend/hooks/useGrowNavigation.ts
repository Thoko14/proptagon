import { useState, useCallback } from 'react';
import { ViewMode } from '../types';

export const useGrowNavigation = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedSuburb, setSelectedSuburb] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  // Navigation functions
  const navigateToMap = useCallback(() => {
    setViewMode('map');
    setSelectedSuburb(null);
    setSelectedProperty(null);
  }, []);

  const navigateToStrategy = useCallback(() => {
    setViewMode('strategy');
  }, []);

  const navigateToPropertyFilters = useCallback(() => {
    setViewMode('property-filters');
  }, []);

  const navigateToProperties = useCallback(() => {
    setViewMode('properties');
  }, []);

  const navigateToPropertyDetail = useCallback((propertyId: string) => {
    setViewMode('property-detail');
    setSelectedProperty(propertyId);
  }, []);

  const navigateToCompare = useCallback(() => {
    setViewMode('compare');
  }, []);

  const navigateToSuburbList = useCallback(() => {
    setViewMode('suburb-list');
  }, []);

  const navigateToSuburbDetail = useCallback((suburbId: string) => {
    setViewMode('suburb-detail');
    setSelectedSuburb(suburbId);
  }, []);

  const navigateToSuburbFromProperty = useCallback((suburbId: string) => {
    setViewMode('suburb-detail');
    setSelectedSuburb(suburbId);
    setSelectedProperty(null);
  }, []);

  const backToMap = useCallback(() => {
    navigateToMap();
  }, [navigateToMap]);

  // View mode checks
  const isMapView = viewMode === 'map';
  const isStrategyView = viewMode === 'strategy';
  const isPropertyFiltersView = viewMode === 'property-filters';
  const isPropertiesView = viewMode === 'properties';
  const isPropertyDetailView = viewMode === 'property-detail';
  const isCompareView = viewMode === 'compare';
  const isSuburbListView = viewMode === 'suburb-list';
  const isSuburbDetailView = viewMode === 'suburb-detail';

  return {
    // State
    viewMode,
    selectedSuburb,
    selectedProperty,
    
    // Navigation functions
    navigateToMap,
    navigateToStrategy,
    navigateToPropertyFilters,
    navigateToProperties,
    navigateToPropertyDetail,
    navigateToCompare,
    navigateToSuburbList,
    navigateToSuburbDetail,
    navigateToSuburbFromProperty,
    backToMap,
    
    // View mode checks
    isMapView,
    isStrategyView,
    isPropertyFiltersView,
    isPropertiesView,
    isPropertyDetailView,
    isCompareView,
    isSuburbListView,
    isSuburbDetailView,
    
    // Setters
    setViewMode,
    setSelectedSuburb,
    setSelectedProperty,
  };
};
