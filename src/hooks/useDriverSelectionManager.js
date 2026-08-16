import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import api from '../services/axios';
import { useDispatch } from 'react-redux';
import { setSelectedRider } from '../Redux/riderslice';
import { useRiderAvailabilitySubscription } from './useRiderAvailabilitySubscription';

export const useDriverSelectionManager = (rideId, bookingStatus, setBookingStatus, setSelectedDriverForUI) => {
  const dispatch = useDispatch();
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [rideDetails, setRideDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchingRide, setFetchingRide] = useState(true);
  const isRateLimitedRef = useRef(false);
  const isAssigningRef = useRef(false);
  const currentRideDetailsRef = useRef(null);

  // Handle new rider coming online - add them to driver list if within range
  const handleNewRiderOnline = useCallback((newRiderData) => {
    const newDriver = {
      id: newRiderData.riderId,
      name: newRiderData.riderName,
      rating: 4.8,
      totalRides: 0,
      fare: rideDetails?.fare || null,
      distance: newRiderData.distance,
      eta: newRiderData.eta,
      profilePic: newRiderData.profilePic,
      vehicle: {
        model: newRiderData.vehicleType || 'Unknown',
        color: 'Black',
        plate: newRiderData.plateNumber
      },
      isNewlyOnline: true
    };

    setDrivers(prevDrivers => {
      const driverExists = prevDrivers.some(d => d.id === newRiderData.riderId);
      if (!driverExists) {
        return [newDriver, ...prevDrivers];
      }
      return prevDrivers.map(driver => (
        driver.id === newRiderData.riderId ? { ...driver, ...newDriver, isNewlyOnline: true } : driver
      ));
    });

    console.log(`New rider available: ${newRiderData.riderName}`);
  }, [rideDetails?.fare]);

  // Fetch nearby drivers without dependency issues. The rider list is time-sensitive,
  // so we explicitly bypass browser cache and retry on 304 cache hits.
  const performDriverFetch = useCallback(async (rideData) => {
    if (!rideData?.pickupCoordinates?.coordinates) return;

    const [lng, lat] = rideData.pickupCoordinates.coordinates;
    const buildRequestConfig = (requestId) => ({
      // A unique URL bypasses browser cache without adding non-simple CORS headers.
      params: { lat, lng, maxDistance: 5000, _t: requestId },
      validateStatus: (status) => (status >= 200 && status < 300) || status === 304
    });

    try {
      let driverResponse = await api.get('/rider/nearby-drivers', buildRequestConfig(Date.now()));

      if (driverResponse.status === 304) {
        console.warn('[Driver Selection] Nearby driver response was 304. Retrying with a cache-busting request.');
        driverResponse = await api.get('/rider/nearby-drivers', buildRequestConfig(Date.now()));
      }

      // Reset rate limit flag on successful request
      isRateLimitedRef.current = false;

      const responseDrivers = Array.isArray(driverResponse?.data?.drivers) ? driverResponse.data.drivers : [];
      const normalizedRideFare = Number(rideData?.fare);
      const transformedDrivers = responseDrivers.map(driver => ({
        id: driver._id,
        name: `${driver.riderInfo.firstname} ${driver.riderInfo.lastname}`,
        rating: 4.8,
        totalRides: 156,
        fare: Number.isFinite(normalizedRideFare) ? normalizedRideFare : null,
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
    } catch (err) {
      // Handle rate limiting gracefully - stop polling temporarily
      if (err.response?.status === 429) {
        console.warn('⚠️ Rate limited - pausing polling');
        isRateLimitedRef.current = true;
        return;
      }
      console.error('Error fetching drivers:', err);
    }
  }, []);

  const refreshAvailableDrivers = useCallback(() => {
    if (currentRideDetailsRef.current) {
      performDriverFetch(currentRideDetailsRef.current);
    }
  }, [performDriverFetch]);

  const handleRiderOffline = useCallback((riderId) => {
    setDrivers(previousDrivers => previousDrivers.filter(driver => String(driver.id) !== String(riderId)));
  }, []);



  // Subscribe to rider availability updates
  useRiderAvailabilitySubscription(
    rideDetails?.pickupCoordinates?.coordinates[1],
    rideDetails?.pickupCoordinates?.coordinates[0],
    handleNewRiderOnline,
    refreshAvailableDrivers,
    handleRiderOffline
  );

  useEffect(() => {
    const fetchRideAndSetup = async () => {
      try {
        setFetchingRide(true);
        const token = localStorage.getItem('nvcr_tk');

        // Fetch ride details once
        if (rideId) {
          try {
            const rideResponse = await api.get(`/ride/${rideId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const rideData = rideResponse.data.ride;
            setRideDetails(rideData);
            currentRideDetailsRef.current = rideData;

            // Initial fetch of nearby drivers
            setLoading(true);
            await performDriverFetch(rideData);
            setLoading(false);
          } catch (err) {
            console.error('Error fetching ride details:', err);
            setLoading(false);
          }
        }
        setFetchingRide(false);

      } catch (error) {
        console.error('Core fetch error:', error);
        setLoading(false);
      }
    };

    fetchRideAndSetup();
  }, [rideId, performDriverFetch]);

  useEffect(() => {
    if (['rejected', 'expired', 'cancelled', 'timed_out'].includes(bookingStatus)) {
      setSelectedDriver(null);
      dispatch(setSelectedRider(null));
    }
  }, [bookingStatus, dispatch]);

  const handleDriverSelect = (driver) => {
    if (bookingStatus === 'waiting') return;
    setSelectedDriver(driver);
    setSelectedDriverForUI(driver); // optional sync to parent if it needs it directly, otherwise the parent can just read it from hook return
    dispatch(setSelectedRider(driver));
    if (['rejected', 'expired', 'cancelled', 'timed_out'].includes(bookingStatus) && setBookingStatus) {
      setBookingStatus('idle');
    }
  };

  const handleConfirmBooking = async () => {
    if (isAssigningRef.current || !selectedDriver || !rideId) return;

    isAssigningRef.current = true;
    try {
      setBookingStatus('confirming');
      const token = localStorage.getItem('nvcr_tk');
      await api.post(`/ride/${rideId}/assign-driver`, {
        driverId: selectedDriver.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookingStatus((currentStatus) => currentStatus === 'accepted' ? currentStatus : 'waiting');
    } catch (error) {
      console.error('Error assigning driver:', error);
      setBookingStatus('idle');
      toast.error(error.response?.data?.message || 'Failed to confirm booking. Please try again.');
    } finally {
      isAssigningRef.current = false;
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




