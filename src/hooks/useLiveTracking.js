import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '../services/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000';

// Exponential backoff for reconnection
const getReconnectDelay = (attempt) => {
  const baseDelay = 1000; // 1 second
  const maxDelay = 30000; // 30 seconds
  return Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
};

export const useLiveTracking = (rideId, user, userRoles) => {
  const navigate = useNavigate();

  const [rideDetails, setRideDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rideStatus, setRideStatus] = useState('Waiting for driver to accept...');
  const [driverLocation, setDriverLocation] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showStartRideModal, setShowStartRideModal] = useState(false);

  // Derived role flags
  const isPassenger = rideDetails?.user?._id === user?._id || rideDetails?.user === user?._id;
  const isRider = rideDetails?.assignedDriver?.riderInfo?._id === user?._id || rideDetails?.assignedDriver?.riderInfo === user?._id;

  const reconnectAttemptRef = useRef(0);

  const fetchRideStatus = useCallback(async () => {
    if (!rideId) return;
    try {
      const response = await api.get(`/ride/${rideId}`);
      const ride = response.data.ride;

      setRideDetails(ride);

      const statusMap = {
        pending: 'Ride cancelled',
        accepted: 'Driver is on the way',
        at_pickup: 'Driver is at pickup location',
        starting: 'Awaiting driver agreement',
        in_progress: 'Trip in progress',
        awaiting_completion: 'Awaiting passenger confirmation',
        completed: 'Ride completed',
        cancelled: 'Ride cancelled'
      };

      setRideStatus(statusMap[ride.rideStatus] || ride.rideStatus);

      const currentIsPassenger =
        ride.user?._id === user?._id || ride.user === user?._id;

      const currentIsRider =
        ride.assignedDriver?.riderInfo?._id === user?._id ||
        ride.assignedDriver?.riderInfo === user?._id;

      if (ride.rideStatus === 'pending') {
        if (currentIsPassenger) {
          toast.info("Ride cancelled. Redirecting to driver selection...");
          navigate(`/driver-selection?rideId=${rideId}`);
        } else if (currentIsRider) {
          toast.info("Ride cancelled by passenger.");
          navigate('/riderdashboard');
        }
      }

      setShowStartRideModal(
        ride.rideStatus === 'starting' && currentIsRider
      );

      setShowCompletionModal(
        ride.rideStatus === 'awaiting_completion' && currentIsPassenger
      );

      if (ride.rideStatus === 'completed') {
        setTimeout(() => {
          navigate(`/ride-completion?rideId=${rideId}`);
        }, 2000);
      }

    } catch (error) {
      console.error('Error fetching ride status:', error);
    } finally {
      setLoading(false);
    }
  }, [rideId, navigate, user]);

  useEffect(() => {
    let socket;
    let locationInterval;
    let statusPollInterval;
    const token = localStorage.getItem('nvcr_tk');

    if (user && user._id && token && rideId) {
      const connectSocket = () => {
        console.log("Socket URL:", apiUrl);
        console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
        socket = io(apiUrl, {
          auth: { token },
          reconnection: true,
          reconnectionDelay: getReconnectDelay(reconnectAttemptRef.current),
          reconnectionDelayMax: 30000,
          reconnectionAttempts: 10
        });

        socket.on('connect', () => {
          reconnectAttemptRef.current = 0; // Reset on successful connection
          socket.emit('join', user._id);
          socket.emit('joinRide', rideId);
        });

        socket.on('connect_error', (error) => {
          console.warn('[Socket] Connection error:', error);
          reconnectAttemptRef.current += 1;
        });

        socket.on('disconnect', (reason) => {
          // disconnected
        });

        if (userRoles?.includes('rider') && isRider) {
          // For riders: send location updates every 8 seconds
          const minDistanceMeters = 10;
          let lastLocation = null;

          locationInterval = setInterval(() => {
            if (navigator.geolocation && socket?.connected) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude } = position.coords;
                  const currentLocation = { lat: latitude, lng: longitude };

                  if (!lastLocation || getDistance(lastLocation, currentLocation) > minDistanceMeters) {
                    socket.emit('updateLocation', {
                      rideId,
                      location: currentLocation
                    });
                    lastLocation = currentLocation;
                    setDriverLocation(currentLocation);
                  }
                },
                (error) => console.warn('Geolocation error:', error),
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
              );
            }
          }, 8000);
        } else if (isPassenger) {
          socket.on('driverLocationUpdate', (data) => {
            setDriverLocation(data.location);
          });
        }

        socket.on('statusUpdate', (data) => {
          fetchRideStatus();
        });

        socket.on('error', (error) => {
          console.error('[Socket] Error:', error);
          toast.error(error.message);
        });
      };

      connectSocket();

      if (rideId) {
        fetchRideStatus();
        statusPollInterval = setInterval(fetchRideStatus, 8000);
      }
    }

    return () => {
      if (statusPollInterval) clearInterval(statusPollInterval);
      if (locationInterval) clearInterval(locationInterval);
      if (socket) socket.disconnect();
    };
  }, [rideId, navigate, user, userRoles, fetchRideStatus, isPassenger, isRider]);

  const updateRideStatus = async (newStatus) => {
    try {
      await api.patch(`/ride/${rideId}/status`, {
        status: newStatus,
      });

      fetchRideStatus();

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update ride status"
      );
    }
  };

  const submitComplaint = async (complaintText) => {
    if (!complaintText.trim()) return false;
    try {
      const token = localStorage.getItem('nvcr_tk');
      await api.post(`/ride/${rideId}/complaint`, {
        text: complaintText,
        role: isRider ? 'rider' : 'passenger'
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success("Complaint submitted successfully");
      return true;
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error("Failed to submit complaint");
      return false;
    }
  };

  return {
    rideDetails,
    loading,
    rideStatus,
    driverLocation,
    isPassenger,
    isRider,
    showCompletionModal,
    setShowCompletionModal,
    showStartRideModal,
    setShowStartRideModal,
    updateRideStatus,
    submitComplaint
  };
};

// Helper function to calculate distance between two coordinates (Haversine formula)
function getDistance(loc1, loc2) {
  const R = 6371000; // Earth's radius in meters
  const lat1 = (loc1.lat * Math.PI) / 180;
  const lat2 = (loc2.lat * Math.PI) / 180;
  const deltaLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
  const deltaLng = ((loc2.lng - loc1.lng) * Math.PI) / 180;

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}





