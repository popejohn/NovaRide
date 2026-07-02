import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../services/axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setProfileCompleted } from '../Redux/verifiedUserslice';
import { useNavigate } from 'react-router-dom';

export const useRiderProfileForm = (user) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);

    const personalFormik = useFormik({
        initialValues: {
            firstname: user?.firstname || '',
            lastname: user?.lastname || '',
            phone: user?.phone || '',
            dateOfBirth: null,
            address: '',
            nextOfKinName: '',
            nextOfKinPhone: '',
            nextOfKinAddress: ''
        },
        validationSchema: Yup.object({
            firstname: Yup.string()
                .transform((value) => (value || '').trim())
                .min(2, 'Enter a valid first name')
                .required('First name is required'),
            lastname: Yup.string()
                .transform((value) => (value || '').trim())
                .min(2, 'Enter a valid last name')
                .required('Last name is required'),
            phone: Yup.string()
                .transform((value) => (value || '').trim())
                .matches(/^0\d{10}$/, 'Please enter a valid phone number')
                .required('Phone number is required'),
            dateOfBirth: Yup.date()
                .typeError('Please select a valid date')
                .required('Date of birth is required'),
            address: Yup.string()
                .transform((value) => (value || '').trim())
                .required('Address is required'),
            nextOfKinName: Yup.string()
                .transform((value) => (value || '').trim())
                .required('Next of kin name is required'),
            nextOfKinPhone: Yup.string()
                .transform((value) => (value || '').trim())
                .matches(/^0\d{10}$/, 'Please enter a valid phone number')
                .required('Next of kin phone number is required')
                .test(
                    'different-from-user-phone',
                    'Next of kin phone number cannot be the same as your phone number',
                    function (value) {
                        const { phone } = this.parent;
                        return !value || !phone || value !== phone;
                    }
                ),
            nextOfKinAddress: Yup.string()
                .transform((value) => (value || '').trim())
                .required('Next of kin address is required')
        }),
        onSubmit: (values, { setSubmitting }) => {
            if (!values.dateOfBirth || !(values.dateOfBirth instanceof Date)) {
                toast.error('Please select a valid date of birth.');
                setSubmitting(false);
                return;
            }
            if (values.nextOfKinPhone === values.phone) {
                toast.error('Next of kin phone number cannot be the same as your phone number. Please use a different number.');
                setSubmitting(false);
                return;
            }
            setCurrentStep(2);
            setSubmitting(false);
        }
    });

    const vehicleFormik = useFormik({
        initialValues: {
            plateNumber: '',
            vehicleType: 'tricycle'
        },
        validationSchema: Yup.object({
            plateNumber: Yup.string()
                .transform((value) => (value || '').trim().toUpperCase())
                .matches(/^[A-Z]{3}\d{3}[A-Z]{2}$|^[A-Z]{2}\d{3}[A-Z]{3}$/, 'Enter a valid plate number')
                .required('Plate number is required'),
            vehicleType: Yup.string().oneOf(['car', 'bike', 'tricycle']).required('Vehicle type is required')
        }),
        onSubmit: () => setCurrentStep(3)
    });

    const documentsFormik = useFormik({
        initialValues: {
            licenseNumber: '',
            licenseExpiry: '',
            insuranceNumber: '',
            insuranceExpiry: ''
        },
        validationSchema: Yup.object({
            licenseNumber: Yup.string()
                .transform((value) => (value || '').trim())
                .required('Driver license number is required'),
            licenseExpiry: Yup.date()
                .typeError('Please select a valid license expiry date')
                .min(new Date(), 'License must not be expired')
                .required('License expiry date is required'),
            insuranceNumber: Yup.string().transform((value) => (value || '').trim()),
            insuranceExpiry: Yup.date()
                .nullable()
                .transform((value, originalValue) => (originalValue === '' ? null : value))
                .when('insuranceNumber', {
                    is: (insuranceNumber) => Boolean((insuranceNumber || '').trim()),
                    then: (schema) => schema
                        .typeError('Please select a valid insurance expiry date')
                        .min(new Date(), 'Insurance must not be expired')
                        .required('Insurance expiry date is required when insurance number is provided'),
                    otherwise: (schema) => schema.notRequired()
                })
        }),
        onSubmit: () => setCurrentStep(4)
    });

    const paymentFormik = useFormik({
        initialValues: {
            bankName: '',
            accountNumber: '',
            accountName: '',
            bvn: ''
        },
        validationSchema: Yup.object({
            bankName: Yup.string()
                .transform((value) => (value || '').trim())
                .required('Bank name is required'),
            accountNumber: Yup.string()
                .transform((value) => (value || '').trim())
                .matches(/^\d{10}$/, 'Account number must be 10 digits')
                .required('Account number is required'),
            accountName: Yup.string()
                .transform((value) => (value || '').trim())
                .required('Account name is required'),
            bvn: Yup.string()
                .transform((value) => (value || '').trim())
                .matches(/^\d{11}$/, 'BVN must be 11 digits')
                .required('BVN is required')
        }),
        onSubmit: async (values) => {
            try {
                const token = localStorage.getItem('nvcr_tk');
                if (!token) {
                    toast.error('Please login first');
                    return;
                }

                const profileData = {
                    personal: personalFormik.values,
                    vehicle: vehicleFormik.values,
                    documents: documentsFormik.values,
                    payment: values
                };

                const response = await api.post('/rider/create-profile', profileData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data) {
                    dispatch(setProfileCompleted());
                    toast.success('Profile setup completed successfully!');
                    navigate('/riderdashboard');
                }
            } catch (error) {
                console.error('Profile setup error:', error);
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('nvcr_tk');
                    navigate('/login');
                    return;
                }
                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error('Failed to save profile. Please try again.');
                }
            }
        }
    });

    const getCurrentFormik = () => {
        switch (currentStep) {
            case 1: return personalFormik;
            case 2: return vehicleFormik;
            case 3: return documentsFormik;
            case 4: return paymentFormik;
            default: return personalFormik;
        }
    };

    return {
        currentStep,
        setCurrentStep,
        personalFormik,
        vehicleFormik,
        documentsFormik,
        paymentFormik,
        getCurrentFormik
    };
};






