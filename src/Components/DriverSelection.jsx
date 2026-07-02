import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaArrowLeft } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useDriverSocket } from '../hooks/useDriverSocket';
import { useDriverSelectionManager } from '../hooks/useDriverSelectionManager';
import RideDetailsSummary from './RideDetailsSummary';
import DriversList from './DriversList';
import BookingConfirmation from './BookingConfirmation';

const DriverSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const rideId = queryParams.get('rideId');

  const { user } = useSelector(state => state.verifiedUser);
  const { bookingStatus, setBookingStatus, acceptedDriver } = useDriverSocket(user?._id, rideId);

  const { 
    drivers,
    rideDetails,
    loading,
    fetchingRide,
    selectedDriver,
    handleDriverSelect,
    handleConfirmBooking
  } = useDriverSelectionManager(rideId, bookingStatus, setBookingStatus, () => {});

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-orange-500/30">
      {/* Premium Header/Background */}
      <div className="fixed top-0 inset-x-0 h-[40vh] bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-24">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-all group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-black uppercase tracking-tighter">Nova <span className="text-orange-500">Selection</span></h1>
            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Find your perfect ride</p>
          </div>
          <div className="w-11"></div> {/* Spacer */}
        </div>

        {/* Ride Details Summary Section */}
        <RideDetailsSummary rideDetails={rideDetails} fetchingRide={fetchingRide} />

        {/* Drivers Section */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-tight">Available Riders</h2>
          <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-full">{drivers.length} NEARBY</span>
        </div>

        <DriversList
          drivers={drivers}
          loading={loading}
          selectedDriver={selectedDriver}
          handleDriverSelect={handleDriverSelect}
        />

        <BookingConfirmation
          selectedDriver={selectedDriver}
          rideId={rideId}
          rideDetails={rideDetails}
          bookingStatus={bookingStatus}
          handleConfirmBooking={handleConfirmBooking}
        />
      </div>
    </div>
  );
};

export default DriverSelection;




