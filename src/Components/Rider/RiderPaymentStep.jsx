import React from 'react';
import Input from '../Input';

const RiderPaymentStep = ({ formik }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Bank Name"
          required
          value={formik.values.bankName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="bankName"
          placeholder="e.g., First Bank"
          error={formik.touched.bankName && formik.errors.bankName}
        />

        <Input
          label="Account Number"
          required
          value={formik.values.accountNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="accountNumber"
          placeholder="1234567890"
          error={formik.touched.accountNumber && formik.errors.accountNumber}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Account Name"
          required
          value={formik.values.accountName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="accountName"
          placeholder="John A. Doe"
          error={formik.touched.accountName && formik.errors.accountName}
        />

        <Input
          label="BVN"
          required
          value={formik.values.bvn}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="bvn"
          placeholder="12345678901"
          error={formik.touched.bvn && formik.errors.bvn}
        />
      </div>
    </div>
  );
};

export default RiderPaymentStep;




