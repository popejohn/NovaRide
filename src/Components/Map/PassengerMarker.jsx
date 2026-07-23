import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { useMapInstance } from './MapContext';
import { toLngLat } from './mapUtils';

const PassengerMarker = ({
  position,
  type = 'pickup', // 'pickup' | 'destination' | 'default'
  draggable = false,
  onDragEnd = null,
  popupTitle = '',
  popupSubtext = '',
  customIcon = null
}) => {
  const { map } = useMapInstance();
  const markerRef = useRef(null);
  const onDragEndRef = useRef(onDragEnd);

  useEffect(() => {
    onDragEndRef.current = onDragEnd;
  }, [onDragEnd]);

  const getMarkerHtml = () => {
    if (customIcon) return customIcon;
    if (type === 'pickup') {
      return `<div style="background-color: #3b82f6; color: white; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.6); cursor: ${draggable ? 'grab' : 'pointer'};">📍</div>`;
    }
    if (type === 'destination') {
      return `<div style="background-color: #ef4444; color: white; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 0 10px rgba(239, 68, 68, 0.6); cursor: ${draggable ? 'grab' : 'pointer'};">🎯</div>`;
    }
    return `<div style="background-color: #10b981; color: white; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 0 10px rgba(16, 185, 129, 0.6); cursor: pointer;">👤</div>`;
  };

  useEffect(() => {
    if (!map || !position) return;

    const coords = toLngLat(position);
    if (!coords) return;

    if (!markerRef.current) {
      const el = document.createElement('div');
      el.className = `custom-${type}-marker`;
      el.innerHTML = getMarkerHtml();

      const popupContent = popupTitle || popupSubtext
        ? `<div style="text-align: center; padding: 4px;">
            ${popupTitle ? `<div style="font-weight: bold; color: ${type === 'pickup' ? '#2563eb' : '#dc2626'};">${popupTitle}</div>` : ''}
            ${popupSubtext ? `<div style="font-size: 11px; color: #4b5563;">${popupSubtext}</div>` : ''}
          </div>`
        : null;

      const popup = popupContent
        ? new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML(popupContent)
        : null;

      const markerOptions = {
        element: el,
        draggable: draggable,
        anchor: 'center'
      };

      const marker = new maplibregl.Marker(markerOptions)
        .setLngLat(coords)
        .addTo(map);

      if (popup) {
        marker.setPopup(popup);
      }

      if (draggable) {
        marker.on('dragend', () => {
          const lngLat = marker.getLngLat();
          if (onDragEndRef.current) {
            onDragEndRef.current({ lat: lngLat.lat, lng: lngLat.lng, lngLat });
          }
        });
      }

      markerRef.current = marker;
    } else {
      markerRef.current.setLngLat(coords);
    }
  }, [map, position, draggable, popupTitle, popupSubtext, type]);

  // Handle cleanup on unmount safely
  useEffect(() => {
    return () => {
      if (markerRef.current) {
        try {
          markerRef.current.remove();
        } catch (e) {
          // Ignore marker removal error if map was already destroyed
        }
        markerRef.current = null;
      }
    };
  }, []);

  return null;
};

export default PassengerMarker;
