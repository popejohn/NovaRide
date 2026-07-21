import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import riderService from '../api/riderService';

export const useAvailableRides = (isOnline) => {
    const [availableRides, setAvailableRides] = useState([]);
    const socketRef = useRef(null);

    const fetchRides = async () => {
        try {
            const response = await riderService.getAvailableRides();
            setAvailableRides(response.data.rides || []);
        } catch (error) {
            console.error('Error fetching rides:', error);
        }
    };

    useEffect(() => {
        let socket;

        if (isOnline) {
            // Fetch initial rides
            fetchRides();

            // Connect to Socket.io for real-time updates
            const token = localStorage.getItem('nvcr_tk');
            const apiUrl = import.meta.env.VITE_API_URL || 'https://novaride-backend-staging.onrender.com';
            
            socket = io(apiUrl, {
                auth: { token },
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                reconnectionAttempts: 5
            });

            socket.on('connect', () => {
            });

            // Listen for new rides being available
            socket.on('newRideAvailable', (data) => {
                setAvailableRides(prev => {
                    // Check if ride already exists
                    const rideExists = prev.some(r => r._id === data.ride._id);
                    if (!rideExists) {
                        return [data.ride, ...prev];
                    }
                    return prev;
                });
            });

            // Listen for incoming ride requests (ride was assigned to this rider)
            socket.on('incomingRideRequest', (data) => {
                // Remove from available rides since it's now assigned to us
                setAvailableRides(prev => 
                    prev.filter(r => r._id !== data.rideId)
                );
            });

            // Listen for ride acceptances (remove if rider accepted it)
            socket.on('rideAccepted', (data) => {
                setAvailableRides(prev => 
                    prev.filter(r => r._id !== data.rideId)
                );
            });

            socketRef.current = socket;
        } else {
            setAvailableRides([]);
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        }

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [isOnline]);

    return {
        availableRides,
        refetchRides: fetchRides
    };
};




