/**
 * Utility functions for MapLibre map operations
 */

export const cartoVoyagerStyle = {
  version: 8,
  sources: {
    'carto-voyager': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        'https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }
  },
  layers: [
    {
      id: 'carto-voyager-layer',
      type: 'raster',
      source: 'carto-voyager',
      minzoom: 0,
      maxzoom: 20
    }
  ]
};

export const openStreetMapStyle = {
  version: 8,
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  },
  layers: [
    {
      id: 'osm-layer',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 19
    }
  ]
};

/**
 * Normalizes input coordinates into MapLibre standard [lng, lat] format.
 * Accepts [lat, lng], [lng, lat], or { lat, lng } / { latitude, longitude }.
 */
export const toLngLat = (coord) => {
  if (!coord) return null;

  // Handle object { lat, lng } or { latitude, longitude }
  if (typeof coord === 'object' && !Array.isArray(coord)) {
    const lat = coord.lat ?? coord.latitude;
    const lng = coord.lng ?? coord.longitude;
    if (lat != null && lng != null) {
      return [Number(lng), Number(lat)];
    }
  }

  // Handle array [val1, val2]
  if (Array.isArray(coord) && coord.length >= 2) {
    const [first, second] = coord.map(Number);
    if (isNaN(first) || isNaN(second)) return null;

    // Detect [lat, lng] vs [lng, lat] for West Africa / Nigeria:
    // Latitude is positive ~4 to ~14 (Ibadan ~7.37, Lagos ~6.52)
    // Longitude is positive ~2 to ~14 (Ibadan ~3.94, Lagos ~3.38)
    // If first element is > 5 and second element is < 5, first is lat and second is lng
    if (first > 5.5 && first < 15 && second > 1.5 && second < 5.5) {
      return [second, first]; // convert to [lng, lat]
    }
    return [first, second]; // assume already [lng, lat]
  }

  return null;
};

/**
 * Converts bounds from [[lat1, lng1], [lat2, lng2]] or [[lng1, lat1], [lng2, lat2]]
 * to MapLibre LngLatBoundsLike format: [[minLng, minLat], [maxLng, maxLat]]
 */
export const toLngLatBounds = (bounds) => {
  if (!bounds || !Array.isArray(bounds) || bounds.length < 2) return null;
  const sw = toLngLat(bounds[0]);
  const ne = toLngLat(bounds[1]);
  if (!sw || !ne) return null;

  const minLng = Math.min(sw[0], ne[0]);
  const maxLng = Math.max(sw[0], ne[0]);
  const minLat = Math.min(sw[1], ne[1]);
  const maxLat = Math.max(sw[1], ne[1]);

  return [[minLng, minLat], [maxLng, maxLat]];
};
