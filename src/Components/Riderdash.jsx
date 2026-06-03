import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChartLine, FaWallet, FaRoute, FaUsers, FaArrowTrendUp } from 'react-icons/fa6';
import { MdSpaceDashboard } from 'react-icons/md';
import Navbar from './Navbar';
import OtherNav from './VerifiedNav';
import Button from './Button';

// Hook
import { useRiderDashboard } from '../hooks/useRiderDashboard';

// Sub-components
import SidebarButton from './Profile/SidebarButton'; // Reusing the same styled button
import KilometersChart from './Rider/KilometersChart';
import WalletPanel from './Rider/WalletPanel';
import Journeys from './Rider/Journeys';
import AvailablePassengers from './Rider/AvailablePassengers';
import RideRequestModal from './Rider/RideRequestModal';

const Riderdash = () => {
  const navigate = useNavigate();
  const {
    user,
    role,
    isOnline,
    availableRides,
    view,
    setView,
    locationError,
    walletBalance,
    transactions,
    journeys,
    totalKm,
    monthlyKm,
    selectedRide,
    setSelectedRide,
    handleAcceptRide,
    handleRejectRide,
    handleOnlineToggle
  } = useRiderDashboard();

  return (
    <div className="min-h-screen bg-stone-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

      <Navbar
        userrole={role}
        userverified={true}
        nav={<OtherNav userrole={role} />}
        profilePic={user?.profilePic}
      />

      <main className="mt-32 px-4 md:px-8 lg:px-12 max-w-[1600px] mx-auto pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 bg-white border border-neutral-100 rounded-[2rem] shadow-xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4">
                <div
                  onClick={handleOnlineToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors duration-300 ${isOnline ? 'bg-green-500' : 'bg-neutral-200'
                    }`}
                >
                  <motion.span
                    animate={{ x: isOnline ? 24 : 4 }}
                    className="inline-block h-4 w-4 rounded-full bg-white shadow-sm"
                  />
                </div>
              </div>

              <div className="mb-6">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">Rider Profile</p>
                <h2 className="text-2xl font-black text-neutral-900 tracking-tighter">
                  {user?.firstname || 'Driver'} <span className="text-orange-500 text-sm align-top font-bold">★ 4.9</span>
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-neutral-300'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                    {isOnline ? 'Currently Online' : 'Offline'}
                  </span>
                </div>
              </div>

              <nav className="space-y-1">
                <SidebarButton active={view === 'overview'} onClick={() => setView('overview')} icon={MdSpaceDashboard}>Overview</SidebarButton>
                <SidebarButton active={view === 'kilometers'} onClick={() => setView('kilometers')} icon={FaChartLine}>Kilometers</SidebarButton>
                <SidebarButton onClick={() => navigate('/wallet')} icon={FaWallet}>Wallet</SidebarButton>
                <SidebarButton active={view === 'journeys'} onClick={() => setView('journeys')} icon={FaRoute}>Journeys</SidebarButton>
                <SidebarButton active={view === 'available'} onClick={() => setView('available')} icon={FaUsers}>Incoming Requests</SidebarButton>
              </nav>

              <div className="mt-6">
                <Link to="/bookride">
                  <Button
                    text="Book a Ride"
                    classes="w-full py-4 rounded-[1.5rem] bg-orange-500 text-white font-black uppercase tracking-[0.15em] text-[10px] shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  />
                </Link>
              </div>

              <div className="mt-8 pt-8 border-t border-neutral-50">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">Lifetime Stats</p>
                <div className="text-3xl font-black text-neutral-900 tracking-tighter">
                  {totalKm.toLocaleString()} <span className="text-sm font-bold text-neutral-400 uppercase tracking-widest ml-1 text-[10px]">KM</span>
                </div>
              </div>
            </motion.div>

            {locationError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 shadow-lg shadow-red-500/5 transition-all"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> {locationError}
              </motion.div>
            )}
          </aside>

          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {view === 'overview' && (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <KilometersChart monthly={monthlyKm} />
                    <WalletPanel balance={walletBalance} />
                    <div className="xl:col-span-2">
                      <AvailablePassengers list={availableRides} onViewRequest={setSelectedRide} />
                    </div>
                  </div>
                )}
                {view === 'kilometers' && <KilometersChart monthly={monthlyKm} />}
                {view === 'journeys' && <Journeys items={journeys} />}
                {view === 'available' && <AvailablePassengers list={availableRides} onViewRequest={setSelectedRide} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      <RideRequestModal
        ride={selectedRide}
        onAccept={handleAcceptRide}
        onDecline={handleRejectRide}
        onClose={() => setSelectedRide(null)}
      />
    </div>
  );
};

export default Riderdash;
