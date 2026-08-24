import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import OtherNav from './VerifiedNav';
import Button from './Button';
import RoleService from '../utils/roleService';
import api from '../services/axios';
import { FaCar, FaCalculator, FaClock, FaMoneyBillWave, FaChartLine, FaMotorcycle, FaMapMarkerAlt } from 'react-icons/fa';
import { PaystackButton } from 'react-paystack';
import { motion } from 'framer-motion';

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

import { PaymentProgress } from './Installment/PaymentProgress';

import { VehicleDetails } from './Installment/VehicleDetails';

import { FinanceCalculator } from './Installment/FinanceCalculator';

import { PaymentHistory } from './Installment/PaymentHistory';

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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="relative">
          <div className="w-16 h-16 rounded-3xl border-4 border-orange-100 animate-pulse" />
          <div className="absolute inset-0 border-t-4 border-orange-500 rounded-3xl animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 relative overflow-hidden">
       {/* Global Decorative Elements aligned with Rider Dashboard */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

      <Navbar userrole={user?.role} userverified={true} profilePic={user?.profilePic} nav={<OtherNav userrole={user?.role} />} />

      <div className="pt-32 pb-20 px-4 md:px-8 lg:px-12 max-w-[1600px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Sidebar aligned with Rider Dashboard Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-xl relative overflow-hidden"
            >
               <div className="relative z-10">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-4">Partner Profile</p>
                 <div className="flex items-center gap-4">
                   <div className="w-16 h-16 rounded-[1.5rem] bg-neutral-900 flex items-center justify-center text-white text-2xl font-black overflow-hidden border-2 border-white shadow-lg">
                     {user?.profilePic ? (
                       <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                     ) : (
                       user?.firstname?.[0] || 'C'
                     )}
                   </div>
                   <div>
                     <h2 className="text-2xl font-black text-neutral-900 tracking-tighter leading-none">{user?.firstname || 'Customer'}</h2>
                     <p className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase mt-3">NVCR-PARTNER-4022</p>
                   </div>
                 </div>
               </div>

               <nav className="mt-8 space-y-1">
                <SidebarButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={FaChartLine}>
                  Overview
                </SidebarButton>
                <SidebarButton active={activeTab === 'vehicle'} onClick={() => setActiveTab('vehicle')} icon={FaCar}>
                  Vehicle
                </SidebarButton>
                <SidebarButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={FaMoneyBillWave}>
                  Payments
                </SidebarButton>
                <SidebarButton active={activeTab === 'calculator'} onClick={() => setActiveTab('calculator')} icon={FaCalculator}>
                  Simulator
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

              <div className="mt-8 pt-8 border-t border-neutral-50">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">Repayment Plan</p>
                <div className="text-2xl font-black text-neutral-900 tracking-tighter">
                  {installmentData?.installmentPlan || 'Nova sprint'}
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
                className="bg-white p-20 rounded-[3rem] border border-neutral-100 shadow-xl text-center"
              >
                <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-neutral-100">
                  <FaCar className="text-4xl text-neutral-200" />
                </div>
                <h3 className="text-3xl font-black text-neutral-900 mb-4 tracking-tighter">Welcome, Nova Partner</h3>
                <p className="text-neutral-500 font-bold max-w-sm mx-auto leading-relaxed mb-10 text-sm">
                  Experience seamless vehicle ownership. Complete your profile or view available vehicles to get started.
                </p>
                <button className="px-12 py-5 bg-neutral-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-black transition-all">
                  Browse Vehicles
                </button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <PaymentProgress
                        totalAmount={installmentData.totalAmount}
                        paidAmount={installmentData.paidAmount}
                        nextPaymentDate={installmentData.nextPaymentDate}
                        onPaymentSuccess={fetchInstallmentData}
                      />
                      <VehicleDetails
                        vehicle={{
                          name: installmentData.vehicleName,
                          plateNumber: installmentData.vehiclePlate,
                          image: installmentData.vehicleImage || '/placeholderVehicle.jpg',
                          color: 'Crystal Black',
                          specs: installmentData.specs || {
                            engine: '1.5L Turbo',
                            transmission: 'Automatic',
                            fuelType: 'Petrol',
                            mileage: '4,200 km'
                          }
                        }}
                      />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                      {[
                        { label: 'Limit Level', value: '₦' + installmentData.totalAmount.toLocaleString(), icon: FaChartLine, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { label: 'Plan Name', value: installmentData.installmentPlan || 'Nova sprint', icon: FaCalculator, color: 'text-orange-500', bg: 'bg-orange-50' },
                        { label: 'Monthly Repay', value: '₦' + installmentData.monthlyPayment.toLocaleString(), icon: FaMoneyBillWave, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                        { label: 'Activation', value: new Date(installmentData.createdAt).toLocaleDateString(), icon: FaClock, color: 'text-purple-500', bg: 'bg-purple-50' },
                      ].map((stat, i) => (
                        <div key={i} className="p-8 bg-white rounded-[2rem] border border-neutral-100 shadow-xl shadow-neutral-500/5 group hover:border-orange-200 transition-all duration-500">
                          <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                            <stat.icon className="text-xl" />
                          </div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">{stat.label}</p>
                          <p className="text-lg font-black text-neutral-900">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'vehicle' && (
                  <VehicleDetails
                    vehicle={{
                      name: installmentData.vehicleName,
                      plateNumber: installmentData.vehiclePlate,
                      image: installmentData.vehicleImage || '/placeholderVehicle.jpg',
                      color: 'Crystal Black',
                      specs: installmentData.specs || {
                        engine: '1.5L Turbo',
                        transmission: 'Automatic',
                        fuelType: 'Petrol',
                        mileage: '4,200 km'
                      }
                    }}
                  />
                )}

                {activeTab === 'history' && (
                  <PaymentHistory payments={installmentData.payments || []} />
                )}

                {activeTab === 'calculator' && (
                  <FinanceCalculator installment={installmentData} />
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



