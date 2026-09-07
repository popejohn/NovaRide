import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import OtherNav from './VerifiedNav';
import RoleService from '../utils/roleService';
import api from '../services/axios';
import { FaChartLine, FaMotorcycle, FaMoneyBillWave, FaMapMarkerAlt, FaFileContract, FaCalendarCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { PaymentProgress } from './Installment/PaymentProgress';
import { VehicleDetails } from './Installment/VehicleDetails';
import { PaymentHistory } from './Installment/PaymentHistory';

const SidebarButton = ({ active, onClick, children, icon: Icon }) => (
  <motion.button
    whileHover={{ x: 5, backgroundColor: active ? '#171717' : 'rgba(249, 115, 22, 0.08)', color: active ? '#ffffff' : '#f97316' }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl mb-2 transition-all duration-300 font-bold text-sm tracking-tight relative overflow-hidden group ${
      active 
        ? 'bg-neutral-900 text-white shadow-xl translate-x-1' 
        : 'text-neutral-500'
    }`}
  >
    {active && <motion.div layoutId="sidebar-indicator" className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />}
    <Icon className={`text-lg transition-colors duration-300 ${active ? 'text-orange-500' : 'text-neutral-400 group-hover:text-orange-500'}`} />
    <span className="relative z-10">{children}</span>
  </motion.button>
);

const ActionButton = ({ onClick, children, icon: Icon, color = "orange" }) => {
  const colors = {
    orange: "bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white border-orange-100",
    neutral: "bg-neutral-50 text-neutral-600 hover:bg-neutral-900 hover:text-white border-neutral-100"
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-[2rem] border-2 transition-all duration-500 group font-black text-sm ${colors[color]}`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-500 ${
        color === 'orange' ? 'bg-orange-100 group-hover:bg-white/20' : 'bg-neutral-200 group-hover:bg-white/20'
      }`}>
        <Icon className="text-base" />
      </div>
      {children}
    </button>
  );
};

const InstallmentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.verifiedUser);
  const hasRiderRole = RoleService.hasRole(user?.role, RoleService.ROLES.RIDER);
  const [activeTab, setActiveTab] = useState('overview');
  const [installmentData, setInstallmentData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInstallmentData = async () => {
    try {
      const token = localStorage.getItem('nvcr_tk');
      const response = await api.get('/user/installment-data', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setInstallmentData(response.data.installment);
    } catch (error) {
      console.error('Error fetching installment data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstallmentData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="relative">
          <div className="w-16 h-16 rounded-3xl border-4 border-neutral-800 animate-pulse" />
          <div className="absolute inset-0 border-t-4 border-orange-500 rounded-3xl animate-spin" />
        </div>
      </div>
    );
  }

  const financials = installmentData?.financials || {};
  const schedule = installmentData?.schedule || {};

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-neutral-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none" />

      <Navbar userrole={user?.role} userverified={true} profilePic={user?.profilePic} nav={<OtherNav userrole={user?.role} />} />

      <div className="pt-32 pb-20 px-4 md:px-8 lg:px-12 max-w-[1600px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-neutral-900 p-6 rounded-[2rem] border border-neutral-800 shadow-2xl shadow-black/30 relative overflow-hidden"
            >
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-4">Maruwa Partner Profile</p>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-black flex items-center justify-center text-white text-2xl font-black overflow-hidden border-2 border-neutral-700 shadow-lg">
                    {user?.profilePic || installmentData?.documents?.applicantPhoto ? (
                      <img src={user?.profilePic || installmentData?.documents?.applicantPhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      user?.firstname?.[0] || 'P'
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight leading-none">
                      {user?.firstname} {user?.lastname}
                    </h2>
                    <p className="text-[10px] font-bold text-orange-600 tracking-widest uppercase mt-2 font-mono">
                      NVCR-PARTNER-{user?._id?.slice(-4)?.toUpperCase() || '4022'}
                    </p>
                  </div>
                </div>
              </div>

              <nav className="mt-8 space-y-1">
                <SidebarButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={FaChartLine}>
                  Overview & Schedule
                </SidebarButton>
                <SidebarButton active={activeTab === 'vehicle'} onClick={() => setActiveTab('vehicle')} icon={FaMotorcycle}>
                  Maruwa Vehicle
                </SidebarButton>
                <SidebarButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={FaMoneyBillWave}>
                  Payment Ledger
                </SidebarButton>
                <SidebarButton active={activeTab === 'terms'} onClick={() => navigate('/installment-terms')} icon={FaFileContract}>
                  Agreement Terms
                </SidebarButton>
              </nav>

              <div className="mt-6 space-y-3">
                <ActionButton onClick={() => navigate('/bookride')} icon={FaMapMarkerAlt}>
                  Book a Ride
                </ActionButton>
                {!hasRiderRole && (
                  <ActionButton onClick={() => navigate('/rider-profile-setup')} icon={FaMotorcycle} color="neutral">
                    Become a Rider
                  </ActionButton>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-800">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-1">Contract Status</p>
                <div className="inline-flex px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-500/15 text-orange-400 border border-orange-500/25">
                  {schedule.status || 'deposit_pending'}
                </div>
              </div>
            </motion.div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            {!installmentData ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-neutral-900 p-16 rounded-[3rem] border border-neutral-800 shadow-2xl shadow-black/30 text-center"
              >
                <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-orange-500/25 text-orange-500 text-3xl">
                  <FaMotorcycle />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Complete Your Maruwa Profile</h3>
                <p className="text-neutral-400 font-bold max-w-sm mx-auto leading-relaxed mb-8 text-xs">
                  Fill out your personal information, two guarantors, and document uploads to activate your Maruwa installment plan.
                </p>
                <button
                  onClick={() => navigate('/installment-profile-setup')}
                  className="px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all"
                >
                  Start Profile Registration
                </button>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                      <PaymentProgress
                        installment={installmentData}
                        onPaymentSuccess={fetchInstallmentData}
                      />
                      <VehicleDetails
                        vehicle={installmentData.vehicle}
                        depositPaid={financials.depositPaid}
                        vehicleAssigned={installmentData.vehicle?.assigned}
                      />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                      {[
                        { label: 'Contract Target', value: '₦' + (financials.totalContractAmount || 7500000).toLocaleString(), icon: FaChartLine, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                        { label: 'Daily Rate (M-F)', value: '₦' + (financials.dailyInstallment || 18000).toLocaleString(), icon: FaMoneyBillWave, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                        { label: 'Days Completed', value: `${schedule.completedDays || 0} / ${schedule.totalScheduledDays || 389}`, icon: FaCalendarCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                        { label: 'Deposit Status', value: financials.depositPaid ? '₦500,000 Paid ✓' : '₦500,000 Due', icon: FaFileContract, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                      ].map((stat, i) => (
                        <div key={i} className="p-6 bg-neutral-900 rounded-[2rem] border border-neutral-800 shadow-xl shadow-black/20 group hover:border-orange-500/40 transition-all duration-300">
                          <div className={`w-10 h-10 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                            <stat.icon className="text-lg" />
                          </div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-1">{stat.label}</p>
                          <p className="text-base font-black text-white">{stat.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Payment History Component */}
                    <PaymentHistory payments={installmentData.payments || []} />
                  </div>
                )}

                {activeTab === 'vehicle' && (
                  <VehicleDetails
                    vehicle={installmentData.vehicle}
                    depositPaid={financials.depositPaid}
                    vehicleAssigned={installmentData.vehicle?.assigned}
                  />
                )}

                {activeTab === 'history' && (
                  <PaymentHistory payments={installmentData.payments || []} />
                )}
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default InstallmentDashboard;
