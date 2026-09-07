import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaUser, FaIdCard, FaCalculator, FaUsers, FaFileSignature, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { setUser } from '../Redux/verifiedUserslice';
import api from '../services/axios';
import Navbar from './Navbar';
import OtherNav from './VerifiedNav';
import PersonalInfoStep from './Installment/PersonalInfoStep';
import GuarantorsStep from './Installment/GuarantorsStep';
import DocumentsStep from './Installment/DocumentsStep';
import InstallmentPlanStep from './Installment/InstallmentPlanStep';
import PaymentStep from './Installment/PaymentStep';

const steps = [
  { id: 1, title: 'Personal & Next of Kin', short: 'Personal', icon: FaUser },
  { id: 2, title: 'Guarantors 1 & 2',       short: 'Guarantors', icon: FaUsers },
  { id: 3, title: 'Documents & Photos',      short: 'Documents', icon: FaIdCard },
  { id: 4, title: 'Ownership Plan',          short: 'Plan', icon: FaCalculator },
  { id: 5, title: 'Settlement & Terms',      short: 'Terms', icon: FaFileSignature },
];

const InstallmentProfileSetup = () => {
  const navigate   = useNavigate();
  const dispatch   = useDispatch();
  const { user }   = useSelector(state => state.verifiedUser);

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting]   = useState(false);

  /* ─── Step 1 formik ─── */
  const personalFormik = useFormik({
    initialValues: {
      firstname:       user?.firstname || '',
      lastname:        user?.lastname  || '',
      phone:           user?.phone     || '',
      email:           user?.email     || '',
      dateOfBirth:     user?.installmentProfile?.personal?.dateOfBirth     || '',
      gender:          user?.installmentProfile?.personal?.gender           || '',
      maritalStatus:   user?.installmentProfile?.personal?.maritalStatus    || '',
      address:         user?.installmentProfile?.personal?.address          || '',
      stateOfOrigin:   user?.installmentProfile?.personal?.stateOfOrigin    || '',
      lga:             user?.installmentProfile?.personal?.lga              || '',
      nokName:         user?.installmentProfile?.nextOfKin?.name            || '',
      nokRelationship: user?.installmentProfile?.nextOfKin?.relationship    || '',
      nokPhone:        user?.installmentProfile?.nextOfKin?.phone           || '',
      nokAddress:      user?.installmentProfile?.nextOfKin?.address         || '',
    },
    validationSchema: Yup.object({
      firstname:       Yup.string().required('First name is required').min(2),
      lastname:        Yup.string().required('Last name is required').min(2),
      phone:           Yup.string().matches(/^0\d{10}$/, 'Valid 11-digit phone required').required(),
      email:           Yup.string().email('Invalid email').required(),
      dateOfBirth:     Yup.date().required('Date of birth is required'),
      gender:          Yup.string().oneOf(['male','female']).required('Gender is required'),
      maritalStatus:   Yup.string().required('Marital status is required'),
      address:         Yup.string().required('Residential address is required'),
      stateOfOrigin:   Yup.string().required('State of origin is required'),
      lga:             Yup.string().required('LGA is required'),
      nokName:         Yup.string().required('Next of kin name is required'),
      nokRelationship: Yup.string().required('Relationship is required'),
      nokPhone:        Yup.string().matches(/^0\d{10}$/, 'Valid 11-digit phone required').required(),
      nokAddress:      Yup.string().required('Next of kin address is required'),
    }),
    onSubmit: () => setCurrentStep(2),
  });

  /* ─── Step 2 formik ─── */
  const guarantorsFormik = useFormik({
    initialValues: {
      g1Name: user?.installmentProfile?.guarantors?.[0]?.name || '',
      g1Phone: user?.installmentProfile?.guarantors?.[0]?.phone || '',
      g1Relationship: user?.installmentProfile?.guarantors?.[0]?.relationship || '',
      g1Address: user?.installmentProfile?.guarantors?.[0]?.homeAddress || '',
      g1Occupation: user?.installmentProfile?.guarantors?.[0]?.occupation || '',
      g1OfficeAddress: user?.installmentProfile?.guarantors?.[0]?.officeAddress || '',
      g1MeansOfId: user?.installmentProfile?.guarantors?.[0]?.meansOfId || 'national-id',
      g1IdNumber: user?.installmentProfile?.guarantors?.[0]?.idNumber || '',
      g1Photo: user?.installmentProfile?.guarantors?.[0]?.photoUrl || '',
      g2Name: user?.installmentProfile?.guarantors?.[1]?.name || '',
      g2Phone: user?.installmentProfile?.guarantors?.[1]?.phone || '',
      g2Relationship: user?.installmentProfile?.guarantors?.[1]?.relationship || '',
      g2Address: user?.installmentProfile?.guarantors?.[1]?.homeAddress || '',
      g2Occupation: user?.installmentProfile?.guarantors?.[1]?.occupation || '',
      g2OfficeAddress: user?.installmentProfile?.guarantors?.[1]?.officeAddress || '',
      g2MeansOfId: user?.installmentProfile?.guarantors?.[1]?.meansOfId || 'national-id',
      g2IdNumber: user?.installmentProfile?.guarantors?.[1]?.idNumber || '',
      g2Photo: user?.installmentProfile?.guarantors?.[1]?.photoUrl || '',
    },
    validationSchema: Yup.object({
      g1Name:         Yup.string().required('Guarantor 1 full name is required'),
      g1Phone:        Yup.string().matches(/^0\d{10}$/, 'Valid 11-digit phone required').required(),
      g1Relationship: Yup.string().required(),
      g1Address:      Yup.string().required('Home address required'),
      g1Occupation:   Yup.string().required('Occupation required'),
      g1OfficeAddress:Yup.string().required('Office address required'),
      g1IdNumber:     Yup.string().required('ID number required'),
      g1Photo:        Yup.string().required('Guarantor 1 passport photo required'),
      g2Name:         Yup.string().required('Guarantor 2 full name is required'),
      g2Phone:        Yup.string().matches(/^0\d{10}$/, 'Valid 11-digit phone required').required(),
      g2Relationship: Yup.string().required(),
      g2Address:      Yup.string().required('Home address required'),
      g2Occupation:   Yup.string().required('Occupation required'),
      g2OfficeAddress:Yup.string().required('Office address required'),
      g2IdNumber:     Yup.string().required('ID number required'),
      g2Photo:        Yup.string().required('Guarantor 2 passport photo required'),
    }),
    onSubmit: () => setCurrentStep(3),
  });

  /* ─── Step 3 formik ─── */
  const documentsFormik = useFormik({
    initialValues: {
      applicantPhotoUrl:   user?.installmentProfile?.documents?.applicantPhotoUrl || user?.profilePic || '',
      idType:              user?.installmentProfile?.documents?.idType || '',
      idNumber:            user?.installmentProfile?.documents?.idNumber || '',
      idDocumentUrl:       user?.installmentProfile?.documents?.idDocumentUrl || '',
      driverLicenseNumber: user?.installmentProfile?.documents?.driverLicenseNumber || '',
      driverLicenseUrl:    user?.installmentProfile?.documents?.driverLicenseUrl || '',
      bvn:                 user?.installmentProfile?.documents?.bvn || '',
      nin:                 user?.installmentProfile?.documents?.nin || '',
    },
    validationSchema: Yup.object({
      applicantPhotoUrl: Yup.string().required('Applicant passport photograph required'),
      idType:            Yup.string().required('Means of ID required'),
      idNumber:          Yup.string().required('ID number required'),
      idDocumentUrl:     Yup.string().required('ID document upload required'),
      bvn:               Yup.string().matches(/^\d{11}$/, 'BVN must be 11 digits').required(),
      nin:               Yup.string().matches(/^\d{11}$/, 'NIN must be 11 digits').required(),
    }),
    onSubmit: () => setCurrentStep(4),
  });

  /* ─── Step 4 formik (plan review) ─── */
  const planFormik = useFormik({
    initialValues: { planName: 'Maruwa Daily Ownership Plan' },
    onSubmit: () => setCurrentStep(5),
  });

  /* ─── Step 5 formik (submit) ─── */
  const paymentFormik = useFormik({
    initialValues: {
      bankName:      user?.installmentProfile?.paymentDetails?.bankName || '',
      accountNumber: user?.installmentProfile?.paymentDetails?.accountNumber || '',
      accountName:   user?.installmentProfile?.paymentDetails?.accountName || '',
      termsAccepted: false,
    },
    validationSchema: Yup.object({
      bankName:      Yup.string().required('Bank name required'),
      accountNumber: Yup.string().matches(/^\d{10}$/, '10-digit account number required').required(),
      accountName:   Yup.string().required('Account name required'),
      termsAccepted: Yup.boolean().oneOf([true], 'You must agree to the Terms & Conditions'),
    }),
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        const token = localStorage.getItem('nvcr_tk');
        const payload = {
          personal: {
            firstname: personalFormik.values.firstname,
            lastname:  personalFormik.values.lastname,
            email:     personalFormik.values.email,
            phone:     personalFormik.values.phone,
            dateOfBirth:   personalFormik.values.dateOfBirth,
            gender:        personalFormik.values.gender,
            maritalStatus: personalFormik.values.maritalStatus,
            address:       personalFormik.values.address,
            stateOfOrigin: personalFormik.values.stateOfOrigin,
            lga:           personalFormik.values.lga,
          },
          nextOfKin: {
            name:         personalFormik.values.nokName,
            relationship: personalFormik.values.nokRelationship,
            phone:        personalFormik.values.nokPhone,
            address:      personalFormik.values.nokAddress,
          },
          vehicle: {
            vehicleType: 'Tricycle',
            plateNumber: 'PENDING_ASSIGNMENT',
            modelMake:   'TVS King 200cc Commercial',
            color:       'Yellow',
            ownership:   'Company',
          },
          guarantors: [
            {
              name:         guarantorsFormik.values.g1Name,
              phone:        guarantorsFormik.values.g1Phone,
              relationship: guarantorsFormik.values.g1Relationship,
              homeAddress:  guarantorsFormik.values.g1Address,
              occupation:   guarantorsFormik.values.g1Occupation,
              officeAddress:guarantorsFormik.values.g1OfficeAddress,
              meansOfId:    guarantorsFormik.values.g1MeansOfId,
              idNumber:     guarantorsFormik.values.g1IdNumber,
              photoUrl:     guarantorsFormik.values.g1Photo,
            },
            {
              name:         guarantorsFormik.values.g2Name,
              phone:        guarantorsFormik.values.g2Phone,
              relationship: guarantorsFormik.values.g2Relationship,
              homeAddress:  guarantorsFormik.values.g2Address,
              occupation:   guarantorsFormik.values.g2Occupation,
              officeAddress:guarantorsFormik.values.g2OfficeAddress,
              meansOfId:    guarantorsFormik.values.g2MeansOfId,
              idNumber:     guarantorsFormik.values.g2IdNumber,
              photoUrl:     guarantorsFormik.values.g2Photo,
            },
          ],
          documents: { ...documentsFormik.values },
          terms: { accepted: values.termsAccepted, termsVersion: 'v1.0-2026' },
          paymentDetails: {
            bankName:      values.bankName,
            accountNumber: values.accountNumber,
            accountName:   values.accountName,
          },
        };

        const res = await api.post('/user/installment-profile', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(setUser({ user: res.data.user }));
        toast.success('Maruwa Installment Profile submitted successfully!');
        navigate('/installment-dashboard');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to submit profile. Check all fields.');
      } finally {
        setSubmitting(false);
      }
    },
  });

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

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <PersonalInfoStep  formik={personalFormik} />;
      case 2: return <GuarantorsStep    formik={guarantorsFormik} />;
      case 3: return <DocumentsStep     formik={documentsFormik} />;
      case 4: return <InstallmentPlanStep formik={planFormik} />;
      case 5: return <PaymentStep       formik={paymentFormik} />;
      default: return null;
    }
  };

  const currentFormik = getCurrentFormik();

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* ── Ambient glow ── */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-orange-500/8 via-orange-500/3 to-transparent pointer-events-none" />
      <div className="absolute top-[10%] right-[-15%] w-[700px] h-[700px] bg-orange-500/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-orange-600/4 blur-[120px] rounded-full pointer-events-none" />

      <Navbar userrole={user?.role} userverified={true} profilePic={user?.profilePic} nav={<OtherNav userrole={user?.role} />} />

      <div className="pt-32 pb-24 px-4 md:px-8 lg:px-12 max-w-5xl mx-auto relative z-10">

        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-500">
              Novacrest Hire-Purchase Registration
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none mb-3">
            Maruwa <span className="text-orange-500">Installment</span> <br className="hidden sm:block" />
            Application
          </h1>
          <p className="text-neutral-500 font-medium text-sm max-w-lg">
            Complete all five sections accurately. Your information is stored securely and used solely for vehicle allocation and repayment tracking.
          </p>
        </motion.div>

        {/* ── Step Progress ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="bg-neutral-900/80 backdrop-blur-md border border-white/[0.06] rounded-[1.75rem] p-4 md:p-5">
            <div className="flex items-center justify-between gap-2">
              {steps.map((step, idx) => {
                const isActive    = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                return (
                  <React.Fragment key={step.id}>
                    <button
                      type="button"
                      onClick={() => isCompleted && setCurrentStep(step.id)}
                      className={`flex-1 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 py-2 px-1 sm:px-3 rounded-xl transition-all duration-300 ${
                        isCompleted ? 'cursor-pointer opacity-100' : 'cursor-default'
                      }`}
                    >
                      <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isActive
                          ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/40 scale-105'
                          : isCompleted
                            ? 'bg-neutral-700 text-orange-400'
                            : 'bg-neutral-800 text-neutral-600'
                      }`}>
                        {isCompleted ? <FaCheckCircle className="text-sm" /> : <step.icon className="text-sm" />}
                      </div>
                      <div className="hidden md:block text-left">
                        <p className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-orange-500' : isCompleted ? 'text-neutral-400' : 'text-neutral-700'}`}>
                          Step {String(step.id).padStart(2, '0')}
                        </p>
                        <p className={`text-[11px] font-bold leading-tight ${isActive ? 'text-white' : isCompleted ? 'text-neutral-400' : 'text-neutral-600'}`}>
                          {step.short}
                        </p>
                      </div>
                    </button>

                    {idx < steps.length - 1 && (
                      <div className={`h-px flex-1 max-w-[32px] rounded-full transition-colors duration-500 hidden sm:block ${
                        step.id < currentStep ? 'bg-orange-500/60' : 'bg-neutral-800'
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Mobile step label */}
            <div className="sm:hidden mt-3 pt-3 border-t border-white/5 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">
                Step {currentStep} / {steps.length}: {steps[currentStep - 1]?.title}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Form Card ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.25 }}
            className="bg-neutral-900 border border-white/[0.07] rounded-[2rem] shadow-2xl overflow-hidden"
          >
            {/* Card Header */}
            <div className="px-8 md:px-12 pt-10 pb-8 border-b border-white/[0.06]">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
                  {React.createElement(steps[currentStep - 1].icon)}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-500/80 mb-0.5">
                    Step {String(currentStep).padStart(2, '0')} of {steps.length}
                  </p>
                  <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                    {steps[currentStep - 1].title}
                  </h2>
                </div>
              </div>
            </div>

            {/* Step Content */}
            <form onSubmit={currentFormik.handleSubmit}>
              <div className="px-8 md:px-12 py-10">
                {renderStep()}
              </div>

              {/* Navigation */}
              <div className="px-8 md:px-12 pb-10 flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-white/[0.06] pt-8">
                <button
                  type="button"
                  onClick={() => setCurrentStep(p => p - 1)}
                  disabled={currentStep === 1 || submitting}
                  className={`w-full sm:w-auto px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${
                    currentStep === 1
                      ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-white active:scale-95'
                  }`}
                >
                  ← Previous
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-400 disabled:bg-orange-500/50 text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-xl shadow-orange-500/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting…
                    </>
                  ) : currentStep === 5 ? (
                    'Submit Application →'
                  ) : (
                    'Continue →'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InstallmentProfileSetup;
