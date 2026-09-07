import React from 'react';
import { Link } from 'react-router-dom';
import { FaMoneyBillWave, FaFileContract, FaShieldAlt } from 'react-icons/fa';
import Input from '../Input';

const PaymentStep = ({ formik }) => {
  return (
    <div className="space-y-8">
      {/* Section E: Settlement / Bank Details */}
      <div className="bg-neutral-50/70 p-8 rounded-[2rem] border-2 border-neutral-100 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black">
            <FaMoneyBillWave />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-900">Section E — Payment & Settlement Details</h3>
            <p className="text-xs font-bold text-neutral-500">Provide your verified bank account details for settlement & records</p>
          </div>
        </div>

        <Input
          label="Bank Name *"
          variant="light"
          value={formik.values.bankName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="bankName"
          placeholder="e.g. Access Bank, First Bank, Zenith Bank"
          error={formik.touched.bankName && formik.errors.bankName}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Account Number (10 Digits) *"
            variant="light"
            value={formik.values.accountNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="accountNumber"
            placeholder="0123456789"
            error={formik.touched.accountNumber && formik.errors.accountNumber}
          />
          <Input
            label="Account Name *"
            variant="light"
            value={formik.values.accountName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="accountName"
            placeholder="Matching your ID name"
            error={formik.touched.accountName && formik.errors.accountName}
          />
        </div>
      </div>

      {/* Section F: Terms and Conditions Attestation */}
      <div className="bg-white p-8 rounded-[2rem] border-2 border-orange-500/30 shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-2xl rounded-full -mr-16 -mt-16 pointer-events-none" />

        <div className="flex items-center gap-3">
          <FaFileContract className="text-orange-500 text-2xl" />
          <h3 className="text-base font-black text-neutral-900 uppercase tracking-wider">
            Section F — Terms & Conditions / Attestation
          </h3>
        </div>

        <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-100 text-xs font-medium text-neutral-700 leading-relaxed space-y-2">
          <p>
            By submitting this application, you attest that you understand and agree to the contractual provisions:
          </p>
          <ul className="list-disc list-inside space-y-1 text-neutral-800 font-bold">
            <li>₦500,000 Initial Deposit + ₦18,000 daily installment on business days (Mon–Fri).</li>
            <li>Mechanical faults warranty covers 2 weeks; maintenance thereafter is rider responsibility.</li>
            <li>Daily installments remain obligatory in the event of accident or downtime.</li>
            <li>1 week of continuous default leads to vehicle retrieval without refund.</li>
            <li>Disputes are subject to Oyo State, Nigeria legal jurisdiction.</li>
          </ul>
        </div>

        {/* Checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-4 cursor-pointer group">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formik.values.termsAccepted}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 w-5 h-5 accent-orange-500 rounded border-neutral-300 cursor-pointer"
            />
            <span className="text-xs font-bold text-neutral-700 group-hover:text-neutral-900 leading-relaxed">
              I have read, understood, and agree to the{' '}
              <Link
                to="/installment-terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 underline font-black hover:text-orange-600"
              >
                Novacrest Maruwa Hire-Purchase Terms and Conditions (v1.0-2026)
              </Link>{' '}
              and solemnly attest that all information and documents provided are true and accurate.
            </span>
          </label>
          {formik.touched.termsAccepted && formik.errors.termsAccepted && (
            <p className="text-[10px] font-black text-red-500 uppercase tracking-wider mt-2">
              {formik.errors.termsAccepted}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;
