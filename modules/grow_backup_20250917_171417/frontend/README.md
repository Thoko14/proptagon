# Grow Module - Suburb Map Functionality

## Overview

This module implements interactive suburb polygon outlines with hover functionality, popup display, and search zoom-to-fit capabilities using Mapbox GL JS.

## Features Implemented

### 1. Default Blue Outlines
- All suburb polygons display with blue outlines (`#3b82f6`) at all zoom levels
- Outlines are visible and consistent across the map
- Line width: 2px for good visibility

### 2. Hover Highlight + Popup
- **Orange highlight**: When hovering over a suburb (zoom ≥ 6), the outline changes to orange (`#f97316`)
- **Popup display**: Shows suburb name in a small popup positioned at the cursor
- **Mutual exclusivity**: Only one suburb can be highlighted at a time
- **Smooth transitions**: No flicker when moving between suburbs

### 3. Zoom Gating
- Hover functionality is only active at zoom level ≥ 6
- Below zoom 6: outlines remain blue with no hover/popup
- Above zoom 6: full hover functionality enabled

### 4. Search → Zoom-to-Fit
- Search bar supports suburb name search
- Automatically zooms to fit the entire suburb polygon
- Uses bounding box calculation from GeoJSON geometry
- Applies 50px padding for better visibility

### 5. Data Structure
- Uses `australia_simplified5.geojson` for suburb polygons
- Supports both `Polygon` and `MultiPolygon` geometries
- Suburb names from `properties.name` or `properties.SA2_NAME21`

## Technical Implementation

### Components

#### GrowMap.tsx
- Main map component with Mapbox GL JS integration
- Handles suburb data loading and layer management
- Implements hover detection and popup functionality
- Provides `zoomToSuburb` method via ref

#### GrowTopBar.tsx
- Search interface with suburb search integration
- Connects to map zoom functionality
- Falls back to Mapbox Geocoding API for non-suburb searches

#### App.tsx
- Main application component
- Manages state between map and search components
- Handles strategy mode and suburb selection

### Key Functions

#### Hover Detection
```typescript
const handleMouseMove = (e: mapboxgl.MapMouseEvent) => {
  if (!map.current || map.current.getZoom() < MIN_HOVER_ZOOM) return;
  
  const features = map.current.queryRenderedFeatures(e.point, {
    layers: [SUBURB_LAYER_ID]
  });
  
  // Update hover state and show popup
}
```

#### Zoom to Suburb
```typescript
const zoomToSuburb = (suburbName: string) => {
  // Find suburb by name in GeoJSON data
  // Calculate bounding box from geometry
  // Use fitBounds with padding
}
```

#### Bounding Box Calculation
```typescript
const getBoundingBox = (geometry: any): number[] | null => {
  // Process Polygon and MultiPolygon coordinates
  // Calculate min/max bounds
  // Return [minX, minY, maxX, maxY]
}
```

## Configuration

### Constants
- `MIN_HOVER_ZOOM = 6`: Minimum zoom for hover functionality
- `SUBURB_SOURCE_ID = 'suburbs'`: Mapbox source ID
- `SUBURB_LAYER_ID = 'suburbs-outline'`: Outline layer ID

### Colors
- Default outline: `#3b82f6` (blue)
- Hover outline: `#f97316` (orange)
- Line width: 2px

## Usage

### Basic Map Display
```tsx
<GrowMap 
  onMapReady={setMapInstance} 
  className="w-full h-full"
/>
```

### With Search Integration
```tsx
<GrowMap 
  ref={mapRef}
  onMapReady={setMapInstance} 
  onSuburbSearch={handleSuburbSearch}
/>

<GrowTopBar 
  onSearch={handleSearchResult} 
  onSuburbSearch={handleSuburbSearch}
/>
```

### Programmatic Suburb Zoom
```tsx
const mapRef = useRef<GrowMapRef>(null);

// Zoom to specific suburb
mapRef.current?.zoomToSuburb('Bondi Beach');
```

## Data Requirements

The implementation expects GeoJSON data with the following structure:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[lng, lat], ...]]
      },
      "properties": {
        "id": "unique_id",
        "name": "Suburb Name",
        "SA2_NAME21": "Alternative Name"
      }
    }
  ]
}
```

## Browser Compatibility

- Modern browsers with ES6+ support
- Mapbox GL JS v2.x
- React 16.8+ (for hooks)

## Performance Considerations

- GeoJSON data is loaded once on map initialization
- Hover detection uses efficient `queryRenderedFeatures`
- Popup creation/destruction is optimized
- Bounding box calculations are cached per feature
