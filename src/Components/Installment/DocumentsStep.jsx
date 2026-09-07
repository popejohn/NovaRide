import React, { useState } from 'react';
import { FaIdCard, FaUpload, FaCheckCircle, FaSpinner, FaUser, FaFileAlt } from 'react-icons/fa';
import Input from '../Input';
import api from '../../services/axios';
import { toast } from 'react-toastify';

const DocumentsStep = ({ formik }) => {
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingIdDoc, setUploadingIdDoc] = useState(false);
  const [uploadingLicenseDoc, setUploadingLicenseDoc] = useState(false);

  const handleFileUpload = async (file, fieldKey, docType, setUploading) => {
    if (!file) return;
    try {
      setUploading(true);
      const token = localStorage.getItem('nvcr_tk');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('docType', docType);

      const response = await api.post('/upload/document', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const url = response.data?.data?.url || response.data?.url;
      if (url) {
        formik.setFieldValue(fieldKey, url);
        toast.success('Document uploaded successfully!');
      }
    } catch (err) {
      console.error('File upload error:', err);
      toast.error('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Applicant Passport Photograph */}
      <div className="bg-neutral-50/70 p-6 rounded-2xl border-2 border-neutral-100 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-2xl bg-neutral-200 overflow-hidden border-2 border-white shadow-lg flex items-center justify-center shrink-0">
          {formik.values.applicantPhotoUrl ? (
            <img src={formik.values.applicantPhotoUrl} alt="Applicant" className="w-full h-full object-cover" />
          ) : (
            <FaUser className="text-3xl text-neutral-400" />
          )}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h4 className="text-sm font-black text-neutral-900 uppercase tracking-wider mb-1">
            Applicant Passport Photograph <span className="text-orange-500">*</span>
          </h4>
          <p className="text-xs font-bold text-neutral-500 mb-3">
            Clear headshot on a neutral background. Maximum size 5MB.
          </p>
          <input
            type="file"
            id="applicant-photo"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files[0], 'applicantPhotoUrl', 'applicant_photo', setUploadingPhoto)}
          />
          <label
            htmlFor="applicant-photo"
            className="cursor-pointer inline-flex items-center gap-2 bg-neutral-900 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
          >
            {uploadingPhoto ? <FaSpinner className="animate-spin" /> : (formik.values.applicantPhotoUrl ? <FaCheckCircle /> : <FaUpload />)}
            {formik.values.applicantPhotoUrl ? 'Replace Photo' : 'Upload Passport Photo'}
          </label>
          {formik.touched.applicantPhotoUrl && formik.errors.applicantPhotoUrl && (
            <p className="text-[10px] font-bold text-red-500 mt-2">{formik.errors.applicantPhotoUrl}</p>
          )}
        </div>
      </div>

      {/* ID Selection & Upload */}
      <div className="bg-neutral-50/70 p-6 rounded-2xl border-2 border-neutral-100 space-y-6">
        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-orange-500 flex items-center gap-2">
          <FaIdCard /> Government-Issued Identification Document
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Means of ID *</label>
            <select
              name="idType"
              value={formik.values.idType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-6 py-4 rounded-[1.25rem] border-2 border-neutral-100 bg-white font-bold text-sm outline-none focus:border-orange-500/30"
            >
              <option value="">Select ID Type</option>
              <option value="national-id">National Identification Number (NIN / Slip / Card)</option>
              <option value="drivers-license">Driver's License</option>
              <option value="international-passport">International Passport</option>
              <option value="voters-card">Voter's Card</option>
            </select>
            {formik.touched.idType && formik.errors.idType && (
              <p className="mt-2 text-[10px] font-bold text-red-500 italic px-1 uppercase tracking-wider">{formik.errors.idType}</p>
            )}
          </div>

          <Input
            label="ID / Document Number *"
            variant="light"
            value={formik.values.idNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="idNumber"
            placeholder="e.g. 12345678901"
            error={formik.touched.idNumber && formik.errors.idNumber}
          />
        </div>

        {/* Upload government ID document */}
        <div className="p-4 bg-white rounded-xl border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FaFileAlt className="text-2xl text-orange-500" />
            <div>
              <p className="text-xs font-black text-neutral-900">Upload Valid ID Document (Image or PDF) *</p>
              <p className="text-[10px] font-bold text-neutral-500">Corresponding to the ID selected above</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="file"
              id="id-doc"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files[0], 'idDocumentUrl', 'government_id', setUploadingIdDoc)}
            />
            <label
              htmlFor="id-doc"
              className="cursor-pointer inline-flex items-center gap-2 bg-neutral-900 hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
            >
              {uploadingIdDoc ? <FaSpinner className="animate-spin" /> : (formik.values.idDocumentUrl ? <FaCheckCircle /> : <FaUpload />)}
              {formik.values.idDocumentUrl ? 'Uploaded ✓ (Click to change)' : 'Upload Document'}
            </label>
          </div>
        </div>
        {formik.touched.idDocumentUrl && formik.errors.idDocumentUrl && (
          <p className="text-[10px] font-bold text-red-500">{formik.errors.idDocumentUrl}</p>
        )}
      </div>

      {/* Driver's license document upload if provided */}
      <div className="bg-neutral-50/70 p-6 rounded-2xl border-2 border-neutral-100 space-y-6">
        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-600">
          Driver's License (Optional / Where Applicable)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Driver's License Number"
            variant="light"
            value={formik.values.driverLicenseNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="driverLicenseNumber"
            placeholder="e.g. OYO12345AA00"
            error={formik.touched.driverLicenseNumber && formik.errors.driverLicenseNumber}
          />
          <div className="flex flex-col justify-end">
            <input
              type="file"
              id="driver-license-doc"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files[0], 'driverLicenseUrl', 'drivers_license', setUploadingLicenseDoc)}
            />
            <label
              htmlFor="driver-license-doc"
              className="cursor-pointer w-full py-4 rounded-[1.25rem] border-2 border-dashed border-neutral-300 hover:border-orange-500 text-neutral-600 hover:text-orange-500 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-all bg-white"
            >
              {uploadingLicenseDoc ? <FaSpinner className="animate-spin" /> : (formik.values.driverLicenseUrl ? <FaCheckCircle className="text-green-600" /> : <FaUpload />)}
              {formik.values.driverLicenseUrl ? 'Driver License Uploaded ✓' : "Upload Driver's License Document"}
            </label>
          </div>
        </div>
      </div>

      {/* BVN & NIN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Bank Verification Number (BVN) *"
          variant="light"
          value={formik.values.bvn}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="bvn"
          placeholder="11-digit BVN"
          error={formik.touched.bvn && formik.errors.bvn}
        />
        <Input
          label="National Identification Number (NIN) *"
          variant="light"
          value={formik.values.nin}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="nin"
          placeholder="11-digit NIN"
          error={formik.touched.nin && formik.errors.nin}
        />
      </div>
    </div>
  );
};

export default DocumentsStep;
