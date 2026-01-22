import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from './Navbar';
import OtherNav from './VerifiedNav';
import Button from './Button';
import { FaMapMarkerAlt, FaClock, FaUser, FaCar, FaRoute } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const IncomingRideRequest = () => {
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds countdown
  const [isAccepted, setIsAccepted] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);

  // Mock ride request data
  const rideRequest = {
    id: 'ride_123',
    passenger: {
      name: 'Sarah Johnson',
      phone: '+2348012345678',
      rating: 4.8,
      profilePic: '/placeholderProfile.jpg'
    },
    pickup: {
      address: 'Ikeja City Mall, Ikeja',
      coordinates: [6.5244, 3.3792]
    },
    destination: {
      address: 'Lekki Phase 1, Lekki',
      coordinates: [6.4698, 3.5852]
    },
    distance: 15.2,
    duration: 25,
    fare: 3200,
    paymentMethod: 'Wallet',
    notes: 'Please help with luggage'
  };

  const routeCoordinates = [
    rideRequest.pickup.coordinates,
    rideRequest.destination.coordinates
  ];

  useEffect(() => {
    if (timeLeft > 0 && !isAccepted && !isDeclined) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAccepted && !isDeclined) {
      // Auto-decline if not responded
      handleDecline();
    }
  }, [timeLeft, isAccepted, isDeclined]);

  const handleAccept = () => {
    setIsAccepted(true);
    // In real app, send acceptance to API
    setTimeout(() => {
      navigate('/rider-live-tracking');
    }, 2000);
  };

  const handleDecline = () => {
    setIsDeclined(true);
    // In real app, send decline to API
    setTimeout(() => {
      navigate('/riderdashboard');
    }, 2000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isAccepted) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCar className="text-4xl text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Ride Accepted!</h2>
          <p className="text-green-600">Heading to pickup location...</p>
        </div>
      </div>
    );
  }

  if (isDeclined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCar className="text-4xl text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ride Declined</h2>
          <p className="text-gray-600">Looking for the next ride request...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar userrole="rider" userverified={true} profilePic="/placeholderProfile.jpg" nav={<OtherNav userrole="rider" />} />

      <div className="mt-24 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ride Request Card */}
            <div className="bg-black text-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">New Ride Request</h1>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">{formatTime(timeLeft)}</div>
                  <div className="text-sm text-gray-300">Time left</div>
                </div>
              </div>

              {/* Passenger Info */}
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={rideRequest.passenger.profilePic}
                  alt={rideRequest.passenger.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-xl font-semibold">{rideRequest.passenger.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <span>⭐ {rideRequest.passenger.rating}</span>
                    <span>•</span>
                    <span>{rideRequest.passenger.phone}</span>
                  </div>
                </div>
              </div>

              {/* Route Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="flex flex-col items-center">
                    <FaMapMarkerAlt className="text-green-400" />
                    <div className="w-0.5 h-8 bg-gray-600 mt-1"></div>
                    <FaMapMarkerAlt className="text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{rideRequest.pickup.address}</div>
                    <div className="text-sm text-gray-300 mb-2">Pickup location</div>
                    <div className="font-medium">{rideRequest.destination.address}</div>
                    <div className="text-sm text-gray-300">Destination</div>
                  </div>
                </div>
              </div>

              {/* Ride Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-300 mb-1">
                    <FaRoute />
                    <span className="text-sm">Distance</span>
                  </div>
                  <div className="font-semibold">{rideRequest.distance} km</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-300 mb-1">
                    <FaClock />
                    <span className="text-sm">Duration</span>
                  </div>
                  <div className="font-semibold">{rideRequest.duration} min</div>
                </div>
              </div>

              {/* Fare and Payment */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <div className="text-sm text-gray-300">Fare</div>
                  <div className="text-2xl font-bold text-yellow-400">₦{rideRequest.fare}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-300">Payment</div>
                  <div className="font-semibold">{rideRequest.paymentMethod}</div>
                </div>
              </div>

              {/* Special Notes */}
              {rideRequest.notes && (
                <div className="mb-6">
                  <div className="text-sm text-gray-300 mb-1">Notes</div>
                  <div className="bg-gray-800 p-3 rounded text-sm">{rideRequest.notes}</div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button
                  text="Accept Ride"
                  classes="flex-1 bg-yellow-400 text-black py-3 px-4 rounded font-semibold hover:bg-yellow-500"
                  onClick={handleAccept}
                />
                <Button
                  text="Decline"
                  classes="flex-1 bg-gray-600 text-white py-3 px-4 rounded font-semibold hover:bg-gray-700"
                  onClick={handleDecline}
                />
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-lg shadow h-96 lg:h-auto">
              <MapContainer
                center={[6.5244, 3.3792]}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
                className="rounded-lg"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Pickup location */}
                <Marker position={rideRequest.pickup.coordinates}>
                  <Popup>Pickup: {rideRequest.pickup.address}</Popup>
                </Marker>

                {/* Destination */}
                <Marker position={rideRequest.destination.coordinates}>
                  <Popup>Destination: {rideRequest.destination.address}</Popup>
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
        </div>
      </div>
    </div>
  );
};

export default IncomingRideRequest;