import React, {useState, useRef, useEffect} from "react";  
import Button from "./Button";  // Reusable Button component
import Input from "./Input";  // Reusable Input component
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";  
import { signupStart, signupFailure, signupSuccess } from "../Redux/authslice"; // Redux actions for signup
import { useFormik } from "formik";   // Formik for form handling
import * as Yup from "yup";   // Yup for form validation
import { BiHide, BiShow } from "react-icons/bi";
import { ToastContainer, toast } from 'react-toastify';  // Toast notifications
import { ImSpinner6 } from "react-icons/im"; // Spinner icon for loading state
import 'react-toastify/dist/ReactToastify.css';  // Toast styles
import Loader from "./Loader";  // Loader component





function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {isLoading, user, error} = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordRef = useRef()
  const confirmPasswordRef = useRef()

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      phone: "",
      password: "",
      confirmpassword: "",
      role: ""
    },
    validationSchema: Yup.object({
      firstname: Yup.string().required("Please provide your first name"),
      lastname: Yup.string().required("Please provide your last name"),
      phone: Yup.string().matches(/^0\d{10}$/, "Please enter a valid phone number").required("Phone number is required"),
      password: Yup.string().required('Password is required').matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, "password must contain numbers and letters and not less than 8 characters"),
      confirmpassword: Yup.string().oneOf([Yup.ref("password"), null], "Passwords do not match").required('Please confirm your password'),
      role: Yup.string().oneOf(["passenger", "rider", "installment"], "Please select a valid role")
  .required("Please select a role"),
  }),
  onSubmit: (values) =>{
    dispatch(signupStart());
    const {firstname, lastname, phone, password, role} = values;
    axios.post("http://localhost:5000/auth/signup", values)
  .then(res => {
    toast.success('Signup successful')
    setTimeout(() => {
      dispatch(signupSuccess(res.data));
      navigate('/login')
    }, 3000);
  })
  .catch(err => {
    dispatch(signupFailure('Signup failed, please try again'));

    const msg = err?.response?.data?.message || 'Signup failed, please try again';
    toast.error(msg);

    // RESET FORM FIELDS
    formik.resetForm();

    // RESET PASSWORD FIELD TYPES + ICON STATES
    setShowPassword(false);
    setShowConfirm(false);

    if (passwordRef.current) passwordRef.current.type = "password";
    if (confirmPasswordRef.current) confirmPasswordRef.current.type = "password";
  });

  }
})

const toggleShow = (inputRef, setState, currentState) => {
  if (inputRef.current.value.length === 0) return;
  if (inputRef.current) {
    inputRef.current.type = currentState ? "password" : "text";    
    setState(!currentState);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <form onSubmit={formik.handleSubmit} className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 my-7">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Create Account</h2>
        <Input label='First name' name="firstname" value={formik.values.firstname} onChange={formik.handleChange} onBlur={formik.handleBlur} required/>
        {formik.touched.firstname && formik.errors.firstname && <div className="italic text-red-600 text-sm -mt-2">{formik.errors.firstname}</div>}
        <Input label="Last name" name="lastname" value={formik.values.lastname} onChange={formik.handleChange} onBlur={formik.handleBlur} required />
        {formik.touched.lastname && formik.errors.lastname && <div className="italic text-red-600 text-sm -mt-2">{formik.errors.lastname}</div>}
        <Input label="Phone number" name="phone" value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur} required />
        {formik.touched.phone && formik.errors.phone && <div className="italic text-red-600 text-sm -mt-2">{formik.errors.phone}</div>}
        <label className="relative block mb-4 text-left w-full">
          <span className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Password</span>
          <input name= 'password' type={passwordRef.current ?passwordRef.current.type :"password"} ref={passwordRef} onBlur = {formik.handleBlur} onChange={formik.handleChange} value={formik.values.password} className="w-full px-4 py-2 rounded-lg border border-teal-600 outline-0 shadow-md  focus:ring-1 focus:ring-blue-300"/>
          <span className="absolute top-3/5 end-4" onClick={()=>toggleShow(passwordRef, setShowPassword, showPassword)}>{showPassword ?<BiHide /> :<BiShow />}</span>
        </label>
        {formik.touched.password && formik.errors.password && <div className="italic text-red-600 text-sm -mt-2">{formik.errors.password}</div>}
        <label className="relative block mb-4 text-left w-full">
          <span className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Confirm password</span>
          <input name= 'confirmpassword' type={confirmPasswordRef.current ?confirmPasswordRef.current.type :"password"} ref={confirmPasswordRef} value={formik.values.confirmpassword} onBlur = {formik.handleBlur} onChange={formik.handleChange} className="w-full px-4 py-2 rounded-lg border border-teal-600 outline-0 shadow-md  focus:ring-1 focus:ring-blue-300"/>
          <span className="absolute top-3/5 end-4" onClick={() => toggleShow(confirmPasswordRef, setShowConfirm, showConfirm)}>{showConfirm ?<BiHide /> :<BiShow />}</span>
        </label>
        {formik.touched.confirmpassword && formik.errors.confirmpassword && <div className="italic text-red-600 text-sm -mt-2">{formik.errors.confirmpassword}</div>}
        <label className="block mb-6">
          <span className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Register as</span>
          <select
            name="role"
            onChange={formik.handleChange}
            value={formik.values.role}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-2 rounded-lg border border-teal-600 shadow-md outline-0 focus:ring ring-blue-600"
          >
            <option value="">Select an option</option>
            <option value="passenger">Passenger</option>
            <option value="rider">Rider (Driver)</option>
            <option value="installment">Installment buyer</option>
          </select>
        </label>
        {formik.touched.role && formik.errors.role && <div className="italic text-red-600 text-sm -mt-2">{formik.errors.role}</div>}
        <div className="mx-auto w-3/4">
            <Button type="submit" text={isLoading ? <Loader color='#ffffff' /> : "Sign Up"} classes={'rounded-md flex justify-center align-center bg-gradient-to-r text-white from-teal-600 to-teal-900 font-semibold py-3 px-6 w-full shadow-lg hover:scale-105'} disabled={isLoading} />
        </div>
        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link>
        </p>
      </form>
      <ToastContainer />
    </div>

  );
}



export default SignUp