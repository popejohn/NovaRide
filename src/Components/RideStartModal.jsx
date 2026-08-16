import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCar, FaTimes } from 'react-icons/fa';
import Button from './Button';

const RideStartModal = ({ showStartRideModal, setShowStartRideModal, isRider, updateRideStatus }) => {
  if (!showStartRideModal || !isRider) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowStartRideModal(false)}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-neutral-900 border border-white/10 rounded-[2.5rem] p-8 max-w-md w-full shadow-3xl overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-blue-500" />

          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center text-orange-500 mx-auto mb-6 border border-orange-500/20">
              <FaCar className="text-3xl" />
            </div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">
              Start <span className="text-orange-500">Ride?</span>
            </h2>
            <p className="text-neutral-400 text-sm font-medium leading-relaxed">
              The passenger has requested to start the ride. Agreeing will start the trip and deduct the fare from the passenger's wallet.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              text="AGREE & START"
              classes="w-full bg-orange-500 text-white py-5 rounded-[1.5rem] font-black text-[10px] lg:text-xs uppercase tracking-[0.25em] shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:bg-orange-600 transition-all"
              onClick={() => {
                updateRideStatus('in_progress');
                setShowStartRideModal(false);
              }}
            />
            <Button
              text="CANCEL RIDE"
              icon={<FaTimes className="text-xs" />}
              classes="w-full bg-red-600 text-white py-4 rounded-[1.5rem] font-black text-[10px] lg:text-xs uppercase tracking-[0.25em] hover:bg-red-700 transition-all"
              onClick={() => updateRideStatus('cancelled')}
            />
            <button
              onClick={() => setShowStartRideModal(false)}
              className="w-full py-4 text-neutral-500 font-black text-[10px] uppercase tracking-[0.2em] hover:text-white transition-colors"
            >
              Not Ready Yet
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RideStartModal;




