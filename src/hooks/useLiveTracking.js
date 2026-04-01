import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useLiveTracking = (rideId, user, userRoles) => {
  const navigate = useNavigate();

  const [rideDetails, setRideDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rideStatus, setRideStatus] = useState('Waiting for driver to accept...');
  const [driverLocation, setDriverLocation] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Derived role flags
  const isPassenger = rideDetails?.user?._id === user?._id || rideDetails?.user === user?._id;
  const isRider = rideDetails?.assignedDriver?.riderInfo?._id === user?._id || rideDetails?.assignedDriver?.riderInfo === user?._id;

  const isPassengerRef = useRef(false);
  const isRiderRef = useRef(false);

  useEffect(() => {
    isPassengerRef.current = isPassenger;
    isRiderRef.current = isRider;
  }, [isPassenger, isRider]);

  const fetchRideStatus = useCallback(async () => {
    if (!rideId) return;
    try {
      const token = localStorage.getItem('nvcr_tk');
      const response = await fetch(`/api/ride/${rideId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const ride = data.ride;
        setRideDetails(ride);

        const statusMap = {
          'accepted': 'Driver is on the way',
          'at_pickup': 'Driver is at pickup location',
          'starting': 'Awaiting driver agreement',
          'in_progress': 'Trip in progress',
          'awaiting_completion': 'Awaiting passenger confirmation',
          'completed': 'Ride completed',
          'cancelled': 'Ride cancelled'
        };
        setRideStatus(statusMap[ride.rideStatus] || ride.rideStatus);

        if (ride.rideStatus === 'awaiting_completion' && isPassengerRef.current) {
          setShowCompletionModal(true);
        }

        if (ride.rideStatus === 'completed') {
          setTimeout(() => {
            navigate(`/ride-completion?rideId=${rideId}`);
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Error fetching ride status:', error);
    } finally {
      setLoading(false);
    }
  }, [rideId, navigate]);

  useEffect(() => {
    let socket;
    let locationInterval;
    let interval;
    const token = localStorage.getItem('nvcr_tk');

    if (user && user._id && token && rideId) {
      socket = io('http://localhost:5000', { auth: { token } });

      socket.on('connect', () => {
        socket.emit('join', user._id);
        socket.emit('joinRide', rideId);
      });

      if (userRoles?.includes('rider') && isRider) {
        locationInterval = setInterval(() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              const { latitude, longitude } = position.coords;
              socket.emit('updateLocation', {
                rideId,
                location: { lat: latitude, lng: longitude }
              });
              setDriverLocation({ lat: latitude, lng: longitude });
            });
          }
        }, 4000);
      } else if (isPassenger) {
        socket.on('driverLocationUpdate', (data) => {
          setDriverLocation(data.location);
        });
      }

      socket.on('statusUpdate', (data) => {
        const statusMap = {
          'accepted': 'Driver is on the way',
          'at_pickup': 'Driver is at pickup location',
          'starting': 'Awaiting driver agreement',
          'in_progress': 'Trip in progress',
          'awaiting_completion': 'Awaiting passenger confirmation',
          'completed': 'Ride completed',
          'cancelled': 'Ride cancelled'
        };
        setRideStatus(statusMap[data.status] || data.status);
        if (data.status === 'awaiting_completion' && isPassengerRef.current) {
          setShowCompletionModal(true);
        }
        if (data.status === 'completed') {
          setTimeout(() => {
            navigate(`/ride-completion?rideId=${rideId}`);
          }, 3000);
        }
      });
    }

    if (rideId) {
      fetchRideStatus();
      interval = setInterval(fetchRideStatus, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (locationInterval) clearInterval(locationInterval);
      if (socket) socket.disconnect();
    };
  }, [rideId, navigate, user, userRoles, fetchRideStatus, isPassenger, isRider]);

  const updateRideStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem('nvcr_tk');
      await fetch(`/api/ride/${rideId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      fetchRideStatus();
    } catch (error) {
      console.error('Error updating ride status:', error);
    }
  };

  const submitComplaint = async (complaintText) => {
    if (!complaintText.trim()) return false;
    try {
      const token = localStorage.getItem('nvcr_tk');
      await axios.post(`/api/ride/${rideId}/complaint`, {
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
    updateRideStatus,
    submitComplaint
  };
};
