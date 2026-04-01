import React from 'react';
import Input from '../Input';

const RiderPaymentStep = ({ formik }) => {
  return (
    <div className="space-y-4">
       <Input
        label="Bank Name*"
        value={formik.values.bankName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        name="bankName"
        placeholder="e.g., First Bank"
        error={formik.touched.bankName && formik.errors.bankName}
        variant="light"
      />

      <Input
        label="Account Number*"
        value={formik.values.accountNumber}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        name="accountNumber"
        placeholder="1234567890"
        error={formik.touched.accountNumber && formik.errors.accountNumber}
        variant="light"
      />

      <Input
        label="Account Name*"
        value={formik.values.accountName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        name="accountName"
        placeholder="John A. Doe"
        error={formik.touched.accountName && formik.errors.accountName}
        variant="light"
      />

      <Input
        label="BVN*"
        value={formik.values.bvn}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        name="bvn"
        placeholder="12345678901"
        error={formik.touched.bvn && formik.errors.bvn}
        variant="light"
      />
    </div>
  );
};

export default RiderPaymentStep;
