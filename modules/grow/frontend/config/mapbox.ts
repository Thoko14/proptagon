// Mapbox configuration
export const MAPBOX_CONFIG = {
  accessToken: 'pk.eyJ1IjoidG9tbXN0YXIyNSIsImEiOiJjbWUzN2VucmgwNGc3MmpzZWMxODkyN29pIn0.FaVz4ISNR1sQqT8o6Qj2Aw',
  style: 'mapbox://styles/mapbox/light-v11', // Light style that supports custom layers
  center: [134.5, -25.5] as [number, number], // Australia center
  zoom: 5, // Start at zoom 6 to show localities across Australia
  // Performance optimizations
  renderWorldCopies: false,
  maxZoom: 18,
  minZoom: 3,
  // Smooth zooming
  zoomAnimationDuration: 300,
  // Reduce flickering
  preserveDrawingBuffer: true,
} as const;