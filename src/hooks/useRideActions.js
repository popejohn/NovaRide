import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StorageService from '../utils/storageService.js';

export const useRideActions = (onRideUpdate) => {
    const navigate = useNavigate();
    const [selectedRide, setSelectedRide] = useState(null);

    const handleAcceptRide = async (rideId) => {
        try {
            const token = StorageService.getToken();
            const response = await fetch('/api/ride/accept-ride', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rideId })
            });

            if (response.ok) {
                setSelectedRide(null);
                navigate(`/live-tracking?rideId=${rideId}`);
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to accept ride');
            }
        } catch (error) {
            console.error('Error accepting ride:', error);
            alert('An error occurred while accepting the ride');
        }
    };

    const handleRejectRide = async (rideId) => {
        try {
            const token = StorageService.getToken();
            const response = await fetch('/api/ride/reject-ride', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rideId })
            });

            if (response.ok) {
                setSelectedRide(null);
                if (onRideUpdate) onRideUpdate(); // Refresh rides
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to reject ride');
            }
        } catch (error) {
            console.error('Error rejecting ride:', error);
            alert('An error occurred while rejecting the ride');
        }
    };

    return {
        selectedRide,
        setSelectedRide,
        handleAcceptRide,
        handleRejectRide
    };
};