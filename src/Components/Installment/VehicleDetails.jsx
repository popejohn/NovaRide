import React from 'react';
import { FaCar, FaCalculator, FaMoneyBillWave, FaClock } from 'react-icons/fa';

export const VehicleDetails = ({ vehicle }) => (
  <div className="p-8 bg-white rounded-[3rem] border border-neutral-100 shadow-xl shadow-neutral-500/5 relative overflow-hidden group">
    <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-500/5 blur-3xl rounded-full -mr-20 -mb-20" />
    
    <div className="flex items-center gap-6 mb-8">
      <div className="relative">
        <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full group-hover:bg-orange-500/30 transition-all duration-500" />
        <img src={vehicle.image} alt={vehicle.name} className="w-24 h-24 rounded-3xl object-cover relative z-10 border-4 border-white shadow-xl" />
      </div>
      <div>
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">Active Vehicle</h3>
        <h4 className="text-xl font-black text-neutral-900 leading-tight">{vehicle.name}</h4>
        <div className="mt-2 inline-flex px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-[10px] font-black uppercase tracking-widest text-neutral-600">
          {vehicle.plateNumber}
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-y-6 gap-x-8">
      {[
        { label: 'Color', value: vehicle.color, icon: FaCar },
        { label: 'Transmission', value: vehicle.specs.transmission, icon: FaCalculator },
        { label: 'Fuel Type', value: vehicle.specs.fuelType, icon: FaMoneyBillWave },
        { label: 'Mileage', value: vehicle.specs.mileage, icon: FaClock },
      ].map((spec, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 border border-neutral-100">
            <spec.icon className="text-xs" />
          </div>
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.15em] text-neutral-400">{spec.label}</p>
            <p className="text-xs font-black text-neutral-900">{spec.value}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
