// Mapbox configuration
export const MAPBOX_CONFIG = {
  accessToken: 'pk.eyJ1IjoidG9tbXN0YXIyNSIsImEiOiJjbWUzN2VucmgwNGc3MmpzZWMxODkyN29pIn0.FaVz4ISNR1sQqT8o6Qj2Aw',
  style: 'mapbox://styles/mapbox/light-v11', // Light style that supports custom layers
  center: [134.5, -25.5] as [number, number], // Australia center
  zoom: 3.5,
} as const; 