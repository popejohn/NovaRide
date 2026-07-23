import React, { useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import { useMapInstance } from './MapContext';

const MapControls = ({ position = 'top-right', showCompass = true, showZoom = true }) => {
  const { map } = useMapInstance();

  useEffect(() => {
    if (!map) return;

    const navControl = new maplibregl.NavigationControl({
      showCompass,
      showZoom
    });

    try {
      map.addControl(navControl, position);
    } catch (err) {
      console.warn('Failed to add control:', err);
    }

    return () => {
      try {
        if (map && map.hasControl && map.hasControl(navControl)) {
          map.removeControl(navControl);
        }
      } catch (err) {
        // Map instance was already destroyed or unmounted
      }
    };
  }, [map, position, showCompass, showZoom]);

  return null;
};

export default MapControls;
