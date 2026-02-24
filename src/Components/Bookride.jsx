import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import OtherNav from './VerifiedNav'
import Button from './Button'
import profilePic from '../assets/placeholderProfile.jpg'
import ClickToReveal from './ClickReveal'
import Mapcontainer from './Mapcontainer'

// Hook
import { useRideBooking } from '../hooks/useRideBooking';

// Sub-components
import RideBookingSidebar from './Booking/RideBookingSidebar';



//  Checks user authentication status using token stored in localStorage
//  Fetches and sets user data in Redux store
//  Redirects to login page if not authenticated

const Bookride = () => {
  const {
    user,
    isAuthenticated,
    loading,
    pickupLocation,
    destination,
    showCostDist,
    distance,
    eta,
    pickupSuggestions,
    destinationSuggestions,
    activeInput,
    destinationInputRef,
    handleFare,
    handleSuggestionClick,
    cancelRide,
    handleUseMyLocation,
    handleLocationChange,
    clearInput
  } = useRideBooking();

  const Motion = motion;


  return (
    <div>
      {/*Bookride has different features for each role. Why userrole's added as a prop and only accessible to authenticated users */}
      <Navbar
        userrole={user?.role}
        userverified={isAuthenticated}
        nav={<OtherNav userrole={user?.role} />}
        profilePic={user?.profilePic || profilePic}
        button={
          <Link to={'/installment-profile-setup'}>
            <Button
              text={'Own a Ride'}
              classes={'h-11 py-1 px-5 rounded-2xl bg-neutral-900 text-white hover:bg-black transition-all font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-neutral-900/10'}
            />
          </Link>
        }
      />
      <div className='mt-20 pt-12 px-6 lg:px-20 flex flex-col lg:flex-row pb-10 gap-12 bg-neutral-50 min-h-screen items-start'>
        <RideBookingSidebar
          user={user}
          loading={loading}
          pickupLocation={pickupLocation}
          destination={destination}
          pickupSuggestions={pickupSuggestions}
          destinationSuggestions={destinationSuggestions}
          activeInput={activeInput}
          destinationInputRef={destinationInputRef}
          handleFare={handleFare}
          handleLocationChange={handleLocationChange}
          handleSuggestionClick={handleSuggestionClick}
          handleUseMyLocation={handleUseMyLocation}
          clearInput={clearInput}
          cancelRide={cancelRide}
          showCostDist={showCostDist}
          distance={distance}
          eta={eta}
        >
          {distance && eta && showCostDist && (
            <ClickToReveal
              distance={distance}
              duration={eta}
              cancelRide={cancelRide}
            />
          )}
        </RideBookingSidebar>

        <Motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='flex-1 h-[500px] lg:h-auto lg:self-stretch min-h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-neutral-200'
        >
          <Mapcontainer />
        </Motion.div>
      </div>
    </div>
  )
}


export default Bookride
