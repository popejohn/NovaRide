import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FaStar, FaMapMarkerAlt, FaCar, FaUser, FaClock, FaRoute, FaArrowLeft, FaShieldAlt, FaPhoneAlt, FaTimes } from 'react-icons/fa';
import { IoMdInformationCircleOutline, IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";
import { ClipLoader } from 'react-spinners';
import Button from './Button';
import { toast } from 'react-toastify';
import { setSelectedRider } from '../Redux/riderslice';
import profilePicPlaceholder from '../assets/placeholderProfile.jpg';

// StatusModal Component for ride acceptance/rejection
const StatusModal = ({ status, driver, onAction, onProceed }) => {
  const isAccepted = status === 'accepted';
  const [hasCalled, setHasCalled] = useState(false);

  const handleCall = () => {
    setHasCalled(true);
    // The href tel: will handle the actual calling on mobile
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-sm bg-[#121212] rounded-[2.5rem] border border-white/10 p-8 shadow-2xl text-center"
      >
        <div className="mb-6">
          {isAccepted ? (
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
              <IoMdCheckmarkCircle className="text-5xl text-green-500" />
            </div>
          ) : (
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
              <IoMdCloseCircle className="text-5xl text-red-500" />
            </div>
          )}
        </div>

        <h2 className="text-2xl font-black mb-2 tracking-tighter uppercase">
          Ride {isAccepted ? 'Accepted' : 'Declined'}
        </h2>
        <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
          {isAccepted
            ? `${driver?.name} is on the way to pick you up!`
            : "The rider declined your request. Please select another rider."
          }
        </p>

        {isAccepted && driver && (
          <div className="bg-white/5 rounded-2xl p-4 mb-8 flex items-center gap-4 text-left border border-white/5">
            <img
              src={driver.profilePic || profilePicPlaceholder}
              alt={driver.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-bold text-white">{driver.name}</p>
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">⭐ {driver.rating} Rating</p>
              {hasCalled && <p className="text-orange-500 font-bold text-xs mt-1">{driver.phone}</p>}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {isAccepted ? (
            <>
              <a
                href={`tel:${driver?.phone}`}
                onClick={handleCall}
                className="flex items-center justify-center gap-3 w-full py-4 bg-orange-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
              >
                <FaPhoneAlt /> Call Driver
              </a>

              <AnimatePresence>
                {hasCalled && (
                  <motion.button
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    onClick={onProceed}
                    className="w-full py-4 bg-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10"
                  >
                    Proceed to Tracking
                  </motion.button>
                )}
              </AnimatePresence>
            </>
          ) : (
            <button
              onClick={() => onAction()}
              className="w-full py-4 bg-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all"
            >
              Try Another Rider
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// DriverCard Component with premium design
const DriverCard = ({ driver, onSelect, selected }) => (
  // ... (DriverCard content kept same but using imports already there)
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    onClick={() => onSelect(driver)}
    className={`group relative p-5 rounded-2xl cursor-pointer transition-all duration-300 border backdrop-blur-md ${selected
      ? 'bg-orange-500/10 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.15)]'
      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
      }`}
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={driver.profilePic || profilePicPlaceholder}
            alt={driver.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-orange-500/30"
          />
          <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-[#121212]"></div>
        </div>
        <div>
          <h3 className="font-bold text-xl text-white group-hover:text-orange-400 transition-colors">{driver.name}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex items-center bg-orange-500/20 px-2 py-0.5 rounded-lg border border-orange-500/20">
              <FaStar className="text-orange-400 text-sm mr-1" />
              <span className="text-sm font-bold text-orange-400">{driver.rating}</span>
            </div>
            <span className="text-sm text-neutral-400">{driver.totalRides} rides</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-black text-white">₦{driver.fare.toLocaleString()}</div>
        <div className="text-sm font-medium text-orange-500">{driver.eta} mins away</div>
      </div>
    </div>

    <div className="mt-6 grid grid-cols-2 gap-3">
      <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/5">
        <FaCar className="text-neutral-400" />
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Vehicle</span>
          <span className="text-sm text-neutral-300 truncate">{driver.vehicle.model} • {driver.vehicle.plate}</span>
        </div>
      </div>
      <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/5">
        <FaMapMarkerAlt className="text-neutral-400" />
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Distance</span>
          <span className="text-sm text-neutral-300">{driver.distance} km</span>
        </div>
      </div>
    </div>

    {selected && (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-4 flex items-center justify-center space-x-2 py-2 bg-orange-500 rounded-xl text-white font-bold"
      >
        <FaShieldAlt />
        <span>Selected Driver</span>
      </motion.div>
    )}
  </motion.div>
);

const DriverSelection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const rideId = queryParams.get('rideId');

  const { user } = useSelector(state => state.verifiedUser);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [rideDetails, setRideDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchingRide, setFetchingRide] = useState(true);
  const [bookingStatus, setBookingStatus] = useState('idle'); // idle, waiting, accepted, rejected
  const [acceptedDriver, setAcceptedDriver] = useState(null);

  useEffect(() => {
    let socket;
    const token = localStorage.getItem('nvcr_tk');

    if (user?._id && token) {
      socket = io('http://localhost:5000', { auth: { token } });

      socket.on('connect', () => {
        socket.emit('join', user._id);
      });

      socket.on('rideAccepted', (data) => {
        if (String(data.rideId) === String(rideId)) {
          setAcceptedDriver(data.driver);
          setBookingStatus('accepted');
          toast.success("Ride Accepted!");
          // Automatic redirection removed as per new implementation
        }
      });

      socket.on('rideRejected', (data) => {
        if (String(data.rideId) === String(rideId)) {
          setBookingStatus('rejected');
          setSelectedDriver(null);
          toast.error("The rider declined your request.");
        }
      });

      return () => {
        if (socket) socket.disconnect();
      };
    }
  }, [user?.id, rideId, navigate]);

  useEffect(() => {
    const fetchRideAndDrivers = async () => {
      try {
        setFetchingRide(true);
        const token = localStorage.getItem('nvcr_tk');

        if (rideId) {
          try {
            const rideResponse = await axios.get(`/api/ride/${rideId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setRideDetails(rideResponse.data.ride);
          } catch (err) {
            console.error('Error fetching ride details:', err);
          }
        }
        setFetchingRide(false);

        setLoading(true);
        try {
          const lat = rideDetails?.pickupCoordinates?.coordinates[1];
          const lng = rideDetails?.pickupCoordinates?.coordinates[0];

          if (lat && lng) {
            const driverResponse = await axios.get('/api/rider/nearby-drivers', {
              params: { lat, lng, maxDistance: 5000 }
            });

            const transformedDrivers = driverResponse.data.drivers.map(driver => ({
              id: driver._id,
              name: `${driver.riderInfo.firstname} ${driver.riderInfo.lastname}`,
              rating: 4.8,
              totalRides: 156,
              fare: rideDetails?.fare || 2500,
              distance: parseFloat(driver.distance?.toFixed(1)) || 1.2,
              eta: Math.ceil((driver.distance || 1.2) * 4),
              profilePic: driver.riderInfo.profilePic,
              vehicle: {
                model: driver.vehicleType,
                color: 'Black',
                plate: driver.plateNumber
              }
            }));

            setDrivers(transformedDrivers);
          }
        } catch (err) {
          console.error('Error fetching drivers:', err);
          setDrivers([]);
        } finally {
          setLoading(false);
        }
      } catch (error) {
        console.error('Core fetch error:', error);
      }
    };

    fetchRideAndDrivers();
  }, [rideId, rideDetails?._id]);

  const handleDriverSelect = (driver) => {
    if (bookingStatus === 'waiting') return;
    setSelectedDriver(driver);
    dispatch(setSelectedRider(driver));
  };

  const handleConfirmBooking = async () => {
    if (selectedDriver && rideId) {
      try {
        setBookingStatus('waiting');
        const token = localStorage.getItem('nvcr_tk');
        const response = await axios.post(`/api/ride/${rideId}/assign-driver`, {
          driverId: selectedDriver.id
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status !== 200) {
          setBookingStatus('idle');
          alert('Failed to assign driver. Please try again.');
        }
      } catch (error) {
        console.error('Error assigning driver:', error);
        setBookingStatus('idle');
        alert('Failed to confirm booking. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-orange-500/30">
      {/* Premium Header/Background */}
      <div className="fixed top-0 inset-x-0 h-[40vh] bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-24">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-all group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-black uppercase tracking-tighter">Nova <span className="text-orange-500">Selection</span></h1>
            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Find your perfect ride</p>
          </div>
          <div className="w-11"></div> {/* Spacer */}
        </div>

        {/* Ride Details Summary Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl mb-12"
        >
          {fetchingRide ? (
            <div className="flex flex-col items-center py-4">
              <ClipLoader color="#f97316" size={30} />
              <p className="mt-2 text-neutral-400 text-sm">Fetching trip details...</p>
            </div>
          ) : rideDetails ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6 relative">
                {/* Visual Route Line */}
                <div className="absolute left-[7px] top-[26px] bottom-[26px] w-[2px] bg-gradient-to-b from-orange-500 to-blue-500 rounded-full"></div>

                <div className="flex items-start z-10 relative">
                  <div className="w-4 h-4 rounded-full bg-orange-500 mt-1 border-4 border-[#121212] shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                  <div className="ml-6">
                    <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Pickup</span>
                    <p className="text-lg font-bold leading-tight line-clamp-2">{rideDetails.pickupLocation}</p>
                  </div>
                </div>

                <div className="flex items-start z-10 relative">
                  <div className="w-4 h-4 rounded-full bg-blue-500 mt-1 border-4 border-[#121212] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                  <div className="ml-6">
                    <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Destination</span>
                    <p className="text-lg font-bold leading-tight line-clamp-2">{rideDetails.destination}</p>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 rounded-2xl p-6 border border-white/5 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-400 flex items-center gap-2"><FaRoute /> Distance</span>
                  <span className="font-bold text-white">{rideDetails.distance} km</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-400 flex items-center gap-2"><FaClock /> Est. Duration</span>
                  <span className="font-bold text-white">{rideDetails.eta} mins</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                  <span className="text-neutral-400 font-bold">Total Fare</span>
                  <span className="text-3xl font-black text-orange-500">₦{rideDetails.fare.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-neutral-400">
              <IoMdInformationCircleOutline className="mx-auto text-4xl mb-2 opacity-20" />
              <p>Enter pickup and destination to see details</p>
            </div>
          )}
        </motion.div>

        {/* Drivers Section */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-tight">Available Riders</h2>
          <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-full">{drivers.length} NEARBY</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20">
            <div className="relative">
              <ClipLoader color="#f97316" size={60} />
              <div className="absolute inset-0 flex items-center justify-center">
                <FaCar className="text-orange-500 animate-pulse" />
              </div>
            </div>
            <p className="mt-6 text-neutral-400 font-medium">Scanning for available riders...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {drivers.map((driver, index) => (
                <DriverCard
                  key={driver.id}
                  driver={driver}
                  onSelect={handleDriverSelect}
                  selected={selectedDriver?.id === driver.id}
                />
              ))}
            </AnimatePresence>

            {drivers.length === 0 && (
              <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                <FaUser className="mx-auto text-4xl text-neutral-700 mb-4" />
                <p className="text-neutral-500 font-medium">No drivers found in your vicinity.</p>
                <p className="text-xs text-neutral-600 mt-2">Try expanding your search or wait a moment.</p>
              </div>
            )}
          </div>
        )}

        {/* Confirm Booking Sticky Mobile/Bottom */}
        <AnimatePresence>
          {selectedDriver && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-10 inset-x-6 z-50 md:relative md:bottom-auto md:inset-x-0 md:mt-12"
            >
              <div className="bg-orange-500 p-1 rounded-[2rem] shadow-[0_20px_50px_rgba(249,115,22,0.3)]">
                <div className="bg-[#121212] flex items-center justify-between p-4 rounded-[1.8rem]">
                  <div className="flex items-center space-x-4">
                    <div className="bg-orange-500/20 p-3 rounded-2xl">
                      <FaShieldAlt className="text-orange-500 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white leading-tight">Book {selectedDriver.name}</h4>
                      <p className="text-xs text-neutral-400">Total: ₦{selectedDriver.fare.toLocaleString()}</p>
                    </div>
                  </div>
                  <Button
                    text={bookingStatus === 'waiting' ? "Waiting for Driver..." : "Confirm Booking"}
                    disabled={bookingStatus === 'waiting'}
                    classes={`${bookingStatus === 'waiting' ? 'bg-neutral-600' : 'bg-orange-500 hover:bg-orange-600'} text-white px-8 py-4 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-lg shadow-orange-500/20`}
                    onClick={handleConfirmBooking}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(bookingStatus === 'accepted' || bookingStatus === 'rejected') && (
            <StatusModal
              status={bookingStatus}
              driver={acceptedDriver}
              onAction={() => setBookingStatus('idle')}
              onProceed={() => navigate(`/live-tracking?rideId=${rideId}`)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DriverSelection;
