import React, { useState } from 'react';
import Input from '../Input';
import { FaUserCheck, FaCamera, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import api from '../../services/axios';
import { toast } from 'react-toastify';

const GuarantorsStep = ({ formik }) => {
  const [uploadingG1, setUploadingG1] = useState(false);
  const [uploadingG2, setUploadingG2] = useState(false);

  const handleGuarantorPhotoUpload = async (file, guarantorKey, setUploading) => {
    if (!file) return;
    try {
      setUploading(true);
      const token = localStorage.getItem('nvcr_tk');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('docType', 'guarantor_photo');

      const response = await api.post('/upload/document', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const url = response.data?.data?.url || response.data?.url;
      if (url) {
        formik.setFieldValue(`${guarantorKey}Photo`, url);
        toast.success(`Guarantor photograph uploaded!`);
      }
    } catch (err) {
      console.error('Guarantor photo upload error:', err);
      toast.error('Failed to upload guarantor photograph. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Guarantor 1 */}
      <div className="space-y-6 bg-neutral-50/70 p-8 rounded-[2rem] border-2 border-neutral-100 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/60 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black">1</div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-900">Section G — Guarantor 1</h3>
              <p className="text-xs font-bold text-neutral-500">First legal surety details & photograph</p>
            </div>
          </div>

          {/* Photo upload */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-neutral-200 overflow-hidden border-2 border-white shadow-md flex items-center justify-center relative">
              {formik.values.g1Photo ? (
                <img src={formik.values.g1Photo} alt="Guarantor 1" className="w-full h-full object-cover" />
              ) : (
                <FaUserCheck className="text-neutral-400 text-xl" />
              )}
            </div>
            <div>
              <input
                type="file"
                id="g1-photo"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleGuarantorPhotoUpload(e.target.files[0], 'g1', setUploadingG1)}
              />
              <label
                htmlFor="g1-photo"
                className="cursor-pointer inline-flex items-center gap-2 bg-neutral-900 hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
              >
                {uploadingG1 ? <FaSpinner className="animate-spin" /> : <FaCamera />}
                {formik.values.g1Photo ? 'Change Photo' : 'Upload Passport Photo *'}
              </label>
              {formik.touched.g1Photo && formik.errors.g1Photo && (
                <p className="text-[10px] font-bold text-red-500 mt-1">{formik.errors.g1Photo}</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            variant="light"
            value={formik.values.g1Name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="g1Name"
            error={formik.touched.g1Name && formik.errors.g1Name}
          />
          <Input
            label="Phone Number"
            type="tel"
            variant="light"
            value={formik.values.g1Phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="g1Phone"
            placeholder="08012345678"
            error={formik.touched.g1Phone && formik.errors.g1Phone}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Relationship to Rider"
            variant="light"
            value={formik.values.g1Relationship}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="g1Relationship"
            placeholder="e.g., Brother, Senior Colleague, Landlord"
            error={formik.touched.g1Relationship && formik.errors.g1Relationship}
          />
          <Input
            label="Occupation / Trade"
            variant="light"
            value={formik.values.g1Occupation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="g1Occupation"
            placeholder="e.g., Civil Servant, Trader, Engineer"
            error={formik.touched.g1Occupation && formik.errors.g1Occupation}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Residential Home Address"
            variant="light"
            value={formik.values.g1Address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="g1Address"
            error={formik.touched.g1Address && formik.errors.g1Address}
          />
          <Input
            label="Office / Business Address"
            variant="light"
            value={formik.values.g1OfficeAddress}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="g1OfficeAddress"
            error={formik.touched.g1OfficeAddress && formik.errors.g1OfficeAddress}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-200/60">
          <div>
            <label className="block mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Means of ID</label>
            <select
              name="g1MeansOfId"
              value={formik.values.g1MeansOfId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-6 py-4 rounded-[1.25rem] border-2 border-neutral-100 bg-white font-bold text-sm outline-none focus:border-orange-500/30"
            >
              <option value="national-id">National ID / NIN Slip</option>
              <option value="drivers-license">Driver's License</option>
              <option value="international-passport">International Passport</option>
              <option value="voters-card">Voter's Card</option>
            </select>
          </div>
          <Input
            label="Guarantor ID Number"
            variant="light"
            value={formik.values.g1IdNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="g1IdNumber"
            error={formik.touched.g1IdNumber && formik.errors.g1IdNumber}
          />
        </div>
      </div>

      {/* Guarantor 2 */}
      <div className="space-y-6 bg-neutral-50/70 p-8 rounded-[2rem] border-2 border-neutral-100 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/60 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-black">2</div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-900">Section H — Guarantor 2</h3>
              <p className="text-xs font-bold text-neutral-500">Second legal surety details & photograph</p>
            </div>
          </div>

          {/* Photo upload */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-neutral-200 overflow-hidden border-2 border-white shadow-md flex items-center justify-center relative">
              {formik.values.g2Photo ? (
                <img src={formik.values.g2Photo} alt="Guarantor 2" className="w-full h-full object-cover" />
              ) : (
                <FaUserCheck className="text-neutral-400 text-xl" />
              )}
            </div>
            <div>
              <input
                type="file"
                id="g2-photo"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleGuarantorPhotoUpload(e.target.files[0], 'g2', setUploadingG2)}
              />
              <label
                htmlFor="g2-photo"
                className="cursor-pointer inline-flex items-center gap-2 bg-neutral-900 hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
              >
                {uploadingG2 ? <FaSpinner className="animate-spin" /> : <FaCamera />}
                {formik.values.g2Photo ? 'Change Photo' : 'Upload Passport Photo *'}
              </label>
              {formik.touched.g2Photo && formik.errors.g2Photo && (
                <p className="text-[10px] font-bold text-red-500 mt-1">{formik.errors.g2Photo}</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            variant="light"
            value={formik.values.g2Name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="g2Name"
            error={formik.touched.g2Name && formik.errors.g2Name}
          />
          <Input
            label="Phone Number"
            type="tel"
            variant="light"
            value={formik.values.g2Phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="g2Phone"
            placeholder="08012345678"
            error={formik.touched.g2Phone && formik.errors.g2Phone}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Relationship to Rider"
            variant="light"
            value={formik.values.g2Relationship}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="g2Relationship"
            placeholder="e.g., Uncle, Community Leader, Colleague"
            error={formik.touched.g2Relationship && formik.errors.g2Relationship}
          />
          <Input
            label="Occupation / Trade"
            variant="light"
            value={formik.values.g2Occupation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="g2Occupation"
            placeholder="e.g., Businessman, Accountant, Teacher"
            error={formik.touched.g2Occupation && formik.errors.g2Occupation}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Residential Home Address"
            variant="light"
            value={formik.values.g2Address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="g2Address"
            error={formik.touched.g2Address && formik.errors.g2Address}
          />
          <Input
            label="Office / Business Address"
            variant="light"
            value={formik.values.g2OfficeAddress}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="g2OfficeAddress"
            error={formik.touched.g2OfficeAddress && formik.errors.g2OfficeAddress}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-200/60">
          <div>
            <label className="block mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Means of ID</label>
            <select
              name="g2MeansOfId"
              value={formik.values.g2MeansOfId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-6 py-4 rounded-[1.25rem] border-2 border-neutral-100 bg-white font-bold text-sm outline-none focus:border-orange-500/30"
            >
              <option value="national-id">National ID / NIN Slip</option>
              <option value="drivers-license">Driver's License</option>
              <option value="international-passport">International Passport</option>
              <option value="voters-card">Voter's Card</option>
            </select>
          </div>
          <Input
            label="Guarantor ID Number"
            variant="light"
            value={formik.values.g2IdNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="g2IdNumber"
            error={formik.touched.g2IdNumber && formik.errors.g2IdNumber}
          />
        </div>
      </div>
    </div>
  );
};

export default GuarantorsStep;
