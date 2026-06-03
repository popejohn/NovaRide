import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from './Navbar';
import OtherNav from './VerifiedNav';
import Button from './Button';
import axios from 'axios';
import { FaCar, FaIdCard, FaCreditCard, FaUser } from 'react-icons/fa';
import { setUser } from '../Redux/verifiedUserslice';
import RiderPersonalInfoStep from './Rider/RiderPersonalInfoStep';
import VehicleDetailsStep from './Rider/VehicleDetailsStep';
import RiderDocumentsStep from './Rider/RiderDocumentsStep';
import RiderPaymentStep from './Rider/RiderPaymentStep';
import { useProfilePicture } from '../hooks/useProfilePicture';
import { useRiderProfileForm } from '../hooks/useRiderProfileForm';

const RiderProfileSetup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.verifiedUser);
  const token = localStorage.getItem('nvcr_tk');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        axios.get(`${apiUrl}/rider/get-details`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data) {
            dispatch(
              setUser({
                user: response.data.rider,
                role: 'rider',
                profileCompleted: response.data.profileCompleted || false,
              })
            );
          }
        })
        .catch((error) => {
          console.error('Error fetching user details:', error);
          if (error.response && error.response.status === 401) {
            localStorage.removeItem('nvcr_tk');
            navigate('/login');
            return;
          }
        });
    }
  }, [token, navigate, dispatch]);

  const profilePicHook = useProfilePicture(user);
  const formHook = useRiderProfileForm(user);

  const steps = [
    { id: 1, title: 'Personal Info', icon: FaUser },
    { id: 2, title: 'Vehicle Details', icon: FaCar },
    { id: 3, title: 'Documents', icon: FaIdCard },
    { id: 4, title: 'Payment Info', icon: FaCreditCard },
  ];

  const renderStepContent = () => {
    switch (formHook.currentStep) {
      case 1:
        return (
          <RiderPersonalInfoStep
            formik={formHook.personalFormik}
            profilePicture={profilePicHook.profilePicture}
            handleProfilePictureChange={profilePicHook.handleProfilePictureChange}
            startCamera={profilePicHook.startCamera}
            showCameraModal={profilePicHook.showCameraModal}
            videoRef={profilePicHook.videoRef}
            canvasRef={profilePicHook.canvasRef}
            captureImage={profilePicHook.captureImage}
            stopCamera={profilePicHook.stopCamera}
          />
        );
      case 2:
        return <VehicleDetailsStep formik={formHook.vehicleFormik} />;
      case 3:
        return <RiderDocumentsStep formik={formHook.documentsFormik} />;
      case 4:
        return <RiderPaymentStep formik={formHook.paymentFormik} />;
      default:
        return null;
    }
  };

  const currentFormik = formHook.getCurrentFormik();

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* <Navbar userrole="rider" userverified={true} profilePic="/placeholderProfile.jpg" nav={<OtherNav userrole="rider" />}/> */}

      <div className="px-4 pt-10 md:px-8">
        <div className="max-w-md md:max-w-4xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl text-center md:text-3xl font-bold text-gray-900 mb-2">
              {user?.firstname} Complete Your Profile
            </h1>
            <p className="text-gray-600 text-center text-sm">
              Set up your profile to start accepting rides
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 md:w-10 h-8 md:h-10 rounded-full ${
                      step.id <= formHook.currentStep
                        ? 'bg-yellow-400 text-black'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    <step.icon className="text-xs md:text-sm" />
                  </div>
                  <div className="ml-2 md:ml-3">
                    <div
                      className={`text-xs md:text-sm font-medium hidden md:block ${
                        step.id <= formHook.currentStep
                          ? 'text-black'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 md:w-16 h-0.5 mx-2 md:mx-4 ${
                        step.id < formHook.currentStep
                          ? 'bg-yellow-400'
                          : 'bg-gray-200'
                      }`}
                    />
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
                  classes={`px-4 md:px-6 py-2 rounded font-semibold text-sm md:text-base ${
                    formHook.currentStep === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                  onClick={() => formHook.setCurrentStep((prev) => prev - 1)}
                  disabled={formHook.currentStep === 1}
                />

                <Button
                  type="submit"
                  text={formHook.currentStep === 4 ? 'Complete Setup' : 'Next'}
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