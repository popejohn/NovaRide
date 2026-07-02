import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Button from './Button';
import Input from './Input';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaUser, FaIdCard, FaBriefcase, FaHome, FaMoneyBillWave, FaCalculator, FaUsers } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { setProfileCompleted } from '../Redux/verifiedUserslice';
import api from '../services/axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PersonalInfoStep from './Installment/PersonalInfoStep';
import GuarantorsStep from './Installment/GuarantorsStep';
import DocumentsStep from './Installment/DocumentsStep';
import InstallmentPlanStep from './Installment/InstallmentPlanStep';
import PaymentStep from './Installment/PaymentStep';

import { FaCalendarAlt } from 'react-icons/fa';

const InstallmentProfileSetup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.verifiedUser);

  const [currentStep, setCurrentStep] = useState(1);
  const [profilePicture, setProfilePicture] = useState(null);

  const steps = [
    { id: 1, title: 'Personal Info', icon: FaUser },
    { id: 2, title: 'Guarantors', icon: FaUsers },
    { id: 3, title: 'Documents', icon: FaIdCard },
    { id: 4, title: 'Installment Plan', icon: FaCalculator },
    { id: 5, title: 'Payment', icon: FaMoneyBillWave }
  ];

  const personalFormik = useFormik({
    initialValues: {
      firstname: user?.firstname || '',
      lastname: user?.lastname || '',
      phone: user?.phone || '',
      email: user?.email || '',
      dateOfBirth: '',
      gender: '',
      maritalStatus: '',
      address: '',
      city: '',
      state: ''
    },
    validationSchema: Yup.object({
      firstname: Yup.string().required('First name is required').min(2, 'Enter a valid first name'),
      lastname: Yup.string().required('Last name is required').min(2, 'Enter a valid last name'),
      phone: Yup.string().matches(/^0\d{10}$/, 'Please enter a valid phone number').required('Phone number is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      dateOfBirth: Yup.date().required('Date of birth is required'),
      gender: Yup.string().oneOf(['male', 'female']).required('Gender is required'),
      maritalStatus: Yup.string().oneOf(['single', 'married', 'divorced', 'widowed']).required('Marital status is required'),
      address: Yup.string().required('Address is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required')
    }),
    onSubmit: () => setCurrentStep(2)
  });

  const guarantorsFormik = useFormik({
    initialValues: {
      g1Name: '',
      g1Phone: '',
      g1Relationship: '',
      g1Address: '',
      g1Employer: '',
      g1Job: '',
      g1Income: '',
      g2Name: '',
      g2Phone: '',
      g2Relationship: '',
      g2Address: '',
      g2Employer: '',
      g2Job: '',
      g2Income: ''
    },
    validationSchema: Yup.object({
      g1Name: Yup.string().required('Guarantor 1 name is required'),
      g1Phone: Yup.string().matches(/^0\d{10}$/, 'Invalid phone number').required('Guarantor 1 phone is required'),
      g1Relationship: Yup.string().required('Relationship is required'),
      g1Address: Yup.string().required('Address is required'),
      g1Employer: Yup.string().required('Employer name is required'),
      g1Job: Yup.string().required('Job title is required'),
      g1Income: Yup.number().min(0, 'Income cannot be negative').min(300000, 'Minimum income is ₦300,000').required('Income is required'),
      g2Name: Yup.string().required('Guarantor 2 name is required'),
      g2Phone: Yup.string().matches(/^0\d{10}$/, 'Invalid phone number').required('Guarantor 2 phone is required'),
      g2Relationship: Yup.string().required('Relationship is required'),
      g2Address: Yup.string().required('Address is required'),
      g2Employer: Yup.string().required('Employer name is required'),
      g2Job: Yup.string().required('Job title is required'),
      g2Income: Yup.number()
        .min(0, 'Income cannot be negative')
        .min(300000, 'Minimum income is ₦300,000')
        .required('Income is required')
        .test('at-least-one-500k', 'At least one guarantor must earn ₦500,000 or more', function(value) {
          const { g1Income } = this.parent;
          return value >= 500000 || g1Income >= 500000;
        })
    }),
    onSubmit: () => setCurrentStep(3)
  });

  const documentsFormik = useFormik({
    initialValues: {
      idType: '',
      idNumber: '',
      idExpiry: '',
      bvn: '',
      nin: ''
    },
    validationSchema: Yup.object({
      idType: Yup.string().oneOf(['national-id', 'drivers-license', 'international-passport']).required('ID type is required'),
      idNumber: Yup.number("Enter a valid ID number").required('ID number is required'),
      idExpiry: Yup.date().min(new Date(), 'ID must not be expired').required('ID expiry date is required').nullable(),
      bvn: Yup.number().matches(/^\d{11}$/, 'BVN must be 11 digits').required('BVN is required'),
      nin: Yup.string().matches(/^\d{11}$/, 'NIN must be 11 digits').required('NIN is required')
    }),
    onSubmit: () => setCurrentStep(4)
  });

  const planFormik = useFormik({
    initialValues: {
      planName: '',
      duration: ''
    },
    validationSchema: Yup.object({
      planName: Yup.string().required('Please select an installment plan')
    }),
    onSubmit: () => setCurrentStep(5)
  });

  const plans = [
    { 
      id: 'sprint', 
      name: 'Nova sprint', 
      duration: 12, 
      description: 'Quick completion for focused riders.',
      features: ['Lower total interest', 'Fast ownership', '12 Months duration']
    },
    { 
      id: 'stability', 
      name: 'Nova stability', 
      duration: 18, 
      description: 'Balanced payments for consistent growth.',
      features: ['Optimal monthly rate', 'Simplified planning', '18 Months duration']
    },
    { 
      id: 'friend', 
      name: 'Nova friend', 
      duration: 24, 
      description: 'Maximum flexibility for your journey.',
      features: ['Lowest monthly impact', 'Long-term partnership', '24 Months duration']
    }
  ];

  const paymentFormik = useFormik({
    initialValues: {
      bankName: '',
      accountNumber: '',
      accountName: ''
    },
    validationSchema: Yup.object({
      bankName: Yup.string().required('Bank name is required'),
      accountNumber: Yup.string().matches(/^\d{10}$/, 'Account number must be 10 digits').required('Account number is required'),
      accountName: Yup.string().required('Account name is required')
    }),
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem('nvcr_tk');
        const profileData = {
          personal: personalFormik.values,
          guarantors: [
            { 
              name: guarantorsFormik.values.g1Name, 
              phone: guarantorsFormik.values.g1Phone, 
              relationship: guarantorsFormik.values.g1Relationship,
              address: guarantorsFormik.values.g1Address,
              employment: {
                employerName: guarantorsFormik.values.g1Employer,
                jobTitle: guarantorsFormik.values.g1Job,
                monthlyIncome: guarantorsFormik.values.g1Income
              }
            },
            { 
              name: guarantorsFormik.values.g2Name, 
              phone: guarantorsFormik.values.g2Phone, 
              relationship: guarantorsFormik.values.g2Relationship,
              address: guarantorsFormik.values.g2Address,
              employment: {
                employerName: guarantorsFormik.values.g2Employer,
                jobTitle: guarantorsFormik.values.g2Job,
                monthlyIncome: guarantorsFormik.values.g2Income
              }
            }
          ],
          documents: documentsFormik.values,
          installmentPlan: {
            planName: planFormik.values.planName,
            remainingMonths: planFormik.values.duration
          },
          paymentDetails: values,
        };

        await api.post('/user/installment-profile', profileData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        dispatch(setProfileCompleted());
        toast.success('Profile setup completed successfully!');
        navigate('/installment-dashboard');
      } catch (error) {
        console.error('Profile setup error:', error);
        if (error.response?.status !== 401) {
          toast.error('Failed to save profile. Please try again.');
        }
      }
    }
  });

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicture(file);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep 
            formik={personalFormik} 
            profilePicture={profilePicture} 
            onProfilePictureChange={handleProfilePictureChange} 
          />
        );
      case 2:
        return <GuarantorsStep formik={guarantorsFormik} />;
      case 3:
        return <DocumentsStep formik={documentsFormik} />;
      case 4:
        return <InstallmentPlanStep formik={planFormik} plans={plans} />;
      case 5:
        return <PaymentStep formik={paymentFormik} />;
      default:
        return null;
    }
  };

  const getCurrentFormik = () => {
    switch (currentStep) {
      case 1: return personalFormik;
      case 2: return guarantorsFormik;
      case 3: return documentsFormik;
      case 4: return planFormik;
      case 5: return paymentFormik;
      default: return personalFormik;
    }
  };

  const currentFormik = getCurrentFormik();

  return (
    <div className="min-h-screen bg-stone-50 py-16 px-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-neutral-900 pointer-events-none skew-y-[-6deg] origin-top-left -mt-32" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
          <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl font-black text-white tracking-tighter mb-4 leading-tight">
                Complete Your <br />
                <span className="text-orange-500">Installment</span> Profile
              </h1>
              <p className="text-neutral-400 font-bold text-sm tracking-wide uppercase">
                Step {currentStep} of {steps.length}: {steps.find(s => s.id === currentStep)?.title}
              </p>
            </div>
            <div className="hidden md:block">
              <p className="text-neutral-500 font-bold text-xs max-w-xs leading-relaxed">
                Unlock your potential with our flexible vehicle financing. Complete your profile to get started with your application.
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between bg-neutral-900/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center group/step cursor-pointer" onClick={() => step.id < currentStep && setCurrentStep(step.id)}>
                  <div className={`relative flex items-center justify-center w-12 h-12 rounded-[1.25rem] transition-all duration-500 ${
                    step.id === currentStep 
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/40 scale-110' 
                      : step.id < currentStep 
                        ? 'bg-white text-neutral-900' 
                        : 'bg-neutral-800 text-neutral-500 group-hover/step:bg-neutral-700'
                  }`}>
                    <step.icon className="text-base" />
                    {step.id < currentStep && (
                       <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-neutral-900 flex items-center justify-center">
                         <div className="w-1.5 h-1.5 bg-white rounded-full" />
                       </div>
                    )}
                  </div>
                  <div className="ml-4 mr-6 hidden lg:block">
                    <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-0.5 ${step.id <= currentStep ? 'text-white' : 'text-neutral-600'}`}>
                      Step 0{step.id}
                    </div>
                    <div className={`text-[11px] font-bold ${step.id <= currentStep ? 'text-neutral-400' : 'text-neutral-700'}`}>
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="mx-2 hidden sm:block">
                      <div className={`w-10 h-[2px] rounded-full transition-all duration-700 ${step.id < currentStep ? 'bg-orange-500' : 'bg-neutral-800'}`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white border border-neutral-100 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] p-8 md:p-16 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />
            
            <form onSubmit={currentFormik.handleSubmit} className="relative z-10">
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-16 pt-10 border-t border-neutral-50">
                <Button
                  type="button"
                  text="Previous Step"
                  classes={`w-full sm:w-auto px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
                    currentStep === 1
                      ? 'bg-neutral-50 text-neutral-300 cursor-not-allowed border border-neutral-100'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 active:scale-95'
                  }`}
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  disabled={currentStep === 1}
                />

                <Button
                  type="submit"
                  text={currentStep === 5 ? 'Complete Application' : 'Continue to Next Step'}
                  classes="w-full sm:w-auto bg-neutral-900 text-white px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-orange-500 transition-all duration-500 active:scale-95 shadow-2xl shadow-neutral-900/20"
                  disabled={!currentFormik.isValid}
                />
              </div>
            </form>
          </div>
        </div>
    </div>
  );
};

export default InstallmentProfileSetup;



