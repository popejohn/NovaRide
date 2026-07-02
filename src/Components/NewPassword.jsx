import React, { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import api from '../services/axios';
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from 'react-toastify';
import Loader from "./Loader";

function NewPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const phone = searchParams.get("phone") || "";
  const otp = searchParams.get("otp") || "";

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Please confirm your password"),
    }),
    onSubmit: async (values) => {
      if (!phone || !otp) {
        toast.error("Missing reset session. Please request a new code.");
        return;
      }
      setIsLoading(true);
      try {
        const resp = await api.post('/auth/verify-reset-otp', {
          phone,
          otp,
          newPassword: values.newPassword,
        });

        toast.success(resp?.data?.message || 'Password reset successfully.');
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } catch (err) {
        toast.error(err.response?.data?.message || 'An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <form 
        onSubmit={formik.handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Create New Password
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
          Please enter and confirm your new password below.
        </p>

        <div className="space-y-4">
          <div>
            <Input
              label="New Password"
              type="password"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="newPassword"
              placeholder="••••••••"
            />
            {formik.touched.newPassword && formik.errors.newPassword ? (
              <div className="italic text-red-600 text-sm mt-1">{formik.errors.newPassword}</div>
            ) : null}
          </div>

          <div>
            <Input
              label="Confirm Password"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="confirmPassword"
              placeholder="••••••••"
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="italic text-red-600 text-sm mt-1">{formik.errors.confirmPassword}</div>
            ) : null}
          </div>
        </div>

        <div className="mx-auto w-3/4 mt-8">
          <Button
            type="submit"
            text={isLoading ? <Loader color={"#ffffff"} /> : "Reset Password"}
            classes={'rounded-md bg-gradient-to-r text-white from-teal-600 to-teal-900 font-semibold py-3 px-6 w-full shadow-lg hover:scale-105'}
            disabled={isLoading}
          />
        </div>

        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
          <Link to="/login" className="text-blue-600 hover:underline">Back to Login</Link>
        </p>
      </form>
    </div>
  );
}

export default NewPassword;






