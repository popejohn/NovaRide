import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom icons for different marker types
const driverIcon = L.divIcon({
  html: `<div style="background-color: #f97316; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 0 10px rgba(249, 115, 22, 0.6);">🚗</div>`,
  iconSize: [40, 40],
  className: 'custom-icon'
});

const pickupIcon = L.divIcon({
  html: `<div style="background-color: #3b82f6; color: white; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.6);">📍</div>`,
  iconSize: [36, 36],
  className: 'custom-icon'
});

const destinationIcon = L.divIcon({
  html: `<div style="background-color: #ef4444; color: white; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 0 10px rgba(239, 68, 68, 0.6);">🎯</div>`,
  iconSize: [36, 36],
  className: 'custom-icon'
});

// Component to fit bounds on the map
const FitBounds = ({ bounds }) => {
  const map = useMap();
  
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [bounds, map]);
  
  return null;
};

const MapSection = ({ rideDetails, driverLocation, pickupLocation, destinationLocation }) => {
  // Default center if no locations available
  const defaultCenter = [6.5244, 3.3792]; // Lagos coordinates
  const center = driverLocation || pickupLocation || defaultCenter;

  // Calculate bounds for all locations
  const getBounds = () => {
    const locations = [];
    if (driverLocation) locations.push(driverLocation);
    if (pickupLocation) locations.push(pickupLocation);
    if (destinationLocation) locations.push(destinationLocation);
    return locations.length > 0 ? locations : null;
  };

  const bounds = getBounds();

  // Create route coordinates for polyline
  const routeCoordinates = [];
  if (pickupLocation) routeCoordinates.push(pickupLocation);
  if (destinationLocation) routeCoordinates.push(destinationLocation);

  return (
    <div className="relative w-full h-96 md:h-[500px] rounded-[2.5rem] overflow-hidden shadow-3xl">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={20}
        />

        {/* Route line between pickup and destination */}
        {routeCoordinates.length === 2 && (
          <Polyline
            positions={routeCoordinates}
            color="#f97316"
            weight={3}
            opacity={0.7}
            dashArray="5, 5"
          />
        )}

        {/* Driver Marker */}
        {driverLocation && (
          <Marker position={driverLocation} icon={driverIcon}>
            <Popup>
              <div className="text-center">
                <div className="font-bold text-orange-600">Driver Location</div>
                <div className="text-xs text-gray-600">{driverLocation[0].toFixed(4)}, {driverLocation[1].toFixed(4)}</div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Pickup Location Marker */}
        {pickupLocation && (
          <Marker position={pickupLocation} icon={pickupIcon}>
            <Popup>
              <div className="text-center">
                <div className="font-bold text-blue-600">Pickup Location</div>
                <div className="text-xs text-gray-600">{rideDetails?.pickupLocation || 'Pickup'}</div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination Marker */}
        {destinationLocation && (
          <Marker position={destinationLocation} icon={destinationIcon}>
            <Popup>
              <div className="text-center">
                <div className="font-bold text-red-600">Destination</div>
                <div className="text-xs text-gray-600">{rideDetails?.destination || 'Destination'}</div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Fit bounds when all locations are available */}
        {bounds && <FitBounds bounds={bounds} />}
      </MapContainer>

      {/* Map Overlay Info */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-2xl p-4 text-white z-10 max-w-xs">
        <div className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-1">Status</div>
        <div className="text-lg font-black text-white">{rideDetails?.rideStatus || 'Loading...'}</div>
      </div>
    </div>
  );
};

export default MapSection;