import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Navbar from './Navbar';
import OtherNav from './VerifiedNav';
import Button from './Button';
import Input from './Input';
import { FaUser, FaEdit, FaLock, FaBell, FaShieldAlt, FaCamera } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const SidebarButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-3 rounded-md mb-2 ${active ? 'bg-yellow-400 text-black' : 'hover:bg-gray-100 text-white/90'}`}
  >
    {children}
  </button>
);

const ProfileForm = ({ initialValues, onSubmit, validationSchema }) => (
  <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={onSubmit}
  >
    {({ isSubmitting }) => (
      <Form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <Field
              name="firstname"
              as={Input}
              placeholder="Enter first name"
              classes="w-full"
            />
            <ErrorMessage name="firstname" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <Field
              name="lastname"
              as={Input}
              placeholder="Enter last name"
              classes="w-full"
            />
            <ErrorMessage name="lastname" component="div" className="text-red-500 text-sm mt-1" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <Field
            name="email"
            type="email"
            as={Input}
            placeholder="Enter email address"
            classes="w-full"
          />
          <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <Field
            name="phone"
            as={Input}
            placeholder="Enter phone number"
            classes="w-full"
          />
          <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <Field
            name="dateOfBirth"
            type="date"
            as={Input}
            classes="w-full"
          />
          <ErrorMessage name="dateOfBirth" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <Field
            name="address"
            as="textarea"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-yellow-400"
            placeholder="Enter your address"
            rows="3"
          />
          <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        <Button
          type="submit"
          text={isSubmitting ? "Updating..." : "Update Profile"}
          classes="bg-yellow-400 text-black py-2 px-6 rounded hover:bg-yellow-500"
          disabled={isSubmitting}
        />
      </Form>
    )}
  </Formik>
);

const PasswordForm = ({ onSubmit }) => (
  <Formik
    initialValues={{
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }}
    validationSchema={Yup.object({
      currentPassword: Yup.string().required('Current password is required'),
      newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm password is required')
    })}
    onSubmit={onSubmit}
  >
    {({ isSubmitting }) => (
      <Form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <Field
            name="currentPassword"
            type="password"
            as={Input}
            placeholder="Enter current password"
            classes="w-full"
          />
          <ErrorMessage name="currentPassword" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <Field
            name="newPassword"
            type="password"
            as={Input}
            placeholder="Enter new password"
            classes="w-full"
          />
          <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <Field
            name="confirmPassword"
            type="password"
            as={Input}
            placeholder="Confirm new password"
            classes="w-full"
          />
          <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        <Button
          type="submit"
          text={isSubmitting ? "Changing..." : "Change Password"}
          classes="bg-yellow-400 text-black py-2 px-6 rounded hover:bg-yellow-500"
          disabled={isSubmitting}
        />
      </Form>
    )}
  </Formik>
);

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    rideRequests: true,
    paymentAlerts: true,
    promotions: false,
    securityAlerts: true,
    rideUpdates: true
  });

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const SettingToggle = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-gray-700">{label}</span>
      <button
        onClick={onChange}
        className={`w-12 h-6 rounded-full transition-colors ${value ? 'bg-yellow-400' : 'bg-gray-300'}`}
      >
        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Notification Preferences</h4>
      <div className="space-y-2">
        <SettingToggle
          label="Ride Requests"
          value={settings.rideRequests}
          onChange={() => handleToggle('rideRequests')}
        />
        <SettingToggle
          label="Payment Alerts"
          value={settings.paymentAlerts}
          onChange={() => handleToggle('paymentAlerts')}
        />
        <SettingToggle
          label="Promotional Offers"
          value={settings.promotions}
          onChange={() => handleToggle('promotions')}
        />
        <SettingToggle
          label="Security Alerts"
          value={settings.securityAlerts}
          onChange={() => handleToggle('securityAlerts')}
        />
        <SettingToggle
          label="Ride Updates"
          value={settings.rideUpdates}
          onChange={() => handleToggle('rideUpdates')}
        />
      </div>
      <Button
        text="Save Preferences"
        classes="bg-yellow-400 text-black py-2 px-6 rounded hover:bg-yellow-500"
      />
    </div>
  );
};

const ProfileManagement = () => {
  const { user } = useSelector(state => state.verifiedUser);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileImage, setProfileImage] = useState(user?.profilePic || '/placeholderProfile.jpg');

  // Update profile image when user data changes
  useEffect(() => {
    if (user?.profilePic && profileImage === '/placeholderProfile.jpg') {
      setProfileImage(user.profilePic);
    }
  }, [user, profileImage]);

  const getUserRole = () => {
    return user?.role || 'passenger';
  };

  const getRoleDisplay = () => {
    const role = getUserRole();
    switch(role) {
      case 'rider': return 'Rider';
      case 'installment': return 'Installment Customer';
      default: return 'Passenger';
    }
  };

  const profileValidationSchema = Yup.object({
    firstname: Yup.string().required('First name is required'),
    lastname: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    dateOfBirth: Yup.date().required('Date of birth is required'),
    address: Yup.string().required('Address is required')
  });

  const handleProfileUpdate = (values) => {
    // Handle profile update logic here
    console.log('Updating profile:', values);
    // dispatch(updateUserProfile(values));
  };

  const handlePasswordChange = (values) => {
    // Handle password change logic here
    console.log('Changing password:', values);
    // dispatch(changePassword(values));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target.result);
      reader.readAsDataURL(file);

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
        // Update the profile image with the URL from backend
        setProfileImage(response.data.data.profilePic);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to upload profile picture');
    }
  };

  const mockUserData = {
    firstname: user?.firstname || 'John',
    lastname: user?.lastname || 'Doe',
    email: user?.email || 'john.doe@example.com',
    phone: user?.phone || '+234 123 456 7890',
    dateOfBirth: '1990-01-01',
    address: '123 Main Street, Lagos, Nigeria'
  };

  return (
    <div className="min-h-screen">
      <Navbar userrole={getUserRole()} userverified={true} profilePic={profileImage} nav={<OtherNav userrole={getUserRole()} />} />

      <div className="mt-24 px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="col-span-1 bg-black text-white rounded p-4">
            <div className="mb-6 text-center">
              <div className="relative inline-block">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-yellow-400"
                />
                <label className="absolute bottom-0 right-0 bg-yellow-400 p-1 rounded-full cursor-pointer">
                  <FaCamera className="text-black text-sm" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="mt-3">
                <div className="text-sm text-gray-300">{getRoleDisplay()}</div>
                <div className="text-xl font-bold text-orange-400">{user?.firstname || 'User'}</div>
                <div className="text-sm text-gray-400">{mockUserData.email}</div>
              </div>
            </div>

            <SidebarButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>
              <FaUser className="inline mr-2" /> Profile Info
            </SidebarButton>
            <SidebarButton active={activeTab === 'security'} onClick={() => setActiveTab('security')}>
              <FaLock className="inline mr-2" /> Security
            </SidebarButton>
            <SidebarButton active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')}>
              <FaBell className="inline mr-2" /> Notifications
            </SidebarButton>
            <SidebarButton active={activeTab === 'privacy'} onClick={() => setActiveTab('privacy')}>
              <FaShieldAlt className="inline mr-2" /> Privacy
            </SidebarButton>
          </aside>

          <main className="col-span-1 md:col-span-3">
            <div className="p-6 bg-white rounded shadow">
              {activeTab === 'profile' && (
                <div>
                  <h3 className="font-semibold mb-6">Personal Information</h3>
                  <ProfileForm
                    initialValues={mockUserData}
                    onSubmit={handleProfileUpdate}
                    validationSchema={profileValidationSchema}
                  />
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h3 className="font-semibold mb-6">Change Password</h3>
                  <PasswordForm onSubmit={handlePasswordChange} />

                  <div className="mt-8 pt-6 border-t">
                    <h4 className="font-medium mb-4">Two-Factor Authentication</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">SMS Authentication</div>
                        <div className="text-sm text-gray-500">Receive codes via SMS</div>
                      </div>
                      <Button
                        text="Enable"
                        classes="bg-yellow-400 text-black py-2 px-4 rounded hover:bg-yellow-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h3 className="font-semibold mb-6">Notification Settings</h3>
                  <NotificationSettings />
                </div>
              )}

              {activeTab === 'privacy' && (
                <div>
                  <h3 className="font-semibold mb-6">Privacy Settings</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-4">Data Sharing</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Share ride history with partners</span>
                          <input type="checkbox" className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Allow location tracking for better service</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Marketing communications</span>
                          <input type="checkbox" className="rounded" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <h4 className="font-medium mb-4 text-red-600">Danger Zone</h4>
                      <Button
                        text="Delete Account"
                        classes="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;