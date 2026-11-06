import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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

    // refetchRides is created by useAvailableRides below; a ref breaks the circular dependency
    const refetchRidesRef = useRef(() => {});
    const { selectedRide, setSelectedRide, handleAcceptRide, handleRejectRide } = useRideActions(() => refetchRidesRef.current());

    // Close the open ride request modal and notify the rider if that ride expires/is cancelled
    const handleRideLifecycleUpdate = useCallback((data) => {
        const inactiveStatuses = ['cancelled', 'expired', 'timed_out'];
        if (!inactiveStatuses.includes(data?.status)) return;

        setSelectedRide((current) => {
            if (current && String(current._id) === String(data.rideId)) {
                toast.error(data.reason === 'expired' ? 'This ride request has expired.' : 'This ride request is no longer available.');
                return null;
            }
            return current;
        });
    }, [setSelectedRide]);

    const { availableRides, incomingRide, refetchRides } = useAvailableRides(isOnline, handleRideLifecycleUpdate);

    useEffect(() => {
        refetchRidesRef.current = refetchRides;
    }, [refetchRides]);


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
                if (!response.data?.profileCompleted) {
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




