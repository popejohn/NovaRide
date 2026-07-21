import React, { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginStart, loginFailure, loginSuccess } from "../Redux/authslice";
import { setUser } from "../Redux/verifiedUserslice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BiHide, BiShow } from "react-icons/bi";
import { toast } from 'react-toastify';
import Loader from "./Loader";
import novaLogo from '../assets/nova.png';
import loginBg from '../assets/night-5137487_1920.jpg';
import { motion } from 'framer-motion';
import AuthService from "../utils/authService.js";
import RoleService from "../utils/roleService.js";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [show, setShow] = useState(false);

  const formik = useFormik({
    initialValues: {
      phone: "",
      password: "",
    },
    validationSchema: Yup.object({
      phone: Yup.string().matches(/^0\d{10}$/, "Please enter a valid phone number").required("Phone number is required"),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      dispatch(loginStart());
      try {
        const result = await AuthService.login(values);
        toast.success('Welcome back to Nova!');

        const { token, user, role } = result;

        setTimeout(() => {
          dispatch(loginSuccess({ token }));
          dispatch(setUser({ user }));

          if (role === RoleService.ROLES.RIDER) {
            navigate(user.profileCompleted ? '/riderdashboard' : '/rider-profile-setup');
          } else if (role === RoleService.ROLES.INSTALLMENT) {
            navigate(user.profileCompleted ? '/installment-dashboard' : '/installment-profile-setup');
          } else {
            navigate('/bookride');
          }
        }, 1500);
      } catch (error) {
        const errorMessage = error?.message || 'Login failed. Please try again.';
        toast.error(errorMessage);
        dispatch(loginFailure(errorMessage));
      }
    }
  });

  return (
    <div className="min-h-screen flex bg-neutral-950 font-sans selection:bg-orange-500/30">
      {/* Hero Section - Split View (LG+) */}
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

        {/* Abstract background detail */}
        <div className="absolute bottom-[10%] left-[10%] w-32 h-[1px] bg-gradient-to-r from-orange-500 to-transparent opacity-50" />
      </div>

      {/* Form Section */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 bg-neutral-900 lg:bg-neutral-950">
        <div className="w-full max-w-sm space-y-12">
          {/* Mobile Text-only Header (No Logo) */}
          <div className="lg:hidden text-center">
            <h1 className="text-4xl font-black tracking-tighter text-white">NOVA<span className="text-orange-500">RIDE</span></h1>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-4xl font-black text-white tracking-tight">Login</h2>
            <p className="text-neutral-500 font-bold text-sm tracking-wide">Welcome back! Enter your details.</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <Input
                label="Phone number"
                name="phone"
                placeholder="08012345678"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                error={formik.touched.phone && formik.errors.phone}
              />

              <div className="relative group/pass">
                <Input
                  label="Password"
                  name="password"
                  type={show ? "text" : "password"}
                  placeholder="••••••••"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  error={formik.touched.password && formik.errors.password}
                />
                <button
                  type="button"
                  className="absolute right-5 top-[48px] text-neutral-600 hover:text-orange-500 transition-all duration-300"
                  onClick={() => setShow(!show)}
                >
                  {show ? <BiHide size={22} /> : <BiShow size={22} />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center px-1">
              <div className="h-[1px] flex-1 bg-neutral-800 mr-4" />
              <Link to="/forgot-password" title="Recover Access" className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 hover:text-orange-500 transition-colors">
                forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              text={isLoading ? <Loader color={"#ffffff"} /> : "Login"}
              classes={'w-full py-5 bg-orange-500 hover:bg-white hover:text-neutral-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-orange-500/20 transition-all duration-500 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-orange-500 disabled:hover:text-white disabled:hover:border-transparent border-2 border-transparent hover:border-white'}
              disabled={isLoading || !formik.isValid || !formik.dirty}
            />
          </form>

          <footer className="pt-12 border-t border-neutral-800 text-center">
            <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em]">
              New to the platform?
              <Link to="/signup" className="text-orange-500 hover:text-white transition-all ml-2 underline decoration-orange-500/30 underline-offset-4">
                Create Account
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Login;




