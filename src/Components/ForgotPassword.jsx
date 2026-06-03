import React, { useEffect, useState } from "react";
import Button from "./Button";
import Input from "./Input";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from 'react-toastify';
import Loader from "./Loader";
import { IoRefresh } from 'react-icons/io5';


function ForgotPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 for phone entry, 2 for OTP verification
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpExpiresAt, setOtpExpiresAt] = useState(null);
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  const [otpVerifying, setOtpVerifying] = useState(false);

  // When OTP expires, allow resend button to appear
  const canResendOtp = countdownSeconds <= 0 && !!otpExpiresAt;


  const resendOtp = async () => {
    if (!phoneNumber) return;
    setIsLoading(true);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const resp = await axios.post(`${apiUrl}/auth/resend-otp`, { phone: phoneNumber });
      const data = resp?.data?.data || resp?.data || {};
      if (data?.expiresAt) {
        setOtpExpiresAt(new Date(data.expiresAt));
        setCountdownSeconds(Number(data.expiresInSeconds) || 0);
      }
      toast.success('OTP resent successfully.');
      setOtpExpiresAt(prev => prev); // keep state stable
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };




  // Step 1: Phone number form
  const phoneFormik = useFormik({
    initialValues: {
      phone: "",
    },
    validationSchema: Yup.object({
      phone: Yup.string().matches(/^0\d{10}$/, "Please enter a valid phone number").required("Phone number is required"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      try {
        const resp = await axios.post(`${apiUrl}/auth/forgot-password`, {
          phone: values.phone
        });
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

  // Countdown timer for OTP expiry
  React.useEffect(() => {
    if (!otpExpiresAt) return;
    const tick = () => {
      const diffMs = otpExpiresAt.getTime() - Date.now();
      const remaining = Math.max(0, Math.floor(diffMs / 1000));
      setCountdownSeconds(remaining);
      if (remaining <= 0) {
        return;
      }
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [otpExpiresAt]);

  // Step 2a: OTP verification step (no password fields on this page)
  const otpFormik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: Yup.object({
      otp: Yup.string().required("OTP is required"),
    }),

    onSubmit: async (values) => {
      if (otpVerifying) return;
      setOtpVerifying(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      try {
        const resp = await axios.post(`${apiUrl}/auth/verify-otp`, {
          phone: phoneNumber,
          otp: values.otp,
        });

        toast.success(resp?.data?.message || 'OTP verified successfully.');
        // Redirect to new password page
        setTimeout(() => {
          navigate(`/new-password?phone=${encodeURIComponent(phoneNumber)}&otp=${encodeURIComponent(values.otp)}`);
        }, 500);
      } catch (err) {
        // Return to forgot-password with message to resend
        toast.error(err.response?.data?.message || 'Invalid or expired OTP. Please resend.');
        // Clear OTP to allow re-entry
        setOtpVerifying(false);
        otpFormik.setFieldValue('otp', '');
        return;
      } finally {
        setOtpVerifying(false);
      }
    },
  });

  // Auto-submit when OTP reaches 6 digits
  useEffect(() => {
    const otp = otpFormik.values.otp;
    if (otp && otp.length === 6) {
      otpFormik.handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpFormik.values.otp]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <form 
        onSubmit={step === 1 ? phoneFormik.handleSubmit : otpFormik.handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Reset Password
        </h2>

        {step === 1 ? (
          // Step 1: Phone Entry
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
              Enter your phone number to receive a reset code
            </p>
            <Input
              label="Phone Number"
              type="text"
              value={phoneFormik.values.phone}
              onChange={phoneFormik.handleChange}
              onBlur={phoneFormik.handleBlur}
              name="phone"
              placeholder="e.g., 08012345678"
            />
            {phoneFormik.touched.phone && phoneFormik.errors.phone ? (
              <div className="italic text-red-600 text-sm">{phoneFormik.errors.phone}</div>
            ) : null}
            <div className="mx-auto w-3/4 mt-5">
              <Button
                type="submit"
                text={isLoading ? <Loader color={"#ffffff"} /> : "Send Reset Code"}
                classes={'rounded-md bg-gradient-to-r text-white from-teal-600 to-teal-900 font-semibold py-3 px-6 w-full shadow-lg hover:scale-105'}
                disabled={isLoading}
              />
            </div>
          </>
        ) : (
          // Step 2: OTP and Password Reset
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
              Enter the code sent to {phoneNumber} and your new password
            </p>

            <div className="text-sm text-gray-700 dark:text-gray-300 mb-4 text-center">
              {countdownSeconds > 0 ? (
                <span>
                  OTP expires in <b>{String(Math.floor(countdownSeconds / 60)).padStart(2, '0')}:{String(countdownSeconds % 60).padStart(2, '0')}</b>
                </span>
              ) : (
                <span className="text-red-600">OTP expired</span>
              )}
            </div>

            <div className="relative">
              {/* 6 separate OTP digit inputs */}
              <div className="flex items-center justify-between gap-2">
                {Array.from({ length: 6 }).map((_, idx) => {
                  const digit = otpFormik.values.otp[idx] || "";

                  return (
                    <input
                      key={idx}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      aria-label={`OTP digit ${idx + 1}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      className="w-12 h-12 md:w-14 md:h-14 text-center text-2xl font-semibold rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-800 dark:border-gray-700 dark:focus:ring-teal-400"
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

                        // If user types/pastes multiple digits into one box, fill sequentially
                        const digitsToInsert = onlyDigits.slice(0, 6 - idx);
                        const otpArr = otpFormik.values.otp.padEnd(6, " ").split("");
                        for (let i = 0; i < digitsToInsert.length; i++) {
                          otpArr[idx + i] = digitsToInsert[i];
                        }
                        const nextOtp = otpArr.join("").replace(/\s/g, "");
                        otpFormik.setFieldValue("otp", nextOtp.slice(0, 6));

                        // auto-focus next if only a single digit was entered
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

                        if (e.key.length === 1 && /\D/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
                        if (!pasted) return;
                        const digits = pasted.slice(0, 6);
                        otpFormik.setFieldValue("otp", digits);
                        e.preventDefault();
                      }}
                      onBlur={() => otpFormik.setFieldTouched("otp", true)}
                    />
                  );
                })}
              </div>

              {otpVerifying && (
                <div className="absolute right-2 top-[6px]">
                  <Loader color={'#ffffff'} />
                </div>
              )}
            </div>


            {canResendOtp && (
              <button
                type="button"
                onClick={resendOtp}
                disabled={isLoading || otpVerifying}
                className="mt-3 text-sm text-blue-600 hover:underline flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>Resend OTP</span>
                <IoRefresh
                  className={`text-blue-600 transition-transform duration-200 ${isLoading ? 'animate-spin' : ''}`}
                />
              </button>
            )}

            {otpFormik.touched.otp && otpFormik.errors.otp ? (
              <div className="italic text-red-600 text-sm">{otpFormik.errors.otp}</div>
            ) : null}





            {/* <div className="mx-auto w-3/4 mt-5">
              <Button
                type="submit"
                text={isLoading ? <Loader color={"#ffffff"} />}
                classes={'rounded-md bg-gradient-to-r text-white from-teal-600 to-teal-900 font-semibold py-3 px-6 w-full shadow-lg hover:scale-105'}
                disabled={isLoading}
              />
            </div> */}

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full mt-3 text-sm text-blue-600 hover:underline text-center"
            >
              Use different phone number
            </button>
          </>
        )}

        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
          <Link to="/login" className="text-blue-600 hover:underline">Back to Login</Link>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;