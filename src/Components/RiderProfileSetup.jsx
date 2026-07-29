import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from './Navbar';
import OtherNav from './VerifiedNav';
import Button from './Button';
import api from '../services/axios';
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
        api.get('/rider/get-details', {
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
    <div className="min-h-screen bg-neutral-950 text-white py-12 px-4 sm:px-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-orange-500/10 via-orange-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-[15%] right-[-5%] w-[450px] h-[450px] bg-orange-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-3 leading-tight">
            {user?.firstname ? `${user.firstname}, ` : ''}Complete Your <span className="text-orange-500">Rider Profile</span>
          </h1>
          <p className="text-neutral-400 font-bold text-xs md:text-sm tracking-wide uppercase">
            Step {formHook.currentStep} of {steps.length}: {steps.find((s) => s.id === formHook.currentStep)?.title}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between bg-neutral-900/80 backdrop-blur-xl p-4 md:p-6 rounded-[2rem] border border-white/10 shadow-2xl">
            {steps.map((step, index) => {
              const isCurrent = step.id === formHook.currentStep;
              const isCompleted = step.id < formHook.currentStep;
              const StepIcon = step.icon;

              return (
                <div key={step.id} className="flex items-center group/step">
                  <div
                    className={`relative flex items-center justify-center w-10 md:w-12 h-10 md:h-12 rounded-[1.25rem] transition-all duration-500 ${
                      isCurrent
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/40 scale-110'
                        : isCompleted
                        ? 'bg-neutral-800 text-orange-400 border border-orange-500/40'
                        : 'bg-neutral-900 text-neutral-600 border border-white/5'
                    }`}
                  >
                    <StepIcon className="text-xs md:text-base" />
                    {isCompleted && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-neutral-950 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                  <div className="ml-3 mr-4 hidden md:block">
                    <div
                      className={`text-[10px] font-black uppercase tracking-[0.2em] mb-0.5 ${
                        isCurrent || isCompleted ? 'text-white' : 'text-neutral-600'
                      }`}
                    >
                      Step 0{step.id}
                    </div>
                    <div
                      className={`text-[11px] font-bold ${
                        isCurrent ? 'text-orange-400' : isCompleted ? 'text-neutral-300' : 'text-neutral-600'
                      }`}
                    >
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="mx-2 hidden sm:block">
                      <div
                        className={`w-8 md:w-14 h-[2px] rounded-full transition-all duration-500 ${
                          isCompleted ? 'bg-orange-500' : 'bg-neutral-800'
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-neutral-900/90 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-12 shadow-2xl shadow-black/60 relative overflow-hidden">
          {/* Accent glow behind form */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[90px] rounded-full -mr-20 -mt-20 pointer-events-none" />

          <form onSubmit={currentFormik.handleSubmit} className="relative z-10">
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-10 pt-8 border-t border-white/10">
              <Button
                type="button"
                text="Previous"
                classes={`px-6 py-4.5 rounded-xl font-bold text-xs uppercase tracking-[0.15em] transition-all duration-300 ${
                  formHook.currentStep === 1
                    ? 'bg-neutral-800/50 text-neutral-600 cursor-not-allowed border border-white/5'
                    : 'bg-white/10 text-white hover:bg-white/20 active:scale-95 border border-white/10'
                }`}
                onClick={() => formHook.setCurrentStep((prev) => prev - 1)}
                disabled={formHook.currentStep === 1}
              />

              <Button
                type="submit"
                text={formHook.currentStep === 4 ? 'Complete Setup' : 'Next Step'}
                classes="bg-orange-500 text-white px-8 py-4.5 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-orange-500/25"
                disabled={!currentFormik.isValid}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RiderProfileSetup;





