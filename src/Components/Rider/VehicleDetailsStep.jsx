import React from 'react';
import Input from '../Input';

const VehicleDetailsStep = ({ formik }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type*</label>
          <select
            name="vehicleType"
            value={formik.values.vehicleType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-2 rounded-lg border outline-0 shadow-md focus:ring-1 focus:ring-yellow-400 ${formik.touched.vehicleType && formik.errors.vehicleType ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select vehicle type</option>
            <option value="car">Car</option>
            <option value="bike">Motorcycle</option>
            <option value="tricycle">Tricycle</option>
          </select>
          {formik.touched.vehicleType && formik.errors.vehicleType && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.vehicleType}</p>
          )}
        </div>
        <Input
          label="Plate Number*"
          value={formik.values.plateNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="plateNumber"
          placeholder="ABC 123 XY"
          error={formik.touched.plateNumber && formik.errors.plateNumber}
          variant="light"
        />
      </div>
    </div>
  );
};

export default VehicleDetailsStep;
