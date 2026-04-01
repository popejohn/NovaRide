import { useState, useEffect, useRef } from 'react';
import riderService from '../api/riderService';

export const useAvailableRides = (isOnline) => {
    const [availableRides, setAvailableRides] = useState([]);
    const ridesIntervalRef = useRef(null);

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

    return {
        availableRides,
        refetchRides: fetchRides
    };
};