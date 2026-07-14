import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/axios';

export const useRideActions = (onRideUpdate) => {
    const navigate = useNavigate();
    const [selectedRide, setSelectedRide] = useState(null);

    const handleAcceptRide = async (rideId) => {
        try {
            await api.post('/api/ride/accept-ride', { rideId });
            setSelectedRide(null);
            navigate(`/live-tracking?rideId=${rideId}`);
        } catch (error) {
            console.error('Error accepting ride:', error);
            alert(error.response?.data?.message || 'An error occurred while accepting the ride');
        }
    };

    const handleRejectRide = async (rideId) => {
        try {
            await api.post('/api/ride/reject-ride', { rideId });
            setSelectedRide(null);
            if (onRideUpdate) onRideUpdate(); // Refresh rides
        } catch (error) {
            console.error('Error rejecting ride:', error);
            alert(error.response?.data?.message || 'An error occurred while rejecting the ride');
        }
    };

    return {
        selectedRide,
        setSelectedRide,
        handleAcceptRide,
        handleRejectRide
    };
};



