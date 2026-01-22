import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import OtherNav from './VerifiedNav';
import Button from './Button';
import { FaStar, FaMapMarkerAlt, FaClock, FaCar, FaCheckCircle } from 'react-icons/fa';

const StarRating = ({ rating, onRatingChange }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`text-2xl cursor-pointer ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          onClick={() => onRatingChange(star)}
        />
      ))}
    </div>
  );
};

const RideCompletion = () => {
  const navigate = useNavigate();
  const { pickupLocation, destination, selectedRider } = useSelector(state => state.getRide);

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Mock ride data
  const rideData = {
    distance: 12.5,
    duration: 28,
    fare: selectedRider?.fare || 2500,
    driver: selectedRider || {
      name: 'John Adebayo',
      vehicle: { model: 'Toyota Camry', plate: 'ABC 123 XY' }
    },
    pickupTime: '10:30 AM',
    dropoffTime: '10:58 AM',
    date: 'December 17, 2025'
  };

  const handleSubmitRating = () => {
    // In real app, submit rating to API
    setSubmitted(true);
    // Could show success message or navigate
  };

  const handleBookAnother = () => {
    navigate('/bookride');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      <Navbar userrole="" userverified={true} profilePic="/placeholderProfile.jpg" nav={<OtherNav />} />

      <div className="mt-24 px-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ride Completed!</h1>
            <p className="text-gray-600">Thank you for riding with Maruwa</p>
          </div>

          {/* Ride Summary Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Ride Summary</h2>

            <div className="space-y-4">
              {/* Route */}
              <div className="flex items-start space-x-3">
                <div className="flex flex-col items-center">
                  <FaMapMarkerAlt className="text-green-500" />
                  <div className="w-0.5 h-8 bg-gray-300 mt-1"></div>
                  <FaMapMarkerAlt className="text-red-500" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{pickupLocation}</div>
                  <div className="text-sm text-gray-500 mb-2">{rideData.pickupTime}</div>
                  <div className="font-medium">{destination}</div>
                  <div className="text-sm text-gray-500">{rideData.dropoffTime}</div>
                </div>
              </div>

              {/* Ride Details */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
                    <FaMapMarkerAlt />
                    <span className="text-sm">Distance</span>
                  </div>
                  <div className="font-semibold">{rideData.distance} km</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
                    <FaClock />
                    <span className="text-sm">Duration</span>
                  </div>
                  <div className="font-semibold">{rideData.duration} min</div>
                </div>
              </div>

              {/* Driver Info */}
              <div className="flex items-center space-x-3 pt-4 border-t">
                <img
                  src={rideData.driver.profilePic || '/placeholderProfile.jpg'}
                  alt={rideData.driver.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="font-medium">{rideData.driver.name}</div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FaCar />
                    <span>{rideData.driver.vehicle.model} • {rideData.driver.vehicle.plate}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">₦{rideData.fare}</div>
                  <div className="text-sm text-gray-500">Paid via Wallet</div>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Section */}
          {!submitted ? (
            <div className="bg-black text-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Rate Your Experience</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">How was your ride with {rideData.driver.name}?</label>
                  <StarRating rating={rating} onRatingChange={setRating} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Additional Feedback (Optional)</label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tell us about your experience..."
                    className="w-full p-3 rounded border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
                    rows={3}
                  />
                </div>

                <Button
                  text="Submit Rating"
                  classes="w-full bg-yellow-400 text-black py-3 px-4 rounded font-semibold hover:bg-yellow-500 disabled:opacity-50"
                  onClick={handleSubmitRating}
                  disabled={rating === 0}
                />
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-2 text-green-800">
                <FaCheckCircle />
                <span className="font-medium">Thank you for your feedback!</span>
              </div>
              <p className="text-green-700 text-sm mt-1">Your rating helps us improve our service.</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              text="Book Another Ride"
              classes="flex-1 bg-black text-white py-3 px-4 rounded font-semibold hover:bg-gray-800"
              onClick={handleBookAnother}
            />
            <Button
              text="Go Home"
              classes="flex-1 bg-yellow-400 text-black py-3 px-4 rounded font-semibold hover:bg-yellow-500"
              onClick={handleGoHome}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideCompletion;