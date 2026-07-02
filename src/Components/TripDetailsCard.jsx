import React from 'react';
import { motion } from 'framer-motion';

const TripDetailsCard = ({ rideDetails }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/10 shadow-3xl"
    >
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black uppercase tracking-tight italic text-neutral-400">Transaction</h3>
        <div className="text-2xl font-black text-white tracking-tighter italic">₦{rideDetails.fare.toLocaleString()}</div>
      </div>

      <div className="space-y-6 relative ml-2">
        <div className="absolute left-[7px] top-[26px] bottom-[26px] w-[1px] bg-white/10"></div>
        <div className="flex items-start gap-6 relative z-10">
          <div className="w-3.5 h-3.5 rounded-full bg-orange-500 mt-2 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Pickup</span>
            <span className="text-sm font-bold text-neutral-100 line-clamp-1">{rideDetails.pickupLocation}</span>
          </div>
        </div>
        <div className="flex items-start gap-6 relative z-10">
          <div className="w-3.5 h-3.5 rounded-full bg-blue-500 mt-2 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Drop-off</span>
            <span className="text-sm font-bold text-neutral-100 line-clamp-1">{rideDetails.destination}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TripDetailsCard;



