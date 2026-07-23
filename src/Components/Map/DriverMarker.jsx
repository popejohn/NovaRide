import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { useMapInstance } from './MapContext';
import { toLngLat } from './mapUtils';

const DriverMarker = ({ position, popupText = 'Driver Location', popupSubtext = '' }) => {
  const { map } = useMapInstance();
  const markerRef = useRef(null);
  const currentCoordsRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!map || !position) return;

    const targetCoords = toLngLat(position);
    if (!targetCoords) return;

    // Create marker element if it doesn't exist
    if (!markerRef.current) {
      const el = document.createElement('div');
      el.className = 'custom-driver-marker';
      el.innerHTML = `<div style="background-color: #f97316; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 0 12px rgba(249, 115, 22, 0.7); cursor: pointer; transition: transform 0.2s ease;">🚗</div>`;

      const popup = new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML(`
        <div style="text-align: center; padding: 4px;">
          <div style="font-weight: bold; color: #ea580c;">${popupText}</div>
          <div style="font-size: 11px; color: #4b5563;">${popupSubtext || `${targetCoords[1].toFixed(4)}, ${targetCoords[0].toFixed(4)}`}</div>
        </div>
      `);

      markerRef.current = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat(targetCoords)
        .setPopup(popup)
        .addTo(map);

      currentCoordsRef.current = targetCoords;
      return;
    }

    // Smooth marker movement interpolation
    const startCoords = currentCoordsRef.current || targetCoords;
    const startTime = performance.now();
    const duration = 1200; // ms for smooth transition between location updates

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out quad
      const easeProgress = 1 - (1 - progress) * (1 - progress);

      const currentLng = startCoords[0] + (targetCoords[0] - startCoords[0]) * easeProgress;
      const currentLat = startCoords[1] + (targetCoords[1] - startCoords[1]) * easeProgress;

      const interpolated = [currentLng, currentLat];
      currentCoordsRef.current = interpolated;

      if (markerRef.current) {
        markerRef.current.setLngLat(interpolated);
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [map, position, popupText, popupSubtext]);

  // Clean up marker safely on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (markerRef.current) {
        try {
          markerRef.current.remove();
        } catch (e) {
          // Ignore marker removal error if map was destroyed
        }
        markerRef.current = null;
      }
    };
  }, []);

  return null;
};

export default DriverMarker;
