import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../Redux/verifiedUserslice';
import authService from '../api/authService';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

export const useProfileManagement = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.verifiedUser);

    const [activeTab, setActiveTab] = useState('profile');
    const [profileImage, setProfileImage] = useState(user?.profilePic || '/placeholderProfile.jpg');
    const [privacySettings, setPrivacySettings] = useState(user?.privacySettings || {
        shareRideHistory: false,
        allowLocationTracking: true,
        receiveMarketingEmails: false
    });
    const [isSavingPrivacy, setIsSavingPrivacy] = useState(false);

    useEffect(() => {
        if (user?.profilePic && profileImage === '/placeholderProfile.jpg') {
            setProfileImage(user.profilePic);
        }
        if (user?.privacySettings) {
            setPrivacySettings(user.privacySettings);
        }
    }, [user, profileImage]);

    const getUserRole = () => user?.role || 'passenger';

    const getRoleDisplay = () => {
        const role = getUserRole();
        switch (role) {
            case 'rider': return 'Rider';
            case 'installment': return 'Installment Customer';
            default: return 'Passenger';
        }
    };

    const profileValidationSchema = Yup.object({
        firstname: Yup.string().required('First name is required'),
        lastname: Yup.string().required('Last name is required'),
        phone: Yup.string().required('Phone number is required'),
        dateOfBirth: Yup.date().required('Date of birth is required').nullable(),
        address: Yup.string().required('Address is required')
    });

    const handleProfileUpdate = async (values, { setSubmitting }) => {
        try {
            const response = await authService.updateProfile(values);
            if (response.data.success) {
                toast.success('Profile updated successfully');
                dispatch(setUser({ user: response.data.data }));
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setSubmitting(false);
        }
    };

    const handlePasswordChange = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await authService.changePassword(values);
            if (response.data.success) {
                toast.success('Password updated successfully');
                resetForm();
            }
        } catch (error) {
            console.error('Error changing password:', error);
            const message = error.response?.data?.message;
            if (message && message.toLowerCase() === 'invalid current password') {
                toast.error(message);
                resetForm();
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleSmsToggle = async () => {
        const newState = !user?.isSmsProtectionEnabled;
        try {
            const response = await authService.updateSecuritySettings({ isSmsProtectionEnabled: newState });
            if (response.data.success) {
                toast.success(`SMS Protection ${newState ? 'enabled' : 'disabled'}`);
                dispatch(setUser({ user: response.data.data }));
            }
        } catch (error) {
            console.error('Error toggling SMS protection:', error);
            toast.error('Failed to update security settings');
        }
    };

    const handleNotificationUpdate = async (newSettings) => {
        try {
            const response = await authService.updateProfile({ notificationSettings: newSettings });
            if (response.data.success) {
                toast.success('Notification preferences updated successfully');
                dispatch(setUser({ user: response.data.data }));
            }
        } catch (error) {
            console.error('Error updating notification settings:', error);
            toast.error(error.response?.data?.message || 'Failed to update notification settings');
        }
    };

    const handlePrivacyToggle = (setting) => {
        setPrivacySettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };

    const handlePrivacyUpdate = async () => {
        try {
            setIsSavingPrivacy(true);
            const response = await authService.updateProfile({ privacySettings });
            if (response.data.success) {
                toast.success('Privacy settings updated successfully');
                dispatch(setUser({ user: response.data.data }));
            }
        } catch (error) {
            console.error('Error updating privacy settings:', error);
            toast.error(error.response?.data?.message || 'Failed to update privacy settings');
        } finally {
            setIsSavingPrivacy(false);
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setProfileImage(e.target.result);
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append('profilePic', file);

            try {
                const response = await authService.uploadProfilePic(formData);
                if (response.data.success) {
                    toast.success('Profile picture uploaded successfully');
                    dispatch(setUser({ user: response.data.data.user }));
                    setProfileImage(response.data.data.profilePic);
                }
            } catch (error) {
                console.error('Error uploading profile picture:', error);
                toast.error(error.response?.data?.message || 'Failed to upload profile picture');
            }
        }
    };

    const initialProfileValues = {
        firstname: user?.firstname || '',
        lastname: user?.lastname || '',
        phone: user?.phone || '',
        dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth) : null,
        address: user?.address || ''
    };

    return {
        user,
        activeTab,
        setActiveTab,
        profileImage,
        privacySettings,
        isSavingPrivacy,
        getUserRole,
        getRoleDisplay,
        profileValidationSchema,
        handleProfileUpdate,
        handlePasswordChange,
        handleSmsToggle,
        handleNotificationUpdate,
        handlePrivacyToggle,
        handlePrivacyUpdate,
        handleImageUpload,
        initialProfileValues
    };
};




