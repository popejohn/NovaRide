import React from 'react';
import Input from '../Input';

const VehicleDetailsStep = ({ formik }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
            Vehicle Type <span className="text-orange-500">*</span>
          </label>
          <select
            name="vehicleType"
            value={formik.values.vehicleType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-5 py-4 rounded-[1.25rem] bg-neutral-800/40 border-2 text-white outline-none focus:bg-neutral-800 focus:border-orange-500/50 transition-all duration-300 font-bold text-sm ${
              formik.touched.vehicleType && formik.errors.vehicleType ? 'border-red-500/50 bg-red-500/5' : 'border-neutral-800'
            }`}
          >
            <option value="" className="bg-neutral-900 text-neutral-400">Select vehicle type</option>
            <option value="car" className="bg-neutral-900 text-white">Car</option>
            <option value="bike" className="bg-neutral-900 text-white">Motorcycle</option>
            <option value="tricycle" className="bg-neutral-900 text-white">Tricycle</option>
          </select>
          {formik.touched.vehicleType && formik.errors.vehicleType && (
            <p className="mt-2 text-[10px] font-bold text-red-500 italic uppercase tracking-wider">
              {formik.errors.vehicleType}
            </p>
          )}
        </div>
        <Input
          label="Plate Number"
          required
          value={formik.values.plateNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="plateNumber"
          placeholder="ABC 123 XY"
          error={formik.touched.plateNumber && formik.errors.plateNumber}
        />
      </div>
    </div>
  );
};

export default VehicleDetailsStep;




