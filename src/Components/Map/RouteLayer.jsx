import React, { useEffect } from 'react';
import { useMapInstance } from './MapContext';
import { toLngLat } from './mapUtils';

const RouteLayer = ({
  id = 'route-layer',
  coordinates = [],
  color = '#f97316',
  width = 4,
  opacity = 0.8,
  dashed = false
}) => {
  const { map } = useMapInstance();
  const sourceId = `${id}-source`;
  const layerId = `${id}-line`;

  useEffect(() => {
    if (!map || !coordinates || coordinates.length < 2) return;

    // Normalize coordinates array to [[lng, lat], ...]
    const formattedCoordinates = coordinates
      .map((c) => toLngLat(c))
      .filter(Boolean);

    if (formattedCoordinates.length < 2) return;

    const geojsonData = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: formattedCoordinates
      }
    };

    const addOrUpdateLayer = () => {
      try {
        const existingSource = map.getSource(sourceId);
        if (existingSource) {
          existingSource.setData(geojsonData);
        } else {
          map.addSource(sourceId, {
            type: 'geojson',
            data: geojsonData
          });

          const paintOptions = {
            'line-color': color,
            'line-width': width,
            'line-opacity': opacity
          };

          if (dashed) {
            paintOptions['line-dasharray'] = [2, 2];
          }

          map.addLayer({
            id: layerId,
            type: 'line',
            source: sourceId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: paintOptions
          });
        }
      } catch (err) {
        // Map instance might be destroyed
      }
    };

    if (map.isStyleLoaded()) {
      addOrUpdateLayer();
    } else {
      map.once('styledata', addOrUpdateLayer);
    }

    return () => {
      try {
        if (map && map.getStyle && map.getStyle()) {
          if (map.getLayer && map.getLayer(layerId)) {
            map.removeLayer(layerId);
          }
          if (map.getSource && map.getSource(sourceId)) {
            map.removeSource(sourceId);
          }
        }
      } catch (err) {
        // Ignore unmount layer cleanup error if map removed
      }
    };
  }, [map, coordinates, color, width, opacity, dashed, id, sourceId, layerId]);

  return null;
};

export default RouteLayer;
