import React from 'react';
import { FaShieldAlt } from 'react-icons/fa';
import Button from './Button';

const BookingConfirmation = ({ selectedDriver, bookingStatus, handleConfirmBooking }) => {
  return (
    <AnimatePresence>
      {selectedDriver && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-10 inset-x-6 z-50 md:relative md:bottom-auto md:inset-x-0 md:mt-12"
        >
          <div className="bg-orange-500 p-1 rounded-[2rem] shadow-[0_20px_50px_rgba(249,115,22,0.3)]">
            <div className="bg-[#121212] flex items-center justify-between p-4 rounded-[1.8rem]">
              <div className="flex items-center space-x-4">
                <div className="bg-orange-500/20 p-3 rounded-2xl">
                  <FaShieldAlt className="text-orange-500 text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-white leading-tight">Book {selectedDriver.name}</h4>
                  <p className="text-xs text-neutral-400">Total: ₦{selectedDriver.fare.toLocaleString()}</p>
                </div>
              </div>
              <Button
                text={bookingStatus === 'waiting' ? "Waiting for Driver..." : "Confirm Booking"}
                disabled={bookingStatus === 'waiting'}
                classes={`${bookingStatus === 'waiting' ? 'bg-neutral-600' : 'bg-orange-500 hover:bg-orange-600'} text-white px-8 py-4 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-lg shadow-orange-500/20`}
                onClick={handleConfirmBooking}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingConfirmation;