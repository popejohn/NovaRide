import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
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
            const walletResponse = await client.get('/user/wallet-data', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const balance = walletResponse.data.walletBalance;

            if (balance < fare) {
                toast.error("Insufficient balance, please fund your wallet");
                navigate('/wallet');
                setIsProcessing(false);
                return;
            }

            // If balance is sufficient, Paystack popup for the fare amount
            const paystackConfig = {
                reference: (new Date()).getTime().toString(),
                email: `user_${Date.now()}@novacrest.local`, 
                amount: fare * 100, // in kobo
                publicKey: 'pk_test_26f1b45d2f2c179ed904deee64e9fe8c60ff8fc4',
            };

            const PaystackPop = (await import('@paystack/inline-js')).default;
            const paystack = new PaystackPop();
            
            paystack.newTransaction({
                ...paystackConfig,
                onSuccess: async (transaction) => {
                    toast.success("Payment successful! Creating ride...");
                    proceedToCreateRide(fare, token);
                },
                onCancel: () => {
                    toast.error("Payment cancelled.");
                    setIsProcessing(false);
                }
            });

        } catch (error) {
            console.error('Error in handlePickRider:', error);
            const errorMessage = error.response?.data?.message || error.message;

            if (errorMessage.toLowerCase().includes('expired') || error.response?.status === 401) {
                localStorage.removeItem('nvcr_tk');
                navigate('/login');
            } else {
                toast.error(`Error: ${errorMessage}`);
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

            const response = await client.post('/ride/create-ride', rideData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                navigate(`/driver-selection?rideId=${response.data.ride._id}`);
            }
        } catch (error) {
            console.error('Error creating ride:', error);
            toast.error(`Error creating ride: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        checkBalanceAndPay,
        isProcessing
    };
};
