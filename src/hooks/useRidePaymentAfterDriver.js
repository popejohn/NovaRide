import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/axios';
import { toast } from 'react-toastify';

export const useRidePaymentAfterDriver = (rideId, rideDetails) => {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const user = useSelector(state => state.verifiedUser.user);

    const processPaymentForRide = async () => {
        try {
            setIsProcessing(true);
            const token = localStorage.getItem('nvcr_tk');
            
            if (!rideId || !rideDetails) {
                toast.error("Ride information is missing");
                setIsProcessing(false);
                return;
            }

            const fare = rideDetails.fare;

            // Check balance one more time before payment
            const walletResponse = await api.get('/user/wallet-data', {
                headers: { 
                    Authorization: `Bearer ${token}`
                }
            });

            if (!walletResponse.data || walletResponse.data.walletBalance === undefined) {
                console.error('❌ Invalid wallet response:', walletResponse.data);
                toast.error("Unable to verify wallet balance. Payment cancelled.");
                setIsProcessing(false);
                return;
            }

            const balance = walletResponse.data.walletBalance;
            
            // Note: We do not check if balance < fare here because the user is 
            // paying directly with Paystack (card).

            // Get user email for Paystack
            const userEmail = user?.email || `user_${Date.now()}@novacrest.local`;

            // Return config for PaystackButton component to use
            return {
                email: userEmail,
                amount: fare * 100, // in kobo
                reference: (new Date()).getTime().toString(),
                onSuccess: async (transaction) => {
                    await handlePaymentSuccess(transaction, rideId, token);
                },
                onCancel: () => {
                    handlePaymentCancel();
                },
                onError: (error) => {
                    handlePaymentError(error);
                }
            };

        } catch (error) {
            console.error('❌ Payment processing error:', error);
            toast.error(`Error processing payment: ${error.message}`);
            setIsProcessing(false);
            return null;
        }
    };

    const handlePaymentSuccess = async (transaction, rideId, token) => {
        try {
            
            if (!transaction || !transaction.reference) {
                console.error('❌ Invalid transaction response');
                toast.error("Payment completed but verification failed. Please contact support.");
                setIsProcessing(false);
                return;
            }

            // Verify payment with backend
            const verifyResponse = await api.post('/paystack/verify-ride-payment', {
                reference: transaction.reference,
                rideId: rideId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (verifyResponse.status === 200) {
                toast.success("Payment successful! Proceeding to live tracking...");
                setIsProcessing(false);
                
                // Navigate to live tracking after a short delay
                setTimeout(() => {
                    navigate(`/live-tracking?rideId=${rideId}`);
                }, 1500);
            }
        } catch (error) {
            console.error('❌ Payment verification failed:', error);
            toast.error(`Payment verification failed: ${error.response?.data?.message || error.message}`);
            setIsProcessing(false);
        }
    };

    const handlePaymentCancel = () => {
        toast.warn("Payment cancelled. You can try again.");
        setIsProcessing(false);
    };

    const handlePaymentError = (error) => {
        console.error('❌ Paystack error:', error);
        const errorMessage = error?.message || 'Unknown payment error occurred';
        toast.error(`Payment error: ${errorMessage}`);
        setIsProcessing(false);
    };

    return {
        processPaymentForRide,
        isProcessing,
        setIsProcessing
    };
};




