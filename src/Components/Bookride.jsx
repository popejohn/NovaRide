import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { IoClose } from "react-icons/io5"
import { FaMapMarkedAlt } from "react-icons/fa"
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
    fare,
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

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
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
      <div className='mt-20 pt-12 px-6 lg:px-20 flex flex-col lg:flex-row pb-10 gap-12 bg-neutral-50 min-h-screen items-stretch'>
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
          onOpenMap={() => setIsMapModalOpen(true)}
        >
          {distance && eta && showCostDist && (
            <ClickToReveal
              distance={distance}
              duration={eta}
              fare={fare}
              cancelRide={cancelRide}
            />
          )}
        </RideBookingSidebar>

        {/* Desktop side-by-side Map */}
        <Motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='hidden lg:block flex-1 min-h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-neutral-200'
        >
          <Mapcontainer />
        </Motion.div>
      </div>

      {/* Mobile Map Modal */}
      <AnimatePresence>
        {isMapModalOpen && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[6000] bg-black/80 backdrop-blur-lg flex items-center justify-center p-4 lg:hidden"
          >
            <Motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full h-[85vh] rounded-[2.5rem] overflow-hidden relative shadow-2xl"
            >
              <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-[7000] bg-gradient-to-b from-black/20 to-transparent">
                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                  <FaMapMarkedAlt className="text-orange-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-800">Set Location on Map</span>
                </div>
                <button
                  onClick={() => setIsMapModalOpen(false)}
                  className="bg-white/90 backdrop-blur-md text-neutral-900 p-2 rounded-full hover:bg-white transition-all shadow-lg"
                >
                  <IoClose className="text-xl" />
                </button>
              </div>
              <div className="w-full h-full pt-4">
                <Mapcontainer />
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


export default Bookride




