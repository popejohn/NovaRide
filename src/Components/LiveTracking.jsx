import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import OtherNav from './VerifiedNav';
import Button from './Button';
import { FaStar, FaCar } from 'react-icons/fa';
import MapSection from './MapSection';
import RideControls from './RideControls';
import TripDetailsCard from './TripDetailsCard';
import ComplaintForm from './ComplaintForm';
import RideCompletionModal from './RideCompletionModal';
import RideStartModal from './RideStartModal';
import { useLiveTracking } from '../hooks/useLiveTracking';

const LiveTracking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const rideId = queryParams.get('rideId');

  const [complaintText, setComplaintText] = useState('');
  const [showComplaintForm, setShowComplaintForm] = useState(false);

  const user = useSelector(state => state.verifiedUser.user);
  const userRoles = useSelector(state => state.verifiedUser.role);

  const {
    rideDetails,
    loading,
    rideStatus,
    driverLocation,
    isPassenger,
    isRider,
    showCompletionModal,
    setShowCompletionModal,
    showStartRideModal,
    setShowStartRideModal,
    updateRideStatus,
    submitComplaint
  } = useLiveTracking(rideId, user, userRoles);

  const handleSubmitComplaint = async () => {
    const success = await submitComplaint(complaintText);
    if (success) {
      setComplaintText('');
      setShowComplaintForm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="font-bold tracking-widest uppercase text-xs">Initialising Live Tracking...</p>
        </div>
      </div>
    );
  }

  if (!rideDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
        <div className="text-center">
          <h2 className="text-3xl font-black mb-4 uppercase italic">Ride Not Found</h2>
          <Button text="Go Back" onClick={() => navigate('/bookride')} />
        </div>
      </div>
    );
  }

  const pickupCoords = [rideDetails.pickupCoordinates.coordinates[1], rideDetails.pickupCoordinates.coordinates[0]];
  const destinationCoords = [rideDetails.destinationCoordinates.coordinates[1], rideDetails.destinationCoordinates.coordinates[0]];
  const driverCoords = driverLocation
    ? [driverLocation.lat, driverLocation.lng]
    : rideDetails.assignedDriver?.location?.coordinates
      ? [rideDetails.assignedDriver.location.coordinates[1], rideDetails.assignedDriver.location.coordinates[0]]
      : [pickupCoords[0] + 0.005, pickupCoords[1] + 0.005];

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-orange-500 selection:text-white">
      <Navbar userrole={userRoles} userverified={true} profilePic={user?.profilePic || "/placeholderProfile.jpg"} nav={<OtherNav userrole={userRoles} />} />

      <div className="mt-28 px-4 md:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-4xl font-black uppercase tracking-tighter italic">Live <span className="text-orange-500">Tracking</span></h1>
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.3em] mt-1 pl-1 border-l-2 border-orange-500/30">Ride ID: {rideId}</p>
            </motion.div>
            {((isPassenger) || (isRider)) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-4 rounded-3xl backdrop-blur-2xl shadow-2xl"
              >
                <div className="relative">
                  <div className={`w-3 h-3 rounded-full ${rideDetails.rideStatus === 'completed' ? 'bg-green-500' : 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)] animate-pulse'}`} />
                </div>
                <span className="text-sm font-black uppercase tracking-widest text-neutral-300">{rideStatus}</span>
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Map Column */}
            <div className="lg:col-span-8 order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 rounded-[3rem] border border-white/10 shadow-3xl overflow-hidden h-[500px] lg:h-[700px] relative group"
              >
                <MapSection
                  rideDetails={rideDetails}
                  driverLocation={driverCoords}
                  pickupLocation={pickupCoords}
                  destinationLocation={destinationCoords}
                />
              </motion.div>
            </div>

            {/* Controls Column */}
            <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
              {/* User Info Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/10 shadow-3xl relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black uppercase tracking-tight italic">{isRider ? 'Your Passenger' : 'Your Rider'}</h3>
                  <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 border border-orange-500/20">
                    <FaCar className="text-xl" />
                  </div>
                </div>

                <div className="flex items-center gap-6 p-5 bg-white/5 rounded-3xl border border-white/5 mb-8 hover:bg-white/10 transition-colors">
                  <img
                    src={(isRider ? rideDetails.user?.profilePic : rideDetails.assignedDriver?.riderInfo?.profilePic) || '/placeholderProfile.jpg'}
                    alt="User"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-orange-500/40 shadow-xl"
                  />
                  <div>
                    <h4 className="text-xl font-black tracking-tight leading-none mb-2">
                      {isRider
                        ? `${rideDetails.user?.firstname} ${rideDetails.user?.lastname}`
                        : rideDetails.assignedDriver?.riderInfo
                          ? `${rideDetails.assignedDriver.riderInfo.firstname} ${rideDetails.assignedDriver.riderInfo.lastname || ''}`
                          : 'Rider Assigned'}
                    </h4>
                    <p className="text-xs text-neutral-400 font-bold mb-2">
                      📞 {isRider ? rideDetails.user?.phone : rideDetails.assignedDriver?.riderInfo?.phone || 'No phone number available'}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex text-orange-500">
                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">4.9 Star</span>
                    </div>
                  </div>
                </div>

                <RideControls
                  rideStatus={rideDetails.rideStatus}
                  isPassenger={isPassenger}
                  isRider={isRider}
                  updateRideStatus={updateRideStatus}
                />
              </motion.div>

              {/* Trip Details Card */}
              <TripDetailsCard rideDetails={rideDetails} />

              {/* Complaint Form */}
              <ComplaintForm
                showComplaintForm={showComplaintForm}
                setShowComplaintForm={setShowComplaintForm}
                complaintText={complaintText}
                setComplaintText={setComplaintText}
                handleSubmitComplaint={handleSubmitComplaint}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ride Start Modal */}
      <RideStartModal
        showStartRideModal={showStartRideModal}
        setShowStartRideModal={setShowStartRideModal}
        isRider={isRider}
        updateRideStatus={updateRideStatus}
      />

      {/* Ride Completion Modal */}
      <RideCompletionModal
        showCompletionModal={showCompletionModal}
        setShowCompletionModal={setShowCompletionModal}
        isPassenger={isPassenger}
        updateRideStatus={updateRideStatus}
      />
    </div>
  );
};

export default LiveTracking;




