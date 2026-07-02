import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Input from '../Input';

const RiderDocumentsStep = ({ formik }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Driver License Number*"
          value={formik.values.licenseNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="licenseNumber"
          error={formik.touched.licenseNumber && formik.errors.licenseNumber}
          variant="light"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">License Expiry Date*</label>
          <DatePicker
            selected={formik.values.licenseExpiry}
            onChange={(date) => formik.setFieldValue('licenseExpiry', date)}
            onBlur={formik.handleBlur}
            name="licenseExpiry"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-0 shadow-md focus:ring-1 focus:ring-yellow-400"
            dateFormat="yyyy-MM-dd"
            placeholderText="Select expiry date"
            minDate={new Date()}
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
          />
          {formik.touched.licenseExpiry && formik.errors.licenseExpiry && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.licenseExpiry}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Insurance Number"
          value={formik.values.insuranceNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="insuranceNumber"
          error={formik.touched.insuranceNumber && formik.errors.insuranceNumber}
          variant="light"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Expiry Date</label>
          <DatePicker
            selected={formik.values.insuranceExpiry}
            onChange={(date) => formik.setFieldValue('insuranceExpiry', date)}
            onBlur={formik.handleBlur}
            name="insuranceExpiry"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-0 shadow-md focus:ring-1 focus:ring-yellow-400"
            dateFormat="yyyy-MM-dd"
            placeholderText="Select expiry date"
            minDate={new Date()}
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
          />
          {formik.touched.insuranceExpiry && formik.errors.insuranceExpiry && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.insuranceExpiry}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiderDocumentsStep;




