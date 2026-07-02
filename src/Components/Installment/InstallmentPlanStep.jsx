import React from 'react';
import { FaCalculator } from 'react-icons/fa';

const InstallmentPlanStep = ({ formik, plans }) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-10">
        <h3 className="text-xl font-black text-neutral-900 tracking-tight">Select Your Installment Plan</h3>
        <p className="text-sm text-neutral-500 font-bold max-w-sm mx-auto mt-2">Choose the plan that best fits your financial goals and repayment capacity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            onClick={() => {
              formik.setFieldValue('planName', plan.name);
              formik.setFieldValue('duration', plan.duration);
            }}
            className={`relative p-8 rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer group ${
              formik.values.planName === plan.name 
                ? 'border-orange-500 bg-orange-50 shadow-2xl shadow-orange-500/10 scale-[1.02]' 
                : 'border-neutral-100 bg-white hover:border-neutral-300 hover:shadow-xl'
            }`}
          >
            {formik.values.planName === plan.name && (
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
            
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500 ${
              formik.values.planName === plan.name ? 'bg-orange-500 text-white' : 'bg-neutral-100 text-neutral-400 group-hover:bg-neutral-200'
            }`}>
              <FaCalculator className="text-xl" />
            </div>

            <h4 className="text-lg font-black text-neutral-900 mb-2 leading-tight">{plan.name}</h4>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-2xl font-black text-orange-500">{plan.duration}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Months</span>
            </div>

            <p className="text-xs text-neutral-500 font-bold leading-relaxed mb-6">
              {plan.description}
            </p>

            <ul className="space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                  <div className="w-1 h-1 rounded-full bg-neutral-300" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {formik.touched.planName && formik.errors.planName && (
        <p className="text-center text-[10px] font-black text-red-500 uppercase tracking-widest animate-bounce mt-4">
          {formik.errors.planName}
        </p>
      )}
    </div>
  );
};

export default InstallmentPlanStep;




