import React from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaCheck, FaCar, FaTimes } from 'react-icons/fa';
import Button from './Button';

const RideControls = ({ rideStatus, isPassenger, isRider, updateRideStatus }) => {
  const renderPassengerControls = () => {
    if (rideStatus === 'accepted' || rideStatus === 'at_pickup') {
      return (
        <div className="space-y-4">
          <Button
            text="START RIDE"
            icon={<FaPlay className="text-xs" />}
            classes="w-full bg-green-600 text-white py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-green-600/20 hover:bg-green-700 transition-all"
            onClick={() => updateRideStatus('starting')}
          />
          <Button
            text="CANCEL RIDE"
            icon={<FaTimes className="text-xs" />}
            classes="w-full bg-red-600 text-white py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-red-600/20 hover:bg-red-700 transition-all"
            onClick={() => updateRideStatus('pending')}
          />
        </div>
      );
    }
    if (rideStatus === 'starting') {
      return (
        <div className="text-center py-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
          <p className="text-orange-500 font-bold uppercase tracking-widest text-xs animate-pulse">
            Awaiting Driver Agreement...
          </p>
        </div>
      );
    }
    return null;
  };

  const renderRiderControls = () => {
    if (rideStatus === 'accepted') {
      return (
        <Button
          text="I'M ON MY WAY"
          icon={<FaPlay className="text-xs" />}
          classes="w-full bg-blue-600 text-white py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/20 hover:bg-blue-700 transition-all"
          onClick={() => updateRideStatus('at_pickup')}
        />
      );
    }
    if (rideStatus === 'in_progress') {
      return (
        <Button
          text="COMPLETE RIDE"
          icon={<FaCheck className="text-xs" />}
          classes="w-full bg-orange-600 text-white py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-orange-600/20 hover:bg-orange-700 transition-all"
          onClick={() => updateRideStatus('awaiting_completion')}
        />
      );
    }
    if (rideStatus === 'awaiting_completion') {
      return (
        <div className="text-center py-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
          <p className="text-orange-500 font-bold uppercase tracking-widest text-xs animate-pulse">
            Awaiting Passenger Confirmation...
          </p>
        </div>
      );
    }
    return null;
  };

  const content = isPassenger ? renderPassengerControls() : (isRider ? renderRiderControls() : null);

  if (!content) return null;

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
        {content}
      </div>
    </motion.div>
  );
};

export default RideControls;