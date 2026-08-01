import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../services/axios';

export const useRideActions = (onRideUpdate) => {
    const navigate = useNavigate();
    const [selectedRide, setSelectedRide] = useState(null);

    const handleAcceptRide = async (rideId) => {
        try {
            await api.post('/ride/accept-ride', { rideId });
            setSelectedRide(null);
            navigate(`/live-tracking?rideId=${rideId}`);
        } catch (error) {
            console.error('Error accepting ride:', error);
            toast.error(error.response?.data?.message || 'An error occurred while accepting the ride');
        }
    };

    const handleRejectRide = async (rideId) => {
        try {
            await api.post('/ride/reject-ride', { rideId });
            setSelectedRide(null);
            if (onRideUpdate) onRideUpdate(); // Refresh rides
        } catch (error) {
            console.error('Error rejecting ride:', error);
            toast.error(error.response?.data?.message || 'An error occurred while rejecting the ride');
        }
    };

    return {
        selectedRide,
        setSelectedRide,
        handleAcceptRide,
        handleRejectRide
    };
};



