import React, { useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import { useMapInstance } from './MapContext';
import { toLngLat } from './mapUtils';

const FitBounds = ({ points = [], padding = 50, maxZoom = 15 }) => {
  const { map } = useMapInstance();

  useEffect(() => {
    if (!map || !points || points.length === 0) return;

    const validCoords = points.map((p) => toLngLat(p)).filter(Boolean);
    if (validCoords.length === 0) return;

    const bounds = new maplibregl.LngLatBounds();
    validCoords.forEach((coord) => {
      bounds.extend(coord);
    });

    map.fitBounds(bounds, {
      padding: typeof padding === 'number' ? padding : 50,
      maxZoom: maxZoom,
      duration: 800
    });
  }, [map, points, padding, maxZoom]);

  return null;
};

export default FitBounds;
