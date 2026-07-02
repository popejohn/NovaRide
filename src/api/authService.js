import api from '../services/axios';

const authService = {
    updateProfile: async (data) => {
        return api.put('/auth/update-profile', data);
    },

    changePassword: async (data) => {
        return api.put('/auth/change-password', data);
    },

    updateSecuritySettings: async (data) => {
        return api.put('/auth/security-settings', data);
    },

    uploadProfilePic: async (formData) => {
        const token = localStorage.getItem('nvcr_tk');
        if (!token) {
            throw new Error('No authentication token found');
        }

        return api.post(`${apiUrl}/auth/upload-profile-pic`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
    }
};

export default authService;






