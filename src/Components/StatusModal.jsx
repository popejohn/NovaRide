import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPhoneAlt } from 'react-icons/fa';
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";
import profilePicPlaceholder from '../assets/placeholderProfile.jpg';

const StatusModal = ({ status, driver, onAction, onProceed }) => {
  const isAccepted = status === 'accepted';
  const [hasCalled, setHasCalled] = useState(false);

  const handleCall = () => {
    setHasCalled(true);
    // The href tel: will handle the actual calling on mobile
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-sm bg-[#121212] rounded-[2.5rem] border border-white/10 p-8 shadow-2xl text-center"
      >
        <div className="mb-6">
          {isAccepted ? (
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
              <IoMdCheckmarkCircle className="text-5xl text-green-500" />
            </div>
          ) : (
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
              <IoMdCloseCircle className="text-5xl text-red-500" />
            </div>
          )}
        </div>

        <h2 className="text-2xl font-black mb-2 tracking-tighter uppercase">
          Ride {isAccepted ? 'Accepted' : 'Declined'}
        </h2>
        <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
          {isAccepted
            ? `${driver?.name} is on the way to pick you up!`
            : "The rider declined your request. Please select another rider."
          }
        </p>

        {isAccepted && driver && (
          <div className="bg-white/5 rounded-2xl p-4 mb-8 flex items-center gap-4 text-left border border-white/5">
            <img
              src={driver.profilePic || profilePicPlaceholder}
              alt={driver.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-bold text-white">{driver.name}</p>
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">⭐ {driver.rating} Rating</p>
              {hasCalled && <p className="text-orange-500 font-bold text-xs mt-1">{driver.phone}</p>}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {isAccepted ? (
            <>
              <a
                href={`tel:${driver?.phone}`}
                onClick={handleCall}
                className="flex items-center justify-center gap-3 w-full py-4 bg-orange-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
              >
                <FaPhoneAlt /> Call Driver
              </a>

              <AnimatePresence>
                {hasCalled && (
                  <motion.button
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    onClick={onProceed}
                    className="w-full py-4 bg-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10"
                  >
                    Proceed to Tracking
                  </motion.button>
                )}
              </AnimatePresence>
            </>
          ) : (
            <button
              onClick={() => onAction()}
              className="w-full py-4 bg-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all"
            >
              Try Another Rider
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StatusModal;