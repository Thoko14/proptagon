// Catchments configuration for Mapbox vector tiles
// NSW tilesets provided by user

export const NSW_CATCHMENTS_TILESETS = {
  primary: 'mapbox://tommstar25.dg9ropwk',
  secondary: 'mapbox://tommstar25.cbf6rphf',
  future: 'mapbox://tommstar25.42l9a1mu',
  schools: 'mapbox://tommstar25.0mxd9sgh',
} as const;

// Suggested source IDs for Mapbox
export const NSW_CATCHMENTS_SOURCE_IDS = {
  primary: 'nsw-catchments-primary',
  secondary: 'nsw-catchments-secondary',
  future: 'nsw-catchments-future',
  schools: 'nsw-schools',
} as const;

// Suggested layer IDs (fill/line) per tileset
export const NSW_CATCHMENTS_LAYER_IDS = {
  primary: {
    fill: 'nsw-catchments-primary-fill',
    line: 'nsw-catchments-primary-line',
  },
  secondary: {
    fill: 'nsw-catchments-secondary-fill',
    line: 'nsw-catchments-secondary-line',
  },
  future: {
    fill: 'nsw-catchments-future-fill',
    line: 'nsw-catchments-future-line',
  },
  schools: {
    points: 'nsw-schools-points',
    labels: 'nsw-schools-labels',
  },
} as const;

// Source-layer names within each tileset
export const NSW_CATCHMENTS_SOURCE_LAYERS = {
  primary: 'catchments_primary', // Enriched tileset uses 'catchments_primary' layer name
  secondary: 'catchments_secondary', // Enriched tileset uses 'catchments_secondary' layer name
  future: 'catchments', // Future tileset unchanged
  schools: 'schools', // Schools source layer name
} as const;

// Note: We still need the exact source-layer names within each tileset to wire layers.

