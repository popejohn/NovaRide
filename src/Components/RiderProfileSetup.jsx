import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from './Navbar';
import OtherNav from './VerifiedNav';
import Button from './Button';
import Input from './Input';
import { useFormik } from 'formik';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import axios from 'axios';
import { FaCar, FaIdCard, FaCreditCard, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { setProfileCompleted, setUser } from '../Redux/verifiedUserslice';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const RiderProfileSetup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.verifiedUser);

  const [currentStep, setCurrentStep] = useState(1);
  const [profilePicture, setProfilePicture] = useState(user?.profilePic || null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  //get request to fetch existing profile data could be implemented here. Attach token to header

  const token = localStorage.getItem('nvcr_tk');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      axios.get('http://localhost:5000/rider/get-details', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          // Assuming the response has user data, update the store
          if (response.data) {
            dispatch(setUser({ user: response.data.rider, role: 'rider', profileCompleted: response.data.profileCompleted || false }));
          }
        })
        .catch(error => {
          console.error('Error fetching user details:', error);

          // Handle authentication errors (invalid/expired token)
          if (error.response && error.response.status === 401) {
            localStorage.removeItem('nvcr_tk');
            toast.error('Your session has expired. Please login again.');
            navigate('/login');
            return;
          }

          // For other errors, just log them (don't show toast to avoid spam)
        });
    }
  }, [token, navigate, dispatch]);

  // Update profile picture when user data changes
  useEffect(() => {
    if (user?.profilePic && !profilePicture) {
      setProfilePicture(user.profilePic);
    }
  }, [user, profilePicture]);



  const steps = [
    { id: 1, title: 'Personal Info', icon: FaUser },
    { id: 2, title: 'Vehicle Details', icon: FaCar },
    { id: 3, title: 'Documents', icon: FaIdCard },
    { id: 4, title: 'Payment Info', icon: FaCreditCard }
  ];

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
      firstname: Yup.string().required('First name is required'),
      lastname: Yup.string().required('Last name is required'),
      phone: Yup.string().matches(/^0\d{10}$/, 'Please enter a valid phone number').required('Phone number is required'),
      dateOfBirth: Yup.mixed().test('is-date', 'Please select a valid date', (value) => !value || value instanceof Date),
      address: Yup.string().required('Address is required'),
      nextOfKinName: Yup.string().required('Next of kin name is required'),
      nextOfKinPhone: Yup.string().matches(/^0\d{10}$/, 'Please enter a valid phone number').required('Next of kin phone number is required'),
      nextOfKinAddress: Yup.string().required('Next of kin address is required')
    }),
    onSubmit: (values, { setSubmitting }) => {
      // Validate date of birth
      if (!values.dateOfBirth || !(values.dateOfBirth instanceof Date)) {
        toast.error('Please select a valid date of birth.');
        setSubmitting(false);
        return;
      }

      // Check if next of kin phone number is the same as user's phone number
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
      plateNumber: Yup.string().required('Plate number is required'),
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
      licenseNumber: Yup.string().required('Driver license number is required'),
      licenseExpiry: Yup.date().min(new Date(), 'License must not be expired').required('License expiry date is required'),
      insuranceNumber: Yup.string(),
      insuranceExpiry: Yup.date().min(new Date(), 'Insurance must not be expired')
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
      bankName: Yup.string().required('Bank name is required'),
      accountNumber: Yup.string().matches(/^\d{10}$/, 'Account number must be 10 digits').required('Account number is required'),
      accountName: Yup.string().required('Account name is required'),
      bvn: Yup.string().matches(/^\d{11}$/, 'BVN must be 11 digits').required('BVN is required')
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

        const response = await axios.post('http://localhost:5000/rider/create-profile', profileData, {
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

        // Handle authentication errors (invalid/expired token)
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('nvcr_tk');
          toast.error('Your session has expired. Please login again.');
          navigate('/login');
          return;
        }

        // Handle other API errors
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Failed to save profile. Please try again.');
        }
      }
    }
  });

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicture(file);
      // Upload to backend
      await uploadProfilePicture(file);
    }
  };

  const uploadProfilePicture = async (file) => {
    const token = localStorage.getItem('nvcr_tk');
    if (!token) {
      toast.error('Please login first');
      return;
    }

    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      const response = await axios.post('http://localhost:5000/auth/upload-profile-pic', formData, {
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
        toast.error('Your session has expired. Please login again.');
        navigate('/login');
        return;
      }

      toast.error('Failed to upload profile picture');
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

  React.useEffect(() => {
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-20 md:w-24 h-20 md:h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                {profilePicture ? (
                  <img
                    src={typeof profilePicture === 'string' ? profilePicture : URL.createObjectURL(profilePicture)}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <FaUser className="text-2xl md:text-3xl text-gray-400" />
                )}
              </div>
              <div className="flex justify-center space-x-4">
                <button onClick={startCamera} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Take Photo
                </button>
                <button onClick={() => document.getElementById('file-input').click()} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Upload Photo
                </button>
              </div>
              {showCameraModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                    <h3 className="text-lg font-semibold mb-4 text-center">Take Photo</h3>
                    <div className="relative mb-4">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-64 bg-gray-200 rounded"
                        onLoadedMetadata={() => {
                          if (videoRef.current) {
                            videoRef.current.play().catch(console.error);
                          }
                        }}
                      />
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={captureImage}
                        className="bg-yellow-400 text-black px-6 py-2 rounded font-semibold hover:bg-yellow-500"
                      >
                        Capture
                      </button>
                      <button
                        onClick={stopCamera}
                        className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name*"
                value={personalFormik.values.firstname}
                onChange={personalFormik.handleChange}
                onBlur={personalFormik.handleBlur}
                name="firstname"
              />
              <Input
                label="Last Name*"
                value={personalFormik.values.lastname}
                onChange={personalFormik.handleChange}
                onBlur={personalFormik.handleBlur}
                name="lastname"
              />
            </div>

            <Input
              label="Phone Number*"
              type="tel"
              value={personalFormik.values.phone}
              onChange={personalFormik.handleChange}
              onBlur={personalFormik.handleBlur}
              name="phone"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth*</label>
              <DatePicker
                selected={personalFormik.values.dateOfBirth}
                onChange={(date) => personalFormik.setFieldValue('dateOfBirth', date)}
                onBlur={personalFormik.handleBlur}
                name="dateOfBirth"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-0 shadow-md focus:ring-1 focus:ring-yellow-400"
                dateFormat="yyyy-MM-dd"
                placeholderText="Select date of birth"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                maxDate={new Date()}
              />
              {personalFormik.touched.dateOfBirth && personalFormik.errors.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1">{personalFormik.errors.dateOfBirth}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
              <textarea
                name="address"
                value={personalFormik.values.address}
                onChange={personalFormik.handleChange}
                onBlur={personalFormik.handleBlur}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-0 shadow-md focus:ring-1 focus:ring-yellow-400"
                rows={3}
                placeholder="Enter your full address"
              ></textarea>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Next of Kin Details</h3>
              <div className="space-y-4">
                <Input
                  label="Next of Kin Name*"
                  value={personalFormik.values.nextOfKinName}
                  onChange={personalFormik.handleChange}
                  onBlur={personalFormik.handleBlur}
                  name="nextOfKinName"
                  placeholder="Full name"
                />
                <Input
                  label="Next of Kin Phone Number*"
                  type="tel"
                  value={personalFormik.values.nextOfKinPhone}
                  onChange={personalFormik.handleChange}
                  onBlur={personalFormik.handleBlur}
                  name="nextOfKinPhone"
                  placeholder="Phone number"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next of Kin Address*</label>
                  <textarea
                    name="nextOfKinAddress"
                    value={personalFormik.values.nextOfKinAddress}
                    onChange={personalFormik.handleChange}
                    onBlur={personalFormik.handleBlur}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-0 shadow-md focus:ring-1 focus:ring-yellow-400"
                    rows={3}
                    placeholder="Enter next of kin address"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Vehicle Make"
                value={vehicleFormik.values.make}
                onChange={vehicleFormik.handleChange}
                onBlur={vehicleFormik.handleBlur}
                name="make"
                placeholder="e.g., Toyota"
              />
              <Input
                label="Vehicle Model"
                value={vehicleFormik.values.model}
                onChange={vehicleFormik.handleChange}
                onBlur={vehicleFormik.handleBlur}
                name="model"
                placeholder="e.g., Camry"
              />
            </div> */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type*</label>
                <select
                  name="vehicleType"
                  value={vehicleFormik.values.vehicleType}
                  onChange={vehicleFormik.handleChange}
                  onBlur={vehicleFormik.handleBlur}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-0 shadow-md focus:ring-1 focus:ring-yellow-400"
                >
                  <option value="car">Car</option>
                  <option value="bike">Motorcycle</option>
                  <option value="tricycle">Tricycle</option>
                </select>
              </div>
              <Input
                label="Plate Number*"
                value={vehicleFormik.values.plateNumber}
                onChange={vehicleFormik.handleChange}
                onBlur={vehicleFormik.handleBlur}
                name="plateNumber"
                placeholder="ABC 123 XY"
              />
            </div>


          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Driver License Number*"
                value={documentsFormik.values.licenseNumber}
                onChange={documentsFormik.handleChange}
                onBlur={documentsFormik.handleBlur}
                name="licenseNumber"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">License Expiry Date*</label>
                <DatePicker
                  selected={documentsFormik.values.licenseExpiry}
                  onChange={(date) => documentsFormik.setFieldValue('licenseExpiry', date)}
                  onBlur={documentsFormik.handleBlur}
                  name="licenseExpiry"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-0 shadow-md focus:ring-1 focus:ring-yellow-400"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select expiry date"
                  minDate={new Date()}
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                />
                {documentsFormik.touched.licenseExpiry && documentsFormik.errors.licenseExpiry && (
                  <p className="text-red-500 text-sm mt-1">{documentsFormik.errors.licenseExpiry}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Insurance Number"
                value={documentsFormik.values.insuranceNumber}
                onChange={documentsFormik.handleChange}
                onBlur={documentsFormik.handleBlur}
                name="insuranceNumber"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Expiry Date</label>
                <DatePicker
                  selected={documentsFormik.values.insuranceExpiry}
                  onChange={(date) => documentsFormik.setFieldValue('insuranceExpiry', date)}
                  onBlur={documentsFormik.handleBlur}
                  name="insuranceExpiry"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-0 shadow-md focus:ring-1 focus:ring-yellow-400"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select expiry date"
                  minDate={new Date()}
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                />
                {documentsFormik.touched.insuranceExpiry && documentsFormik.errors.insuranceExpiry && (
                  <p className="text-red-500 text-sm mt-1">{documentsFormik.errors.insuranceExpiry}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <Input
              label="Bank Name*"
              value={paymentFormik.values.bankName}
              onChange={paymentFormik.handleChange}
              onBlur={paymentFormik.handleBlur}
              name="bankName"
              placeholder="e.g., First Bank"
            />

            <Input
              label="Account Number*"
              value={paymentFormik.values.accountNumber}
              onChange={paymentFormik.handleChange}
              onBlur={paymentFormik.handleBlur}
              name="accountNumber"
              placeholder="1234567890"
            />

            <Input
              label="Account Name*"
              value={paymentFormik.values.accountName}
              onChange={paymentFormik.handleChange}
              onBlur={paymentFormik.handleBlur}
              name="accountName"
              placeholder="John A. Doe"
            />

            <Input
              label="BVN*"
              value={paymentFormik.values.bvn}
              onChange={paymentFormik.handleChange}
              onBlur={paymentFormik.handleBlur}
              name="bvn"
              placeholder="12345678901"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const getCurrentFormik = () => {
    switch (currentStep) {
      case 1: return personalFormik;
      case 2: return vehicleFormik;
      case 3: return documentsFormik;
      case 4: return paymentFormik;
      default: return personalFormik;
    }
  };

  const currentFormik = getCurrentFormik();

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* <Navbar userrole="rider" userverified={true} profilePic="/placeholderProfile.jpg" nav={<OtherNav userrole="rider" />}/> */}

      <div className="px-4 pt-10 md:px-8">
        <div className="max-w-md md:max-w-4xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl text-center md:text-3xl font-bold text-gray-900 mb-2">{user?.firstname} Complete Your Profile</h1>
            <p className="text-gray-600 text-center text-sm">Set up your profile to start accepting rides</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 md:w-10 h-8 md:h-10 rounded-full ${step.id <= currentStep ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-400'
                    }`}>
                    <step.icon className="text-xs md:text-sm" />
                  </div>
                  <div className="ml-2 md:ml-3">
                    <div className={`text-xs md:text-sm font-medium hidden md:block ${step.id <= currentStep ? 'text-black' : 'text-gray-400'
                      }`}>
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 md:w-16 h-0.5 mx-2 md:mx-4 ${step.id < currentStep ? 'bg-yellow-400' : 'bg-gray-200'
                      }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <form onSubmit={currentFormik.handleSubmit}>
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6 md:mt-8">
                <Button
                  type="button"
                  text="Previous"
                  classes={`px-4 md:px-6 py-2 rounded font-semibold text-sm md:text-base ${currentStep === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                    }`}
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  disabled={currentStep === 1}
                />

                <Button
                  type="submit"
                  text={currentStep === 4 ? 'Complete Setup' : 'Next'}
                  classes="bg-yellow-400 text-black px-4 md:px-6 py-2 rounded font-semibold hover:bg-yellow-500 text-sm md:text-base"
                  disabled={!currentFormik.isValid}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderProfileSetup;