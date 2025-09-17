import { useState, useCallback } from 'react';
import { Suburb, Property } from '../types';

export type CompareItem = Suburb | Property;

export const useCompareManagement = () => {
  const [compareItems, setCompareItems] = useState<CompareItem[]>([]);
  const [compareMode, setCompareMode] = useState<'suburbs' | 'properties' | null>(null);

  // Add item to comparison
  const addToCompare = useCallback((item: CompareItem) => {
    setCompareItems(prev => {
      // Check if item already exists
      const exists = prev.some(existing => existing.id === item.id);
      if (exists) return prev;
      
      // Determine mode based on first item
      if (prev.length === 0) {
        const newMode = 'suburbId' in item ? 'suburbs' : 'properties';
        setCompareMode(newMode);
      }
      
      // Add item (max 4 items)
      if (prev.length < 4) {
        return [...prev, item];
      }
      
      return prev;
    });
  }, []);

  // Remove item from comparison
  const removeFromCompare = useCallback((id: string) => {
    setCompareItems(prev => {
      const filtered = prev.filter(item => item.id !== id);
      
      // Clear mode if no items left
      if (filtered.length === 0) {
        setCompareMode(null);
      }
      
      return filtered;
    });
  }, []);

  // Reorder comparison items
  const reorderCompare = useCallback((items: CompareItem[]) => {
    setCompareItems(items);
  }, []);

  // Clear all comparison items
  const clearCompare = useCallback(() => {
    setCompareItems([]);
    setCompareMode(null);
  }, []);

  // Check if item is in comparison
  const isInCompare = useCallback((id: string) => {
    return compareItems.some(item => item.id === id);
  }, [compareItems]);

  // Get comparison count
  const getCompareCount = useCallback(() => {
    return compareItems.length;
  }, [compareItems]);

  // Check if comparison is full
  const isCompareFull = useCallback(() => {
    return compareItems.length >= 4;
  }, [compareItems]);

  // Check if comparison is empty
  const isCompareEmpty = useCallback(() => {
    return compareItems.length === 0;
  }, [compareItems]);

  // Get items by type
  const getSuburbs = useCallback(() => {
    return compareItems.filter((item): item is Suburb => 'suburbId' in item === false);
  }, [compareItems]);

  const getProperties = useCallback(() => {
    return compareItems.filter((item): item is Property => 'suburbId' in item);
  }, [compareItems]);

  return {
    // State
    compareItems,
    compareMode,
    
    // Actions
    addToCompare,
    removeFromCompare,
    reorderCompare,
    clearCompare,
    
    // Utility functions
    isInCompare,
    getCompareCount,
    isCompareFull,
    isCompareEmpty,
    getSuburbs,
    getProperties,
    
    // Setters
    setCompareItems,
    setCompareMode,
  };
};
