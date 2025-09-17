import { useState, useCallback } from 'react';
import { SuburbToolkitData } from '../types';

export const useSuburbToolkit = () => {
  const [toolkitSuburb, setToolkitSuburb] = useState<SuburbToolkitData | null>(null);
  const [toolkitPosition, setToolkitPosition] = useState<{ x: number; y: number } | null>(null);

  // Show toolkit for a specific suburb
  const showToolkit = useCallback((suburb: SuburbToolkitData) => {
    console.log('🔧 showToolkit called with:', suburb);
    setToolkitSuburb(suburb);
    setToolkitPosition(suburb.position);
  }, []);

  // Hide toolkit
  const hideToolkit = useCallback(() => {
    setToolkitSuburb(null);
    setToolkitPosition(null);
  }, []);

  // Update toolkit position
  const updateToolkitPosition = useCallback((position: { x: number; y: number }) => {
    setToolkitPosition(position);
  }, []);

  // Check if toolkit is visible
  const isToolkitVisible = toolkitSuburb !== null;

  return {
    // State
    toolkitSuburb,
    toolkitPosition,
    isToolkitVisible,
    
    // Actions
    showToolkit,
    hideToolkit,
    updateToolkitPosition,
    
    // Setters
    setToolkitSuburb,
    setToolkitPosition,
  };
};
