import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../Redux/verifiedUserslice';

/**
 * Custom hook to manage session inactivity timeout.
 * @param {boolean} isAuthenticated - Whether the user is currently authenticated.
 * @param {number} timeoutMs - Timeout duration in milliseconds (default: 30 minutes).
 */
const useSessionTimeout = (isAuthenticated, timeoutMs = 30 * 60 * 1000) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = useCallback(() => {
        dispatch(logout());
        navigate('/login');
    }, [dispatch, navigate]);

    useEffect(() => {
        if (!isAuthenticated) return;

        let timeoutId;

        const resetTimeout = () => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(handleLogout, timeoutMs);
        };

        const activityEvents = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];

        // Initial timeout
        resetTimeout();

        // Reset timeout on activity
        activityEvents.forEach((event) => {
            window.addEventListener(event, resetTimeout);
        });

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            activityEvents.forEach((event) => {
                window.removeEventListener(event, resetTimeout);
            });
        };
    }, [handleLogout, timeoutMs, isAuthenticated]);
};

export default useSessionTimeout;




