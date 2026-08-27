import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPickupLocation, setDestination } from '../Redux/riderslice';
import { setPickupCoordinate, setDestinationCoordinate } from '../Redux/locationSlice';
import { itemLoaded, itemLoading } from '../Redux/showslice';
import { setUser } from '../Redux/verifiedUserslice';
import { toast } from 'react-toastify';
import api from '../services/axios';
import { getSuggestions } from "../utils/autocomplete";
import { forwardGeocode, reverseGeocode } from '../utils/reverseGeo';
import { requestCurrentPosition, GEO_ERROR_CODES } from '../utils/geolocation';

export const useRideBooking = () => {
    const dispatch = useDispatch();

    const { pickupLocation, destination } = useSelector((state) => state.getRide);
    const { user, isAuthenticated } = useSelector((state) => state.verifiedUser);
    const { loading } = useSelector(state => state.loader);
    const { pickupCoordinate, destinationCoordinate } = useSelector((state) => state.location);

    const [showCostDist, setShowCostDist] = useState(false);
    const [distance, setDistance] = useState('');
    const [eta, setEta] = useState('');
    const [fare, setFare] = useState(null);
    const [pickupSuggestions, setPickupSuggestions] = useState([]);
    const [destinationSuggestions, setDestinationSuggestions] = useState([]);
    const [activeInput, setActiveInput] = useState("");

    const destinationInputRef = useRef();

    useEffect(() => {
        const token = localStorage.getItem('nvcr_tk');
        if (token && !user) {
            api.get('/auth/verify-token')
                .then((res) => {
                    if (res.data && res.data.data) {
                        dispatch(setUser({ user: res.data.data, isAuthenticated: true }));
                    }
                })
                .catch((error) => {
                    console.warn('Token verification failed (non-critical):', error.message);
                    // Don't propagate error - token verification is not critical during ride booking
                });
        }
    }, [dispatch, user]);

    const handleFare = async () => {
        // First check if both pickup and destination inputs are present
        if (!pickupLocation || !destination) {
            toast.error("Please pick a valid location");
            return;
        }

        // Verify pickup coordinate on map
        let pickCoord = pickupCoordinate;
        const isPickValid = pickCoord?.lat != null && !isNaN(pickCoord.lat) && pickCoord?.lng != null && !isNaN(pickCoord.lng);
        if (!isPickValid && pickupLocation) {
            const forwardRes = await forwardGeocode(pickupLocation);
            if (forwardRes && forwardRes.lat != null && !isNaN(forwardRes.lat)) {
                pickCoord = { lat: forwardRes.lat, lng: forwardRes.lng, address: pickupLocation };
                dispatch(setPickupCoordinate(pickCoord));
            } else {
                pickCoord = null;
            }
        }

        // Verify destination coordinate on map
        let destCoord = destinationCoordinate;
        const isDestValid = destCoord?.lat != null && !isNaN(destCoord.lat) && destCoord?.lng != null && !isNaN(destCoord.lng);
        if (!isDestValid && destination) {
            const forwardRes = await forwardGeocode(destination);
            if (forwardRes && forwardRes.lat != null && !isNaN(forwardRes.lat)) {
                destCoord = { lat: forwardRes.lat, lng: forwardRes.lng, address: destination };
                dispatch(setDestinationCoordinate(destCoord));
            } else {
                destCoord = null;
            }
        }

        // Must have TWO valid location markers on the map
        const hasValidPickupMarker = pickCoord?.lat != null && !isNaN(pickCoord.lat) && pickCoord?.lng != null && !isNaN(pickCoord.lng);
        const hasValidDestMarker = destCoord?.lat != null && !isNaN(destCoord.lat) && destCoord?.lng != null && !isNaN(destCoord.lng);

        if (!hasValidPickupMarker || !hasValidDestMarker) {
            toast.error("Please pick a valid location");
            return;
        }

        dispatch(itemLoading());
        setShowCostDist(false);
        setFare(null);
        try {
            const response = await api.post('/ride/estimate', {
                pickupLocation,
                destination,
                pickupCoordinates: { type: 'Point', coordinates: [pickCoord.lng, pickCoord.lat] },
                destinationCoordinates: { type: 'Point', coordinates: [destCoord.lng, destCoord.lat] }
            });
            setDistance(response.data.distance);
            setEta(response.data.eta);
            setFare(response.data.fare);
            setTimeout(() => {
                setShowCostDist(true);
                dispatch(itemLoaded());
            }, 1000);
        } catch (error) {
            console.error('Error in handleFare:', error);
            toast.error(error.response?.data?.message || 'Unable to calculate a road fare right now. Please try again.');
            dispatch(itemLoaded());
        }
    };

    const handleSuggestionClick = async (item, type) => {
        let lat = item.lat;
        let lng = item.lng;

        if (lat == null || isNaN(lat) || lng == null || isNaN(lng)) {
            const forwardRes = await forwardGeocode(item.display);
            if (forwardRes) {
                lat = forwardRes.lat;
                lng = forwardRes.lng;
            }
        }

        if (lat != null && !isNaN(lat) && lng != null && !isNaN(lng)) {
            if (type === "pickup") {
                dispatch(setPickupLocation(item.display));
                dispatch(setPickupCoordinate({ lat, lng, address: item.display }));
                setPickupSuggestions([]);
            } else {
                dispatch(setDestination(item.display));
                dispatch(setDestinationCoordinate({ lat, lng, address: item.display }));
                setDestinationSuggestions([]);
            }
        } else {
            if (type === "pickup") {
                dispatch(setPickupLocation(item.display));
                setPickupSuggestions([]);
            } else {
                dispatch(setDestination(item.display));
                setDestinationSuggestions([]);
            }
        }
    };

    const cancelRide = () => {
        dispatch(setPickupLocation(''));
        dispatch(setDestination(''));
        dispatch(setPickupCoordinate({ lat: null, lng: null }));
        dispatch(setDestinationCoordinate({ lat: null, lng: null }));
        setEta('');
        setDistance('');
        setFare(null);
        setShowCostDist(false);
    };

    const handleUseMyLocation = async () => {
        dispatch(itemLoading());
        setPickupSuggestions([]);
        toast.info('Fetching your current location...', { autoClose: 1500 });

        try {
            // requestCurrentPosition validates accuracy before resolving.
            // If the browser returns an IP-based location (e.g. accuracy = 100,000 m),
            // it will throw a GEO_ERROR_CODES.LOW_ACCURACY error and we never
            // write anything to Redux state.
            const { latitude, longitude, accuracy } = await requestCurrentPosition();

            // Reverse geocode the validated device coordinates - must be successful
            const address = await reverseGeocode(latitude, longitude);

            if (!address) {
                // Reverse geocoding failed - show error and don't set location
                toast.error('Failed to fetch location, please check your internet', { autoClose: 5000 });
                dispatch(itemLoaded());
                return;
            }

            // Only proceed if reverse geocoding was successful
            dispatch(setPickupLocation(address));
            dispatch(setPickupCoordinate({ lat: latitude, lng: longitude, address }));
            setPickupSuggestions([]);
            toast.success('Location fetched successfully', { autoClose: 2500 });
        } catch (err) {
            // IMPORTANT: on any error we do NOT write coordinates to Redux.
            // We also do NOT overwrite an existing pickup that the user may
            // have manually selected before clicking this button.
            console.error('[handleUseMyLocation] Geolocation failed:', err.code, err.message);

            // All errors show the same generic message as requested
            toast.error('Failed to fetch location, please check your internet', { autoClose: 5000 });
        } finally {
            dispatch(itemLoaded());
        }
    };

    const handleLocationChange = async (value, type) => {
        if (type === "pickup") {
            dispatch(setPickupLocation(value));
            setActiveInput("pickup");
            if (value.length > 2) {
                const results = await getSuggestions(value);
                setPickupSuggestions(results);
            } else {
                setPickupSuggestions([]);
            }
        } else {
            dispatch(setDestination(value));
            setActiveInput("destination");
            if (value.length > 2) {
                const results = await getSuggestions(value);
                setDestinationSuggestions(results);
            } else {
                setDestinationSuggestions([]);
            }
        }
    };

    const clearInput = (type) => {
        if (type === 'pickup') {
            dispatch(setPickupLocation(''));
            dispatch(setPickupCoordinate({ lat: null, lng: null }));
            setPickupSuggestions([]);
        } else {
            dispatch(setDestination(''));
            dispatch(setDestinationCoordinate({ lat: null, lng: null }));
            setDestinationSuggestions([]);
        }
    };

    return {
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
        setActiveInput,
        destinationInputRef,
        handleFare,
        handleSuggestionClick,
        cancelRide,
        handleUseMyLocation,
        handleLocationChange,
        clearInput
    };
};




