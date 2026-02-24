import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './Components/Landingpage'
import SignUp from './Components/Signuppage'
import Login from './Components/Loginpage'
import Bookride from './Components/Bookride'
import Riderdash from './Components/Riderdash'
import ForgotPassword from './Components/ForgotPassword'
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
import useSessionTimeout from './utils/useSessionTimeout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


function App() {
  useSessionTimeout(); // Enable global session timeout

  const [verified, setVerified] = useState(false)
  const [pickupCoordinate, setPickupCoordinate] = useState({})
  const [destinationCoordinate, setDestinationCoordinate] = useState({})
  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar theme="dark" />
      <Routes>
        <Route path='/' element={!verified ? <LandingPage verified={verified} setverified={setVerified} /> : <Bookride pickupCoordinate={pickupCoordinate} destinationCoordinate={destinationCoordinate} setPickupCoordinate={setPickupCoordinate} setDestinationCoordinate={setDestinationCoordinate} />} />
        <Route path='signup' element={<SignUp />} />
        <Route path='login' element={<Login />} />
        <Route path='forgot-password' element={<ForgotPassword />} />
        <Route path='bookride' element={<Bookride />} />
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
      </Routes>
    </>
  )
}

export default App
