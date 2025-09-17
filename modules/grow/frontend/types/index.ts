// Shared types and interfaces for the Grow module

export type ViewMode = 'map' | 'strategy' | 'property-filters' | 'properties' | 'property-detail' | 'compare' | 'suburb-list' | 'suburb-detail';

// Suburb-related types
export interface Suburb {
  id: string;
  name: string;
  score: number;
  yield: number;
  vacancy: number;
  growth5y: number;
  seifa: number;
  stockOnMarket: number;
  medianPrice: number;
  state: string;
}

export interface SuburbFeature {
  id: string;
  properties: {
    code?: string;
    name?: string;
    SA2_NAME21?: string;
    strategyScore?: number;
  };
  geometry: {
    coordinates: number[][][];
  };
}

export interface SuburbToolkitData {
  id: string;
  name: string;
  code: string;
  score: number;
  kpis: { 
    yield: number; 
    growth5y: number; 
    vacancy: number; 
  };
  position: { x: number; y: number };
}

// Property-related types
export interface Property {
  id: string;
  title: string;
  price: number;
  image: string;
  beds: number;
  baths: number;
  parking: number;
  propertyType: string;
  landSize?: number;
  internalSize?: number;
  suburbScore: number;
  yieldEstimate: number;
  priceVsMedian: number;
  daysOnMarket: number;
  address: string;
  suburb: string;
  suburbId: string;
  description?: string;
  features?: string[];
  listingDate?: string;
  listingId?: string;
  status?: 'for-sale' | 'auction' | 'under-offer';
  agent?: Agent;
  lastSaleDate?: string;
  lastSalePrice?: number;
  schoolCatchments?: SchoolCatchments;
  zoning?: string;
  nbn?: string;
}

export interface PropertyDetail extends Property {
  priceDisplay?: string;
  images: string[];
  description: string;
  listingDate: string;
  listingId: string;
  status: 'for-sale' | 'auction' | 'under-offer';
  agent: Agent;
  hazards?: string[];
}

export interface Agent {
  name: string;
  agency: string;
  phone: string;
  email: string;
  photo?: string;
}

export interface SchoolCatchments {
  primary?: string;
  secondary?: string;
}

// Strategy-related types
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

// Map-related types
export interface MapState {
  bbox: [number, number, number, number];
  zoom: number;
  selectedSuburbId?: string;
}

export interface LocationScope {
  type: 'all-suburbs' | 'suburb' | 'map-area';
  suburbId?: string;
  suburbName?: string;
  bounds?: [number, number, number, number];
}

// Search and filter types
export interface SearchResult {
  lat: number;
  lng: number;
  bbox?: [number, number, number, number];
}

export interface SuburbSearchResult {
  suburbName: string;
  bbox?: [number, number, number, number];
}

// Component prop types
export interface GrowMapProps {
  className?: string;
  onMapReady?: (map: any) => void;
  onSuburbClick?: (suburb: { 
    name: string; 
    code: string; 
    score: number; 
    kpis: any; 
    position: { x: number; y: number } 
  }) => void;
  selectedSuburbId?: string | null;
  editingStrategy?: StrategyPreset | null;
}

export interface PropertyViewProps {
  propertyId: string;
  onBack: () => void;
  onViewSuburb: (suburbId: string) => void;
  onAddToCompare: (property: PropertyDetail) => void;
  onSaveProperty: (propertyId: string) => void;
}

// Event handler types
export interface EventHandlers {
  handleSearchResult: (result: SearchResult) => void;
  handleSuburbSearch: (suburbName: string) => void;
  handleSuburbClick: (suburb: { 
    name: string; 
    code: string; 
    score: number; 
    kpis: any; 
    position: { x: number; y: number } 
  }) => void;
  handleStrategyMode: () => void;
  handleSuburbSelect: (suburb: string) => void;
  handleBackToMap: () => void;
  handleShowPropertiesHere: () => void;
  handleToolkitViewSuburb: () => void;
  handleToolkitShowProperties: () => void;
  handleToolkitAddToCompare: () => void;
  handleToolkitClose: () => void;
  handleLayersToggle: () => void;
  handleStrategySave: () => void;
  handleStrategySaveAsPreset: () => void;
  handleSetAsDefault: () => void;
  handleApplyFilters: () => void;
  handlePropertyClick: (propertyId: string) => void;
  handleViewSuburbFromProperty: (suburbId: string) => void;
  handleAddToCompare: (item: Suburb | Property) => void;
  handleRemoveFromCompare: (id: string) => void;
  handleReorderCompare: (items: (Suburb | Property)[]) => void;
  handleCompareView: () => void;
  handleSuburbListView: () => void;
  handleSuburbDetailView: (suburbId: string) => void;
}
