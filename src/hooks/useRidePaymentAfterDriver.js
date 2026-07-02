import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/axios';
import { toast } from 'react-toastify';

export const useRidePaymentAfterDriver = (rideId, rideDetails) => {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

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
            console.log('💳 Processing payment for ride:', rideId, 'Fare: ₦' + fare);

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
            console.log('💰 Wallet Balance:', balance, 'Required Fare:', fare);
            
            // Note: We do not check if balance < fare here because the user is 
            // paying directly with Paystack (card).

            // Get user email for Paystack
            let userEmail = `user_${Date.now()}@novacrest.local`;
            try {
                const userStr = localStorage.getItem('verifiedUser');
                if (userStr) {
                    const userData = JSON.parse(userStr);
                    userEmail = userData.email || userEmail;
                }
            } catch (e) {
                console.warn('Could not get user email from storage:', e.message);
            }

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
            console.log('✅ Paystack payment successful:', transaction);
            
            if (!transaction || !transaction.reference) {
                console.error('❌ Invalid transaction response');
                toast.error("Payment completed but verification failed. Please contact support.");
                setIsProcessing(false);
                return;
            }

            // Verify payment with backend
            console.log('🔍 Verifying payment with backend...');
            const verifyResponse = await api.post('/paystack/verify-ride-payment', {
                reference: transaction.reference,
                rideId: rideId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (verifyResponse.status === 200) {
                console.log('✅ Payment verified successfully');
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
        console.log('⚠️ Payment cancelled by user');
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




