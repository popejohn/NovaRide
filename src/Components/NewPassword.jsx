import React, { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import api from '../services/axios';
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from 'react-toastify';
import Loader from "./Loader";
import { BiHide, BiShow } from "react-icons/bi";
import { motion } from 'framer-motion';

function NewPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const phone = searchParams.get("phone") || "";
  const otp = searchParams.get("otp") || "";

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .required('Password is required')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, "Must be 8+ chars with letters & numbers"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords do not match")
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
    <div className="min-h-screen flex bg-neutral-950 font-sans selection:bg-orange-500/30">

      {/* Left Hero Panel */}
      <div className="hidden lg:flex w-[45%] relative items-center justify-center p-20 overflow-hidden border-r border-neutral-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.1),transparent_70%)]" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10"
        >
          <h1 className="text-[10rem] xl:text-[12rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-800 pointer-events-none select-none">
            NOVA<br />RIDE
          </h1>
        </motion.div>
        <div className="absolute bottom-[10%] left-[10%] w-32 h-[1px] bg-gradient-to-r from-orange-500 to-transparent opacity-50" />
      </div>

      {/* Form Section */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 bg-neutral-900 lg:bg-neutral-950">
        <div className="w-full max-w-sm space-y-10">

          {/* Mobile Header */}
          <div className="lg:hidden text-center">
            <h1 className="text-4xl font-black tracking-tighter text-white">NOVA<span className="text-orange-500">RIDE</span></h1>
          </div>

          {/* Title */}
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-4xl font-black text-white tracking-tight">New Password</h2>
            <p className="text-neutral-500 font-bold text-sm tracking-wide">
              Choose a strong password to secure your account.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-8">
            <fieldset disabled={isLoading || formik.isSubmitting} className="border-0 p-0 m-0 min-w-0">
            <div className="space-y-5">

              {/* New Password */}
              <div className="relative group/pass">
                <Input
                  label="New Password"
                  name="newPassword"
                  type={showNew ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.newPassword && formik.errors.newPassword}
                />
                <button
                  type="button"
                  className="absolute right-5 top-[44px] text-neutral-600 hover:text-orange-500 transition-colors"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <BiHide size={20} /> : <BiShow size={20} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative group/pass">
                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.confirmPassword && formik.errors.confirmPassword}
                />
                <button
                  type="button"
                  className="absolute right-5 top-[44px] text-neutral-600 hover:text-orange-500 transition-colors"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <BiHide size={20} /> : <BiShow size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              text={isLoading ? <Loader color="#ffffff" /> : "Reset Password"}
              classes="w-full py-5 bg-orange-500 hover:bg-white hover:text-neutral-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-orange-500/20 transition-all duration-500 active:scale-95 border-2 border-transparent hover:border-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-orange-500 disabled:hover:text-white disabled:hover:border-transparent"
              disabled={isLoading || !formik.isValid || !formik.dirty}
            />
            </fieldset>
          </form>

          <footer className="pt-10 border-t border-neutral-800 text-center">
            <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em]">
              Remember your password?
              <Link
                to="/login"
                className="text-orange-500 hover:text-white transition-all ml-2 underline decoration-orange-500/30 underline-offset-4"
              >
                Login
              </Link>
            </p>
          </footer>

        </div>
      </div>
    </div>
  );
}

export default NewPassword;

