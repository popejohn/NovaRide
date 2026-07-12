import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000';

// Exponential backoff for reconnection
const getReconnectDelay = (attempt) => {
  const baseDelay = 1000; // 1 second
  const maxDelay = 30000; // 30 seconds
  return Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
};

export const useDriverSocket = (userId, rideId) => {
  const [bookingStatus, setBookingStatus] = useState('idle'); // idle, waiting, accepted, rejected
  const [acceptedDriver, setAcceptedDriver] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const reconnectAttemptRef = useRef(0);

  useEffect(() => {
    const token = localStorage.getItem('nvcr_tk');

    if (userId && token) {
      socketRef.current = io(apiUrl, {
        auth: { token },
        reconnection: true,
        reconnectionDelay: getReconnectDelay(reconnectAttemptRef.current),
        reconnectionDelayMax: 30000,
        reconnectionAttempts: 10,
        transports: ['websocket', 'polling']
      });

      socketRef.current.on('connect', () => {
        setIsConnected(true);
        reconnectAttemptRef.current = 0; // Reset on successful connection
        socketRef.current.emit('join', userId);
      });

      socketRef.current.on('connect_error', (error) => {
        console.warn('[Driver Socket] Connection error:', error);
        reconnectAttemptRef.current += 1;
        setIsConnected(false);
      });

      socketRef.current.on('disconnect', (reason) => {
        setIsConnected(false);
        if (reason === 'io server disconnect') {
          // Manually reconnect if server disconnects
          setTimeout(() => {
            socketRef.current?.connect();
          }, getReconnectDelay(reconnectAttemptRef.current));
        }
      });

      socketRef.current.on('rideAccepted', (data) => {
        if (String(data.rideId) === String(rideId)) {
          setAcceptedDriver(data.driver);
          setBookingStatus('accepted');
          toast.success("Ride Accepted!");
        }
      });

      socketRef.current.on('rideRejected', (data) => {
        if (String(data.rideId) === String(rideId)) {
          setBookingStatus('rejected');
          toast.error("The rider declined your request.");
        }
      });

      socketRef.current.on('error', (error) => {
        console.error('[Driver Socket] Socket error:', error);
        toast.error('Connection error: ' + error.message);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          setIsConnected(false);
        }
      };
    }
  }, [userId, rideId]);

  return { 
    bookingStatus, 
    setBookingStatus, 
    acceptedDriver, 
    setAcceptedDriver,
    isConnected,
    socket: socketRef.current
  };
};





