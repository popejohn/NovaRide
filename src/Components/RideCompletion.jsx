import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import OtherNav from './VerifiedNav';
import Button from './Button';
import { FaStar, FaMapMarkerAlt, FaClock, FaCar, FaCheckCircle } from 'react-icons/fa';
import api from '../services/axios';

const StarRating = ({ rating, onRatingChange }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`text-2xl cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          onClick={() => onRatingChange(star)}
        />
      ))}
    </div>
  );
};

const RideCompletion = () => {
  const { user, role } = useSelector(state => state.verifiedUser);
  const isRider = role?.includes('rider') || role === 'rider';
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const rideId = queryParams.get('rideId');

  const [rideDetails, setRideDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchRideDetails = async () => {
      if (!rideId) {
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem('nvcr_tk');
        const response = await api.get(`/ride/${rideId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setRideDetails(response.data.ride);
      } catch (error) {
        console.error('Error fetching ride details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [rideId]);

  const handleSubmitRating = async () => {
    try {
      const token = localStorage.getItem('nvcr_tk');
      await api.post(`/ride/${rideId}/rate`, {
        rating,
        feedback
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating. Please try again.');
    }
  };

  const handleBookAnother = () => {
    navigate('/bookride');
  };

  const handleGoHome = () => {
    navigate(isRider ? '/riderdashboard' : '/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!rideDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <h2 className="text-2xl font-bold mb-4">Ride details not available</h2>
        <Button text="Go Home" onClick={handleGoHome} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar userrole={role} userverified={true} profilePic={user?.profilePic || "/placeholderProfile.jpg"} nav={<OtherNav userrole={role} />} />

      <div className="mt-24 px-8 pb-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ride Completed!</h1>
            <p className="text-gray-600">Thank you for riding with Nova</p>
          </div>

          {/* Ride Summary Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-neutral-100">
            <h2 className="text-xl font-semibold mb-4">Ride Summary</h2>

            <div className="space-y-6">
              {/* Route */}
              <div className="flex items-start space-x-3">
                <div className="flex flex-col items-center">
                  <FaMapMarkerAlt className="text-green-500" />
                  <div className="w-0.5 h-12 bg-neutral-200 my-1"></div>
                  <FaMapMarkerAlt className="text-red-500" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-lg">{rideDetails.pickupLocation}</div>
                  <div className="text-sm text-gray-500 mb-4">Pickup Location</div>
                  <div className="font-medium text-lg">{rideDetails.destination}</div>
                  <div className="text-sm text-gray-500">Destination</div>
                </div>
              </div>

              {/* Ride Details - Hidden for Riders */}
              {!isRider && (
                <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                  <div className="text-center bg-neutral-50 p-4 rounded-xl">
                    <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
                      <FaMapMarkerAlt className="text-sm" />
                      <span className="text-xs font-bold uppercase tracking-wider">Distance</span>
                    </div>
                    <div className="font-bold text-xl">{rideDetails.distance} km</div>
                  </div>
                  <div className="text-center bg-neutral-50 p-4 rounded-xl">
                    <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
                      <FaClock className="text-sm" />
                      <span className="text-xs font-bold uppercase tracking-wider">Duration</span>
                    </div>
                    <div className="font-bold text-xl">{rideDetails.eta} min</div>
                  </div>
                </div>
              )}

              {/* User/Driver Info */}
              <div className="flex items-center space-x-4 pt-6 border-t">
                {isRider ? (
                  <div className="flex-1 flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-green-700">
                      <FaCheckCircle className="text-xl" />
                      <span className="font-bold text-lg text-neutral-900">Earnings Collected</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-orange-500">₦{(rideDetails.fare * 0.85).toLocaleString()}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Paid (85%) into your Wallet</div>
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={rideDetails.assignedDriver?.riderInfo?.profilePic || '/placeholderProfile.jpg'}
                      alt={rideDetails.assignedDriver?.riderInfo?.firstname}
                      className="w-16 h-16 rounded-full border-2 border-orange-500/20"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-lg">{rideDetails.assignedDriver?.riderInfo?.firstname} {rideDetails.assignedDriver?.riderInfo?.lastname}</div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FaCar className="text-orange-500" />
                        <span>{rideDetails.assignedDriver?.vehicleType} • {rideDetails.assignedDriver?.plateNumber}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-orange-500">₦{rideDetails.fare.toLocaleString()}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Paid from Wallet</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Rating Section (For Passengers and Riders) */}
          {!submitted ? (
            <div className="bg-neutral-900 text-white rounded-[2rem] shadow-2xl p-8 mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl -mr-16 -mt-16"></div>
              <h2 className="text-2xl font-black mb-6 relative z-10">
                {isRider ? "Rate Your Trip" : "Rate Your Experience"}
              </h2>

              <div className="space-y-6 relative z-10">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-3">
                    {isRider ? "How was your trip with this passenger?" : "How was your ride?"}
                  </label>
                  <StarRating rating={rating} onRatingChange={setRating} />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-3">Additional Feedback (Optional)</label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder={isRider ? "Tell us about the passenger..." : "Tell us about your experience..."}
                    className="w-full p-4 rounded-2xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none transition-all"
                    rows={3}
                  />
                </div>

                <Button
                  text="Submit Rating"
                  classes="w-full bg-orange-500 text-white py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 disabled:opacity-50 transition-all shadow-lg shadow-orange-500/20"
                  onClick={handleSubmitRating}
                  disabled={rating === 0}
                />
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 rounded-3xl p-8 mb-8 text-center"
            >
              <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-900">Thank you for your feedback!</h3>
              <p className="text-green-700 mt-2">Your contribution helps us keep Nova premium.</p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            {!isRider && (
              <Button
                text="Book Another Ride"
                classes="flex-1 bg-neutral-900 text-white py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all"
                onClick={handleBookAnother}
              />
            )}
            <Button
              text="Go Home"
              classes="flex-1 bg-white border border-neutral-200 text-neutral-900 py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-neutral-50 transition-all shadow-sm"
              onClick={handleGoHome}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideCompletion;



