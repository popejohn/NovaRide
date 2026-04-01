import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapSection = ({ rideDetails, driverLocation, passengerLocation }) => {
  // Default center if no locations available
  const defaultCenter = [6.5244, 3.3792]; // Lagos coordinates
  const center = driverLocation || passengerLocation || defaultCenter;

  return (
    <div className="relative w-full h-96 md:h-[500px] rounded-[2.5rem] overflow-hidden shadow-3xl">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Driver Marker */}
        {driverLocation && (
          <Marker position={driverLocation}>
            <Popup>Driver Location</Popup>
          </Marker>
        )}

        {/* Passenger Marker */}
        {passengerLocation && (
          <Marker position={passengerLocation}>
            <Popup>Passenger Location</Popup>
          </Marker>
        )}

        {/* Pickup Marker */}
        {rideDetails?.pickupLocation && (
          <Marker position={[rideDetails.pickupLat || 6.5244, rideDetails.pickupLng || 3.3792]}>
            <Popup>Pickup: {rideDetails.pickupLocation}</Popup>
          </Marker>
        )}

        {/* Drop-off Marker */}
        {rideDetails?.destination && (
          <Marker position={[rideDetails.dropLat || 6.5244, rideDetails.dropLng || 3.3792]}>
            <Popup>Drop-off: {rideDetails.destination}</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Map Overlay Info */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-2xl p-4 text-white z-10">
        <div className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-1">Status</div>
        <div className="text-lg font-black text-white">{rideDetails?.status || 'Loading...'}</div>
      </div>
    </div>
  );
};

export default MapSection;