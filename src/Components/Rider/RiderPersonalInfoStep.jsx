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
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-20 md:w-24 h-20 md:h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
          {profilePicture ? (
            <img
              src={typeof profilePicture === 'string' ? profilePicture : URL.createObjectURL(profilePicture)}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <FaUser className="text-2xl md:text-3xl text-gray-400" />
          )}
        </div>
        <div className="flex justify-center space-x-4">
          <button onClick={startCamera} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Take Photo
          </button>
          <button onClick={() => document.getElementById('file-input').click()} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Upload Photo
          </button>
        </div>
        {showCameraModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4 text-center">Take Photo</h3>
              <div className="relative mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-64 bg-gray-200 rounded"
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
                  onClick={captureImage}
                  className="bg-yellow-400 text-black px-6 py-2 rounded font-semibold hover:bg-yellow-500"
                >
                  Capture
                </button>
                <button
                  onClick={stopCamera}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
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
          label="First Name*"
          value={formik.values.firstname}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="firstname"
          error={formik.touched.firstname && formik.errors.firstname}
          variant="light"
        />
        <Input
          label="Last Name*"
          value={formik.values.lastname}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="lastname"
          error={formik.touched.lastname && formik.errors.lastname}
          variant="light"
        />
      </div>

      <Input
        label="Phone Number*"
        type="tel"
        value={formik.values.phone}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        name="phone"
        error={formik.touched.phone && formik.errors.phone}
        variant="light"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth*</label>
        <DatePicker
          selected={formik.values.dateOfBirth}
          onChange={(date) => formik.setFieldValue('dateOfBirth', date)}
          onBlur={formik.handleBlur}
          name="dateOfBirth"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-0 shadow-md focus:ring-1 focus:ring-yellow-400"
          dateFormat="yyyy-MM-dd"
          placeholderText="Select date of birth"
          showYearDropdown
          showMonthDropdown
          dropdownMode="select"
          maxDate={new Date()}
        />
        {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.dateOfBirth}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
        <textarea
          name="address"
          value={formik.values.address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full px-4 py-2 rounded-lg border outline-0 shadow-md focus:ring-1 focus:ring-yellow-400 ${formik.touched.address && formik.errors.address ? 'border-red-500' : 'border-gray-300'}`}
          rows={3}
          placeholder="Enter your full address"
        ></textarea>
        {formik.touched.address && formik.errors.address && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.address}</p>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Next of Kin Details</h3>
        <div className="space-y-4">
          <Input
            label="Next of Kin Name*"
            value={formik.values.nextOfKinName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="nextOfKinName"
            placeholder="Full name"
            error={formik.touched.nextOfKinName && formik.errors.nextOfKinName}
            variant="light"
          />
          <Input
            label="Next of Kin Phone Number*"
            type="tel"
            value={formik.values.nextOfKinPhone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="nextOfKinPhone"
            placeholder="Phone number"
            error={formik.touched.nextOfKinPhone && formik.errors.nextOfKinPhone}
            variant="light"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Next of Kin Address*</label>
            <textarea
              name="nextOfKinAddress"
              value={formik.values.nextOfKinAddress}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 rounded-lg border outline-0 shadow-md focus:ring-1 focus:ring-yellow-400 ${formik.touched.nextOfKinAddress && formik.errors.nextOfKinAddress ? 'border-red-500' : 'border-gray-300'}`}
              rows={3}
              placeholder="Enter next of kin address"
            ></textarea>
            {formik.touched.nextOfKinAddress && formik.errors.nextOfKinAddress && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.nextOfKinAddress}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderPersonalInfoStep;
