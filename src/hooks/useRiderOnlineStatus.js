import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
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
            const toastId = toast.loading('Going live...', {
                position: 'top-right'
            });

            try {
                const location = await getCurrentLocation();
                // ONLY call updateStatus when status actually changes
                await riderService.updateStatus(true, location.latitude, location.longitude);
                dispatch(setOnlineStatus(true));

                toast.update(toastId, {
                    render: 'You are now live',
                    type: 'success',
                    isLoading: false,
                    autoClose: 2500
                });

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
                toast.update(toastId, {
                    render: 'Unable to go live. Please try again.',
                    type: 'error',
                    isLoading: false,
                    autoClose: 4000
                });
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



