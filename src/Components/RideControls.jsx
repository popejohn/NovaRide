import React from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaCheck, FaCar } from 'react-icons/fa';
import Button from './Button';

const RideControls = ({ rideStatus, isPassenger, updateRideStatus }) => {
  const getStatusButton = () => {
    switch (rideStatus) {
      case 'accepted':
        return (
          <Button
            text="START RIDE"
            icon={<FaPlay className="text-sm" />}
            classes="w-full bg-green-600 text-white py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-green-600/20 hover:bg-green-700 transition-all"
            onClick={() => updateRideStatus('started')}
          />
        );
      case 'started':
        return (
          <Button
            text="ARRIVED AT DESTINATION"
            icon={<FaPause className="text-sm" />}
            classes="w-full bg-blue-600 text-white py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/20 hover:bg-blue-700 transition-all"
            onClick={() => updateRideStatus('arrived')}
          />
        );
      case 'arrived':
        return (
          <Button
            text="COMPLETE RIDE"
            icon={<FaCheck className="text-sm" />}
            classes="w-full bg-orange-600 text-white py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-orange-600/20 hover:bg-orange-700 transition-all"
            onClick={() => updateRideStatus('completed')}
          />
        );
      default:
        return null;
    }
  };

  if (!isPassenger) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-6 border border-white/10 shadow-3xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black uppercase tracking-tight italic text-neutral-400">Ride Controls</h3>
        <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center">
          <FaCar className="text-orange-500 text-xl" />
        </div>
      </div>

      <div className="space-y-4">
        {getStatusButton()}
      </div>
    </motion.div>
  );
};

export default RideControls;