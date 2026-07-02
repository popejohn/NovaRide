import React from 'react';
import { FaCalendarAlt, FaIdCard } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Input from '../Input';

const DocumentsStep = ({ formik }) => {
  return (
    <div className="space-y-6">
       <div>
          <label className="block mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">ID Type</label>
          <select
            name="idType"
            value={formik.values.idType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-8 py-5 rounded-[1.25rem] border-2 border-neutral-100 bg-neutral-50 font-bold text-sm outline-none focus:border-orange-500/30 focus:bg-white transition-all duration-300"
          >
            <option value="">Select ID Type</option>
            <option value="national-id">National ID</option>
            <option value="drivers-license">Driver's License</option>
            <option value="international-passport">International Passport</option>
          </select>
          {formik.touched.idType && formik.errors.idType && (
            <p className="mt-2 text-[10px] font-bold text-red-500 italic px-1 uppercase tracking-wider">{formik.errors.idType}</p>
          )}
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="ID Number"
          variant="light"
          value={formik.values.idNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="idNumber"
          error={formik.touched.idNumber && formik.errors.idNumber}
        />
         <div className="space-y-2 group/input">
          <label className={`block mb-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${formik.touched.idExpiry && formik.errors.idExpiry ? 'text-red-500' : 'text-neutral-400 group-focus-within/input:text-orange-600'}`}>
            ID Expiry Date
          </label>
          <div className="relative">
            <div className={`absolute left-6 top-1/2 -translate-y-1/2 z-10 transition-colors duration-300 pointer-events-none ${formik.touched.idExpiry && formik.errors.idExpiry ? 'text-red-500' : 'text-neutral-400 group-focus-within/input:text-orange-500'}`}>
              <FaCalendarAlt className="text-xl" />
            </div>
            <DatePicker
              selected={formik.values.idExpiry ? new Date(formik.values.idExpiry) : null}
              onChange={(date) => formik.setFieldValue('idExpiry', date)}
              onBlur={formik.handleBlur}
              name="idExpiry"
              minDate={new Date()}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              placeholderText="Select expiry date"
              className={`w-full pl-16 pr-8 py-5 rounded-[1.25rem] border-2 transition-all duration-300 outline-none font-bold text-sm bg-neutral-50 border-neutral-100 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-orange-500/30
                ${formik.touched.idExpiry && formik.errors.idExpiry ? 'border-red-500/50 bg-red-500/5 text-red-500' : 'hover:border-neutral-200'}
                shadow-sm group-focus-within/input:shadow-2xl group-focus-within/input:shadow-orange-500/5`}
            />
            <div className="absolute inset-0 rounded-[1.25rem] pointer-events-none transition-all duration-300 opacity-0 group-focus-within/input:opacity-100 ring-[6px] ring-orange-500/5" />
          </div>
          {formik.touched.idExpiry && formik.errors.idExpiry && (
            <p className="mt-2 text-[10px] font-bold text-red-500 italic px-1 uppercase tracking-wider">{formik.errors.idExpiry}</p>
          )}
        </div>
      </div>

      <Input
        label="Bank Verification Number (BVN)"
        variant="light"
        value={formik.values.bvn}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        name="bvn"
        placeholder="12345678901"
        error={formik.touched.bvn && formik.errors.bvn}
      />
      <div className="bg-orange-50 p-6 rounded-2xl flex items-start gap-4 text-[11px] font-bold text-orange-800 leading-relaxed border border-orange-100/50">
        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
          <FaIdCard className="text-orange-600" />
        </div>
        <p>Your BVN is required only for identity verification and is subject to confirmation via the Central Bank of Nigeria's secured protocols. We prioritize your privacy and data security.</p>
      </div>
      
      <Input
        label="National Identification Number (NIN)"
        variant="light"
        value={formik.values.nin}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        name="nin"
        placeholder="12345678901"
        error={formik.touched.nin && formik.errors.nin}
      />
      <div className="bg-neutral-50 p-6 rounded-2xl flex items-start gap-4 text-[11px] font-bold text-neutral-600 leading-relaxed border border-neutral-100">
         <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center shrink-0">
          <FaIdCard className="text-neutral-500" />
        </div>
        <p>Your NIN is subject to confirmation via the NIMC portal. Ensure the number matches exactly as it appears on your slip or card.</p>
      </div>
    </div>
  );
};

export default DocumentsStep;




