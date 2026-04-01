import React from 'react';
import { FaStar, FaCar, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';
import profilePicPlaceholder from '../assets/placeholderProfile.jpg';

const DriverCard = ({ driver, onSelect, selected }) => (
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
        <div className="text-2xl font-black text-white">₦{driver.fare.toLocaleString()}</div>
        <div className="text-sm font-medium text-orange-500">{driver.eta} mins away</div>
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
          <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Distance</span>
          <span className="text-sm text-neutral-300">{driver.distance} km</span>
        </div>
      </div>
    </div>

    {selected && (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-4 flex items-center justify-center space-x-2 py-2 bg-orange-500 rounded-xl text-white font-bold"
      >
        <FaShieldAlt />
        <span>Selected Driver</span>
      </motion.div>
    )}
  </motion.div>
);

export default DriverCard;