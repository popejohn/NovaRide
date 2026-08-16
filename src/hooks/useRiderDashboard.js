import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useRiderOnlineStatus } from './useRiderOnlineStatus.js';
import { useRiderDashboardData } from './useRiderDashboardData.js';
import { useAvailableRides } from './useAvailableRides.js';
import { useRideActions } from './useRideActions.js';
import riderService from '../api/riderService';

export const useRiderDashboard = () => {
    const navigate = useNavigate();
    const { user, role } = useSelector(state => state.verifiedUser);
    const [view, setView] = useState('overview');

    // Use segregated hooks
    const { isOnline, locationError, handleOnlineToggle } = useRiderOnlineStatus();
    const { walletBalance, transactions, journeys, totalKm, monthlyKm } = useRiderDashboardData();
    const { availableRides, incomingRide, refetchRides } = useAvailableRides(isOnline);
    const { selectedRide, setSelectedRide, handleAcceptRide, handleRejectRide } = useRideActions(refetchRides);

    useEffect(() => {
        if (incomingRide && window.matchMedia('(max-width: 767px)').matches) {
            setSelectedRide(incomingRide);
        }
    }, [incomingRide, setSelectedRide]);

    // Profile verification
    useEffect(() => {
        const checkRiderProfile = async () => {
            try {
                const response = await riderService.getDetails();
                if (!response.data) {
                    navigate('/rider-profile-setup');
                }
            } catch (error) {
                console.error('Error checking rider profile:', error);
                navigate('/rider-profile-setup');
            }
        };
        checkRiderProfile();
    }, [navigate]);

    return {
        user,
        role,
        isOnline,
        availableRides,
        view,
        setView,
        locationError,
        walletBalance,
        transactions,
        journeys,
        totalKm,
        monthlyKm,
        selectedRide,
        setSelectedRide,
        handleAcceptRide,
        handleRejectRide,
        handleOnlineToggle
    };
};




