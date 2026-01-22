import React, { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from 'react-toastify';
import Loader from "./Loader";

function ForgotPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      phone: "",
    },
    validationSchema: Yup.object({
      phone: Yup.string().matches(/^0\d{10}$/, "Please enter a valid phone number").required("Phone number is required"),
    }),
    onSubmit: (values) => {
      setIsLoading(true);
      axios.post("http://localhost:5000/auth/forgot-password", values)
        .then(() => {
          toast.success('Reset code has been sent to your phone number');
          setTimeout(() => {
            navigate('/login'); // or to a reset password page if exists
          }, 2000);
        })
        .catch((err) => {
          toast.error(err.response?.data?.message || 'An error occurred');
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <form onSubmit={formik.handleSubmit} className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Forgot Password</h2>
        <Input
          label="Phone Number"
          type="text"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="phone"
        />
        {formik.touched.phone && formik.errors.phone ? (
          <div className="italic text-red-600 text-sm">{formik.errors.phone}</div>
        ) : null}
        <div className="mx-auto w-3/4 mt-5">
          <Button
            type="submit"
            text={isLoading ? <Loader color={"#ffffff"} /> : "Send Reset Code"}
            classes={'rounded-md bg-gradient-to-r text-white from-teal-600 to-teal-900 font-semibold py-3 px-6 w-full shadow-lg hover:scale-105'}
            disabled={isLoading}
          />
        </div>
        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
          <Link to="/login" className="text-blue-600 hover:underline">Back to Login</Link>
        </p>
      </form>
      <ToastContainer />
    </div>
  );
}

export default ForgotPassword;