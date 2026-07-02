import { useState, useRef, useEffect } from 'react';
import api from '../services/axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUser } from '../Redux/verifiedUserslice';
import { useNavigate } from 'react-router-dom';

export const useProfilePicture = (user) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [profilePicture, setProfilePicture] = useState(user?.profilePic || null);
    const [showCameraModal, setShowCameraModal] = useState(false);
    const [cameraStream, setCameraStream] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Update profile picture when user data changes
    useEffect(() => {
        if (user?.profilePic && !profilePicture) {
            setProfilePicture(user.profilePic);
        }
    }, [user, profilePicture]);

    const uploadProfilePicture = async (file) => {
        const token = localStorage.getItem('nvcr_tk');
        if (!token) {
            toast.error('Please login first');
            return;
        }

        const formData = new FormData();
        formData.append('profilePic', file);

        try {
            const response = await api.post('/auth/upload-profile-pic', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                toast.success('Profile picture uploaded successfully');
                // Update local state and Redux store
                setProfilePicture(response.data.data.profilePic);
                dispatch(setUser({ ...user, profilePic: response.data.data.profilePic }));
            }
        } catch (error) {
            console.error('Error uploading profile picture:', error);

            // Handle authentication errors (invalid/expired token)
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('nvcr_tk');
                navigate('/login');
                return;
            }

            toast.error('Failed to upload profile picture');
        }
    };

    const handleProfilePictureChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfilePicture(file);
            // Upload to backend
            await uploadProfilePicture(file);
        }
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setCameraStream(stream);
            setShowCameraModal(true);
        } catch (error) {
            console.error('Error accessing camera:', error);
            toast.error('Unable to access camera. Please check permissions.');
        }
    };

    useEffect(() => {
        if (showCameraModal && cameraStream && videoRef.current) {
            videoRef.current.srcObject = cameraStream;
            videoRef.current.play().catch(console.error);
        }
    }, [showCameraModal, cameraStream]);

    const stopCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
        setShowCameraModal(false);
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);

            canvas.toBlob(async (blob) => {
                if (blob) {
                    setProfilePicture(blob);
                    // Upload to backend
                    await uploadProfilePicture(blob);
                }
                stopCamera();
            }, 'image/jpeg', 0.8);
        }
    };

    return {
        profilePicture,
        showCameraModal,
        videoRef,
        canvasRef,
        handleProfilePictureChange,
        startCamera,
        stopCamera,
        captureImage
    };
};






