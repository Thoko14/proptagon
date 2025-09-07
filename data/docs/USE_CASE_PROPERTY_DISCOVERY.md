# Use Case: Property Discovery & Filtering Flow

## Overview
**Use Case Name:** Suburb-to-Properties Discovery Flow  
**Primary Actor:** Property Investor/Home Buyer  
**Goal:** Discover and filter properties in a specific suburb after searching and exploring the map

## User Story
As a property investor, I want to search for a specific suburb, explore it on the map, and then view all available properties with customizable filters so that I can quickly identify investment opportunities that match my criteria.

## Detailed Flow Description

### 1. Landing Page & Navigation
**Trigger:** User clicks "Grow" in global header from landing page

**Sequence:**
1. **Route Matching** - `App.tsx` matches `/grow` route
2. **Layout Rendering** - `Layout.tsx` renders with global navigation
3. **Grow Page Initialization** - `GrowPage.tsx` initializes with map and top bar
4. **Component Tree Setup** - `GrowTopBar` and `GrowMap` components mount

**Key Functions:**
- Route matching in React Router
- Component state initialization via `useState`
- Map initialization via `useGrowMap()` hook

### 2. Map Initialization & Mouse Interaction
**Trigger:** Map loads and user moves mouse around

**Sequence:**
1. **Master Hook Initialization** - `useGrowMap()` orchestrates all map functionality
2. **Map Instance Creation** - `useMapInitialization()` creates Mapbox instance
3. **Layer Loading** - `useMapLayers()` loads suburb data and boundaries
4. **Event Binding** - `useMapEvents()` attaches mouse and click handlers

**Key Functions:**
- `useGrowMap()` - Master map hook
- `handleMouseMove()` - Hover detection and outline display
- `setHoveredSuburbId()` - Hover state management
- `updateSuburbColors()` - Strategy-based coloring

**User Experience:**
- Orange outline appears on suburb hover
- Cursor changes to pointer over interactive areas
- Smooth visual feedback during exploration

### 3. Suburb Search
**Trigger:** User types "Red Hill" in search bar

**Sequence:**
1. **Input Handling** - `handleInputChange()` captures keystrokes
2. **Debounced Search** - `debouncedSearch()` waits 300ms then queries API
3. **API Integration** - Mapbox Geocoding API called with Australian context
4. **Result Processing** - `prioritizeSuggestions()` sorts by relevance
5. **Dropdown Display** - Search suggestions appear below input

**Key Functions:**
- `handleInputChange()` - Input state management
- `debouncedSearch()` - API call with delay
- `prioritizeSuggestions()` - Result ranking algorithm
- `setSuggestions()` - Dropdown state management

**API Call:**
```typescript
https://api.mapbox.com/geocoding/v5/mapbox.places/Red%20Hill.json?access_token=${token}&country=AU&types=place,neighborhood,postcode&limit=8
```

### 4. Search Result Selection
**Trigger:** User clicks "Red Hill" from search suggestions

**Sequence:**
1. **Selection Processing** - `handleSuggestionSelect()` processes choice
2. **Location Scope Update** - `setLocationScope()` updates to suburb type
3. **Map State Storage** - `updateMapState()` stores suburb bounds
4. **Navigation Trigger** - `onSearch()` callback initiates map movement

**Key Functions:**
- `handleSuggestionSelect()` - Result processing
- `setLocationScope()` - Location state management
- `updateMapState()` - Map bounds storage
- `onSearch()` - Navigation callback

**State Updates:**
```typescript
setLocationScope({
  type: 'suburb',
  suburbName: 'Red Hill',
  bounds: suggestion.bbox
});
```

### 5. Map Navigation to Suburb
**Trigger:** Search result coordinates received

**Sequence:**
1. **Coordinate Processing** - `handleSearchResult()` receives lat/lng/bbox
2. **Map Animation** - `mapInstance.fitBounds()` animates to suburb
3. **Suburb Highlighting** - `highlightSearchedSuburb()` shows focus
4. **State Synchronization** - Search highlight state updated

**Key Functions:**
- `handleSearchResult()` - Coordinate processing
- `mapInstance.fitBounds()` - Smooth map animation
- `highlightSearchedSuburb()` - Visual focus indication
- `setSearchedSuburbId()` - Search state management

**Animation Details:**
```typescript
mapInstance.fitBounds(bbox, {
  padding: 50,
  duration: 2000
});
```

### 6. Suburb Selection & FAB Display
**Trigger:** User clicks on Red Hill suburb on map

**Sequence:**
1. **Click Detection** - `handleMapClick()` identifies suburb click
2. **Suburb Identification** - `findSuburbAtCoordinates()` locates suburb
3. **Data Collection** - Suburb metadata and KPIs gathered
4. **Toolkit Display** - Suburb information panel appears
5. **FAB Activation** - PropertiesFab shows "Show Properties in Suburb"

**Key Functions:**
- `handleMapClick()` - Click event processing
- `findSuburbAtCoordinates()` - Geographic lookup
- `onSuburbClick()` - Toolkit display callback
- `setSelectedSuburb()` - Selection state management

**Collected Data:**
```typescript
const suburb = {
  name: 'Red Hill',
  code: 'SA2_12345',
  score: 85,
  kpis: { yield: 4.2, growth5y: 12.5, vacancy: 2.1 },
  position: { x: 150, y: 200 }
};
```

### 7. Properties FAB Activation
**Trigger:** User clicks "Go" button on PropertiesFab

**Sequence:**
1. **Action Handling** - `handleShowProperties()` processes click
2. **Navigation Decision** - Scope-based routing logic applied
3. **View Mode Change** - `navigateToPropertyFilters()` triggered
4. **Component Switch** - `PropertyFilterView` renders

