import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Types
export interface StrategyProfile {
  goal: 'cashflow' | 'growth' | 'balanced';
  risk: 'low' | 'med' | 'high';
  horizon: '<3' | '5-7' | '10+';
  budget?: number;
  locationPreference?: string[];
  propertyType?: string[];
}

export interface StrategyPreset {
  id: string;
  name: string;
  profile: StrategyProfile;
  weights: {
    yield: number;
    vacancy: number;
    growth5y: number;
    seifa: number;
    stock: number;
    infra: number;
  };
  isDefault?: boolean;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: PropertyFilters;
  isDefault?: boolean;
}

export interface PropertyFilters {
  priceMin?: number;
  priceMax?: number;
  beds?: number;
  baths?: number;
  parking?: number;
  propertyType?: string[];
  landSize?: number;
  keywords?: string;
  highYield?: boolean;
  underMedian?: boolean;
  longDOM?: boolean;
  devHints?: boolean;
}

export interface LocationScope {
  type: 'all-suburbs' | 'suburb' | 'map-area';
  suburbId?: string;
  suburbName?: string;
  bounds?: [number, number, number, number];
}

export interface MapState {
  bbox: [number, number, number, number];
  zoom: number;
  selectedSuburbId?: string;
}

export interface UserPreferences {
  skipFiltersWhenDefault: boolean;
  locationScope?: 'national' | 'state' | 'suburb';
}

export interface LayersState {
  schoolCatchments: boolean;
  // Future layers can be added here
}

export interface GrowState {
  // Strategy
  activeStrategyId: string;
  presets: StrategyPreset[];
  
  // Saved Searches
  activeSavedSearchId: string | null;
  savedSearches: SavedSearch[];
  
  // Location & Map
  locationScope: LocationScope;
  mapState: MapState;
  
  // UI State
  userPrefs: UserPreferences;
  
  // Layers
  layers: LayersState;
  
  // Actions
  setActiveStrategy: (strategyId: string) => void;
  addPreset: (preset: StrategyPreset) => void;
  updatePreset: (id: string, updates: Partial<StrategyPreset>) => void;
  deletePreset: (id: string) => void;
  setDefaultPreset: (id: string) => void;
  
  setActiveSavedSearch: (searchId: string | null) => void;
  addSavedSearch: (search: SavedSearch) => void;
  updateSavedSearch: (id: string, updates: Partial<SavedSearch>) => void;
  deleteSavedSearch: (id: string) => void;
  setDefaultSavedSearch: (id: string) => void;
  
  setLocationScope: (scope: LocationScope) => void;
  updateMapState: (updates: Partial<MapState>) => void;
  
  updateUserPrefs: (updates: Partial<UserPreferences>) => void;
  toggleLayer: (layerName: keyof LayersState) => void;
  
  resetToDefaults: () => void;
}

// Default presets
const DEFAULT_PRESETS: StrategyPreset[] = [
  {
    id: 'balanced-metro',
    name: 'Balanced Metro',
    profile: { goal: 'balanced', risk: 'med', horizon: '5-7' },
    weights: { yield: 20, vacancy: 15, growth5y: 20, seifa: 15, stock: 10, infra: 20 },
    isDefault: true
  },
  {
    id: 'cashflow-au',
    name: 'Cashflow AU',
    profile: { goal: 'cashflow', risk: 'low', horizon: '5-7' },
    weights: { yield: 35, vacancy: 20, growth5y: 10, seifa: 10, stock: 10, infra: 15 }
  },
  {
    id: 'growth-metro',
    name: 'Growth Metro',
    profile: { goal: 'growth', risk: 'high', horizon: '10+' },
    weights: { yield: 10, vacancy: 10, growth5y: 30, seifa: 15, stock: 5, infra: 30 }
  },
  {
    id: 'reno-hunt',
    name: 'Reno Hunt',
    profile: { goal: 'growth', risk: 'med', horizon: '5-7' },
    weights: { yield: 15, vacancy: 10, growth5y: 15, seifa: 10, stock: 20, infra: 30 }
  }
];

const DEFAULT_SAVED_SEARCHES: SavedSearch[] = [
  {
    id: 'default-properties',
    name: 'Default Property Search',
    filters: { beds: 2, propertyType: ['residential'] },
    isDefault: true
  }
];

