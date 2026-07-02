import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import StorageService from '../utils/storageService.js';

// Exponential backoff for reconnection
const getReconnectDelay = (attempt) => {
  const baseDelay = 1000; // 1 second
  const maxDelay = 30000; // 30 seconds
  return Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
};

export const useRiderSocket = (userId, isOnline, onRideRequest) => {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const reconnectAttemptRef = useRef(0);
    const onRideRequestRef = useRef(onRideRequest);

    // Keep callback ref updated
    useEffect(() => {
        onRideRequestRef.current = onRideRequest;
    }, [onRideRequest]);

    useEffect(() => {
        if (isOnline && userId) {
            const token = StorageService.getToken();
            socketRef.current = io(apiUrl, {
                auth: { token },
                reconnection: true,
                reconnectionDelay: getReconnectDelay(reconnectAttemptRef.current),
                reconnectionDelayMax: 30000,
                reconnectionAttempts: 10,
                transports: ['websocket', 'polling']
            });

            socketRef.current.on('connect', () => {
                console.log('[Rider Socket] Connected');
                setIsConnected(true);
                reconnectAttemptRef.current = 0; // Reset on successful connection
                socketRef.current.emit('join', userId);
            });

            socketRef.current.on('connect_error', (error) => {
                console.warn('[Rider Socket] Connection error:', error);
                reconnectAttemptRef.current += 1;
                setIsConnected(false);
            });

            socketRef.current.on('disconnect', (reason) => {
                console.log('[Rider Socket] Disconnected:', reason);
                setIsConnected(false);
                if (reason === 'io server disconnect') {
                    // Manually reconnect if server disconnects
                    setTimeout(() => {
                        socketRef.current?.connect();
                    }, getReconnectDelay(reconnectAttemptRef.current));
                }
            });

            socketRef.current.on('incomingRideRequest', (data) => {
                console.log('Incoming ride request:', data);
                // Play notification sound with error handling
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                audio.play().catch(e => console.warn('Audio play failed:', e));

                if (onRideRequestRef.current) onRideRequestRef.current(data);
            });

            socketRef.current.on('error', (error) => {
                console.error('[Rider Socket] Socket error:', error);
            });

            return () => {
                if (socketRef.current) {
                    socketRef.current.disconnect();
                    setIsConnected(false);
                }
            };
        }
    }, [isOnline, userId]);

    return {
        socket: socketRef.current,
        isConnected
    };
};




