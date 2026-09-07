import React from 'react';
import { FaCar, FaCogs, FaGasPump, FaShieldAlt, FaIdCard, FaMotorcycle, FaHourglassHalf } from 'react-icons/fa';

export const VehicleDetails = ({ vehicle = {}, depositPaid = false, vehicleAssigned = false }) => {
  const specs = vehicle.specs || {
    engine: '200cc 4-Stroke Single Cylinder',
    fuelType: 'Petrol / Commercial',
    ownership: vehicle.ownership || 'Company',
    color: vehicle.color || 'Yellow'
  };

  if (!vehicleAssigned) {
    return (
      <div className="p-8 bg-neutral-900 rounded-[2rem] border border-neutral-800 shadow-xl shadow-black/30 relative overflow-hidden space-y-4">
        <div className="flex items-center gap-5 border-b border-neutral-800 pb-6">
          <div className="w-20 h-20 rounded-2xl bg-neutral-800/60 flex items-center justify-center text-neutral-500 text-3xl shrink-0 border-2 border-neutral-800 shadow-md">
            <FaHourglassHalf />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Assigned Vehicle</span>
            <h4 className="text-lg font-black text-white leading-tight mt-0.5">Awaiting Assignment</h4>
            <div className="mt-2 inline-flex px-3 py-1 rounded-lg bg-black text-neutral-400 border border-neutral-800 text-[11px] font-mono font-black">
              Plate: PENDING_ASSIGNMENT
            </div>
          </div>
        </div>
        <p className="text-xs text-neutral-400 font-bold leading-relaxed">
          {depositPaid
            ? 'Your deposit has been received. Our team is assigning your Maruwa — you will be notified once it is ready for pickup and your daily installment schedule begins.'
            : 'Your Maruwa will be assigned by the admin once your initial deposit of ₦500,000 has been paid.'}
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-neutral-900 rounded-[2rem] border border-neutral-800 shadow-xl shadow-black/30 relative overflow-hidden space-y-6">
      <div className="flex items-center gap-5 border-b border-neutral-800 pb-6">
        <div className="w-20 h-20 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400 font-black text-3xl shrink-0 border-2 border-neutral-800 shadow-md">
          {vehicle.image ? (
            <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <FaMotorcycle />
          )}
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Assigned Vehicle</span>
          <h4 className="text-lg font-black text-white leading-tight mt-0.5">{vehicle.name || 'TVS King Deluxe 200cc'}</h4>
          <div className="mt-2 inline-flex px-3 py-1 rounded-lg bg-black text-orange-300 border border-neutral-800 text-[11px] font-mono font-black">
            Plate: {vehicle.plateNumber || 'PENDING_ASSIGNMENT'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs font-bold text-neutral-300">
        <div className="p-3 bg-black/40 rounded-xl border border-neutral-800">
          <p className="text-[9px] font-black uppercase tracking-wider text-neutral-500">Vehicle Type</p>
          <p className="font-black text-white">{vehicle.type || 'Commercial Tricycle (Maruwa)'}</p>
        </div>
        <div className="p-3 bg-black/40 rounded-xl border border-neutral-800">
          <p className="text-[9px] font-black uppercase tracking-wider text-neutral-500">Color</p>
          <p className="font-black text-white">{vehicle.color || 'Commercial Yellow'}</p>
        </div>
        <div className="p-3 bg-black/40 rounded-xl border border-neutral-800">
          <p className="text-[9px] font-black uppercase tracking-wider text-neutral-500">Ownership Title</p>
          <p className="font-black text-white">{vehicle.ownership || 'Company Lease-to-Own'}</p>
        </div>
        <div className="p-3 bg-black/40 rounded-xl border border-neutral-800">
          <p className="text-[9px] font-black uppercase tracking-wider text-neutral-500">Engine / Capacity</p>
          <p className="font-black text-white">{specs.engine || '200cc High Torque'}</p>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
