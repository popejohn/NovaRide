import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import riderService from '../api/riderService';

export const useAvailableRides = (isOnline) => {
    const [availableRides, setAvailableRides] = useState([]);
    const [incomingRide, setIncomingRide] = useState(null);
    const socketRef = useRef(null);
    const { user } = useSelector((state) => state.verifiedUser);

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
            const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000';
            
            socket = io(apiUrl, {
                auth: { token },
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                reconnectionAttempts: 5
            });

            socket.on('connect', () => {
                if (user?._id) {
                    socket.emit('join', user._id);
                }
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
                if (!data?.ride) {
                    fetchRides();
                    return;
                }

                setIncomingRide(data.ride);
                setAvailableRides((previousRides) => {
                    const alreadyListed = previousRides.some((ride) => ride._id === data.ride._id);
                    return alreadyListed ? previousRides : [data.ride, ...previousRides];
                });
            });

            // Listen for ride acceptances (remove if rider accepted it)
            socket.on('rideAccepted', (data) => {
                setAvailableRides(prev => 
                    prev.filter(r => r._id !== data.rideId)
                );
            });

            socket.on('rideLifecycleUpdated', (data) => {
                if (!data?.rideId) return;
                setAvailableRides(prev => prev.filter(r => r._id !== data.rideId));
            });

            socketRef.current = socket;
        } else {
            setAvailableRides([]);
            setIncomingRide(null);
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
    }, [isOnline, user?._id]);

    return {
        availableRides,
        incomingRide,
        refetchRides: fetchRides
    };
};




