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
import { useRiderSessionPresence } from './hooks/useRiderSessionPresence'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ClipLoader } from 'react-spinners'

import { useSelector, useDispatch } from 'react-redux'
import { setUser, logout } from './Redux/verifiedUserslice'
import api from './services/axios'
import StorageService from './utils/storageService'

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.verifiedUser);
  const [isVerifying, setIsVerifying] = useState(() => !!StorageService.getToken());

  useSessionTimeout(isAuthenticated); // Enable conditional session timeout
  useRiderSessionPresence();

  useEffect(() => {
    const verifyUser = async () => {
      const token = StorageService.getToken();
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
        } finally {
          setIsVerifying(false);
        }
      } else {
        setIsVerifying(false);
      }
    };
    verifyUser();
  }, [dispatch]);

  const [pickupCoordinate, setPickupCoordinate] = useState({})
  const [destinationCoordinate, setDestinationCoordinate] = useState({})

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <ClipLoader color="#f97316" size={45} />
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar theme="dark" />
      <Routes>
        <Route path='/' element={!isAuthenticated ? <LandingPage /> : <Bookride pickupCoordinate={pickupCoordinate} destinationCoordinate={destinationCoordinate} setPickupCoordinate={setPickupCoordinate} setDestinationCoordinate={setDestinationCoordinate} />} />
        <Route path='signup' element={!isAuthenticated ? <SignUp /> : <Navigate to='/bookride' replace />} />
        <Route path='login' element={!isAuthenticated ? <Login /> : <Navigate to='/bookride' replace />} />
        <Route path='forgot-password' element={<ForgotPassword />} />
        <Route path='new-password' element={<NewPassword />} />
        <Route path='bookride' element={isAuthenticated ? <Bookride /> : <Navigate to='/login' replace />} />
        <Route path='driver-selection' element={isAuthenticated ? <DriverSelection /> : <Navigate to='/login' replace />} />
        <Route path='rider-selection' element={isAuthenticated ? <DriverSelection /> : <Navigate to='/login' replace />} />
        <Route path='live-tracking' element={isAuthenticated ? <LiveTracking /> : <Navigate to='/login' replace />} />
        <Route path='ride-completion' element={isAuthenticated ? <RideCompletion /> : <Navigate to='/login' replace />} />
        <Route path='rider-profile-setup' element={isAuthenticated ? <RiderProfileSetup /> : <Navigate to='/login' replace />} />
        <Route path='ride-request' element={isAuthenticated ? <IncomingRideRequest /> : <Navigate to='/login' replace />} />
        <Route path='rider-live-tracking' element={isAuthenticated ? <LiveTracking /> : <Navigate to='/login' replace />} />
        <Route path='riderdashboard' element={isAuthenticated ? <Riderdash /> : <Navigate to='/login' replace />} />
        <Route path='installment-profile-setup' element={isAuthenticated ? <InstallmentProfileSetup /> : <Navigate to='/login' replace />} />
        <Route path='installment-application' element={isAuthenticated ? <InstallmentApplication /> : <Navigate to='/login' replace />} />
        <Route path='installment-dashboard' element={isAuthenticated ? <InstallmentDashboard /> : <Navigate to='/login' replace />} />
        <Route path='wallet' element={isAuthenticated ? <Wallet /> : <Navigate to='/login' replace />} />
        <Route path='profile' element={isAuthenticated ? <ProfileManagement /> : <Navigate to='/login' replace />} />
        <Route path='help' element={<Help />} />
      </Routes>
      {isAuthenticated && <FloatingChatSupport />}
    </>
  )
}

export default App




