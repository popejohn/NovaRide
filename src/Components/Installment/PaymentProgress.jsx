import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaChartLine, FaCheckCircle, FaExclamationCircle, FaShieldAlt, FaSun, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import { PaystackButton } from 'react-paystack';
import { motion } from 'framer-motion';
import api from '../../services/axios';

export const PaymentProgress = ({ installment, onPaymentSuccess }) => {
  const [processing, setProcessing] = useState(false);

  if (!installment) return null;

  const financials = installment.financials || {};
  const schedule = installment.schedule || {};
  const today = installment.today || {};
  const vehicle = installment.vehicle || {};
  const user = installment.user || {};

  const totalAmount = financials.totalContractAmount || 7500000;
  const paidAmount = financials.paidAmount || 0;
  const remainingBalance = financials.remainingBalance || (totalAmount - paidAmount);
  const progressPercent = financials.percentageCompleted || 0;
  const isDepositPending = !financials.depositPaid;
  const amountToPay = today.amountDue || (isDepositPending ? 500000 : 18000);

  const token = localStorage.getItem('nvcr_tk');
  // Paystack Public Key
  const paystackPublicKey = "pk_test_26f1b45d2f2c179ed904deee64e9fe8c60ff8fc4";

  const handlePaystackSuccess = async (response) => {
    try {
      setProcessing(true);
      const reference = response.reference;

      const verifyRes = await api.post('/paystack/verify-installment-payment', {
        reference
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(verifyRes.data?.message || 'Payment verified successfully!');
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      toast.error(err.response?.data?.message || 'Payment verification failed. Please contact support.');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = () => {
    if (isDepositPending) {
      return (
        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1.5">
          <FaClock /> Deposit Pending
        </span>
      );
    }
    if (today.status === 'awaiting_vehicle_assignment') {
      return (
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1.5">
          <FaClock /> Awaiting Vehicle Assignment
        </span>
      );
    }
    if (today.status === 'paid' || today.isPaidToday) {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1.5">
          <FaCheckCircle /> Paid Today
        </span>
      );
    }
    if (today.status === 'overdue') {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1.5">
          <FaExclamationCircle /> Overdue
        </span>
      );
    }
    if (today.status === 'weekend') {
      return (
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1.5">
          <FaSun /> Weekend (No Payment Due)
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1.5">
        <FaClock /> Due Today
      </span>
    );
  };

  return (
    <div className="p-8 bg-neutral-900 rounded-[2rem] border border-neutral-800 shadow-xl shadow-black/30 relative overflow-hidden space-y-6">
      <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 blur-3xl rounded-full pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Repayment Plan</span>
            {getStatusBadge()}
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">
            ₦{paidAmount.toLocaleString()}{' '}
            <span className="text-xs font-bold text-neutral-500">/ ₦{totalAmount.toLocaleString()}</span>
          </h3>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/25 shrink-0">
          <FaChartLine className="text-xl" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
          <span className="text-neutral-500">Progress: {schedule.completedDays || 0} of {schedule.totalScheduledDays || 389} Days</span>
          <span className="text-orange-400">{progressPercent}%</span>
        </div>
        <div className="w-full bg-black rounded-full h-3 p-0.5 border border-neutral-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progressPercent, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full shadow-md"
          />
        </div>
      </div>

      {/* Balance Grid */}
      <div className="grid grid-cols-2 gap-4 py-3 border-y border-neutral-800">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-0.5">Remaining Balance</p>
          <p className="text-base font-black text-white">₦{remainingBalance.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-0.5">Next Payment Date</p>
          <p className="text-base font-black text-white">
            {schedule.nextPaymentDate ? new Date(schedule.nextPaymentDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : 'Pending Deposit'}
          </p>
        </div>
      </div>

      {/* Payment Action Widget */}
      <div className="pt-2">
        {isDepositPending ? (
          <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200/60 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 text-xs font-black uppercase tracking-wider">
              <FaShieldAlt /> Deposit Payment Required
            </div>
            <p className="text-xs text-amber-900 font-bold leading-relaxed">
              Pay the initial deposit of <strong>₦500,000</strong> to activate your commercial Maruwa lease and receive vehicle delivery.
            </p>
            <PaystackButton
              className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
              text={processing ? "Verifying Deposit..." : "Pay Initial Deposit (₦500,000)"}
              email={user.email || 'partner@novaride.ng'}
              amount={500000 * 100}
              publicKey={paystackPublicKey}
              reference={`NVCR_DEP_${Date.now()}_${Math.floor(Math.random() * 10000)}`}
              onSuccess={handlePaystackSuccess}
              onClose={() => toast.info('Deposit payment cancelled.')}
              disabled={processing}
            />
          </div>
        ) : today.status === 'awaiting_vehicle_assignment' ? (
          <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200 flex items-center gap-3 text-blue-800">
            <FaClock className="text-2xl text-blue-500 shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-blue-900">Awaiting Vehicle Assignment</p>
              <p className="text-[11px] font-bold text-blue-700">{today.message || 'Your deposit was received. Daily installments begin once your Maruwa is assigned by the admin.'}</p>
            </div>
          </div>
        ) : today.isPaidToday || today.status === 'paid' ? (
          <div className="bg-green-50 p-5 rounded-2xl border border-green-200 flex items-center gap-3 text-green-800">
            <FaCheckCircle className="text-2xl text-green-600 shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-green-900">Today's Installment Completed</p>
              <p className="text-[11px] font-bold text-green-700">Next payment of ₦18,000 will be due on the next scheduled business day.</p>
            </div>
          </div>
        ) : today.status === 'weekend' ? (
          <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200 flex items-center gap-3 text-blue-800">
            <FaSun className="text-2xl text-blue-500 shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-blue-900">Weekend Free Day</p>
              <p className="text-[11px] font-bold text-blue-700">No scheduled payment due today. Enjoy your weekend!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-300">
              <span>Today's Required Installment:</span>
              <span className="text-sm font-black text-orange-600">₦{amountToPay.toLocaleString()}</span>
            </div>
            <PaystackButton
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-orange-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              text={processing ? "Verifying Payment..." : `Pay Today's Installment (₦${amountToPay.toLocaleString()})`}
              email={user.email || 'partner@novaride.ng'}
              amount={amountToPay * 100}
              publicKey={paystackPublicKey}
              reference={`NVCR_INST_${Date.now()}_${Math.floor(Math.random() * 10000)}`}
              onSuccess={handlePaystackSuccess}
              onClose={() => toast.info('Payment cancelled.')}
              disabled={processing}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentProgress;
