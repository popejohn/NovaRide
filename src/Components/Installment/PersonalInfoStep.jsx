import React from 'react';
import { FaCalendarAlt, FaUserFriends, FaMapMarkerAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Input from '../Input';

/* Shared dark select style */
const darkSelect = `w-full px-6 py-5 rounded-[1.25rem] border-2 border-neutral-800 bg-neutral-800/40 
  text-white font-bold text-sm outline-none focus:border-orange-500/50 focus:bg-neutral-800 
  transition-all duration-300 placeholder:text-neutral-700 cursor-pointer`;

const SectionLabel = ({ icon: Icon, text }) => (
  <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-500 mb-6 flex items-center gap-2">
    <Icon className="text-xs" /> {text}
  </h3>
);

const PersonalInfoStep = ({ formik }) => {
  return (
    <div className="space-y-10">

      {/* Section A: Personal Information */}
      <div>
        <SectionLabel icon={FaMapMarkerAlt} text="Section A — Personal Information" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input label="First Name" value={formik.values.firstname} onChange={formik.handleChange}
            onBlur={formik.handleBlur} name="firstname"
            error={formik.touched.firstname && formik.errors.firstname} />
          <Input label="Last Name" value={formik.values.lastname} onChange={formik.handleChange}
            onBlur={formik.handleBlur} name="lastname"
            error={formik.touched.lastname && formik.errors.lastname} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input label="Phone Number" type="tel" value={formik.values.phone}
            onChange={formik.handleChange} onBlur={formik.handleBlur} name="phone"
            placeholder="08012345678" error={formik.touched.phone && formik.errors.phone} />
          <Input label="Email Address" type="email" value={formik.values.email}
            onChange={formik.handleChange} onBlur={formik.handleBlur} name="email"
            error={formik.touched.email && formik.errors.email} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Date of Birth */}
          <div className="group/input">
            <label className={`block mb-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300
              ${formik.touched.dateOfBirth && formik.errors.dateOfBirth
                ? 'text-red-500'
                : 'text-neutral-500 group-focus-within/input:text-orange-500'}`}>
              Date of Birth
            </label>
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-neutral-600">
                <FaCalendarAlt className="text-lg" />
              </div>
              <DatePicker
                selected={formik.values.dateOfBirth ? new Date(formik.values.dateOfBirth) : null}
                onChange={(d) => formik.setFieldValue('dateOfBirth', d)}
                onBlur={formik.handleBlur}
                name="dateOfBirth"
                peekNextMonth showMonthDropdown showYearDropdown dropdownMode="select"
                maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
                placeholderText="Select birth date (18+)"
                className={`w-full pl-14 pr-6 py-5 rounded-[1.25rem] border-2 transition-all duration-300 outline-none font-bold text-sm
                  bg-neutral-800/40 border-neutral-800 text-white placeholder:text-neutral-700
                  focus:bg-neutral-800 focus:border-orange-500/50
                  ${formik.touched.dateOfBirth && formik.errors.dateOfBirth ? 'border-red-500/50' : ''}`}
              />
            </div>
            {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
              <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-wider px-1">
                {formik.errors.dateOfBirth}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Gender</label>
            <select name="gender" value={formik.values.gender}
              onChange={formik.handleChange} onBlur={formik.handleBlur}
              className={darkSelect + (formik.touched.gender && formik.errors.gender ? ' border-red-500/50' : '')}>
              <option value="" className="bg-neutral-900">Select Gender</option>
              <option value="male" className="bg-neutral-900">Male</option>
              <option value="female" className="bg-neutral-900">Female</option>
            </select>
            {formik.touched.gender && formik.errors.gender && (
              <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-wider px-1">{formik.errors.gender}</p>
            )}
          </div>

          {/* Marital Status */}
          <div>
            <label className="block mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Marital Status</label>
            <select name="maritalStatus" value={formik.values.maritalStatus}
              onChange={formik.handleChange} onBlur={formik.handleBlur}
              className={darkSelect + (formik.touched.maritalStatus && formik.errors.maritalStatus ? ' border-red-500/50' : '')}>
              <option value="" className="bg-neutral-900">Select Status</option>
              <option value="single" className="bg-neutral-900">Single</option>
              <option value="married" className="bg-neutral-900">Married</option>
              <option value="divorced" className="bg-neutral-900">Divorced</option>
              <option value="widowed" className="bg-neutral-900">Widowed</option>
            </select>
            {formik.touched.maritalStatus && formik.errors.maritalStatus && (
              <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-wider px-1">{formik.errors.maritalStatus}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
          <Input label="Home Address" value={formik.values.address} onChange={formik.handleChange}
            onBlur={formik.handleBlur} name="address" placeholder="Full residential address"
            error={formik.touched.address && formik.errors.address} />
          <Input label="State of Origin" value={formik.values.stateOfOrigin}
            onChange={formik.handleChange} onBlur={formik.handleBlur} name="stateOfOrigin"
            placeholder="e.g., Oyo, Lagos" error={formik.touched.stateOfOrigin && formik.errors.stateOfOrigin} />
          <Input label="Local Govt. Area (LGA)" value={formik.values.lga}
            onChange={formik.handleChange} onBlur={formik.handleBlur} name="lga"
            placeholder="e.g., Ibadan North" error={formik.touched.lga && formik.errors.lga} />
        </div>
      </div>

      {/* Section C: Next of Kin */}
      <div className="pt-8 border-t border-white/[0.06]">
        <SectionLabel icon={FaUserFriends} text="Section C — Next of Kin Details" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input label="Next of Kin Full Name" value={formik.values.nokName}
            onChange={formik.handleChange} onBlur={formik.handleBlur} name="nokName"
            error={formik.touched.nokName && formik.errors.nokName} />
          <Input label="Relationship to Applicant" value={formik.values.nokRelationship}
            onChange={formik.handleChange} onBlur={formik.handleBlur} name="nokRelationship"
            placeholder="e.g., Spouse, Sibling, Parent"
            error={formik.touched.nokRelationship && formik.errors.nokRelationship} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input label="Next of Kin Phone" type="tel" value={formik.values.nokPhone}
            onChange={formik.handleChange} onBlur={formik.handleBlur} name="nokPhone"
            placeholder="08012345678" error={formik.touched.nokPhone && formik.errors.nokPhone} />
          <Input label="Next of Kin Address" value={formik.values.nokAddress}
            onChange={formik.handleChange} onBlur={formik.handleBlur} name="nokAddress"
            placeholder="Home address of next of kin"
            error={formik.touched.nokAddress && formik.errors.nokAddress} />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