export const useGrowStore = create<GrowState>()(
  persist(
    (set) => ({
      // Initial state
      activeStrategyId: 'balanced-metro',
      presets: DEFAULT_PRESETS,
      
      activeSavedSearchId: 'default-properties',
      savedSearches: DEFAULT_SAVED_SEARCHES,
      
      locationScope: { type: 'all-suburbs' },
      mapState: {
        bbox: [113.338953, -43.634597, 153.569469, -10.668185], // Australia bounds
        zoom: 4
      },
      
      userPrefs: { skipFiltersWhenDefault: true, locationScope: 'national' },
      
      layers: { schoolCatchments: false },
      
      // Actions
      setActiveStrategy: (strategyId) => set({ activeStrategyId: strategyId }),
      
      addPreset: (preset) => set((state) => ({
        presets: [...state.presets, preset]
      })),
      
      updatePreset: (id, updates) => set((state) => ({
        presets: state.presets.map(p => 
          p.id === id ? { ...p, ...updates } : p
        )
      })),
      
      deletePreset: (id) => set((state) => {
        const newPresets = state.presets.filter(p => p.id !== id);
        const newActiveId = state.activeStrategyId === id 
          ? newPresets.find(p => p.isDefault)?.id || 'balanced-metro'
          : state.activeStrategyId;
        
        return {
          presets: newPresets,
          activeStrategyId: newActiveId
        };
      }),
      
      setDefaultPreset: (id) => set((state) => ({
        presets: state.presets.map(p => ({
          ...p,
          isDefault: p.id === id
        }))
      })),
      
      setActiveSavedSearch: (searchId) => set({ activeSavedSearchId: searchId }),
      
      addSavedSearch: (search) => set((state) => ({
        savedSearches: [...state.savedSearches, search]
      })),
      
      updateSavedSearch: (id, updates) => set((state) => ({
        savedSearches: state.savedSearches.map(s => 
          s.id === id ? { ...s, ...updates } : s
        )
      })),
      
      deleteSavedSearch: (id) => set((state) => {
        const newSearches = state.savedSearches.filter(s => s.id !== id);
        const newActiveId = state.activeSavedSearchId === id 
          ? newSearches.find(s => s.isDefault)?.id || null
          : state.activeSavedSearchId;
        
        return {
          savedSearches: newSearches,
          activeSavedSearchId: newActiveId
        };
      }),
      
      setDefaultSavedSearch: (id) => set((state) => ({
        savedSearches: state.savedSearches.map(s => ({
          ...s,
          isDefault: s.id === id
        }))
      })),
      
      setLocationScope: (scope) => set({ locationScope: scope }),
      
      updateMapState: (updates) => set((state) => ({
        mapState: { ...state.mapState, ...updates }
      })),
      
      updateUserPrefs: (updates) => set((state) => ({
        userPrefs: { ...state.userPrefs, ...updates }
      })),
      
      toggleLayer: (layerName) => set((state) => ({
        layers: { ...state.layers, [layerName]: !state.layers[layerName] }
      })),
      
      resetToDefaults: () => set({
        activeStrategyId: 'balanced-metro',
        activeSavedSearchId: 'default-properties',
        locationScope: { type: 'all-suburbs' },
        mapState: {
          bbox: [113.338953, -43.634597, 153.569469, -10.668185],
          zoom: 4
        },
        userPrefs: { skipFiltersWhenDefault: true },
        layers: { schoolCatchments: false }
      })
    }),
    {
      name: 'propbase:grow:v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeStrategyId: state.activeStrategyId,
        presets: state.presets,
        activeSavedSearchId: state.activeSavedSearchId,
        savedSearches: state.savedSearches,
        userPrefs: state.userPrefs,
        locationScope: state.locationScope,
        mapState: state.mapState,
        layers: state.layers
      }),
      onRehydrateStorage: () => (state) => {
        // Performance optimization: ensure rehydration is fast
        const startTime = performance.now();
        
        // Validate persisted data
        if (state && (!state.presets || state.presets.length === 0)) {
          console.warn('Invalid persisted data, resetting to defaults');
          state.resetToDefaults();
        }
        
        // Performance monitoring
        const endTime = performance.now();
        const rehydrationTime = endTime - startTime;
        
        if (rehydrationTime > 300) {
          console.warn(`Store rehydration took ${rehydrationTime.toFixed(2)}ms, exceeding 300ms target`);
        } else {
          console.log(`Store rehydration completed in ${rehydrationTime.toFixed(2)}ms`);
        }
      },
      // Performance optimization: use versioning for better cache invalidation
      version: 1,
      // Performance optimization: migrate old data if needed
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migrate from v0 to v1
          return {
            ...persistedState,
            layers: { schoolCatchments: false },
            version: 1
          };
        }
        return persistedState;
      }
    }
  )
);

// Selectors
export const useActiveStrategy = () => {
  const { presets, activeStrategyId } = useGrowStore();
  return presets.find(p => p.id === activeStrategyId);
};

export const useActiveSavedSearch = () => {
  const { savedSearches, activeSavedSearchId } = useGrowStore();
  return savedSearches.find(s => s.id === activeSavedSearchId);
};

export const useLayersState = () => {
  const { layers, toggleLayer } = useGrowStore();
  return { layers, toggleLayer };
};
