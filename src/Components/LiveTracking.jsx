import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import Navbar from './Navbar';
import OtherNav from './VerifiedNav';
import Button from './Button';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaClock, FaCar, FaPhone, FaStar, FaExclamationTriangle, FaRoute } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

const LiveTracking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const rideId = queryParams.get('rideId');

  const [rideDetails, setRideDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rideStatus, setRideStatus] = useState('Waiting for driver to accept...');
  const [driverLocation, setDriverLocation] = useState(null);
  const [complaintText, setComplaintText] = useState('');
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [hasCalled, setHasCalled] = useState(false);
  const user = useSelector(state => state.verifiedUser.user);
  const userRoles = useSelector(state => state.verifiedUser.role); // This is an array

  // Derived role flags for the current ride
  const isPassenger = rideDetails?.user?._id === user?._id || rideDetails?.user === user?._id;
  const isRider = rideDetails?.assignedDriver?.riderInfo?._id === user?._id || rideDetails?.assignedDriver?.riderInfo === user?._id;

  const fetchRideStatus = useCallback(async () => {
    if (!rideId) return;
    try {
      const token = localStorage.getItem('nvcr_tk');
      const response = await fetch(`/api/ride/${rideId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const ride = data.ride;
        setRideDetails(ride);

        const statusMap = {
          'accepted': 'Driver is on the way',
          'at_pickup': 'Driver is at pickup location',
          'starting': 'Awaiting driver agreement',
          'in_progress': 'Trip in progress',
          'completed': 'Ride completed',
          'cancelled': 'Ride cancelled'
        };
        setRideStatus(statusMap[ride.rideStatus] || ride.rideStatus);

        if (ride.rideStatus === 'completed') {
          setTimeout(() => {
            navigate(`/ride-completion?rideId=${rideId}`);
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Error fetching ride status:', error);
    } finally {
      setLoading(false);
    }
  }, [rideId, navigate]);

  useEffect(() => {
    let socket;
    const token = localStorage.getItem('nvcr_tk');

    if (user && user._id && token && rideId) {
      socket = io('http://localhost:5000', { auth: { token } });

      socket.on('connect', () => {
        socket.emit('join', user._id);
        socket.emit('joinRide', rideId);
      });

      if (userRoles?.includes('rider') && isRider) {
        const locationInterval = setInterval(() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              const { latitude, longitude } = position.coords;
              socket.emit('updateLocation', {
                rideId,
                location: { lat: latitude, lng: longitude }
              });
              setDriverLocation({ lat: latitude, lng: longitude });
            });
          }
        }, 4000);

        return () => {
          clearInterval(locationInterval);
          if (socket) socket.disconnect();
        };
      } else if (isPassenger) {
        socket.on('driverLocationUpdate', (data) => {
          setDriverLocation(data.location);
        });

        socket.on('statusUpdate', (data) => {
          const statusMap = {
            'accepted': 'Driver is on the way',
            'at_pickup': 'Driver is at pickup location',
            'starting': 'Awaiting driver agreement',
            'in_progress': 'Trip in progress',
            'completed': 'Ride completed',
            'cancelled': 'Ride cancelled'
          };
          setRideStatus(statusMap[data.status] || data.status);
          if (data.status === 'completed') {
            setTimeout(() => {
              navigate(`/ride-completion?rideId=${rideId}`);
            }, 3000);
          }
        });
      }
    }

    if (rideId) {
      fetchRideStatus();
      const interval = setInterval(fetchRideStatus, 5000);
      return () => {
        clearInterval(interval);
        if (socket) socket.disconnect();
      };
    }
  }, [rideId, navigate, user, userRoles, fetchRideStatus]);

  const handleSubmitComplaint = async () => {
    if (!complaintText.trim()) return;
    try {
      const token = localStorage.getItem('nvcr_tk');
      await axios.post(`/api/ride/${rideId}/complaint`, {
        text: complaintText,
        role: isRider ? 'rider' : 'passenger'
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success("Complaint submitted successfully");
      setComplaintText('');
      setShowComplaintForm(false);
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error("Failed to submit complaint");
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

  const routeCoordinates = [pickupCoords, driverCoords, destinationCoords];

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
            {isPassenger && (
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
                <MapContainer
                  center={driverCoords}
                  zoom={14}
                  style={{ height: '100%', width: '100%', filter: 'grayscale(100%) invert(90%) contrast(150%) brightness(100%)' }}
                  className="z-0"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={pickupCoords}><Popup>Pickup</Popup></Marker>
                  <Marker position={driverCoords}><Popup>{isRider ? 'You' : 'Rider'}</Popup></Marker>
                  <Marker position={destinationCoords}><Popup>Destination</Popup></Marker>
                  <Polyline positions={routeCoordinates} color="#f97316" weight={5} opacity={0.8} dashArray="15, 15" />
                </MapContainer>

                <div className="absolute top-8 right-8 z-10 space-y-3">
                  <div className="p-5 bg-black/90 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-2xl flex items-center gap-4 group-hover:border-orange-500/50 transition-colors">
                    <FaClock className="text-orange-500 text-xl" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Duration</span>
                      <span className="text-lg font-black">{rideDetails.eta} MINS</span>
                    </div>
                  </div>
                  <div className="p-5 bg-black/90 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-2xl flex items-center gap-4 group-hover:border-orange-500/50 transition-colors">
                    <FaRoute className="text-orange-500 text-xl" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Distance</span>
                      <span className="text-lg font-black">{rideDetails.distance} KM</span>
                    </div>
                  </div>
                </div>
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
                        : rideDetails.assignedDriver?.riderInfo?.firstname || 'Rider Assigned'}
                    </h4>
                    {isRider && hasCalled && (
                      <p className="text-orange-500 font-black text-xs mb-2 animate-pulse tracking-wider">
                        {rideDetails.user?.phone}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <div className="flex text-orange-500">
                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">4.9 Star</span>
                    </div>
                  </div>
                </div>

                {isPassenger && rideDetails.assignedDriver && (
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-5 bg-black/40 rounded-2xl border border-white/5 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Color/Model</p>
                      <p className="font-black text-sm uppercase">{rideDetails.assignedDriver.vehicleType}</p>
                    </div>
                    <div className="p-5 bg-black/40 rounded-2xl border border-white/5 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Plate Number</p>
                      <p className="font-black text-sm uppercase text-orange-500 tracking-wider">{rideDetails.assignedDriver.plateNumber}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {isRider && rideDetails.rideStatus !== 'in_progress' && rideDetails.rideStatus !== 'completed' && (
                    <a
                      href={`tel:${rideDetails.user?.phone}`}
                      onClick={() => setHasCalled(true)}
                      className="w-full py-5 bg-white text-black rounded-[1.5rem] font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-4 shadow-2xl transition-all hover:bg-orange-500 hover:text-white"
                    >
                      <FaPhone className="text-sm" />
                      Call Passenger
                    </a>
                  )}

                  <div className="space-y-3">
                    {isRider ? (
                      <>
                        {rideDetails.rideStatus === 'accepted' && (
                          <Button
                            text="I HAVE ARRIVED"
                            classes="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.25em] shadow-xl hover:bg-blue-700 transition-colors"
                            onClick={async () => {
                              const token = localStorage.getItem('nvcr_tk');
                              await fetch(`/api/ride/${rideId}/status`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                body: JSON.stringify({ status: 'at_pickup' })
                              });
                              fetchRideStatus();
                            }}
                          />
                        )}
                        {rideDetails.rideStatus === 'starting' && (
                          <Button
                            text="AGREE TO START TRIP"
                            classes="w-full bg-orange-500 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.25em] shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:bg-orange-600 transition-all"
                            onClick={async () => {
                              const token = localStorage.getItem('nvcr_tk');
                              await fetch(`/api/ride/${rideId}/status`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                body: JSON.stringify({ status: 'in_progress' })
                              });
                              fetchRideStatus();
                            }}
                          />
                        )}
                        {rideDetails.rideStatus === 'in_progress' && (
                          <Button
                            text="COMPLETE RIDE"
                            classes="w-full bg-green-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.25em] shadow-xl hover:bg-green-700 transition-colors"
                            onClick={async () => {
                              const token = localStorage.getItem('nvcr_tk');
                              await fetch(`/api/ride/${rideId}/status`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                body: JSON.stringify({ status: 'completed' })
                              });
                              fetchRideStatus();
                            }}
                          />
                        )}
                      </>
                    ) : (
                      <>
                        {rideDetails.rideStatus === 'at_pickup' && (
                          <Button
                            text="START MY TRIP"
                            classes="w-full bg-orange-500 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.25em] shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:bg-orange-600 transition-all"
                            onClick={async () => {
                              const token = localStorage.getItem('nvcr_tk');
                              await fetch(`/api/ride/${rideId}/status`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                body: JSON.stringify({ status: 'starting' })
                              });
                              fetchRideStatus();
                            }}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Trip Details Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/10 shadow-3xl"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black uppercase tracking-tight italic text-neutral-400">Transaction</h3>
                  <div className="text-2xl font-black text-white tracking-tighter italic">₦{rideDetails.fare.toLocaleString()}</div>
                </div>

                <div className="space-y-6 relative ml-2">
                  <div className="absolute left-[7px] top-[26px] bottom-[26px] w-[1px] bg-white/10"></div>
                  <div className="flex items-start gap-6 relative z-10">
                    <div className="w-3.5 h-3.5 rounded-full bg-orange-500 mt-2 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Pickup</span>
                      <span className="text-sm font-bold text-neutral-100 line-clamp-1">{rideDetails.pickupLocation}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-6 relative z-10">
                    <div className="w-3.5 h-3.5 rounded-full bg-blue-500 mt-2 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Drop-off</span>
                      <span className="text-sm font-bold text-neutral-100 line-clamp-1">{rideDetails.destination}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-white/5">
                  <button
                    onClick={() => setShowComplaintForm(!showComplaintForm)}
                    className="w-full flex items-center justify-between group py-2"
                  >
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-neutral-600 group-hover:text-red-500 transition-colors">Report Discrepancy</span>
                    <FaExclamationTriangle className="text-neutral-800 group-hover:text-red-500 transition-colors" />
                  </button>

                  <AnimatePresence>
                    {showComplaintForm && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-4"
                      >
                        <textarea
                          value={complaintText}
                          onChange={(e) => setComplaintText(e.target.value)}
                          placeholder="Describe the issue..."
                          className="w-full bg-black/60 border border-white/10 rounded-2xl p-5 text-sm focus:border-orange-500/50 focus:outline-none min-h-[120px] resize-none transition-all placeholder:text-neutral-700"
                        />
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSubmitComplaint}
                          className="w-full mt-4 py-4 bg-red-600/90 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-600 transition-all shadow-2xl shadow-red-600/20"
                        >
                          Send Report
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
