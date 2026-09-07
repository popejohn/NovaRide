import React from 'react';
import { FaShieldAlt, FaCheckCircle, FaCalendarCheck, FaMoneyBillWave, FaMotorcycle } from 'react-icons/fa';

const InstallmentPlanStep = ({ formik }) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <span className="bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider inline-block mb-3">
          Official Novacrest Scheme
        </span>
        <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Maruwa (Tricycle) Ownership Plan</h3>
        <p className="text-sm text-neutral-500 font-bold max-w-md mx-auto mt-2">
          Fixed daily business-day installment plan structured for quick, transparent commercial vehicle acquisition.
        </p>
      </div>

      {/* Primary Highlighted Plan Card */}
      <div className="p-8 md:p-10 rounded-[2.5rem] bg-gradient-to-b from-neutral-900 to-neutral-950 text-white relative overflow-hidden shadow-2xl border-2 border-orange-500/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-3 h-3 rounded-full bg-green-400 animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400">Approved Plan</span>
            </div>
            <h4 className="text-3xl font-black text-white tracking-tight">Maruwa Daily Ownership Plan</h4>
            <p className="text-xs text-neutral-400 font-bold mt-1">Standard Commercial Tricycle Lease-to-Own</p>
          </div>

          <div className="text-left md:text-right">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Total Contract Value</span>
            <p className="text-3xl font-black text-orange-400">₦7,500,000</p>
          </div>
        </div>

        {/* Core Financial Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-b border-white/10">
          <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Initial Deposit</p>
            <p className="text-2xl font-black text-white">₦500,000</p>
            <p className="text-[11px] text-neutral-400 mt-1 font-medium">Payable upon approval</p>
          </div>

          <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-orange-400 mb-1">Daily Installment</p>
            <p className="text-2xl font-black text-orange-400">₦18,000</p>
            <p className="text-[11px] text-neutral-400 mt-1 font-medium">Monday — Friday only</p>
          </div>

          <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Payment Days</p>
            <p className="text-2xl font-black text-white">389 Days</p>
            <p className="text-[11px] text-neutral-400 mt-1 font-medium">Saturday & Sunday Free</p>
          </div>
        </div>

        {/* Feature List */}
        <div className="pt-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-4">Key Terms & Protections</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300 font-bold">
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-orange-500 shrink-0" />
              <span>Zero payments required on weekends (Sat & Sun)</span>
            </div>
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-orange-500 shrink-0" />
              <span>Final payment adjusted to ₦16,000 (never overcharged)</span>
            </div>
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-orange-500 shrink-0" />
              <span>2-week certified warranty on mechanical factory faults</span>
            </div>
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-orange-500 shrink-0" />
              <span>Instant vehicle ownership transfer upon 100% completion</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallmentPlanStep;
