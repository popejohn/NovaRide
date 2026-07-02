import React, { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import { useNavigate, Link } from "react-router-dom";
import api from '../services/axios';
import { useSelector, useDispatch } from "react-redux";
import { signupStart, signupFailure, signupSuccess } from "../Redux/authslice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BiHide, BiShow, BiCheck } from "react-icons/bi";
import { toast } from 'react-toastify';
import Loader from "./Loader";
import novaLogo from '../assets/nova.png';
import signupBg from '../assets/maruwa_passenger.png';
import { motion } from 'framer-motion';

function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      password: "",
      confirmpassword: "",
      role: ""
    },
    validationSchema: Yup.object({
      firstname: Yup.string().required("First name is required").min(2, "Please enter a valid first name"),
      lastname: Yup.string().required("Last name is required").min(2, "Please enter a valid last name"),
      email: Yup.string().email("Please enter a valid email").required("Email is required"),
      phone: Yup.string().matches(/^0\d{10}$/, "Please enter a valid phone number").required("Phone number is required"),
      password: Yup.string().required('Password is required').matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, "Must be 8+ chars with letters & numbers"),
      confirmpassword: Yup.string().oneOf([Yup.ref("password"), null], "Passwords do not match").required('Please confirm password'),
      role: Yup.string().required("Please select your role"),
    }),
    onSubmit: (values) => {
      dispatch(signupStart());
      api.post('/auth/signup', values)
        .then(res => {
          toast.success('Welcome to the Nova family!');
          setTimeout(() => {
            dispatch(signupSuccess(res.data));
            navigate('/login');
          }, 2000);
        })
        .catch(err => {
          const msg = err?.response?.data?.message || 'Something went wrong';
          toast.error(msg);
          dispatch(signupFailure(msg));
        });
    }
  });

  const roles = [
    { id: 'passenger', label: 'Passenger', desc: 'I want to ride' },
    { id: 'rider', label: 'Rider', desc: 'I want to drive' },
    { id: 'installment', label: 'Partner', desc: 'Installment plans' }
  ];

  return (
    <div className="min-h-screen flex bg-neutral-950 font-sans selection:bg-orange-500/30">
      {/* Hero Section - Split View (LG+) */}
      <div className="hidden lg:flex w-[40%] relative items-center justify-center p-20 overflow-hidden border-r border-neutral-800 bg-neutral-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(249,115,22,0.15),transparent_70%)]" />
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h1 className="text-[9rem] xl:text-[11rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-tr from-white via-white to-neutral-700 pointer-events-none select-none">
            NOVA<br /><span className="text-orange-500">RIDE</span>
          </h1>
        </motion.div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 bg-neutral-900 lg:bg-neutral-950">
        <div className="w-full max-w-md space-y-10">
          {/* Mobile Text Header */}
          <div className="lg:hidden text-center mb-10">
            <h1 className="text-4xl font-black tracking-tighter text-white">NOVA<span className="text-orange-500">RIDE</span></h1>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-4xl font-black text-white tracking-tight">Create Account</h2>
            <p className="text-neutral-500 font-bold text-sm tracking-wide">Enter your details to get started.</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstname"
                placeholder="John"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.firstname}
                error={formik.touched.firstname && formik.errors.firstname}
              />
              <Input
                label="Last Name"
                name="lastname"
                placeholder="Doe"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.lastname}
                error={formik.touched.lastname && formik.errors.lastname}
              />
            </div>

            <Input
              label="Phone number"
              name="phone"
              placeholder="08012345678"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
              error={formik.touched.phone && formik.errors.phone}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              error={formik.touched.email && formik.errors.email}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group/pass">
                <Input
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  error={formik.touched.password && formik.errors.password}
                />
                <button type="button" className="absolute right-5 top-[44px] text-neutral-600 hover:text-orange-500 transition-colors" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <BiHide size={20} /> : <BiShow size={20} />}
                </button>
              </div>
              <div className="relative group/pass">
                <Input
                  label="Confirm Password"
                  name="confirmpassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmpassword}
                  error={formik.touched.confirmpassword && formik.errors.confirmpassword}
                />
                <button type="button" className="absolute right-5 top-[44px] text-neutral-600 hover:text-orange-500 transition-colors" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <BiHide size={20} /> : <BiShow size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-1">Account Role</label>
              <div className="grid grid-cols-3 gap-3">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => formik.setFieldValue('role', r.id)}
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden ${formik.values.role === r.id
                      ? 'border-orange-500 bg-orange-500/5'
                      : 'border-neutral-800 hover:border-neutral-700 bg-neutral-900'
                      }`}
                  >
                    {formik.values.role === r.id && (
                      <div className="absolute top-2 right-2 text-orange-500"><BiCheck size={20} /></div>
                    )}
                    <p className={`text-[10px] font-black uppercase tracking-tight ${formik.values.role === r.id ? 'text-white' : 'text-neutral-500'}`}>{r.label}</p>
                    <p className="text-[9px] font-bold text-neutral-600 leading-tight mt-1">{r.desc}</p>
                  </button>
                ))}
              </div>
              {formik.touched.role && formik.errors.role && <p className="mt-2 text-[10px] font-bold text-red-400 italic px-1">● {formik.errors.role}</p>}
            </div>

            <Button
              type="submit"
              text={isLoading ? <Loader color='#ffffff' /> : "Create Account"}
              classes={'w-full py-5 bg-orange-500 hover:bg-white hover:text-neutral-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-orange-500/20 transition-all duration-500 mt-6 active:scale-95 border-2 border-transparent hover:border-white'}
              disabled={isLoading}
            />
          </form>

          <footer className="pt-10 border-t border-neutral-800 text-center">
            <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em]">
              Already registered?
              <Link to="/login" className="text-orange-500 hover:text-white transition-all ml-2 underline decoration-orange-500/30 underline-offset-4">
                Login
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default SignUp;






