import React from 'react';
import { FaMoneyBillWave, FaCalculator } from 'react-icons/fa';
import Input from '../Input';

const PaymentStep = ({ formik }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mb-4">
          <FaMoneyBillWave className="text-2xl text-orange-600" />
        </div>
        <h3 className="text-xl font-black text-neutral-900 tracking-tight">Financial Details</h3>
        <p className="text-sm text-neutral-500 font-bold max-w-xs mt-2">Provide your disbursement account for vehicle payments.</p>
      </div>
      
      <Input
        label="Bank Name"
        variant="light"
        value={formik.values.bankName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        name="bankName"
        placeholder="e.g., Access Bank, UBA"
        error={formik.touched.bankName && formik.errors.bankName}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Account Number"
          variant="light"
          value={formik.values.accountNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="accountNumber"
          placeholder="0123456789"
          error={formik.touched.accountNumber && formik.errors.accountNumber}
        />
        <Input
          label="Account Name"
          variant="light"
          value={formik.values.accountName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="accountName"
          placeholder="John Doe"
          error={formik.touched.accountName && formik.errors.accountName}
        />
      </div>

      <div className="mt-10 p-8 rounded-[2.5rem] bg-neutral-900 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-3xl rounded-full -mr-16 -mt-16" />
        <div className="relative z-10 flex items-start gap-5">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <FaCalculator className="text-orange-400" />
          </div>
          <div>
            <p className="font-black text-xs uppercase tracking-[0.2em] text-orange-400 mb-2">Important Deposit Info</p>
            <p className="text-neutral-400 text-sm font-bold leading-relaxed">
              A mandatory down payment is required upon approval. You'll specify your vehicle choice and repayment term in the next phase of your application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;
