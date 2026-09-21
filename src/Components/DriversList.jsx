import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { FaUser, FaSearchLocation } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import DriverCard from './DriverCard';

const DriversList = ({
  drivers,
  loading,
  selectedDriver,
  handleDriverSelect,
  isExpandedSearch,
  expandingSearch,
  fetchClosestRiders,
  resetToVicinitySearch
}) => {
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
      {isExpandedSearch && (
        <div className="flex items-center justify-between p-3.5 px-5 bg-orange-500/10 border border-orange-500/20 rounded-2xl mb-2 text-xs">
          <div className="flex items-center gap-2 text-orange-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span>Showing closest available riders outside 5 km (+₦500/km pickup fee included)</span>
          </div>
          {resetToVicinitySearch && (
            <button
              onClick={resetToVicinitySearch}
              className="text-neutral-400 hover:text-white underline text-[11px] ml-2 shrink-0 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      )}

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

      {drivers.length === 0 && !isExpandedSearch && (
        <div className="text-center py-12 px-6 bg-white/5 rounded-3xl border border-dashed border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 blur-[60px] rounded-full pointer-events-none" />
          <FaUser className="mx-auto text-4xl text-neutral-600 mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No riders in your vicinity</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto mb-6">
            There are currently no active riders within 5 km of your pickup location. Would you like to pick from the closest available riders?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={fetchClosestRiders}
              disabled={expandingSearch}
              className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-95 disabled:opacity-60 rounded-xl text-white font-bold text-sm shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
            >
              {expandingSearch ? (
                <>
                  <ClipLoader color="#fff" size={16} />
                  <span>Searching closest riders...</span>
                </>
              ) : (
                <>
                  <FaSearchLocation className="text-base" />
                  <span>Find Closest Available Riders</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-neutral-500 mt-4 flex items-center justify-center gap-1">
            <span className="text-orange-400 font-semibold">*Note:</span> Added pickup funds of ₦500 per km apply for distant riders.
          </p>
        </div>
      )}

      {drivers.length === 0 && isExpandedSearch && (
        <div className="text-center py-16 bg-white/5 rounded-3xl border border-dashed border-white/10">
          <FaUser className="mx-auto text-4xl text-neutral-700 mb-3" />
          <p className="text-neutral-400 font-medium">No available riders found in expanded search.</p>
          <p className="text-xs text-neutral-600 mt-1">Please wait a few moments or try again later.</p>
          {resetToVicinitySearch && (
            <button
              onClick={resetToVicinitySearch}
              className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-xs text-neutral-300 font-semibold transition-all"
            >
              Reset to standard vicinity search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DriversList;



