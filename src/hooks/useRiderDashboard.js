import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setOnlineStatus } from '../Redux/verifiedUserslice';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import riderService from '../api/riderService';

export const useRiderDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, role, isOnline } = useSelector(state => state.verifiedUser);

    const [availableRides, setAvailableRides] = useState([]);
    const [view, setView] = useState('overview');
    const [locationError, setLocationError] = useState(null);
    const [walletBalance, setWalletBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [journeys, setJourneys] = useState([]);
    const [totalKm, setTotalKm] = useState(0);
    const [monthlyKm, setMonthlyKm] = useState([0, 0, 0, 0, 0, 0]);
    const [selectedRide, setSelectedRide] = useState(null);

    const ridesIntervalRef = useRef(null);
    const locationIntervalRef = useRef(null);
    const socketRef = useRef(null);

    useEffect(() => {
        if (isOnline && user?._id) {
            const token = localStorage.getItem('nvcr_tk');
            socketRef.current = io('http://localhost:5000', { auth: { token } });

            socketRef.current.on('connect', () => {
                socketRef.current.emit('join', user._id);
                console.log('Rider connected to socket');
            });

            socketRef.current.on('incomingRideRequest', (data) => {
                console.log('Incoming ride request:', data);
                // Play notification sound
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                audio.play().catch(e => console.error('Audio play failed:', e));

                // Automatically refresh the rides list
                fetchRides();
            });

            return () => {
                if (socketRef.current) socketRef.current.disconnect();
            };
        }
    }, [isOnline, user?._id, navigate]);

    const fetchDashboardData = async () => {
        try {
            const walletResponse = await riderService.getWalletData();
            setWalletBalance(walletResponse.data.walletBalance);
            setTransactions(walletResponse.data.transactions);

            const historyResponse = await riderService.getRideHistory();
            const history = historyResponse.data.rides;
            setJourneys(history);

            let total = 0;
            const monthly = [0, 0, 0, 0, 0, 0];
            const now = new Date();

            history.forEach(ride => {
                total += ride.distance;
                const rideDate = new Date(ride.createdAt);
                const monthDiff = (now.getFullYear() - rideDate.getFullYear()) * 12 + (now.getMonth() - rideDate.getMonth());
                if (monthDiff >= 0 && monthDiff < 6) {
                    monthly[5 - monthDiff] += ride.distance;
                }
            });

            setTotalKm(total);
            setMonthlyKm(monthly);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useEffect(() => {
        const checkRiderProfile = async () => {
            try {
                const token = localStorage.getItem('nvcr_tk');
                if (!token) {
                    navigate('/login');
                    return;
                }
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

    const fetchRides = async () => {
        try {
            const response = await riderService.getAvailableRides();
            setAvailableRides(response.data.rides);
        } catch (error) {
            console.error('Error fetching rides:', error);
        }
    };

    useEffect(() => {
        if (isOnline) {
            fetchRides();
            ridesIntervalRef.current = setInterval(fetchRides, 5000);
        } else {
            setAvailableRides([]);
            if (ridesIntervalRef.current) clearInterval(ridesIntervalRef.current);
        }
        return () => clearInterval(ridesIntervalRef.current);
    }, [isOnline]);

    const getCurrentLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser'));
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => reject(error),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
            );
        });
    };

    const handleAcceptRide = async (rideId) => {
        try {
            const token = localStorage.getItem('nvcr_tk');
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
            const token = localStorage.getItem('nvcr_tk');
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
                fetchRides(); // Refresh list
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to reject ride');
            }
        } catch (error) {
            console.error('Error rejecting ride:', error);
            alert('An error occurred while rejecting the ride');
        }
    };

    const handleOnlineToggle = async () => {
        const newOnlineState = !isOnline;
        dispatch(setOnlineStatus(newOnlineState));

        if (newOnlineState) {
            try {
                const location = await getCurrentLocation();
                await riderService.updateLocation(location.latitude, location.longitude, true);

                locationIntervalRef.current = setInterval(async () => {
                    try {
                        const currentLocation = await getCurrentLocation();
                        await riderService.updateLocation(currentLocation.latitude, currentLocation.longitude, true);
                    } catch (error) {
                        console.error('Error updating location during interval:', error);
                    }
                }, 60000);
            } catch (error) {
                dispatch(setOnlineStatus(false));
                setLocationError(error.message);
                console.error('Error enabling online status:', error);
            }
        } else {
            if (locationIntervalRef.current) {
                clearInterval(locationIntervalRef.current);
                locationIntervalRef.current = null;
            }
            try {
                const location = await getCurrentLocation();
                await riderService.updateLocation(location.latitude, location.longitude, false);
            } catch (error) {
                console.error('Error updating location during offline toggle:', error);
            }
        }
    };

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
