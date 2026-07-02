import api from '../services/axios';

// Set base URL for axios defaults if not already set globally or just use local prefix
const API_BASE = ''; // Using relative paths as axios might be configured with a proxy or base URL in api.js

const riderService = {
    getDetails: async () => {
        const token = localStorage.getItem('nvcr_tk');
        return api.get('/api/rider/get-details', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },

    getAvailableRides: async () => {
        const token = localStorage.getItem('nvcr_tk');
        return api.get('/api/ride/available-rides', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },

    updateLocation: async (latitude, longitude, isAvailable) => {
        const token = localStorage.getItem('nvcr_tk');
        return api.put('/api/rider/update-location',
            { latitude, longitude, isAvailable },
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
    },

    getWalletData: async () => {
        const token = localStorage.getItem('nvcr_tk');
        return api.get('/api/user/wallet-data', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },

    getRideHistory: async (role = 'rider') => {
        const token = localStorage.getItem('nvcr_tk');
        return api.get(`/api/ride/history?role=${role}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }
};

export default riderService;




