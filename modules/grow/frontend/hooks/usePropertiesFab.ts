import { useState, useCallback } from 'react';

export interface PropertiesFabState {
  isVisible: boolean;
  position: { x: number; y: number } | null;
  locationScope: 'viewport' | 'suburb' | null;
  suburbId?: string;
}

export const usePropertiesFab = () => {
  const [fabState, setFabState] = useState<PropertiesFabState>({
    isVisible: false,
    position: null,
    locationScope: null,
    suburbId: undefined
  });

  // Show FAB for viewport properties
  const showViewportProperties = useCallback((position: { x: number; y: number }) => {
    setFabState({
      isVisible: true,
      position,
      locationScope: 'viewport',
      suburbId: undefined
    });
  }, []);

  // Show FAB for suburb properties
  const showSuburbProperties = useCallback((position: { x: number; y: number }, suburbId: string) => {
    setFabState({
      isVisible: true,
      position,
      locationScope: 'suburb',
      suburbId
    });
  }, []);

  // Hide FAB
  const hideFab = useCallback(() => {
    setFabState(prev => ({
      ...prev,
      isVisible: false
    }));
  }, []);

  // Update FAB position
  const updateFabPosition = useCallback((position: { x: number; y: number }) => {
    setFabState(prev => ({
      ...prev,
      position
    }));
  }, []);

  // Check if FAB is visible
  const isFabVisible = fabState.isVisible;

  // Check if FAB is for viewport
  const isViewportFab = fabState.locationScope === 'viewport';

  // Check if FAB is for suburb
  const isSuburbFab = fabState.locationScope === 'suburb';

  // Get current suburb ID
  const getCurrentSuburbId = useCallback(() => {
    return fabState.suburbId;
  }, [fabState.suburbId]);

  // Get current location scope
  const getCurrentLocationScope = useCallback(() => {
    return fabState.locationScope;
  }, [fabState.locationScope]);

  // Get FAB position
  const getFabPosition = useCallback(() => {
    return fabState.position;
  }, [fabState.position]);

  return {
    // State
    fabState,
    
    // Actions
    showViewportProperties,
    showSuburbProperties,
    hideFab,
    updateFabPosition,
    
    // Utility functions
    isFabVisible,
    isViewportFab,
    isSuburbFab,
    getCurrentSuburbId,
    getCurrentLocationScope,
    getFabPosition,
    
    // Setter
    setFabState,
  };
};
