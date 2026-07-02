import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { FaUser } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import DriverCard from './DriverCard';

const DriversList = ({ drivers, loading, selectedDriver, handleDriverSelect }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center py-20">
        <div className="relative">
          <ClipLoader color="#f97316" size={60} />
          <div className="absolute inset-0 flex items-center justify-center">
            <FaUser className="text-orange-500 animate-pulse" />
          </div>
        </div>
        <p className="mt-6 text-neutral-400 font-medium">Scanning for available riders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {drivers.map((driver) => (
          <DriverCard
            key={driver.id}
            driver={driver}
            onSelect={handleDriverSelect}
            selected={selectedDriver?.id === driver.id}
          />
        ))}
      </AnimatePresence>

      {drivers.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
          <FaUser className="mx-auto text-4xl text-neutral-700 mb-4" />
          <p className="text-neutral-500 font-medium">No drivers found in your vicinity.</p>
          <p className="text-xs text-neutral-600 mt-2">Try expanding your search or wait a moment.</p>
        </div>
      )}
    </div>
  );
};

export default DriversList;



