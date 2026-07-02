import React from 'react';
import { FaUser, FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Input from '../Input';

const PersonalInfoStep = ({ formik, profilePicture, onProfilePictureChange }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-10 group">
        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all duration-500" />
          <div className="relative w-full h-full bg-neutral-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-xl">
            {profilePicture ? (
              <img src={URL.createObjectURL(profilePicture)} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            ) : (
              <FaUser className="text-4xl text-neutral-300" />
            )}
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={onProfilePictureChange}
          className="hidden"
          id="profile-picture"
        />
        <label 
          htmlFor="profile-picture" 
          className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-2.5 rounded-xl cursor-pointer hover:bg-neutral-800 transition-all active:scale-95 font-black text-[10px] uppercase tracking-widest"
        >
          Change Photo
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          variant="light"
          value={formik.values.firstname}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="firstname"
          error={formik.touched.firstname && formik.errors.firstname}
        />
        <Input
          label="Last Name"
          variant="light"
          value={formik.values.lastname}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="lastname"
          error={formik.touched.lastname && formik.errors.lastname}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Phone Number"
          type="tel"
          variant="light"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="phone"
          error={formik.touched.phone && formik.errors.phone}
        />
        <Input
          label="Email Address"
          type="email"
          variant="light"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="email"
          error={formik.touched.email && formik.errors.email}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 group/input">
          <label className={`block mb-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${formik.touched.dateOfBirth && formik.errors.dateOfBirth ? 'text-red-500' : 'text-neutral-400 group-focus-within/input:text-orange-600'}`}>
            Date of Birth
          </label>
          <div className="relative">
            <div className={`absolute left-6 top-1/2 -translate-y-1/2 z-10 transition-colors duration-300 pointer-events-none ${formik.touched.dateOfBirth && formik.errors.dateOfBirth ? 'text-red-500' : 'text-neutral-400 group-focus-within/input:text-orange-500'}`}>
              <FaCalendarAlt className="text-xl" />
            </div>
            <DatePicker
              selected={formik.values.dateOfBirth ? new Date(formik.values.dateOfBirth) : null}
              onChange={(date) => formik.setFieldValue('dateOfBirth', date)}
              onBlur={formik.handleBlur}
              name="dateOfBirth"
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              placeholderText="Select birth date"
              className={`w-full pl-16 pr-8 py-5 rounded-[1.25rem] border-2 transition-all duration-300 outline-none font-bold text-sm bg-neutral-50 border-neutral-100 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-orange-500/30
                ${formik.touched.dateOfBirth && formik.errors.dateOfBirth ? 'border-red-500/50 bg-red-500/5 text-red-500' : 'hover:border-neutral-200'}
                shadow-sm group-focus-within/input:shadow-2xl group-focus-within/input:shadow-orange-500/5`}
            />
            <div className="absolute inset-0 rounded-[1.25rem] pointer-events-none transition-all duration-300 opacity-0 group-focus-within/input:opacity-100 ring-[6px] ring-orange-500/5" />
          </div>
          {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
            <p className="mt-2 text-[10px] font-bold text-red-500 italic px-1 uppercase tracking-wider">{formik.errors.dateOfBirth}</p>
          )}
        </div>
        <div>
          <label className="block mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Gender</label>
          <select
            name="gender"
            value={formik.values.gender}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-8 py-5 rounded-[1.25rem] border-2 border-neutral-100 bg-neutral-50 font-bold text-sm outline-none focus:border-orange-500/30 focus:bg-white transition-all duration-300"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {formik.touched.gender && formik.errors.gender && (
            <p className="mt-2 text-[10px] font-bold text-red-500 italic px-1 uppercase tracking-wider">{formik.errors.gender}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Marital Status</label>
          <select
            name="maritalStatus"
            value={formik.values.maritalStatus}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-8 py-5 rounded-[1.25rem] border-2 border-neutral-100 bg-neutral-50 font-bold text-sm outline-none focus:border-orange-500/30 focus:bg-white transition-all duration-300"
          >
            <option value="">Select Status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
          {formik.touched.maritalStatus && formik.errors.maritalStatus && (
            <p className="mt-2 text-[10px] font-bold text-red-500 italic px-1 uppercase tracking-wider">{formik.errors.maritalStatus}</p>
          )}
        </div>
        <Input
          label="City"
          variant="light"
          value={formik.values.city}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="city"
          error={formik.touched.city && formik.errors.city}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="State"
          variant="light"
          value={formik.values.state}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="state"
          error={formik.touched.state && formik.errors.state}
        />
        <div className="md:col-span-1">
          <label className="block mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Address</label>
          <textarea
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-8 py-5 rounded-[1.25rem] border-2 border-neutral-100 bg-neutral-50 font-bold text-sm outline-none focus:border-orange-500/30 focus:bg-white transition-all duration-300 min-h-[100px]"
            placeholder="Enter your full address"
          />
           {formik.touched.address && formik.errors.address && (
            <p className="mt-2 text-[10px] font-bold text-red-500 italic px-1 uppercase tracking-wider">{formik.errors.address}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;




