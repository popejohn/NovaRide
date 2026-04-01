import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

export const useDriverSocket = (userId, rideId) => {
  const [bookingStatus, setBookingStatus] = useState('idle'); // idle, waiting, accepted, rejected
  const [acceptedDriver, setAcceptedDriver] = useState(null);

  useEffect(() => {
    let socket;
    const token = localStorage.getItem('nvcr_tk');

    if (userId && token) {
      socket = io('http://localhost:5000', { auth: { token } });

      socket.on('connect', () => {
        socket.emit('join', userId);
      });

      socket.on('rideAccepted', (data) => {
        if (String(data.rideId) === String(rideId)) {
          setAcceptedDriver(data.driver);
          setBookingStatus('accepted');
          toast.success("Ride Accepted!");
        }
      });

      socket.on('rideRejected', (data) => {
        if (String(data.rideId) === String(rideId)) {
          setBookingStatus('rejected');
          toast.error("The rider declined your request.");
        }
      });

      return () => {
        if (socket) socket.disconnect();
      };
    }
  }, [userId, rideId]);

  return { 
    bookingStatus, 
    setBookingStatus, 
    acceptedDriver, 
    setAcceptedDriver 
  };
};
