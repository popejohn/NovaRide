import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setOnlineStatus } from '../Redux/verifiedUserslice';
import riderService from '../api/riderService';

export const useRiderOnlineStatus = () => {
    const dispatch = useDispatch();
    const { isOnline } = useSelector(state => state.verifiedUser);
    const [locationError, setLocationError] = useState(null);
    const locationIntervalRef = useRef(null);

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

    useEffect(() => {
        return () => {
            if (locationIntervalRef.current) {
                clearInterval(locationIntervalRef.current);
            }
        };
    }, []);

    return {
        isOnline,
        locationError,
        handleOnlineToggle
    };
};