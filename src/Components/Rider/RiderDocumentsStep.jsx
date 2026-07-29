import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Input from '../Input';

const RiderDocumentsStep = ({ formik }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Driver License Number"
          required
          value={formik.values.licenseNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="licenseNumber"
          error={formik.touched.licenseNumber && formik.errors.licenseNumber}
        />
        <div className="mb-6">
          <label className="block mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
            License Expiry Date <span className="text-orange-500">*</span>
          </label>
          <DatePicker
            selected={formik.values.licenseExpiry}
            onChange={(date) => formik.setFieldValue('licenseExpiry', date)}
            onBlur={formik.handleBlur}
            name="licenseExpiry"
            className="w-full px-5 py-4 rounded-[1.25rem] bg-neutral-800/40 border-2 border-neutral-800 text-white placeholder:text-neutral-600 focus:bg-neutral-800 focus:border-orange-500/50 outline-none transition-all duration-300 font-bold text-sm"
            dateFormat="yyyy-MM-dd"
            placeholderText="Select expiry date"
            minDate={new Date()}
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
          />
          {formik.touched.licenseExpiry && formik.errors.licenseExpiry && (
            <p className="mt-2 text-[10px] font-bold text-red-500 italic uppercase tracking-wider">
              {formik.errors.licenseExpiry}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Insurance Number"
          value={formik.values.insuranceNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="insuranceNumber"
          error={formik.touched.insuranceNumber && formik.errors.insuranceNumber}
        />
        <div className="mb-6">
          <label className="block mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
            Insurance Expiry Date
          </label>
          <DatePicker
            selected={formik.values.insuranceExpiry}
            onChange={(date) => formik.setFieldValue('insuranceExpiry', date)}
            onBlur={formik.handleBlur}
            name="insuranceExpiry"
            className="w-full px-5 py-4 rounded-[1.25rem] bg-neutral-800/40 border-2 border-neutral-800 text-white placeholder:text-neutral-600 focus:bg-neutral-800 focus:border-orange-500/50 outline-none transition-all duration-300 font-bold text-sm"
            dateFormat="yyyy-MM-dd"
            placeholderText="Select expiry date"
            minDate={new Date()}
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
          />
          {formik.touched.insuranceExpiry && formik.errors.insuranceExpiry && (
            <p className="mt-2 text-[10px] font-bold text-red-500 italic uppercase tracking-wider">
              {formik.errors.insuranceExpiry}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiderDocumentsStep;




