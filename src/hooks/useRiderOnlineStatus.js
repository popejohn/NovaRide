import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setOnlineStatus } from '../Redux/verifiedUserslice';
import riderService from '../api/riderService';

export const useRiderOnlineStatus = () => {
    const dispatch = useDispatch();
    const { isOnline } = useSelector(state => state.verifiedUser);
    const [locationError, setLocationError] = useState(null);

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
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        });
    };

    const handleOnlineToggle = async () => {
        const newOnlineState = !isOnline;

        if (newOnlineState) {
            try {
                const location = await getCurrentLocation();
                // ONLY call updateStatus when status actually changes
                await riderService.updateStatus(true, location.latitude, location.longitude);
                dispatch(setOnlineStatus(true));

                if (window.__novaSocket) {
                    window.__novaSocket.emit('rider:presence', {
                        online: true,
                        location: { lat: location.latitude, lng: location.longitude }
                    });
                }
            } catch (error) {
                // Don't revert the online status — keep the rider's intent.
                // The status will be synced on the next location interval.
                setLocationError(error.message);
                console.error('Error enabling online status:', error);
            }
        } else {
            try {
                // ONLY call updateStatus when status actually changes
                await riderService.updateStatus(false, null, null);
                dispatch(setOnlineStatus(false));
            } catch (error) {
                console.error('Error updating status during offline toggle:', error);
            }
        }
    };

    return {
        isOnline,
        locationError,
        handleOnlineToggle
    };
};



