import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import StorageService from '../utils/storageService.js';

export const useRiderSocket = (userId, isOnline, onRideRequest) => {
    const socketRef = useRef(null);

    useEffect(() => {
        if (isOnline && userId) {
            const token = StorageService.getToken();
            socketRef.current = io('http://localhost:5000', { auth: { token } });

            socketRef.current.on('connect', () => {
                socketRef.current.emit('join', userId);
                console.log('Rider connected to socket');
            });

            socketRef.current.on('incomingRideRequest', (data) => {
                console.log('Incoming ride request:', data);
                // Play notification sound
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                audio.play().catch(e => console.error('Audio play failed:', e));

                if (onRideRequest) onRideRequest(data);
            });

            return () => {
                if (socketRef.current) socketRef.current.disconnect();
            };
        }
    }, [isOnline, userId, onRideRequest]);

    return {
        socket: socketRef.current
    };
};