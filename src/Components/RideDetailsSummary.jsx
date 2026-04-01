import React from 'react';
import { motion } from 'framer-motion';
import { FaRoute, FaClock } from 'react-icons/fa';
import { IoMdInformationCircleOutline } from "react-icons/io";
import { ClipLoader } from 'react-spinners';

const RideDetailsSummary = ({ rideDetails, fetchingRide }) => {
  if (fetchingRide) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl mb-12"
      >
        <div className="flex flex-col items-center py-4">
          <ClipLoader color="#f97316" size={30} />
          <p className="mt-2 text-neutral-400 text-sm">Fetching trip details...</p>
        </div>
      </motion.div>
    );
  }

  if (!rideDetails) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl mb-12"
      >
        <div className="text-center py-6 text-neutral-400">
          <IoMdInformationCircleOutline className="mx-auto text-4xl mb-2 opacity-20" />
          <p>Enter pickup and destination to see details</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl mb-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 relative">
          {/* Visual Route Line */}
          <div className="absolute left-[7px] top-[26px] bottom-[26px] w-[2px] bg-gradient-to-b from-orange-500 to-blue-500 rounded-full"></div>

          <div className="flex items-start z-10 relative">
            <div className="w-4 h-4 rounded-full bg-orange-500 mt-1 border-4 border-[#121212] shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
            <div className="ml-6">
              <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Pickup</span>
              <p className="text-lg font-bold leading-tight line-clamp-2">{rideDetails.pickupLocation}</p>
            </div>
          </div>

          <div className="flex items-start z-10 relative">
            <div className="w-4 h-4 rounded-full bg-blue-500 mt-1 border-4 border-[#121212] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            <div className="ml-6">
              <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Destination</span>
              <p className="text-lg font-bold leading-tight line-clamp-2">{rideDetails.destination}</p>
            </div>
          </div>
        </div>

        <div className="bg-black/40 rounded-2xl p-6 border border-white/5 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-400 flex items-center gap-2"><FaRoute /> Distance</span>
            <span className="font-bold text-white">{rideDetails.distance} km</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-400 flex items-center gap-2"><FaClock /> Est. Duration</span>
            <span className="font-bold text-white">{rideDetails.eta} mins</span>
          </div>
          <div className="pt-4 border-t border-white/10 flex justify-between items-end">
            <span className="text-neutral-400 font-bold">Total Fare</span>
            <span className="text-3xl font-black text-orange-500">₦{rideDetails.fare.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RideDetailsSummary;