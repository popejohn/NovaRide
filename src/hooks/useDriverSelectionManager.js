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
  const [isExpandedSearch, setIsExpandedSearch] = useState(false);
  const [expandingSearch, setExpandingSearch] = useState(false);
  const isRateLimitedRef = useRef(false);
  const isAssigningRef = useRef(false);
  const currentRideDetailsRef = useRef(null);

  // Handle new rider coming online - add them to driver list if within range
  const handleNewRiderOnline = useCallback((newRiderData) => {
    const normalizedRideFare = Number(rideDetails?.baseFare || rideDetails?.fare) || null;
    const distanceKm = typeof newRiderData.distance === 'number'
      ? parseFloat(newRiderData.distance.toFixed(1))
      : 1.2;
    const isOutside = distanceKm > 5;
    const addedFare = isOutside ? Math.round(distanceKm * 500) : 0;
    const totalFare = normalizedRideFare ? normalizedRideFare + addedFare : null;

    const newDriver = {
      id: newRiderData.riderId,
      name: newRiderData.riderName,
      rating: 4.8,
      totalRides: 0,
      baseFare: normalizedRideFare,
      addedFare,
      fare: totalFare,
      isOutsideVicinity: isOutside,
      distance: distanceKm,
      eta: newRiderData.eta || Math.ceil(distanceKm * 4),
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
  }, [rideDetails?.baseFare, rideDetails?.fare]);

  // Fetch nearby drivers without dependency issues. The rider list is time-sensitive,
  // so we explicitly bypass browser cache and retry on 304 cache hits.
  const performDriverFetch = useCallback(async (rideData, expanded = false) => {
    if (!rideData?.pickupCoordinates?.coordinates) return;

    const [lng, lat] = rideData.pickupCoordinates.coordinates;
    const buildRequestConfig = (requestId) => ({
      // A unique URL bypasses browser cache without adding non-simple CORS headers.
      params: {
        lat,
        lng,
        expandSearch: expanded,
        maxDistance: expanded ? 50000 : 5000,
        _t: requestId
      },
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
      const normalizedRideFare = Number(rideData?.baseFare || rideData?.fare);
      const transformedDrivers = responseDrivers.map(driver => {
        const distanceKm = typeof driver.distance === 'number'
          ? parseFloat(driver.distance.toFixed(1))
          : 1.2;
        const isOutside = driver.isOutsideVicinity ?? (distanceKm > 5);
        // Added funds: #500 per km
        const addedFare = isOutside
          ? (typeof driver.addedFare === 'number' ? driver.addedFare : Math.round(distanceKm * 500))
          : 0;
        const totalFare = Number.isFinite(normalizedRideFare) ? normalizedRideFare + addedFare : null;

        return {
          id: driver._id,
          name: `${driver.riderInfo.firstname} ${driver.riderInfo.lastname}`,
          rating: 4.8,
          totalRides: 156,
          baseFare: normalizedRideFare,
          addedFare,
          fare: totalFare,
          isOutsideVicinity: isOutside,
          distance: distanceKm,
          eta: Math.ceil(distanceKm * 4),
          profilePic: driver.riderInfo.profilePic,
          vehicle: {
            model: driver.vehicleType,
            color: 'Black',
            plate: driver.plateNumber
          }
        };
      });

      setDrivers(transformedDrivers);
      setIsExpandedSearch(Boolean(driverResponse?.data?.isExpanded || expanded));
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

  const fetchClosestRiders = useCallback(async () => {
    if (!currentRideDetailsRef.current) return;
    setExpandingSearch(true);
    await performDriverFetch(currentRideDetailsRef.current, true);
    setExpandingSearch(false);
  }, [performDriverFetch]);

  const resetToVicinitySearch = useCallback(async () => {
    if (!currentRideDetailsRef.current) return;
    setLoading(true);
    await performDriverFetch(currentRideDetailsRef.current, false);
    setLoading(false);
  }, [performDriverFetch]);

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
        driverId: selectedDriver.id,
        addedFare: selectedDriver.addedFare || 0
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
    isExpandedSearch,
    expandingSearch,
    fetchClosestRiders,
    resetToVicinitySearch,
    handleDriverSelect,
    handleConfirmBooking,
    setSelectedDriver
  };
};




