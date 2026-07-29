import React from 'react';
import { FaUser } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Input from '../Input';

const RiderPersonalInfoStep = ({
  formik,
  profilePicture,
  handleProfilePictureChange,
  startCamera,
  showCameraModal,
  videoRef,
  canvasRef,
  captureImage,
  stopCamera
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-24 md:w-28 h-24 md:h-28 bg-neutral-800 border-2 border-orange-500/40 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-orange-500/10">
          {profilePicture ? (
            <img
              src={typeof profilePicture === 'string' ? profilePicture : URL.createObjectURL(profilePicture)}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <FaUser className="text-3xl md:text-4xl text-neutral-500" />
          )}
        </div>
        <div className="flex justify-center space-x-3">
          <button
            type="button"
            onClick={startCamera}
            className="bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-orange-600 transition-all shadow-md shadow-orange-500/20 active:scale-95"
          >
            Take Photo
          </button>
          <button
            type="button"
            onClick={() => document.getElementById('file-input').click()}
            className="bg-white/10 text-white border border-white/10 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white/20 transition-all active:scale-95"
          >
            Upload Photo
          </button>
        </div>
        {showCameraModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-neutral-900 border border-white/10 p-6 rounded-3xl max-w-md w-full shadow-2xl">
              <h3 className="text-base font-black uppercase tracking-wider mb-4 text-center text-white">
                Take Profile Photo
              </h3>
              <div className="relative mb-6 rounded-2xl overflow-hidden border border-white/10 bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-64 bg-neutral-950 object-cover"
                  onLoadedMetadata={() => {
                    if (videoRef.current) {
                      videoRef.current.play().catch(console.error);
                    }
                  }}
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={captureImage}
                  className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-orange-500/25"
                >
                  Capture
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="bg-neutral-800 text-neutral-300 border border-white/5 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-neutral-700 active:scale-95 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleProfilePictureChange}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          required
          value={formik.values.firstname}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="firstname"
          error={formik.touched.firstname && formik.errors.firstname}
        />
        <Input
          label="Last Name"
          required
          value={formik.values.lastname}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="lastname"
          error={formik.touched.lastname && formik.errors.lastname}
        />
      </div>

      <Input
        label="Phone Number"
        required
        type="tel"
        value={formik.values.phone}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        name="phone"
        error={formik.touched.phone && formik.errors.phone}
      />

      <div className="mb-6">
        <label className="block mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
          Date of Birth <span className="text-orange-500">*</span>
        </label>
        <DatePicker
          selected={formik.values.dateOfBirth}
          onChange={(date) => formik.setFieldValue('dateOfBirth', date)}
          onBlur={formik.handleBlur}
          name="dateOfBirth"
          className="w-full px-5 py-4 rounded-[1.25rem] bg-neutral-800/40 border-2 border-neutral-800 text-white placeholder:text-neutral-600 focus:bg-neutral-800 focus:border-orange-500/50 outline-none transition-all duration-300 font-bold text-sm"
          dateFormat="yyyy-MM-dd"
          placeholderText="Select date of birth"
          showYearDropdown
          showMonthDropdown
          dropdownMode="select"
          maxDate={new Date()}
        />
        {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
          <p className="mt-2 text-[10px] font-bold text-red-500 italic uppercase tracking-wider">
            {formik.errors.dateOfBirth}
          </p>
        )}
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
          Address <span className="text-orange-500">*</span>
        </label>
        <textarea
          name="address"
          value={formik.values.address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full px-5 py-4 rounded-[1.25rem] bg-neutral-800/40 border-2 text-white placeholder:text-neutral-600 focus:bg-neutral-800 focus:border-orange-500/50 outline-none transition-all duration-300 font-bold text-sm ${
            formik.touched.address && formik.errors.address ? 'border-red-500/50 bg-red-500/5' : 'border-neutral-800'
          }`}
          rows={3}
          placeholder="Enter your full address"
        ></textarea>
        {formik.touched.address && formik.errors.address && (
          <p className="mt-2 text-[10px] font-bold text-red-500 italic uppercase tracking-wider">
            {formik.errors.address}
          </p>
        )}
      </div>

      <div className="mt-10 pt-6 border-t border-white/10">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-orange-400 mb-6">
          Next of Kin Details
        </h3>
        <div className="space-y-4">
          <Input
            label="Next of Kin Name"
            required
            value={formik.values.nextOfKinName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="nextOfKinName"
            placeholder="Full name"
            error={formik.touched.nextOfKinName && formik.errors.nextOfKinName}
          />
          <Input
            label="Next of Kin Phone Number"
            required
            type="tel"
            value={formik.values.nextOfKinPhone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="nextOfKinPhone"
            placeholder="Phone number"
            error={formik.touched.nextOfKinPhone && formik.errors.nextOfKinPhone}
          />
          <div className="mb-6">
            <label className="block mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
              Next of Kin Address <span className="text-orange-500">*</span>
            </label>
            <textarea
              name="nextOfKinAddress"
              value={formik.values.nextOfKinAddress}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-5 py-4 rounded-[1.25rem] bg-neutral-800/40 border-2 text-white placeholder:text-neutral-600 focus:bg-neutral-800 focus:border-orange-500/50 outline-none transition-all duration-300 font-bold text-sm ${
                formik.touched.nextOfKinAddress && formik.errors.nextOfKinAddress ? 'border-red-500/50 bg-red-500/5' : 'border-neutral-800'
              }`}
              rows={3}
              placeholder="Enter next of kin address"
            ></textarea>
            {formik.touched.nextOfKinAddress && formik.errors.nextOfKinAddress && (
              <p className="mt-2 text-[10px] font-bold text-red-500 italic uppercase tracking-wider">
                {formik.errors.nextOfKinAddress}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderPersonalInfoStep;




