import React from 'react';
import { useProfileManagement } from '../hooks/useProfileManagement';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaLock, FaBell, FaShieldAlt, FaCamera } from 'react-icons/fa';
import Navbar from './Navbar';
import OtherNav from './VerifiedNav';
import Button from './Button';

// Sub-components
import SidebarButton from './Profile/SidebarButton';
import ProfileForm from './Profile/ProfileForm';
import PasswordForm from './Profile/PasswordForm';
import NotificationSettings from './Profile/NotificationSettings';

const Motion = motion;

const ProfileManagement = () => {
  const {
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
  } = useProfileManagement();

  return (
    <div className="min-h-screen bg-neutral-50/50">
      <Navbar userrole={getUserRole()} userverified={true} profilePic={profileImage} nav={<OtherNav userrole={getUserRole()} />} />

      <div className="mt-20 pt-12 px-6 lg:px-20 pb-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 space-y-8">
            <div className="bg-neutral-900 rounded-[2.5rem] p-8 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl -ml-12 -mb-12" />

              <div className="relative inline-block group">
                <div className="absolute inset-0 bg-orange-500 rounded-full blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-neutral-800 relative z-10 shadow-xl"
                />
                <label className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-full cursor-pointer shadow-lg hover:scale-110 active:scale-90 transition-transform z-20">
                  <FaCamera className="text-white text-xs" />
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              <div className="mt-6 relative z-10">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500/80 mb-1">{getRoleDisplay()}</div>
                <div className="text-2xl font-black text-white tracking-tight">{user?.firstname || 'User'} {user?.lastname || ''}</div>
                <div className="text-sm text-neutral-500 font-medium mt-1 truncate">{user?.phone || user?.email}</div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] p-4 border border-white/20 shadow-xl">
              <SidebarButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={FaUser}>
                Profile Info
              </SidebarButton>
              <SidebarButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={FaLock}>
                Security
              </SidebarButton>
              <SidebarButton active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} icon={FaBell}>
                Notifications
              </SidebarButton>
              <SidebarButton active={activeTab === 'privacy'} onClick={() => setActiveTab('privacy')} icon={FaShieldAlt}>
                Privacy & Data
              </SidebarButton>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 bg-white/80 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/20 relative overflow-hidden">
            <div className="relative z-10">
              <AnimatePresence mode="wait">
                <Motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'profile' && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Personal Details</h3>
                        <p className="text-sm text-neutral-500 mt-1">Manage your account information and preferences.</p>
                      </div>
                      <ProfileForm initialValues={initialProfileValues} onSubmit={handleProfileUpdate} validationSchema={profileValidationSchema} />
                    </div>
                  )}

                  {activeTab === 'security' && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Access & Security</h3>
                        <p className="text-sm text-neutral-500 mt-1">Update your password and protect your account.</p>
                      </div>
                      <PasswordForm onSubmit={handlePasswordChange} />

                      <div className="mt-12 pt-10 border-t border-neutral-100">
                        <h4 className="font-black text-sm uppercase tracking-widest text-neutral-400 mb-6">Two-Factor Authentication</h4>
                        <div className="p-8 bg-neutral-900 rounded-[2.5rem] border border-neutral-800 flex items-center justify-between group transition-all shadow-2xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl" />
                          <div className="relative z-10 space-y-1">
                            <div className="font-bold text-white group-hover:text-orange-500 transition-colors">SMS Protection</div>
                            <p className="text-xs text-neutral-500 font-medium">Extra layer of security for your account</p>
                          </div>

                          <button
                            onClick={handleSmsToggle}
                            className={`w-14 h-7 rounded-full transition-all duration-300 relative z-10 ${user?.isSmsProtectionEnabled ? 'bg-orange-500 shadow-lg shadow-orange-500/20' : 'bg-neutral-800'}`}
                          >
                            <Motion.div
                              animate={{ x: user?.isSmsProtectionEnabled ? 32 : 4 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              className="w-5 h-5 bg-white rounded-full shadow-lg absolute top-1"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'notifications' && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Notifications</h3>
                        <p className="text-sm text-neutral-500 mt-1">Control how you want to be notified about activity.</p>
                      </div>
                      <NotificationSettings
                        initialSettings={user?.notificationSettings}
                        onSave={handleNotificationUpdate}
                      />
                    </div>
                  )}

                  {activeTab === 'privacy' && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Privacy Center</h3>
                        <p className="text-sm text-neutral-500 mt-1">Manage your data and visibility settings.</p>
                      </div>
                      <div className="space-y-6">
                        <div className="bg-neutral-50/50 rounded-3xl p-6 border border-neutral-100">
                          <h4 className="font-bold text-neutral-800 mb-6 flex items-center gap-2">
                            Data Management
                          </h4>
                          <div className="space-y-4">
                            {[
                              { label: "Share ride history with analytics partners", key: "shareRideHistory" },
                              { label: "Allow location tracking for better ETA", key: "allowLocationTracking" },
                              { label: "Receive marketing and promotional emails", key: "receiveMarketingEmails" }
                            ].map((item) => (
                              <label key={item.key} className="flex items-center justify-between p-4 hover:bg-white/80 rounded-2xl transition-all cursor-pointer group">
                                <span className="text-sm text-neutral-600 font-medium group-hover:text-neutral-900">{item.label}</span>
                                <input
                                  type="checkbox"
                                  checked={privacySettings[item.key]}
                                  onChange={() => handlePrivacyToggle(item.key)}
                                  className="w-5 h-5 rounded-lg border-neutral-300 text-orange-500 focus:ring-orange-500/20 cursor-pointer"
                                />
                              </label>
                            ))}
                          </div>
                        </div>

                        <Motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-2">
                          <Button
                            onClick={handlePrivacyUpdate}
                            disabled={isSavingPrivacy}
                            text={isSavingPrivacy ? "Saving..." : "Save Privacy Settings"}
                            classes="bg-neutral-900 text-white py-4 px-10 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg hover:bg-black transition-all disabled:opacity-50"
                          />
                        </Motion.div>

                        <div className="pt-10 border-t border-neutral-100">
                          <div className="p-6 bg-red-50/50 rounded-3xl border border-red-100 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="space-y-1 text-center md:text-left">
                              <h4 className="font-black text-sm uppercase tracking-widest text-red-600">Danger Zone</h4>
                              <p className="text-xs text-neutral-500 font-medium leading-relaxed">Permanently delete your account and all associated data. <br className="hidden md:block" /> This action is irreversible.</p>
                            </div>
                            <Motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                text="Delete Account"
                                classes="bg-red-500 text-white py-3 px-8 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all"
                              />
                            </Motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;




