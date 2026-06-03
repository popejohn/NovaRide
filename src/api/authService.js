import client from './client';
import axios from 'axios';

const authService = {
    updateProfile: async (data) => {
        return client.put('/auth/update-profile', data);
    },

    changePassword: async (data) => {
        return client.put('/auth/change-password', data);
    },

    updateSecuritySettings: async (data) => {
        return client.put('/auth/security-settings', data);
    },

    uploadProfilePic: async (formData) => {
        const token = localStorage.getItem('nvcr_tk');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        return axios.post(`${apiUrl}/auth/upload-profile-pic`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
    }
};

export default authService;
