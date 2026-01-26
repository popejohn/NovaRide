import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Navbar from './Navbar';
import OtherNav from './VerifiedNav';
import Button from './Button';
import { setSelectedRider } from '../Redux/riderslice';
import { FaStar, FaMapMarkerAlt, FaCar, FaUser } from 'react-icons/fa';

const DriverCard = ({ driver, onSelect, selected }) => (
  <div className={`p-4 border rounded-lg cursor-pointer transition-all ${selected ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-yellow-300'}`} onClick={() => onSelect(driver)}>
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-3">
        <img src={driver.profilePic || '/placeholderProfile.jpg'} alt={driver.name} className="w-12 h-12 rounded-full" />
        <div>
          <h3 className="font-semibold text-lg">{driver.name}</h3>
          <div className="flex items-center space-x-1">
            <FaStar className="text-yellow-400" />
            <span className="text-sm text-gray-600">{driver.rating} ({driver.totalRides} rides)</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-bold text-lg">₦{driver.fare}</div>
        <div className="text-sm text-gray-500">{driver.distance} km away</div>
      </div>
    </div>

    <div className="mt-3 space-y-2">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <FaCar />
        <span>{driver.vehicle.model} • {driver.vehicle.color} • {driver.vehicle.plate}</span>
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <FaMapMarkerAlt />
        <span>{driver.distance} km • {driver.eta} min away</span>
      </div>
    </div>

    {selected && (
      <div className="mt-3 p-2 bg-yellow-100 rounded text-sm text-yellow-800">
        Driver selected - Proceed to confirm booking
      </div>
    )}
  </div>
);

const DriverSelection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pickupLocation, destination, rideCost } = useSelector(state => state.getRide);
  const { pickupCoordinate } = useSelector(state => state.location);

  const [selectedDriver, setSelectedDriver] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNearbyDrivers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/rider/nearby-drivers', {
          params: {
            lat: pickupCoordinate.lat,
            lng: pickupCoordinate.lng,
            maxDistance: 5000 // 5km radius
          }
        });

        // Transform the data to match the expected format
        const transformedDrivers = response.data.drivers.map((driver, index) => ({
          id: driver._id,
          name: `${driver.riderInfo.firstname} ${driver.riderInfo.lastname}`,
          rating: 4.5, // Default rating, could be calculated from reviews
          totalRides: 100, // Default, could be from driver stats
          fare: rideCost || 2500,
          distance: driver.distance || 1.0,
          eta: Math.ceil((driver.distance || 1.0) * 3), // Rough ETA calculation
          profilePic: driver.riderInfo.profilePic || '/placeholderProfile.jpg',
          vehicle: {
            model: driver.vehicleType,
            color: 'Unknown', // Not in schema
            plate: driver.plateNumber
          }
        }));

        setDrivers(transformedDrivers);
      } catch (error) {
        console.error('Error fetching drivers:', error);
        // Fallback to empty array or show error
        setDrivers([]);
      } finally {
        setLoading(false);
      }
    };

    if (pickupCoordinate.lat && pickupCoordinate.lng) {
      fetchNearbyDrivers();
    }
  }, [pickupCoordinate, rideCost]);

  const handleDriverSelect = (driver) => {
    setSelectedDriver(driver);
    dispatch(setSelectedRider(driver));
  };

  const handleConfirmBooking = () => {
    if (selectedDriver) {
      // In real app, this would make API call to book the ride
      navigate('/live-tracking');
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar userrole="" userverified={true} profilePic="/placeholderProfile.jpg" nav={<OtherNav />} />

      <div className="mt-24 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Choose Your Driver</h1>
            <p className="text-gray-600">Select from available drivers near you</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="font-semibold mb-2">Trip Details</h2>
            <div className="flex justify-between items-center text-sm">
              <div>
                <div className="font-medium">From: {pickupLocation}</div>
                <div className="font-medium">To: {destination}</div>
              </div>
              <div className="text-right">
                <div className="font-bold">Estimated Fare: ₦{rideCost || 2500}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading nearby drivers...</p>
              </div>
            ) : drivers.length > 0 ? (
              drivers.map(driver => (
                <DriverCard
                  key={driver.id}
                  driver={driver}
                  onSelect={handleDriverSelect}
                  selected={selectedDriver?.id === driver.id}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No drivers available in your area at the moment.</p>
              </div>
            )}
          </div>

          {selectedDriver && (
            <div className="mt-6 bg-black text-white p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Ready to book with {selectedDriver.name}?</h3>
                  <p className="text-gray-300 text-sm">Your driver will arrive in approximately {selectedDriver.eta} minutes</p>
                </div>
                <Button
                  text="Confirm Booking"
                  classes="bg-yellow-400 text-black px-6 py-2 rounded font-semibold hover:bg-yellow-500"
                  onClick={handleConfirmBooking}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverSelection;