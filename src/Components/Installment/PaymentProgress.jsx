import React from 'react';
import { FaChartLine } from 'react-icons/fa';
import { PaystackButton } from 'react-paystack';
import { motion } from 'framer-motion';
import api from '../../services/axios';

export const PaymentProgress = ({ totalAmount, paidAmount, nextPaymentDate, onPaymentSuccess }) => {
  const progress = (paidAmount / totalAmount) * 100;
  const remainingAmount = totalAmount - paidAmount;
  const daysUntilPayment = Math.ceil((new Date(nextPaymentDate) - new Date()) / (1000 * 60 * 60 * 24));

  const amountToPay = 10000;
  const token = localStorage.getItem('nvcr_tk');

  return (
    <div className="p-8 bg-white rounded-[2rem] border border-neutral-100 shadow-xl shadow-neutral-500/5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">Repayment Status</h3>
          <p className="text-2xl font-black text-neutral-900">₦{paidAmount.toLocaleString()}<span className="text-xs font-bold text-neutral-400 ml-2 italic">Total Paid</span></p>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100">
          <FaChartLine className="text-2xl" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3">
            <span>Overall Progress</span>
            <span className="text-orange-500">{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-neutral-100 rounded-full h-4 p-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="bg-gradient-to-r from-orange-600 to-orange-400 h-2 rounded-full shadow-lg shadow-orange-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-neutral-50">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Remaining</p>
            <p className="text-lg font-black text-neutral-900">₦{remainingAmount.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Next Payment</p>
            <p className={`text-lg font-black ${daysUntilPayment <= 5 ? 'text-red-500' : 'text-neutral-900'}`}>
              {daysUntilPayment > 0 ? `${daysUntilPayment} days left` : 'Overdue'}
            </p>
          </div>
        </div>

        <PaystackButton
          className="w-full mt-4 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-orange-500/20"
          text="Make Payment (₦10,000)"
          email={`user_${Date.now()}@novacrest.local`}
          amount={amountToPay * 100} // Convert to kobo
          publicKey="pk_test_26f1b45d2f2c179ed904deee64e9fe8c60ff8fc4"
          reference={(new Date()).getTime().toString()}
          onSuccess={async (transaction) => {
              try {
                  await api.post('/paystack/verify-installment-payment', {
                      reference: transaction.reference
                  }, {
                      headers: { Authorization: `Bearer ${token}` }
                  });
                  
                  alert("Payment successful!");
                  if(onPaymentSuccess) onPaymentSuccess();
              } catch (verifyError) {
                  console.error("Verification failed:", verifyError);
                  alert("Payment verification failed. Please contact support.");
              }
          }}
          onClose={() => {
              alert("Payment cancelled.");
          }}
        />
      </div>
    </div>
  );
};