**Key Functions:**
- `handleShowProperties()` - FAB action processing
- `navigateToPropertyFilters()` - Navigation to filters
- `setViewMode('property-filters')` - View state update
- Component re-render logic

**Navigation Logic:**
```typescript
if (fabState.locationScope === 'suburb' && fabState.suburbId) {
  navigateToPropertyFilters(); // Direct to property filters
}
```

### 8. Property Filter Configuration
**Trigger:** User adjusts filter settings

**Sequence:**
1. **Filter State Management** - `handleFilterChange()` processes updates
2. **Property Type Handling** - `handlePropertyTypeChange()` manages checkboxes
3. **State Synchronization** - Local filter state updated
4. **User Preference Storage** - `updateUserPrefs()` saves settings

**Key Functions:**
- `handleFilterChange()` - Individual filter updates
- `handlePropertyTypeChange()` - Multi-select management
- `setFilters()` - Local state synchronization
- `updateUserPrefs()` - Persistent storage

**Filter Categories:**
- **Price Range:** Min/max price boundaries
- **Property Features:** Beds, baths, parking spaces
- **Property Type:** House, unit, townhouse, etc.
- **Investment Criteria:** High yield, under median, long DOM, dev hints
- **Land Size:** Minimum land area requirements

### 9. Filter Application
**Trigger:** User clicks "Apply" button

**Sequence:**
1. **Filter Processing** - `onApplyFilters()` callback triggered
2. **Navigation Execution** - `navigateToProperties()` changes view
3. **View Mode Update** - `setViewMode('properties')` executed
4. **Component Rendering** - `PropertiesView` displays filtered results

**Key Functions:**
- `onApplyFilters()` - Filter application trigger
- `navigateToProperties()` - View navigation
- `setViewMode('properties')` - State update
- Component re-render with filters

**Filter Application:**
```typescript
// Filters applied to property dataset
// Navigation changes to properties view
// Results filtered based on user criteria
// Suburb context preserved
```

### 10. Properties Display & Sorting
**Trigger:** Properties view renders with filtered results

**Sequence:**
1. **Result Rendering** - Filtered properties displayed
2. **Sorting Application** - `sortedProperties` applies user preference
3. **Score Display** - Suburb scores shown on property cards
4. **Interactive Controls** - Sort and view mode toggles available

**Key Functions:**
- `sortedProperties` - Dynamic sorting algorithm
- `formatPrice()` - Price formatting utility
- `getScoreColor()` - Score-based color coding
- `getPriceVsMedianColor()` - Market position indicators

**Sorting Options:**
- **Newest:** Most recently listed properties
- **Price:** Low to high or high to low
- **Yield Estimate:** Highest rental yield first
- **Price vs Median:** Best value opportunities

### 11. Return to Map View
**Trigger:** User clicks "Back" button

**Sequence:**
1. **Navigation Trigger** - `onBack()` callback executed
2. **View Restoration** - `navigateToMap()` returns to map
3. **State Preservation** - Filters and location scope maintained
4. **Map Enhancement** - Properties displayed as map overlays

**Key Functions:**
- `onBack()` - Return navigation trigger
- `navigateToMap()` - Map view restoration
- `setViewMode('map')` - View state update
- Map re-render with context

**Preserved Context:**
- Location scope: Red Hill suburb
- Applied filters: All user-selected criteria
- Property data: Filtered results available
- Strategy context: Current investment strategy active

## Technical Implementation Details

### Component Architecture
```
GrowPage (Container)
├── GrowTopBar (Search & Navigation)
├── GrowMap (Interactive Map)
│   ├── useGrowMap (Master Hook)
│   ├── useMapInitialization (Map Setup)
│   ├── useMapLayers (Data Layers)
│   ├── useMapEvents (User Interactions)
│   └── useMapScoring (Strategy Colors)
├── PropertyFilterView (Filter Interface)
└── PropertiesView (Results Display)
```

### State Management Flow
```
User Action → Component Event → Hook Method → Store Update → UI Re-render
```

### Key Hooks & Their Responsibilities
- **`useGrowMap`** - Orchestrates all map functionality
- **`useGrowState`** - Manages global application state
- **`useGrowNavigation`** - Handles view mode transitions
- **`useMapEvents`** - Processes user interactions
- **`useGrowStore`** - Centralized state storage

### Performance Considerations
- **Debounced Search:** 300ms delay prevents excessive API calls
- **Lazy Loading:** Map layers load progressively
- **State Persistence:** User preferences saved across sessions
- **Efficient Re-renders:** Component updates optimized for map performance

## Success Criteria
1. **Search Accuracy:** User finds intended suburb within 2-3 keystrokes
2. **Map Responsiveness:** Map movement completes within 2 seconds
3. **Filter Performance:** Property results update within 500ms
4. **Context Preservation:** All user selections maintained during navigation
5. **Visual Feedback:** Clear indication of current location and filters

## Error Handling
- **API Failures:** Graceful fallback with user notification
- **Invalid Coordinates:** Default to safe fallback location
- **Filter Conflicts:** Automatic resolution of contradictory filters
- **Network Issues:** Offline mode with cached data when possible

## Future Enhancements
- **Saved Searches:** Persistent filter combinations
- **Property Alerts:** Notifications for new matching properties
- **Advanced Analytics:** Market trend overlays on map
- **Social Features:** Share and compare property selections
- **Mobile Optimization:** Touch-friendly map interactions

## Related Documentation
- [GROW-SPEC.md](./grow-spec.md) - Overall module specification
- [IMPLEMENTATION_VERIFICATION.md](./IMPLEMENTATION_VERIFICATION.md) - Technical implementation details
- [USER_MANUAL.md](./USER_MANUAL.md) - End-user documentation


