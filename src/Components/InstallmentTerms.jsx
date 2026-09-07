import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import OtherNav from './VerifiedNav';
import { useSelector } from 'react-redux';
import { FaFileContract, FaArrowLeft, FaShieldAlt, FaGavel, FaExclamationTriangle } from 'react-icons/fa';

const InstallmentTerms = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.verifiedUser);

  return (
    <div className="min-h-screen bg-stone-50 text-neutral-900 selection:bg-orange-500 selection:text-white">
      {isAuthenticated && (
        <Navbar userrole={user?.role} userverified={true} profilePic={user?.profilePic} nav={<OtherNav userrole={user?.role} />} />
      )}

      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-500 hover:text-orange-500 mb-8 transition-colors"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="bg-white rounded-[2.5rem] border border-neutral-200/80 shadow-2xl p-8 md:p-14 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none" />

          {/* Header */}
          <div className="border-b border-neutral-100 pb-8 mb-10">
            <div className="inline-flex items-center gap-2 bg-orange-100/80 text-orange-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4">
              <FaShieldAlt /> Version 1.0 (2026)
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-neutral-900 mb-3">
              Novacrest Rider / Tricycle (Maruwa) <br />
              <span className="text-orange-500">Hire-Purchase & Installment Agreement</span>
            </h1>
            <p className="text-neutral-500 font-bold text-sm">
              Please read these terms and conditions carefully before completing your application.
            </p>
          </div>

          {/* Agreement Sections */}
          <div className="space-y-8 text-neutral-700 text-sm leading-relaxed">
            <section className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
              <h2 className="text-base font-black text-neutral-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <FaFileContract className="text-orange-500" /> 1. Financial Commitment & Repayment Plan
              </h2>
              <ul className="list-disc list-inside space-y-2 font-medium text-neutral-800">
                <li><strong>Total Contract Target Amount:</strong> ₦7,500,000 (Seven Million Five Hundred Thousand Naira).</li>
                <li><strong>Initial Deposit:</strong> ₦500,000 (Five Hundred Thousand Naira), payable upon application approval before vehicle handover.</li>
                <li><strong>Remaining Balance:</strong> ₦7,000,000 (Seven Million Naira).</li>
                <li><strong>Daily Scheduled Installment:</strong> ₦18,000 (Eighteen Thousand Naira) due on business days (Monday through Friday).</li>
                <li><strong>Weekend Policy:</strong> No scheduled installment payments are due on Saturdays or Sundays.</li>
                <li><strong>Contract Duration:</strong> 389 business days (388 payments of ₦18,000 + 1 final adjusted payment of ₦16,000). Total paid will never exceed ₦7,500,000.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-black text-neutral-900 uppercase tracking-wider">
                2. Mechanical Faults & Maintenance
              </h2>
              <p>
                The company covers certified factory faults within the first <strong>two (2) weeks</strong> from the date of handover. Following this two-week warranty period, the rider/partner assumes full responsibility for regular maintenance, mechanical repairs, servicing, and replacement parts.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-black text-neutral-900 uppercase tracking-wider">
                3. Accidents, Damage & Continuing Payments
              </h2>
              <p>
                In the event of an accident, collision, impoundment, or damage to the vehicle, the rider/partner is solely liable for repair costs and legal liabilities. <strong>The obligation to make daily scheduled payments remains active and continuous</strong> regardless of vehicle downtime or repair status.
              </p>
            </section>

            <section className="bg-red-50/60 p-6 rounded-2xl border border-red-100 space-y-3">
              <h2 className="text-base font-black text-red-900 uppercase tracking-wider flex items-center gap-2">
                <FaExclamationTriangle className="text-red-500" /> 4. Default, Non-Payment & Vehicle Retrieval
              </h2>
              <p className="text-red-950 font-medium">
                Payments must be completed prior to the daily <strong>8:00 PM WAT</strong> cutoff. Failure to pay on scheduled business days marks the installment as overdue.
              </p>
              <p className="text-red-900 font-bold">
                As stipulated in the Novacrest Hire-Purchase policy: <strong>One (1) week of continuous non-payment / default will lead to immediate retrieval and repossession of the vehicle without refund of previous payments or deposit.</strong>
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-black text-neutral-900 uppercase tracking-wider">
                5. Road & Safety Compliance
              </h2>
              <p>
                The rider agrees to strictly comply with all federal, state, and local road transport and safety regulations, including driving licenses, route restrictions, vehicle licensing, and traffic laws. Any fines or penalties incurred are the exclusive liability of the rider.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-black text-neutral-900 uppercase tracking-wider">
                6. Guarantors' Joint & Several Liability
              </h2>
              <p>
                The two (2) guarantors supplied during profile setup agree to act as legal sureties. In the event of default, absconding, or unrecovered damage, guarantors are jointly and severally liable for all outstanding contractual obligations.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-black text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                <FaGavel className="text-neutral-900" /> 7. Governing Law & Jurisdiction
              </h2>
              <p>
                This agreement and any dispute or claim arising out of or in connection with it shall be governed by and construed in accordance with the laws of <strong>Oyo State, Federal Republic of Nigeria</strong>.
              </p>
            </section>

            <section className="bg-neutral-900 text-white p-6 rounded-2xl space-y-2">
              <h2 className="text-sm font-black uppercase tracking-widest text-orange-400">
                8. Rider Attestation & Confirmation
              </h2>
              <p className="text-xs text-neutral-300 leading-relaxed">
                By ticking "I agree to the Terms and Conditions" on the application form and submitting your profile, you solemnly swear and confirm that all information, documents, and guarantor details provided are true, complete, and accurate, and you unconditionally agree to abide by all the provisions of this agreement.
              </p>
            </section>
          </div>

          {/* Footer Back Button */}
          <div className="mt-12 pt-8 border-t border-neutral-100 flex justify-end">
            <button
              onClick={() => navigate(-1)}
              className="px-8 py-4 bg-neutral-900 hover:bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl"
            >
              I Understand & Return
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallmentTerms;
