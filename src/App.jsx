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
import ProtectedRoute from './Components/ProtectedRoute'
import useSessionTimeout from './utils/useSessionTimeout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


import { useSelector, useDispatch } from 'react-redux'
import { setUser, logout, authInitializationComplete } from './Redux/verifiedUserslice'
import api from './services/axios'
import StorageService from './utils/storageService'


function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isInitializing } = useSelector(state => state.verifiedUser);
  useSessionTimeout(isAuthenticated); // Enable conditional session timeout

  useEffect(() => {
    const verifyUser = async () => {
      const token = StorageService.getToken();
      if (!token) {
        dispatch(authInitializationComplete(false));
        return;
      }

      try {
        const response = await api.get('/auth/verify-token');
        if (response.data.success && response.data.data) {
          dispatch(setUser({ user: response.data.data }));
          dispatch(authInitializationComplete(true));
        } else {
          dispatch(logout());
          dispatch(authInitializationComplete(false));
        }
      } catch (error) {
        console.error('Verification failed:', error);
        if (error.response?.status === 401) {
          dispatch(logout());
          dispatch(authInitializationComplete(false));
        } else {
          // Keep the cached session during temporary API/network failures.
          dispatch(authInitializationComplete(isAuthenticated));
        }
      }
    };
    verifyUser();
  }, [dispatch, isAuthenticated]);

  const [pickupCoordinate, setPickupCoordinate] = useState({})
  const [destinationCoordinate, setDestinationCoordinate] = useState({})
  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar theme="dark" />
      <Routes>
        <Route path='/' element={isInitializing ? <ProtectedRoute><LandingPage /></ProtectedRoute> : !isAuthenticated ? <LandingPage /> : <Bookride pickupCoordinate={pickupCoordinate} destinationCoordinate={destinationCoordinate} setPickupCoordinate={setPickupCoordinate} setDestinationCoordinate={setDestinationCoordinate} />} />
        <Route path='signup' element={<SignUp />} />
        <Route path='login' element={<Login />} />
        <Route path='forgot-password' element={<ForgotPassword />} />
        <Route path='new-password' element={<NewPassword />} />
        <Route path='bookride' element={<ProtectedRoute><Bookride /></ProtectedRoute>} />
        <Route path='driver-selection' element={<ProtectedRoute><DriverSelection /></ProtectedRoute>} />
        <Route path='live-tracking' element={<ProtectedRoute><LiveTracking /></ProtectedRoute>} />
        <Route path='ride-completion' element={<ProtectedRoute><RideCompletion /></ProtectedRoute>} />
        <Route path='rider-profile-setup' element={<ProtectedRoute><RiderProfileSetup /></ProtectedRoute>} />
        <Route path='ride-request' element={<ProtectedRoute><IncomingRideRequest /></ProtectedRoute>} />
        <Route path='rider-live-tracking' element={<ProtectedRoute><LiveTracking /></ProtectedRoute>} />
        <Route path='riderdashboard' element={<ProtectedRoute><Riderdash /></ProtectedRoute>} />
        <Route path='installment-profile-setup' element={<ProtectedRoute><InstallmentProfileSetup /></ProtectedRoute>} />
        <Route path='installment-application' element={<ProtectedRoute><InstallmentApplication /></ProtectedRoute>} />
        <Route path='installment-dashboard' element={<ProtectedRoute><InstallmentDashboard /></ProtectedRoute>} />
        <Route path='wallet' element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
        <Route path='profile' element={<ProtectedRoute><ProfileManagement /></ProtectedRoute>} />
        <Route path='help' element={<ProtectedRoute><Help /></ProtectedRoute>} />
      </Routes>
      {isAuthenticated && <FloatingChatSupport />}
    </>
  )
}

export default App




