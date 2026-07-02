import React, { useState } from 'react';
import { FaCalculator } from 'react-icons/fa';

export const FinanceCalculator = ({ installment }) => {
  const [extraPayment, setExtraPayment] = useState(0);
  const [newTenure, setNewTenure] = useState(installment.remainingMonths);

  const calculateNewSchedule = () => {
    const remainingPrincipal = installment.totalAmount - installment.paidAmount;
    const newMonthlyPayment = (remainingPrincipal - extraPayment) / (newTenure || 1);
    const totalNewAmount = installment.paidAmount + (newMonthlyPayment * newTenure);

    return {
      newMonthlyPayment: Math.max(0, Math.round(newMonthlyPayment)),
      totalNewAmount: Math.max(0, Math.round(totalNewAmount)),
      savings: Math.round(installment.totalAmount - totalNewAmount)
    };
  };

  const calculation = calculateNewSchedule();

  return (
    <div className="p-8 bg-white rounded-[3rem] border border-neutral-100 shadow-xl shadow-neutral-500/5 relative overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">Repayment Wizard</h3>
          <p className="text-xl font-black text-neutral-900">Model Your Plan</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100">
          <FaCalculator />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3 px-1">Extra Payment (₦)</label>
            <input
              type="number"
              value={extraPayment}
              onChange={(e) => setExtraPayment(Math.max(0, Number(e.target.value) || 0))}
              min="0"
              className="w-full px-8 py-5 rounded-[1.5rem] bg-neutral-50 border-2 border-neutral-100 focus:border-orange-500/30 font-black text-neutral-900 outline-none transition-all"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3 px-1">New Tenure (Months)</label>
            <input
              type="number"
              value={newTenure}
              onChange={(e) => setNewTenure(Math.max(0, Number(e.target.value) || 0))}
              min="0"
              max={installment.remainingMonths}
              className="w-full px-8 py-5 rounded-[1.5rem] bg-neutral-50 border-2 border-neutral-100 focus:border-orange-500/30 font-black text-neutral-900 outline-none transition-all"
            />
          </div>
        </div>

        <div className="bg-neutral-50 rounded-[2.5rem] p-8 border border-neutral-100 space-y-6">
          <div className="flex justify-between items-center group">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-neutral-400 group-hover:text-neutral-600 transition-colors">New Monthly Pmt</span>
            <span className="text-lg font-black text-neutral-900">₦{calculation.newMonthlyPayment.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center group">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-neutral-400 group-hover:text-neutral-600 transition-colors">Total New Liability</span>
            <span className="text-lg font-black text-neutral-900">₦{calculation.totalNewAmount.toLocaleString()}</span>
          </div>
          <div className="pt-6 border-t border-neutral-200 flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-green-600">Potential Savings</span>
            <span className="text-2xl font-black text-green-600">₦{calculation.savings.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};




