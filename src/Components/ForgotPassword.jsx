import React, { useEffect, useState } from "react";
import Button from "./Button";
import Input from "./Input";
import { useNavigate, Link } from "react-router-dom";
import api from '../services/axios';
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from 'react-toastify';
import Loader from "./Loader";
import { IoRefresh } from 'react-icons/io5';
import { motion } from 'framer-motion';

function ForgotPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpExpiresAt, setOtpExpiresAt] = useState(null);
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  const [otpVerifying, setOtpVerifying] = useState(false);

  const canResendOtp = countdownSeconds <= 0 && !!otpExpiresAt;

  const resendOtp = async () => {
    if (!phoneNumber) return;
    setIsLoading(true);
    try {
      const resp = await api.post('/auth/resend-otp', { phone: phoneNumber });
      const data = resp?.data?.data || resp?.data || {};
      if (data?.expiresAt) {
        setOtpExpiresAt(new Date(data.expiresAt));
        setCountdownSeconds(Number(data.expiresInSeconds) || 0);
      }
      toast.success('OTP resent successfully.');
      setOtpExpiresAt(prev => prev);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const phoneFormik = useFormik({
    initialValues: { phone: "" },
    validationSchema: Yup.object({
      phone: Yup.string()
        .matches(/^0\d{10}$/, "Please enter a valid phone number")
        .required("Phone number is required"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const resp = await api.post('/auth/forgot-password', { phone: values.phone });
        toast.success('OTP sent to your phone number');
        const data = resp?.data?.data || resp?.data || {};
        if (data?.expiresAt) {
          setOtpExpiresAt(new Date(data.expiresAt));
          setCountdownSeconds(Number(data.expiresInSeconds) || 0);
        }
        setPhoneNumber(values.phone);
        setStep(2);
      } catch (err) {
        toast.error(err.response?.data?.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    },
  });

  React.useEffect(() => {
    if (!otpExpiresAt) return;
    const tick = () => {
      const diffMs = otpExpiresAt.getTime() - Date.now();
      const remaining = Math.max(0, Math.floor(diffMs / 1000));
      setCountdownSeconds(remaining);
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [otpExpiresAt]);

  const otpFormik = useFormik({
    initialValues: { otp: "" },
    validationSchema: Yup.object({
      otp: Yup.string().required("OTP is required"),
    }),
    onSubmit: async (values) => {
      if (otpVerifying) return;
      setOtpVerifying(true);
      try {
        const resp = await api.post('/auth/verify-otp', {
          phone: phoneNumber,
          otp: values.otp,
        });
        toast.success(resp?.data?.message || 'OTP verified successfully.');
        setTimeout(() => {
          navigate(`/new-password?phone=${encodeURIComponent(phoneNumber)}&otp=${encodeURIComponent(values.otp)}`);
        }, 500);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Invalid or expired OTP. Please resend.');
        setOtpVerifying(false);
        otpFormik.setFieldValue('otp', '');
      } finally {
        setOtpVerifying(false);
      }
    },
  });

  useEffect(() => {
    const otp = otpFormik.values.otp;
    if (otp && otp.length === 6) {
      otpFormik.handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpFormik.values.otp]);

  const mm = String(Math.floor(countdownSeconds / 60)).padStart(2, '0');
  const ss = String(countdownSeconds % 60).padStart(2, '0');

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

          {/* Title block */}
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-2 text-center lg:text-left"
          >
            <h2 className="text-4xl font-black text-white tracking-tight">
              {step === 1 ? 'Reset Password' : 'Enter OTP'}
            </h2>
            <p className="text-neutral-500 font-bold text-sm tracking-wide">
              {step === 1
                ? 'Enter your phone number to receive a reset code.'
                : `Code sent to ${phoneNumber}. Enter all 6 digits.`}
            </p>
          </motion.div>

          <form
            onSubmit={step === 1 ? phoneFormik.handleSubmit : otpFormik.handleSubmit}
            className="space-y-8"
          >
            {step === 1 ? (
              <div className="space-y-6">
                <Input
                  label="Phone Number"
                  type="text"
                  name="phone"
                  placeholder="08012345678"
                  required
                  value={phoneFormik.values.phone}
                  onChange={phoneFormik.handleChange}
                  onBlur={phoneFormik.handleBlur}
                  error={phoneFormik.touched.phone && phoneFormik.errors.phone}
                />

                <Button
                  type="submit"
                  text={isLoading ? <Loader color="#ffffff" /> : "Send Reset Code"}
                  classes="w-full py-5 bg-orange-500 hover:bg-white hover:text-neutral-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-orange-500/20 transition-all duration-500 active:scale-95 border-2 border-transparent hover:border-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-orange-500 disabled:hover:text-white disabled:hover:border-transparent"
                  disabled={isLoading || !phoneFormik.isValid || !phoneFormik.dirty}
                />
              </div>
            ) : (
              <div className="space-y-6">

                {/* Countdown badge */}
                <div className="flex justify-center">
                  {countdownSeconds > 0 ? (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800 border border-neutral-700 text-[11px] font-black uppercase tracking-widest text-neutral-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse inline-block" />
                      Expires in <span className="text-orange-500">{mm}:{ss}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-[11px] font-black uppercase tracking-widest text-red-400">
                      OTP Expired
                    </span>
                  )}
                </div>

                {/* OTP digit boxes */}
                <div className="relative">
                  <div className="flex items-center justify-between gap-2">
                    {Array.from({ length: 6 }).map((_, idx) => {
                      const digit = otpFormik.values.otp[idx] || "";
                      const isFilled = !!digit;
                      return (
                        <input
                          key={idx}
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          aria-label={`OTP digit ${idx + 1}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          className={`w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-black rounded-2xl border-2 outline-none transition-all duration-200 bg-neutral-900 text-white
                            ${isFilled
                              ? 'border-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.25)]'
                              : 'border-neutral-700 focus:border-orange-500/70'
                            }`}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            const onlyDigits = e.target.value.replace(/\D/g, "");
                            if (!onlyDigits) {
                              const nextOtp = otpFormik.values.otp.padEnd(6, " ").split("");
                              nextOtp[idx] = "";
                              const cleaned = nextOtp.join("").replace(/\s/g, "");
                              otpFormik.setFieldValue("otp", cleaned.slice(0, 6));
                              return;
                            }
                            const digitsToInsert = onlyDigits.slice(0, 6 - idx);
                            const otpArr = otpFormik.values.otp.padEnd(6, " ").split("");
                            for (let i = 0; i < digitsToInsert.length; i++) {
                              otpArr[idx + i] = digitsToInsert[i];
                            }
                            const nextOtp = otpArr.join("").replace(/\s/g, "");
                            otpFormik.setFieldValue("otp", nextOtp.slice(0, 6));
                            if (digitsToInsert.length === 1) {
                              const nextEl = e.currentTarget.form?.querySelector(`input[aria-label='OTP digit ${idx + 2}']`);
                              if (nextEl) nextEl.focus();
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Backspace") {
                              if (!otpFormik.values.otp[idx]) {
                                const prevIdx = idx - 1;
                                if (prevIdx >= 0) {
                                  const otpArr = otpFormik.values.otp.padEnd(6, " ").split("");
                                  otpArr[prevIdx] = "";
                                  const cleaned = otpArr.join("").replace(/\s/g, "");
                                  otpFormik.setFieldValue("otp", cleaned.slice(0, 6));
                                  const prevEl = e.currentTarget.form?.querySelector(`input[aria-label='OTP digit ${prevIdx + 1}']`);
                                  if (prevEl) prevEl.focus();
                                }
                              }
                              return;
                            }
                            if (e.key.length === 1 && /\D/.test(e.key)) e.preventDefault();
                          }}
                          onPaste={(e) => {
                            const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
                            if (!pasted) return;
                            otpFormik.setFieldValue("otp", pasted.slice(0, 6));
                            e.preventDefault();
                          }}
                          onBlur={() => otpFormik.setFieldTouched("otp", true)}
                        />
                      );
                    })}
                  </div>

                  {otpVerifying && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-neutral-950/60 backdrop-blur-sm">
                      <Loader color="#f97316" />
                    </div>
                  )}
                </div>

                {otpFormik.touched.otp && otpFormik.errors.otp && (
                  <p className="text-[10px] font-bold text-red-400 italic px-1">? {otpFormik.errors.otp}</p>
                )}

                {canResendOtp && (
                  <button
                    type="button"
                    onClick={resendOtp}
                    disabled={isLoading || otpVerifying}
                    className="w-full flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500 hover:text-orange-500 transition-colors disabled:opacity-40"
                  >
                    <IoRefresh className={`transition-transform duration-200 ${isLoading ? 'animate-spin' : ''}`} />
                    Resend OTP
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 hover:text-orange-500 transition-colors text-center"
                >
                  ? Use a different number
                </button>
              </div>
            )}
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

export default ForgotPassword;
