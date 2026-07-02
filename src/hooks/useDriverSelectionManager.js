import { useState, useEffect } from 'react';
import api from '../services/axios';
import { useDispatch } from 'react-redux';
import { setSelectedRider } from '../Redux/riderslice';

export const useDriverSelectionManager = (rideId, bookingStatus, setBookingStatus, setSelectedDriverForUI) => {
  const dispatch = useDispatch();
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [rideDetails, setRideDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchingRide, setFetchingRide] = useState(true);

  useEffect(() => {
    const fetchRideAndDrivers = async () => {
      try {
        setFetchingRide(true);
        const token = localStorage.getItem('nvcr_tk');
        let currentRideDetails = null;

        if (rideId) {
          try {
            const rideResponse = await api.get(`/ride/${rideId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            currentRideDetails = rideResponse.data.ride;
            setRideDetails(currentRideDetails);
          } catch (err) {
            console.error('Error fetching ride details:', err);
          }
        }
        setFetchingRide(false);

        setLoading(true);
        try {
          const lat = currentRideDetails?.pickupCoordinates?.coordinates[1] || rideDetails?.pickupCoordinates?.coordinates[1];
          const lng = currentRideDetails?.pickupCoordinates?.coordinates[0] || rideDetails?.pickupCoordinates?.coordinates[0];

          if (lat && lng) {
            const driverResponse = await api.get('/rider/nearby-drivers', {
              params: { lat, lng, maxDistance: 5000 }
            });

            const transformedDrivers = driverResponse.data.drivers.map(driver => ({
              id: driver._id,
              name: `${driver.riderInfo.firstname} ${driver.riderInfo.lastname}`,
              rating: 4.8,
              totalRides: 156,
              fare: currentRideDetails?.fare || 2500,
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rideId]); // purposely omitted rideDetails?.id to avoid infinite re-fetches or redundant loops since we use currentRideDetails inside the function now.

  const handleDriverSelect = (driver) => {
    if (bookingStatus === 'waiting') return;
    setSelectedDriver(driver);
    setSelectedDriverForUI(driver); // optional sync to parent if it needs it directly, otherwise the parent can just read it from hook return
    dispatch(setSelectedRider(driver));
    if (bookingStatus === 'rejected' && setBookingStatus) {
      setBookingStatus('idle');
    }
  };

  const handleConfirmBooking = async () => {
    if (selectedDriver && rideId) {
      try {
        setBookingStatus('waiting');
        const token = localStorage.getItem('nvcr_tk');
        const response = await api.post(`/ride/${rideId}/assign-driver`, {
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

  return {
    drivers,
    rideDetails,
    loading,
    fetchingRide,
    selectedDriver,
    handleDriverSelect,
    handleConfirmBooking,
    setSelectedDriver
  };
};




