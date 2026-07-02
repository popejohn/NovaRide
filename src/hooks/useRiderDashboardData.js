import { useState, useEffect } from 'react';
import riderService from '../api/riderService';

export const useRiderDashboardData = () => {
    const [walletBalance, setWalletBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [journeys, setJourneys] = useState([]);
    const [totalKm, setTotalKm] = useState(0);
    const [monthlyKm, setMonthlyKm] = useState([0, 0, 0, 0, 0, 0]);

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

    return {
        walletBalance,
        transactions,
        journeys,
        totalKm,
        monthlyKm,
        refetch: fetchDashboardData
    };
};



