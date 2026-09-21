import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaCar, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';
import profilePicPlaceholder from '../assets/placeholderProfile.jpg';

const DriverCard = ({ driver, onSelect, selected }) => {
  const fareValue = Number(driver?.fare);
  const fareDisplay = Number.isFinite(fareValue) ? `₦${fareValue.toLocaleString()}` : 'N/A';

  return (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    onClick={() => onSelect(driver)}
    className={`group relative p-5 rounded-2xl cursor-pointer transition-all duration-300 border backdrop-blur-md ${selected
      ? 'bg-orange-500/10 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.15)]'
      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
      }`}
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={driver.profilePic || profilePicPlaceholder}
            alt={driver.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-orange-500/30"
          />
          <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-[#121212]"></div>
        </div>
        <div>
          <h3 className="font-bold text-xl text-white group-hover:text-orange-400 transition-colors">{driver.name}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex items-center bg-orange-500/20 px-2 py-0.5 rounded-lg border border-orange-500/20">
              <FaStar className="text-orange-400 text-sm mr-1" />
              <span className="text-sm font-bold text-orange-400">{driver.rating}</span>
            </div>
            <span className="text-sm text-neutral-400">{driver.totalRides} rides</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-black text-white">{fareDisplay}</div>
        <div className="text-sm font-medium text-orange-500">{driver.eta} mins away</div>
        {driver.addedFare > 0 && (
          <span className="inline-block mt-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-black px-2 py-0.5 rounded-md">
            +₦{Number(driver.addedFare).toLocaleString()} Pickup
          </span>
        )}
      </div>
    </div>

    <div className="mt-6 grid grid-cols-2 gap-3">
      <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/5">
        <FaCar className="text-neutral-400" />
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Vehicle</span>
          <span className="text-sm text-neutral-300 truncate">{driver.vehicle.model} • {driver.vehicle.plate}</span>
        </div>
      </div>
      <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/5">
        <FaMapMarkerAlt className="text-neutral-400" />
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Distance from you</span>
          <span className="text-sm text-neutral-300">{driver.distance} km</span>
        </div>
      </div>
    </div>

    {selected && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="mt-4 pt-4 border-t border-white/10"
      >
        {driver.addedFare > 0 ? (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 mb-3 text-xs space-y-1.5">
            <div className="flex justify-between text-neutral-300">
              <span>Base Ride Fare:</span>
              <span className="font-semibold text-white">₦{Number(driver.baseFare || (driver.fare - driver.addedFare)).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-orange-400">
              <span>Added Distance Fee ({driver.distance} km @ ₦500/km):</span>
              <span className="font-bold">+₦{Number(driver.addedFare).toLocaleString()}</span>
            </div>
            <div className="border-t border-orange-500/20 pt-1.5 flex justify-between font-bold text-white text-sm">
              <span>Total Fare:</span>
              <span className="text-orange-400">₦{Number(driver.fare).toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 mb-3 text-xs flex justify-between text-neutral-300">
            <span>Standard Vicinity Fare:</span>
            <span className="font-bold text-white">₦{Number(driver.fare).toLocaleString()}</span>
          </div>
        )}
        <div className="flex items-center justify-center space-x-2 py-2 bg-orange-500 rounded-xl text-white font-bold text-sm">
          <FaShieldAlt />
          <span>Selected Driver</span>
        </div>
      </motion.div>
    )}
  </motion.div>
  );
};

export default DriverCard;



