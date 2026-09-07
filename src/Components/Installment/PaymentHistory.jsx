import React from 'react';
import { FaCheckCircle, FaExclamationCircle, FaReceipt, FaMoneyBillWave } from 'react-icons/fa';

export const PaymentHistory = ({ payments = [] }) => {
  return (
    <div className="bg-neutral-900 p-8 rounded-4xl border border-neutral-800 shadow-xl shadow-black/30 space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-6">
        <div>
          <h3 className="text-xl font-black text-white tracking-tight">Payment Ledger & History</h3>
          <p className="text-xs font-bold text-neutral-400">Verified record of all completed installment payments and deposits</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
          <FaReceipt />
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="py-12 text-center text-neutral-500 font-bold text-sm">
          No payment transactions recorded yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-500 font-black uppercase tracking-wider text-[10px]">
                <th className="pb-3">Date</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Reference</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 font-bold text-neutral-200">
              {payments.map((p, idx) => (
                <tr key={p._id || idx} className="hover:bg-white/3 transition-colors">
                  <td className="py-4 text-neutral-400 font-medium">
                    {new Date(p.paidAt || p.date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="py-4 capitalize">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      p.type === 'deposit' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/25' : 'bg-neutral-800 text-neutral-200 border border-neutral-700'
                    }`}>
                      {p.type || 'Installment'}
                    </span>
                  </td>
                  <td className="py-4 font-mono text-[11px] text-neutral-400">
                    {p.reference}
                  </td>
                  <td className="py-4 font-black text-white">
                    ₦{(p.amount || 0).toLocaleString()}
                  </td>
                  <td className="py-4">
                    <span className="inline-flex items-center gap-1.5 text-green-600 font-black uppercase text-[10px] tracking-wider">
                      <FaCheckCircle /> Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
