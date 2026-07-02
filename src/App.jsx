import { useState, useEffect } from 'react'
import './App.css'
import { Route, Routes, Navigate } from 'react-router-dom'
import LandingPage from './Components/Landingpage'
import SignUp from './Components/Signuppage'
import Login from './Components/Loginpage'
import Bookride from './Components/Bookride'
import Riderdash from './Components/Riderdash'
import ForgotPassword from './Components/ForgotPassword'
import NewPassword from './Components/NewPassword'
import DriverSelection from './Components/DriverSelection'
import LiveTracking from './Components/LiveTracking'
import RideCompletion from './Components/RideCompletion'
import RiderProfileSetup from './Components/RiderProfileSetup'
import IncomingRideRequest from './Components/IncomingRideRequest'
import InstallmentProfileSetup from './Components/InstallmentProfileSetup'
import InstallmentApplication from './Components/InstallmentApplication'
import InstallmentDashboard from './Components/InstallmentDashboard'
import Wallet from './Components/Wallet'
import ProfileManagement from './Components/ProfileManagement'
import Help from './Components/Help'
import FloatingChatSupport from './Components/FloatingChatSupport'
import useSessionTimeout from './utils/useSessionTimeout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


import { useSelector, useDispatch } from 'react-redux'
import { setUser, logout } from './Redux/verifiedUserslice'
import api from './services/axios'


function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.verifiedUser);
  useSessionTimeout(isAuthenticated); // Enable conditional session timeout

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('nvcr_tk');
      if (token) {
        try {
          const response = await api.get('/auth/verify-token');
          if (response.data.success) {
            dispatch(setUser({ user: response.data.data, isAuthenticated: true }));
          } else {
            dispatch(logout());
          }
        } catch (error) {
          console.error('Verification failed:', error);
          dispatch(logout());
        }
      }
    };
    verifyUser();
  }, [dispatch]);

  const [pickupCoordinate, setPickupCoordinate] = useState({})
  const [destinationCoordinate, setDestinationCoordinate] = useState({})
  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar theme="dark" />
      <Routes>
        <Route path='/' element={!isAuthenticated ? <LandingPage /> : <Bookride pickupCoordinate={pickupCoordinate} destinationCoordinate={destinationCoordinate} setPickupCoordinate={setPickupCoordinate} setDestinationCoordinate={setDestinationCoordinate} />} />
        <Route path='signup' element={<SignUp />} />
        <Route path='login' element={<Login />} />
        <Route path='forgot-password' element={<ForgotPassword />} />
        <Route path='new-password' element={<NewPassword />} />
        <Route path='bookride' element={isAuthenticated ? <Bookride /> : <Navigate to='/login' replace />} />
        <Route path='driver-selection' element={<DriverSelection />} />
        <Route path='live-tracking' element={<LiveTracking />} />
        <Route path='ride-completion' element={<RideCompletion />} />
        <Route path='rider-profile-setup' element={<RiderProfileSetup />} />
        <Route path='ride-request' element={<IncomingRideRequest />} />
        <Route path='rider-live-tracking' element={<LiveTracking />} />
        <Route path='riderdashboard' element={<Riderdash />} />
        <Route path='installment-profile-setup' element={<InstallmentProfileSetup />} />
        <Route path='installment-application' element={<InstallmentApplication />} />
        <Route path='installment-dashboard' element={<InstallmentDashboard />} />
        <Route path='wallet' element={<Wallet />} />
        <Route path='profile' element={<ProfileManagement />} />
        <Route path='help' element={<Help />} />
      </Routes>
      {isAuthenticated && <FloatingChatSupport />}
    </>
  )
}

export default App




