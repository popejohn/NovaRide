import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import OtherNav from './VerifiedNav';
import Button from './Button';
import { FaMapMarkerAlt, FaClock, FaCar, FaPhone, FaStar } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Mock driver position updates
const mockDriverPositions = [
  { lat: 6.5244, lng: 3.3792 }, // Starting position
  { lat: 6.5250, lng: 3.3800 },
  { lat: 6.5260, lng: 3.3810 },
  { lat: 6.5270, lng: 3.3820 },
  { lat: 6.5280, lng: 3.3830 }, // Final position near destination
];

const LiveTracking = () => {
  const navigate = useNavigate();
  const { pickupLocation, destination, selectedRider } = useSelector(state => state.getRide);

  const [driverPosition, setDriverPosition] = useState(mockDriverPositions[0]);
  const [currentETA, setCurrentETA] = useState(15);
  const [rideStatus, setRideStatus] = useState('Driver is on the way');

  // Mock pickup and destination coordinates
  const pickupCoords = [6.5244, 3.3792];
  const destinationCoords = [6.5280, 3.3830];

  useEffect(() => {
    let index = 0;
    // Simulate driver movement
    const interval = setInterval(() => {
      index += 1;
      if (index < mockDriverPositions.length) {
        setDriverPosition(mockDriverPositions[index]);
        setCurrentETA(Math.max(1, currentETA - 3));

        if (index === 2) {
          setRideStatus('Driver has arrived at pickup location');
        } else if (index === 4) {
          setRideStatus('Arriving at destination');
          setTimeout(() => {
            navigate('/ride-completion');
          }, 3000);
        }
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [currentETA, navigate]);

  const routeCoordinates = [
    pickupCoords,
    [driverPosition.lat, driverPosition.lng],
    destinationCoords
  ];

  return (
    <div className="min-h-screen">
      <Navbar userrole="" userverified={true} profilePic="/placeholderProfile.jpg" nav={<OtherNav />} />

      <div className="mt-24 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow h-96 lg:h-[500px]">
                <MapContainer
                  center={[6.5260, 3.3810]}
                  zoom={14}
                  style={{ height: '100%', width: '100%' }}
                  className="rounded-lg"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />

                  {/* Pickup location */}
                  <Marker position={pickupCoords}>
                    <Popup>Pickup: {pickupLocation}</Popup>
                  </Marker>

                  {/* Driver location */}
                  <Marker position={[driverPosition.lat, driverPosition.lng]}>
                    <Popup>Driver: {selectedRider?.name || 'Your Driver'}</Popup>
                  </Marker>

                  {/* Destination */}
                  <Marker position={destinationCoords}>
                    <Popup>Destination: {destination}</Popup>
                  </Marker>

                  {/* Route line */}
                  <Polyline
                    positions={routeCoordinates}
                    color="blue"
                    weight={4}
                    opacity={0.7}
                  />
                </MapContainer>
              </div>
            </div>

            {/* Ride Info Panel */}
            <div className="space-y-4">
              {/* Driver Info */}
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={selectedRider?.profilePic || '/placeholderProfile.jpg'}
                    alt={selectedRider?.name || 'Driver'}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{selectedRider?.name || 'John Adebayo'}</h3>
                    <div className="flex items-center space-x-1">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="text-sm text-gray-600">4.8</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <FaCar className="text-gray-500" />
                    <span>{selectedRider?.vehicle?.model || 'Toyota Camry'} • White</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Plate:</span>
                    <span>{selectedRider?.vehicle?.plate || 'ABC 123 XY'}</span>
                  </div>
                </div>

                <Button
                  text="Call Driver"
                  classes="w-full mt-4 bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
                  onClick={() => {/* Handle call */}}
                />
              </div>

              {/* Ride Status */}
              <div className="bg-black text-white rounded-lg shadow p-4">
                <h3 className="font-semibold mb-2">Ride Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Status</span>
                    <span className="font-medium">{rideStatus}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">ETA</span>
                    <div className="flex items-center space-x-1">
                      <FaClock className="text-yellow-400" />
                      <span className="font-medium">{currentETA} min</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Distance</span>
                    <span className="font-medium">2.1 km</span>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold mb-3">Trip Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">From:</span>
                    <span className="font-medium">{pickupLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">To:</span>
                    <span className="font-medium">{destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fare:</span>
                    <span className="font-bold text-lg">₦{selectedRider?.fare || 2500}</span>
                  </div>
                </div>
              </div>

              {/* Emergency Button */}
              <Button
                text="Emergency"
                classes="w-full bg-red-600 text-white py-3 px-4 rounded font-semibold hover:bg-red-700"
                onClick={() => {/* Handle emergency */}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;