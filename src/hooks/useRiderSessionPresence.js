import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import riderService from '../api/riderService';
import { useRiderSocket } from './useRiderSocket';

const HEARTBEAT_INTERVAL_MS = 20 * 1000;

const getCurrentLocation = () => new Promise((resolve, reject) => {
  if (!navigator.geolocation) {
    reject(new Error('Geolocation is not supported by this browser'));
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => resolve({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    }),
    reject,
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
  );
});

export const useRiderSessionPresence = () => {
  const { user, isAuthenticated, isOnline } = useSelector((state) => state.verifiedUser);
  const location = useLocation();
  const navigate = useNavigate();
  const isRider = Array.isArray(user?.role) ? user.role.includes('rider') : user?.role === 'rider';
  const shouldMaintainPresence = isAuthenticated && isRider && isOnline;

  useRiderSocket(
    shouldMaintainPresence ? user?._id : null,
    shouldMaintainPresence,
    (rideRequest) => {
      if (location.pathname === '/riderdashboard') return;

      toast.info('Incoming ride request', {
        toastId: `ride-request-${rideRequest?.rideId || 'new'}`,
        position: 'top-right',
        className: 'rider-ride-request-toast',
        onClick: () => navigate('/riderdashboard?view=available#incoming-requests'),
      });
    },
  );

  useEffect(() => {
    if (!shouldMaintainPresence) return undefined;

    const updateLocation = async () => {
      try {
        const { latitude, longitude } = await getCurrentLocation();
        await riderService.updateLocation(latitude, longitude);
      } catch (error) {
        console.error('Error updating rider session presence:', error);
      }
    };

    updateLocation();
    const heartbeatId = window.setInterval(updateLocation, HEARTBEAT_INTERVAL_MS);

    return () => window.clearInterval(heartbeatId);
  }, [shouldMaintainPresence]);
};