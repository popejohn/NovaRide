import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapContext } from './MapContext';
import { cartoVoyagerStyle, toLngLat, toLngLatBounds } from './mapUtils';

const MapView = ({
  center = [3.9470, 7.3775], // Default Ibadan [lng, lat]
  zoom = 12,
  minZoom = 0,
  maxZoom = 20,
  maxBounds = null,
  onClick = null,
  mapStyle = cartoVoyagerStyle,
  className = '',
  style = { height: '100%', width: '100%' },
  children
}) => {
  const containerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const onClickRef = useRef(onClick);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);

  // Keep onClickRef updated to prevent stale closures
  useEffect(() => {
    onClickRef.current = onClick;
  }, [onClick]);

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current || mapInstanceRef.current) return;

    const normalizedCenter = toLngLat(center) || [3.9470, 7.3775];
    const normalizedMaxBounds = maxBounds ? toLngLatBounds(maxBounds) : undefined;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: mapStyle,
      center: normalizedCenter,
      zoom: zoom,
      minZoom: minZoom,
      maxZoom: maxZoom,
      maxBounds: normalizedMaxBounds,
      attributionControl: true
    });

    mapInstanceRef.current = map;

    map.on('load', () => {
      setMapLoaded(true);
      setMapInstance(map);
      map.resize();
    });

    // Handle map clicks using the ref to access latest callback & state
    const handleMapClick = (e) => {
      if (onClickRef.current) {
        onClickRef.current({
          lat: e.lngLat.lat,
          lng: e.lngLat.lng,
          lngLat: e.lngLat
        });
      }
    };

    map.on('click', handleMapClick);

    // ResizeObserver for responsive sizing
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.resize();
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      map.off('click', handleMapClick);
      resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Synchronize dynamic center updates
  useEffect(() => {
    if (!mapInstanceRef.current || !center) return;
    const normalizedCenter = toLngLat(center);
    if (normalizedCenter) {
      const currentCenter = mapInstanceRef.current.getCenter();
      const dist = Math.hypot(currentCenter.lng - normalizedCenter[0], currentCenter.lat - normalizedCenter[1]);
      // Only fly/pan if distance is meaningful to prevent jumpiness
      if (dist > 0.0001) {
        mapInstanceRef.current.panTo(normalizedCenter, { duration: 600 });
      }
    }
  }, [center]);

  return (
    <MapContext.Provider value={{ map: mapInstance, mapLoaded }}>
      <div ref={containerRef} className={`relative overflow-hidden ${className}`} style={style}>
        {mapLoaded && children}
      </div>
    </MapContext.Provider>
  );
};

export default MapView;
