import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/axios';
import { toast } from 'react-toastify';

export const useRidePayment = (distance, duration, pickupLocation, destination, pickupCoordinate, destinationCoordinate) => {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const checkBalanceAndPay = async () => {
        try {
            setIsProcessing(true);
            const token = localStorage.getItem('nvcr_tk');
            const fare = distance * 150;
            // Check balance first
            const walletResponse = await api.get('/user/wallet-data', {
                headers: { 
                    Authorization: `Bearer ${token}`
                }
            });

            // Handle potential 304 or missing data
            if (!walletResponse.data || walletResponse.data.walletBalance === undefined) {
                console.error('❌ Invalid wallet response:', walletResponse.data);
                toast.error("Unable to fetch wallet balance. Please try again.");
                setIsProcessing(false);
                return;
            }

            const balance = walletResponse.data.walletBalance;

            // If balance is insufficient, redirect to wallet to add money
            if (balance < fare) {
                toast.error("Insufficient balance. Redirecting to wallet...");
                setIsProcessing(false);
                navigate('/wallet');
                return;
            }

            // If balance is sufficient, create ride and redirect to driver selection
            await proceedToCreateRide(fare, token);

        } catch (error) {
            console.error('❌ Balance check error:', error);
            console.error('Error details:', {
                message: error?.message,
                status: error?.response?.status,
                data: error?.response?.data,
                url: error?.config?.url
            });
            
            // Skip errors from verify-token or non-critical calls
            if (error.config?.url?.includes('verify-token')) {
                return;
            }
            
            const errorMessage = error.response?.data?.message || error.message;

            if (errorMessage.toLowerCase().includes('expired') || error.response?.status === 401) {
                localStorage.removeItem('nvcr_tk');
                navigate('/login');
            } else if (!errorMessage.includes('404') && !errorMessage.includes('offline')) {
                // Show specific error messages based on the request URL
                if (error.config?.url?.includes('wallet-data')) {
                    toast.error("Failed to fetch wallet balance. Please check your connection.");
                } else {
                    toast.error(`Error: ${errorMessage}`);
                }
            }
            setIsProcessing(false);
        }
    };

    const proceedToCreateRide = async (fare, token) => {
        try {
            
            const rideData = {
                pickupLocation,
                destination,
                eta: duration,
                fare: fare,
                distance: distance,
                pickupCoordinates: {
                    type: 'Point',
                    coordinates: [pickupCoordinate.lng, pickupCoordinate.lat]
                },
                destinationCoordinates: {
                    type: 'Point',
                    coordinates: [destinationCoordinate.lng, destinationCoordinate.lat]
                }
            };

            const response = await api.post('/ride/create-ride', rideData);

            if (response.status === 200) {
                toast.success("Ride created! Select a rider...");
                navigate(`/driver-selection?rideId=${response.data.ride._id}`);
            }
        } catch (error) {
            console.error('❌ Error creating ride:', error);
            toast.error(`Error creating ride: ${error.response?.data?.message || error.message}`);
            setIsProcessing(false);
        }
    };

    return {
        checkBalanceAndPay,
        isProcessing
    };
};




