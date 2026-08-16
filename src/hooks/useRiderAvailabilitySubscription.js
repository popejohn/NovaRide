import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000';

/**
 * Hook to subscribe to real-time rider availability updates
 * When a new rider comes online within the passenger's area, they're automatically added to the list
 *
 * @param {number} lat - Passenger's pickup latitude
 * @param {number} lng - Passenger's pickup longitude
 * @param {function} onRiderOnline - Callback when a rider comes online with their details
 * @returns {object} Socket instance for manual control if needed
 */
export const useRiderAvailabilitySubscription = (lat, lng, onRiderOnline, onConnected, onRiderOffline) => {
  const socketRef = useRef(null);
  const onRiderOnlineRef = useRef(onRiderOnline);
  const onConnectedRef = useRef(onConnected);
  const onRiderOfflineRef = useRef(onRiderOffline);

  useEffect(() => {
    onRiderOnlineRef.current = onRiderOnline;
    onConnectedRef.current = onConnected;
    onRiderOfflineRef.current = onRiderOffline;
  }, [onRiderOnline, onConnected, onRiderOffline]);

  useEffect(() => {
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    const token = localStorage.getItem('nvcr_tk');

    try {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      const socket = io(apiUrl, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 10,
        timeout: 20000,
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('[RiderAvailabilitySubscription] Connected to availability updates');
        onConnectedRef.current?.();
      });

      socket.on('riderOnline', (riderData) => {
        const coordinates = riderData?.location?.coordinates;
        if (!riderData?.riderId || !Array.isArray(coordinates) || coordinates.length < 2) return;

        const [riderLng, riderLat] = coordinates;
        if (!Number.isFinite(riderLat) || !Number.isFinite(riderLng)) return;

        const distanceMeters = calculateDistance(lat, lng, riderLat, riderLng);
        if (distanceMeters <= 5000) {
          onRiderOnlineRef.current?.({
            ...riderData,
            distance: distanceMeters / 1000,
            eta: Math.ceil((distanceMeters / 1000) * 4)
          });
        }
      });

      socket.on('riderOffline', ({ riderId }) => {
        if (riderId) {
          onRiderOfflineRef.current?.(riderId);
          onConnectedRef.current?.();
        }
      });

      socket.on('connect_error', (error) => {
        console.warn('[RiderAvailabilitySubscription] Socket connect error:', error);
      });

      socket.on('error', (error) => {
        console.warn('[RiderAvailabilitySubscription] Socket error:', error);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
          console.log('[RiderAvailabilitySubscription] Disconnected');
        }
      };
    } catch (error) {
      console.error('[RiderAvailabilitySubscription] Setup error:', error);
      return () => {};
    }
  }, [lat, lng]);
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in meters
 */
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
