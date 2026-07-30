import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPickupLocation, setDestination } from '../Redux/riderslice';
import { setPickupCoordinate, setDestinationCoordinate } from '../Redux/locationSlice';
import { itemLoaded, itemLoading } from '../Redux/showslice';
import { setUser } from '../Redux/verifiedUserslice';
import { toast } from 'react-toastify';
import api from '../services/axios';
import { getSuggestions } from "../utils/autocomplete";
import { forwardGeocode, reverseGeocode, calculateDistanceAndETA } from '../utils/reverseGeo';

export const useRideBooking = () => {
    const dispatch = useDispatch();

    const { pickupLocation, destination } = useSelector((state) => state.getRide);
    const { user, isAuthenticated } = useSelector((state) => state.verifiedUser);
    const { loading } = useSelector(state => state.loader);
    const { pickupCoordinate, destinationCoordinate } = useSelector((state) => state.location);

    const [showCostDist, setShowCostDist] = useState(false);
    const [distance, setDistance] = useState('');
    const [eta, setEta] = useState('');
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
        try {
            const distanceData = await calculateDistanceAndETA(pickCoord, destCoord);
            if (distanceData) {
                setDistance(distanceData.distanceInKm);
                setEta(distanceData.durationInMin);
            }
            setTimeout(() => {
                setShowCostDist(true);
                dispatch(itemLoaded());
            }, 1000);
        } catch (error) {
            console.error('Error in handleFare:', error);
            toast.error("Please pick a valid location");
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
        setShowCostDist(false);
    };

    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        dispatch(itemLoading());
        // Clear any previous suggestions first
        setPickupSuggestions([]);
        toast.info("Fetching your current location...", { autoClose: 1500 });

        // Use high accuracy and don't cache
        const geoOptions = {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0 // Always get fresh position, never use cached
        };

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                
                try {
                    // First, immediately set the fresh coordinates from device
                    dispatch(setPickupCoordinate({ lat: latitude, lng: longitude }));
                    
                    // Reverse geocode the fresh coordinates to get current address
                    const address = await reverseGeocode(latitude, longitude);
                    const normalizedAddress = (address || '').toLowerCase().trim();
                    const isAddressLookupFailure =
                        !address ||
                        normalizedAddress === 'current location' ||
                        normalizedAddress.includes('unable to retrieve location') ||
                        normalizedAddress.includes('unable to retrieve address');

                    if (isAddressLookupFailure) {
                        dispatch(setPickupLocation(''));
                        dispatch(setPickupCoordinate({ lat: null, lng: null }));
                        setPickupSuggestions([]);
                        toast.error("Failed to fetch current location");
                    } else {
                        // Update the pickup location with fresh data
                        dispatch(setPickupLocation(address));
                        dispatch(setPickupCoordinate({ lat: latitude, lng: longitude, address: address }));
                        setPickupSuggestions([]); // Clear any suggestions

                        toast.success("Location fetched successfully", { autoClose: 2500 });
                    }
                } catch (error) {
                    console.error("Error reverse geocoding:", error);
                    dispatch(setPickupLocation(''));
                    dispatch(setPickupCoordinate({ lat: null, lng: null }));
                    setPickupSuggestions([]);
                    toast.error("Failed to fetch current location");
                } finally {
                    dispatch(itemLoaded());
                }
            },
            (error) => {
                console.error("[Location Error]", error);
                dispatch(itemLoaded());
                
                let errorMessage = "Unable to access your location";
                
                if (error.code === error.PERMISSION_DENIED) {
                    errorMessage = "❌ Location permission denied. Please enable location in browser settings.";
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    errorMessage = "❌ Location services are unavailable. Please enable location services on your device.";
                } else if (error.code === error.TIMEOUT) {
                    errorMessage = "❌ Location request timed out. Check your internet connection and try again.";
                }
                
                toast.error(errorMessage);
            },
            geoOptions
        );
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




