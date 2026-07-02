import React from 'react';
import { FaMoneyBillWave, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';

export const PaymentHistory = ({ payments }) => (
  <div className="p-8 bg-white rounded-[3rem] border border-neutral-100 shadow-xl shadow-neutral-500/5 relative overflow-hidden">
    <div className="flex items-center justify-between mb-8">
      <div>
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">Transaction Log</h3>
        <p className="text-xl font-black text-neutral-900">Recent Payments</p>
      </div>
      <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400 border border-neutral-100">
        <FaMoneyBillWave />
      </div>
    </div>

    {payments.length === 0 ? (
      <div className="py-20 text-center border-2 border-dashed border-neutral-100 rounded-[2rem]">
        <FaClock className="text-4xl text-neutral-100 mx-auto mb-4" />
        <p className="text-sm font-black text-neutral-300 uppercase tracking-widest">No transactions logged</p>
      </div>
    ) : (
      <div className="space-y-4">
        {payments.map((payment, idx) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key={idx} 
            className="flex justify-between items-center p-6 rounded-2xl bg-neutral-50 border border-neutral-100 hover:border-orange-200 transition-all cursor-default group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-orange-500 shadow-sm shadow-neutral-200">
                <FaMoneyBillWave className="text-sm" />
              </div>
              <div>
                <div className="text-lg font-black text-neutral-900">₦{payment.amount.toLocaleString()}</div>
                <div className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">{payment.date}</div>
              </div>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
              payment.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
            }`}>
              {payment.status}
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </div>
);




