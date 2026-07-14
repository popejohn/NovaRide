import React, { useState, useEffect } from 'react';
import api from '../services/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from './Navbar';
import OtherNav from './VerifiedNav';
import Button from './Button';
import { FaMapMarkerAlt, FaClock, FaUser, FaCar, FaRoute } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const IncomingRideRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const rideId = queryParams.get('rideId');

  const [timeLeft, setTimeLeft] = useState(30);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);
  const [rideDetails, setRideDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const response = await api.get(`/ride/${rideId}`);
        setRideDetails(response.data.ride);
      } catch (error) {
        console.error('Error fetching ride:', error);
      } finally {
        setLoading(false);
      }
    };

    if (rideId) fetchRide();
  }, [rideId]);

  useEffect(() => {
    if (timeLeft > 0 && !isAccepted && !isDeclined) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isAccepted, isDeclined]);

  const handleAcceptRide = async () => {
    try {
      await api.post('/ride/accept-ride', { rideId });
      setIsAccepted(true);
      setTimeout(() => {
        navigate(`/live-tracking?rideId=${rideId}`);
      }, 2000);
    } catch (error) {
      console.error('Error accepting ride:', error);
      alert(error.response?.data?.message || 'An error occurred while accepting the ride');
    }
  };

  const handleDecline = async () => {
    try {
      await api.post('/ride/reject-ride', { rideId });
      setIsDeclined(true);
      setTimeout(() => {
        navigate('/riderdashboard');
      }, 2000);
    } catch (error) {
      console.error('Error rejecting ride:', error);
      alert(error.response?.data?.message || 'An error occurred while rejecting the ride');
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Fetching ride details...</p>
        </div>
      </div>
    );
  }

  if (!rideDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ride Not Found</h2>
          <Button text="Go Back" onClick={() => navigate('/riderdashboard')} />
        </div>
      </div>
    );
  }

  const routeCoordinates = [
    [rideDetails.pickupCoordinates.coordinates[1], rideDetails.pickupCoordinates.coordinates[0]],
    [rideDetails.destinationCoordinates.coordinates[1], rideDetails.destinationCoordinates.coordinates[0]]
  ];

  return (
    <div className="min-h-screen">
      <Navbar userrole="rider" userverified={true} profilePic={rideDetails.user?.profilePic || "/placeholderProfile.jpg"} nav={<OtherNav userrole="rider" />} />

      <div className="mt-24 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ride Request Card */}
            <div className="bg-black text-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Ride Recommendation</h1>
                <div className="text-center">
                  <div className="text-sm text-gray-300">Status</div>
                  <div className="text-xl font-bold text-yellow-400 uppercase">{rideDetails.rideStatus}</div>
                </div>
              </div>

              {/* Passenger Info */}
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={rideDetails.user?.profilePic || "/placeholderProfile.jpg"}
                  alt={rideDetails.user?.firstname}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-xl font-semibold">{rideDetails.user?.firstname} {rideDetails.user?.lastname}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <span>⭐ 4.8</span>
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
                    <div className="font-medium">{rideDetails.pickupLocation}</div>
                    <div className="text-sm text-gray-300 mb-2">Pickup location</div>
                    <div className="font-medium">{rideDetails.destination}</div>
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
                  <div className="font-semibold">{rideDetails.distance} km</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-300 mb-1">
                    <FaClock />
                    <span className="text-sm">Duration</span>
                  </div>
                  <div className="font-semibold">{rideDetails.eta} min</div>
                </div>
              </div>

              {/* Fare and Payment */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <div className="text-sm text-gray-300">Fare</div>
                  <div className="text-2xl font-bold text-yellow-400">₦{rideDetails.fare}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-300">Payment</div>
                  <div className="font-semibold">Wallet</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                {rideDetails.rideStatus === 'waiting_for_acceptance' ? (
                  <>
                    <Button
                      text="Accept Ride"
                      classes="flex-1 bg-yellow-400 text-black py-3 px-4 rounded font-semibold hover:bg-yellow-500"
                      onClick={handleAcceptRide}
                    />
                    <Button
                      text="Decline"
                      classes="flex-1 bg-red-600 text-white py-3 px-4 rounded font-semibold hover:bg-red-700"
                      onClick={handleDecline}
                    />
                  </>
                ) : (
                  <Button
                    text="Go to Dashboard"
                    classes="flex-1 bg-gray-600 text-white py-3 px-4 rounded font-semibold hover:bg-gray-700"
                    onClick={() => navigate('/riderdashboard')}
                  />
                )}
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-lg shadow h-96 lg:h-auto">
              <MapContainer
                center={[rideDetails.pickupCoordinates.coordinates[1], rideDetails.pickupCoordinates.coordinates[0]]}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
                className="rounded-lg"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Pickup location */}
                <Marker position={[rideDetails.pickupCoordinates.coordinates[1], rideDetails.pickupCoordinates.coordinates[0]]}>
                  <Popup>Pickup: {rideDetails.pickupLocation}</Popup>
                </Marker>

                {/* Destination */}
                <Marker position={[rideDetails.destinationCoordinates.coordinates[1], rideDetails.destinationCoordinates.coordinates[0]]}>
                  <Popup>Destination: {rideDetails.destination}</Popup>
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



