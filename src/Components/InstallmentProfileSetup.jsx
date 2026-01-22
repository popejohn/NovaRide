import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from './Navbar';
import OtherNav from './VerifiedNav';
import Button from './Button';
import Input from './Input';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaUser, FaIdCard, FaBriefcase, FaHome } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { setProfileCompleted } from '../Redux/verifiedUserslice';

const InstallmentProfileSetup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.verifiedUser);

  const [currentStep, setCurrentStep] = useState(1);
  const [profilePicture, setProfilePicture] = useState(null);

  const steps = [
    { id: 1, title: 'Personal Info', icon: FaUser },
    { id: 2, title: 'Employment', icon: FaBriefcase },
    { id: 3, title: 'Documents', icon: FaIdCard },
    { id: 4, title: 'References', icon: FaHome }
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
      firstname: Yup.string().required('First name is required'),
      lastname: Yup.string().required('Last name is required'),
      phone: Yup.string().matches(/^0\d{10}$/, 'Please enter a valid phone number').required('Phone number is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      dateOfBirth: Yup.date().required('Date of birth is required'),
      gender: Yup.string().oneOf(['male', 'female', 'other']).required('Gender is required'),
      maritalStatus: Yup.string().oneOf(['single', 'married', 'divorced', 'widowed']).required('Marital status is required'),
      address: Yup.string().required('Address is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required')
    }),
    onSubmit: () => setCurrentStep(2)
  });

  const employmentFormik = useFormik({
    initialValues: {
      employmentStatus: '',
      employerName: '',
      jobTitle: '',
      monthlyIncome: '',
      workExperience: '',
      employerPhone: '',
      employerAddress: ''
    },
    validationSchema: Yup.object({
      employmentStatus: Yup.string().oneOf(['employed', 'self-employed', 'business-owner']).required('Employment status is required'),
      employerName: Yup.string().when('employmentStatus', {
        is: (val) => val !== 'self-employed',
        then: Yup.string().required('Employer name is required')
      }),
      jobTitle: Yup.string().required('Job title is required'),
      monthlyIncome: Yup.number().min(30000, 'Monthly income must be at least ₦30,000').required('Monthly income is required'),
      workExperience: Yup.number().min(1, 'Work experience must be at least 1 year').required('Work experience is required'),
      employerPhone: Yup.string().matches(/^0\d{10}$/, 'Please enter a valid phone number'),
      employerAddress: Yup.string()
    }),
    onSubmit: () => setCurrentStep(3)
  });

  const documentsFormik = useFormik({
    initialValues: {
      idType: '',
      idNumber: '',
      idExpiry: '',
      bvn: ''
    },
    validationSchema: Yup.object({
      idType: Yup.string().oneOf(['national-id', 'drivers-license', 'international-passport']).required('ID type is required'),
      idNumber: Yup.string().required('ID number is required'),
      idExpiry: Yup.date().min(new Date(), 'ID must not be expired').required('ID expiry date is required'),
      bvn: Yup.string().matches(/^\d{11}$/, 'BVN must be 11 digits').required('BVN is required')
    }),
    onSubmit: () => setCurrentStep(4)
  });

  const referencesFormik = useFormik({
    initialValues: {
      reference1Name: '',
      reference1Phone: '',
      reference1Relationship: '',
      reference2Name: '',
      reference2Phone: '',
      reference2Relationship: ''
    },
    validationSchema: Yup.object({
      reference1Name: Yup.string().required('Reference 1 name is required'),
      reference1Phone: Yup.string().matches(/^0\d{10}$/, 'Please enter a valid phone number').required('Reference 1 phone is required'),
      reference1Relationship: Yup.string().required('Reference 1 relationship is required'),
      reference2Name: Yup.string().required('Reference 2 name is required'),
      reference2Phone: Yup.string().matches(/^0\d{10}$/, 'Please enter a valid phone number').required('Reference 2 phone is required'),
      reference2Relationship: Yup.string().required('Reference 2 relationship is required')
    }),
    onSubmit: async (values) => {
      try {
        const profileData = {
          personal: personalFormik.values,
          employment: employmentFormik.values,
          documents: documentsFormik.values,
          references: values,
          profilePicture
        };

        console.log('Submitting installment profile:', profileData);

        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        dispatch(setProfileCompleted());
        toast.success('Profile setup completed successfully!');
        navigate('/installment-application');
      } catch (error) {
        console.error('Profile setup error:', error);
        toast.error('Failed to save profile. Please try again.');
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
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                {profilePicture ? (
                  <img src={URL.createObjectURL(profilePicture)} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <FaUser className="text-3xl text-gray-400" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
                id="profile-picture"
              />
              <label htmlFor="profile-picture" className="bg-yellow-400 text-black px-4 py-2 rounded cursor-pointer hover:bg-yellow-500">
                Upload Profile Picture
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={personalFormik.values.firstname}
                onChange={personalFormik.handleChange}
                onBlur={personalFormik.handleBlur}
                name="firstname"
              />
              <Input
                label="Last Name"
                value={personalFormik.values.lastname}
                onChange={personalFormik.handleChange}
                onBlur={personalFormik.handleBlur}
                name="lastname"
              />
            </div>

            <Input
              label="Phone Number"
              type="tel"
              value={personalFormik.values.phone}
              onChange={personalFormik.handleChange}
              onBlur={personalFormik.handleBlur}
              name="phone"
            />

            <Input
              label="Email Address"
              type="email"
              value={personalFormik.values.email}
              onChange={personalFormik.handleChange}
              onBlur={personalFormik.handleBlur}
              name="email"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Date of Birth"
                type="date"
                value={personalFormik.values.dateOfBirth}
                onChange={(e) => personalFormik.setFieldValue('dateOfBirth', e.target.value)}
                onBlur={personalFormik.handleBlur}
                name="dateOfBirth"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={personalFormik.values.gender}
                  onChange={personalFormik.handleChange}
                  onBlur={personalFormik.handleBlur}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-0 shadow-md focus:ring-1 focus:ring-yellow-400"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                <select
                  name="maritalStatus"
                  value={personalFormik.values.maritalStatus}
                  onChange={personalFormik.handleChange}
                  onBlur={personalFormik.handleBlur}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-0 shadow-md focus:ring-1 focus:ring-yellow-400"
                >
                  <option value="">Select Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
              <Input
                label="City"
                value={personalFormik.values.city}
                onChange={personalFormik.handleChange}
                onBlur={personalFormik.handleBlur}
                name="city"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="State"
                value={personalFormik.values.state}
                onChange={personalFormik.handleChange}
                onBlur={personalFormik.handleBlur}
                name="state"
              />
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  name="address"
                  value={personalFormik.values.address}
                  onChange={personalFormik.handleChange}
                  onBlur={personalFormik.handleBlur}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-0 shadow-md focus:ring-1 focus:ring-yellow-400"
                  rows={2}
                  placeholder="Enter your full address"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employment Status</label>
              <select
                name="employmentStatus"
                value={employmentFormik.values.employmentStatus}
                onChange={employmentFormik.handleChange}
                onBlur={employmentFormik.handleBlur}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-0 shadow-md focus:ring-1 focus:ring-yellow-400"
              >
                <option value="">Select Employment Status</option>
                <option value="employed">Employed</option>
                <option value="self-employed">Self Employed</option>
                <option value="business-owner">Business Owner</option>
              </select>
            </div>

            {employmentFormik.values.employmentStatus !== 'self-employed' && (
              <Input
                label="Employer Name"
                value={employmentFormik.values.employerName}
                onChange={employmentFormik.handleChange}
                onBlur={employmentFormik.handleBlur}
                name="employerName"
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Job Title/Position"
                value={employmentFormik.values.jobTitle}
                onChange={employmentFormik.handleChange}
                onBlur={employmentFormik.handleBlur}
                name="jobTitle"
              />
              <Input
                label="Monthly Income (₦)"
                type="number"
                value={employmentFormik.values.monthlyIncome}
                onChange={employmentFormik.handleChange}
                onBlur={employmentFormik.handleBlur}
                name="monthlyIncome"
                placeholder="50000"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Years of Work Experience"
                type="number"
                value={employmentFormik.values.workExperience}
                onChange={employmentFormik.handleChange}
                onBlur={employmentFormik.handleBlur}
                name="workExperience"
                placeholder="3"
              />
              <Input
                label="Employer Phone (Optional)"
                type="tel"
                value={employmentFormik.values.employerPhone}
                onChange={employmentFormik.handleChange}
                onBlur={employmentFormik.handleBlur}
                name="employerPhone"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employer Address (Optional)</label>
              <textarea
                name="employerAddress"
                value={employmentFormik.values.employerAddress}
                onChange={employmentFormik.handleChange}
                onBlur={employmentFormik.handleBlur}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-0 shadow-md focus:ring-1 focus:ring-yellow-400"
                rows={2}
                placeholder="Enter employer address"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
              <select
                name="idType"
                value={documentsFormik.values.idType}
                onChange={documentsFormik.handleChange}
                onBlur={documentsFormik.handleBlur}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-0 shadow-md focus:ring-1 focus:ring-yellow-400"
              >
                <option value="">Select ID Type</option>
                <option value="national-id">National ID</option>
                <option value="drivers-license">Driver's License</option>
                <option value="international-passport">International Passport</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="ID Number"
                value={documentsFormik.values.idNumber}
                onChange={documentsFormik.handleChange}
                onBlur={documentsFormik.handleBlur}
                name="idNumber"
              />
              <Input
                label="ID Expiry Date"
                type="date"
                value={documentsFormik.values.idExpiry}
                onChange={documentsFormik.handleChange}
                onBlur={documentsFormik.handleBlur}
                name="idExpiry"
              />
            </div>

            <Input
              label="Bank Verification Number (BVN)"
              value={documentsFormik.values.bvn}
              onChange={documentsFormik.handleChange}
              onBlur={documentsFormik.handleBlur}
              name="bvn"
              placeholder="12345678901"
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Reference 1</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={referencesFormik.values.reference1Name}
                  onChange={referencesFormik.handleChange}
                  onBlur={referencesFormik.handleBlur}
                  name="reference1Name"
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  value={referencesFormik.values.reference1Phone}
                  onChange={referencesFormik.handleChange}
                  onBlur={referencesFormik.handleBlur}
                  name="reference1Phone"
                />
              </div>
              <Input
                label="Relationship"
                value={referencesFormik.values.reference1Relationship}
                onChange={referencesFormik.handleChange}
                onBlur={referencesFormik.handleBlur}
                name="reference1Relationship"
                placeholder="e.g., Friend, Colleague, Family"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Reference 2</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={referencesFormik.values.reference2Name}
                  onChange={referencesFormik.handleChange}
                  onBlur={referencesFormik.handleBlur}
                  name="reference2Name"
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  value={referencesFormik.values.reference2Phone}
                  onChange={referencesFormik.handleChange}
                  onBlur={referencesFormik.handleBlur}
                  name="reference2Phone"
                />
              </div>
              <Input
                label="Relationship"
                value={referencesFormik.values.reference2Relationship}
                onChange={referencesFormik.handleChange}
                onBlur={referencesFormik.handleBlur}
                name="reference2Relationship"
                placeholder="e.g., Friend, Colleague, Family"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getCurrentFormik = () => {
    switch (currentStep) {
      case 1: return personalFormik;
      case 2: return employmentFormik;
      case 3: return documentsFormik;
      case 4: return referencesFormik;
      default: return personalFormik;
    }
  };

  const currentFormik = getCurrentFormik();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userrole="installment" userverified={true} profilePic="/placeholderProfile.jpg" nav={<OtherNav userrole="installment" />} />

      <div className="mt-24 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Installment Profile</h1>
            <p className="text-gray-600">Set up your profile to apply for vehicle installment purchase</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step.id <= currentStep ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-400'
                  }`}>
                    <step.icon className="text-sm" />
                  </div>
                  <div className="ml-3">
                    <div className={`text-sm font-medium ${
                      step.id <= currentStep ? 'text-black' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      step.id < currentStep ? 'bg-yellow-400' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={currentFormik.handleSubmit}>
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  text="Previous"
                  classes={`px-6 py-2 rounded font-semibold ${
                    currentStep === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  disabled={currentStep === 1}
                />

                <Button
                  type="submit"
                  text={currentStep === 4 ? 'Complete Setup' : 'Next'}
                  classes="bg-yellow-400 text-black px-6 py-2 rounded font-semibold hover:bg-yellow-500"
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

export default InstallmentProfileSetup;