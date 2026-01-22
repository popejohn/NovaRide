import React, {useState, useEffect} from "react";
import Button from "./Button";
import Input from "./Input";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { loginStart, loginFailure, loginSuccess } from "../Redux/authslice";
import { setUser } from "../Redux/verifiedUserslice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BiHide, BiShow } from "react-icons/bi";
import { ToastContainer, toast } from 'react-toastify';
import Loader from "./Loader";



function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let {isLoading, token, error} = useSelector((state) => state.auth);
  let {user} = useSelector((state) => state.verifiedUser);
  const [show, setShow] = useState(false);

  const formik = useFormik({
    initialValues: {
      phone: "",
      password: "",
    },
    validationSchema: Yup.object({
      phone: Yup.string().matches(/^0\d{10}$/, "Please enter a valid phone number").required("Phone number is required"),
      password: Yup.string().matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, "password must contain numbers and letters and not less than 8 characters").required('Password is required'),
  }),
  onSubmit: (values) =>{
    const {phone, password} = values;
    dispatch(loginStart());
    axios.post("http://localhost:5000/auth/login", values)
    .then((res) =>
      {
        localStorage.setItem('nvcr_tk', res.data.data.token);
        toast.success('OTP has been sent to your registered phone number');
        setTimeout(() => {
           dispatch(loginSuccess({token: res.data.data.token}));
           dispatch(setUser({user: res.data.data.user}));
           if (res.data.data.user.role.includes('rider')) {
            if (res.data.data.user.profileCompleted) {
              navigate('/riderdashboard');
            } else {
              navigate('/rider-profile-setup');
            }
          }else {
          navigate('/bookride');
          }
        },2000);
        })
        .catch((err) =>
          {
            dispatch(loginFailure(err));
            console.log(err);
            
            toast.error('Invalid phone number or password')

          })}
})


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <form onSubmit={formik.handleSubmit} className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Account Login</h2>
        <Input label="Phone number" name="phone" onChange={formik.handleChange} onBlur={formik.handleBlur} required />
        {formik.touched.phone && formik.errors.phone && <div className="italic text-red-600 text-sm">{formik.errors.phone}</div>}
        <label className="relative block mb-4 text-left w-full">
          <span className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Password</span>
          <input type= {show ?"text" :"password"} name= 'password' onBlur = {formik.handleBlur} onChange={formik.handleChange} className="w-full px-4 py-2 rounded-lg border border-teal-600 outline-0 shadow-md  focus:ring-1 focus:ring-blue-300"/>
          <span className="absolute top-3/5 end-4" onClick={()=> setShow(!show)}>{show ?<BiHide /> :<BiShow />}</span>
        </label>
        {formik.touched.password && formik.errors.password && <div className="italic text-red-600 text-sm">{formik.errors.password}</div>}
        <div className="mx-auto w-3/4 mt-5">
            <Button type="submit" text={isLoading ? <Loader color={"#ffffff"} /> : "Log in"} classes={'rounded-md bg-gradient-to-r text-white from-teal-600 to-teal-900 font-semibold py-3 px-6 w-full shadow-lg hover:scale-105'} disabled={isLoading} />
        </div>
        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">Forgot Password?</Link>
        </p>
        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
          Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
        </p>
      </form>
      <ToastContainer  />
    </div>

  );
}



export default Login