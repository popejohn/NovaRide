import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPickupLocation, setDestination } from '../Redux/riderslice';
import { setPickupCoordinate, setDestinationCoordinate } from '../Redux/locationSlice';
import { itemLoaded, itemLoading } from '../Redux/showslice';
import { setUser } from '../Redux/verifiedUserslice';
import { toast } from 'react-toastify';
import client from '../api/client';
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
            client.get('/auth/verify-token')
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
        dispatch(itemLoading());
        setShowCostDist(false);
        try {
            let pickCoord = pickupCoordinate;
            if (!pickupCoordinate || !pickupCoordinate.lat || pickupCoordinate.address !== pickupLocation) {
                const forwardRes = await forwardGeocode(pickupLocation);
                if (forwardRes) {
                    pickCoord = { lat: forwardRes.lat, lng: forwardRes.lng, address: pickupLocation };
                    dispatch(setPickupCoordinate(pickCoord));
                } else {
                    pickCoord = null;
                }
            }

            let destCoord = destinationCoordinate;
            if (!destinationCoordinate || !destinationCoordinate.lat || destinationCoordinate.address !== destination) {
                const forwardRes = await forwardGeocode(destination);
                if (forwardRes) {
                    destCoord = { lat: forwardRes.lat, lng: forwardRes.lng, address: destination };
                    dispatch(setDestinationCoordinate(destCoord));
                } else {
                    destCoord = null;
                }
            }

            if (destCoord && pickCoord && destCoord.lat && pickCoord.lat) {
                const distanceData = await calculateDistanceAndETA(pickCoord, destCoord);
                if (distanceData) {
                    setDistance(distanceData.distanceInKm);
                    setEta(distanceData.durationInMin);
                }
            }
            setTimeout(() => {
                setShowCostDist(true);
                dispatch(itemLoaded());
            }, 2000);
        } catch (error) {
            console.error('Error in handleFare:', error);
            dispatch(itemLoaded());
        }
    };

    const handleSuggestionClick = (item, type) => {
        if (type === "pickup") {
            dispatch(setPickupLocation(item.display));
            dispatch(setPickupCoordinate({ lat: item.lat, lng: item.lng, address: item.display }));
            setPickupSuggestions([]);
        } else {
            dispatch(setDestination(item.display));
            dispatch(setDestinationCoordinate({ lat: item.lat, lng: item.lng, address: item.display }));
            setDestinationSuggestions([]);
        }
    };

    const cancelRide = () => {
        dispatch(setPickupLocation(''));
        dispatch(setDestination(''));
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
                
                console.log(`[Location] Device coordinates: Lat ${latitude.toFixed(6)}, Lon ${longitude.toFixed(6)} (±${accuracy.toFixed(0)}m)`);
                
                try {
                    // First, immediately set the fresh coordinates from device
                    dispatch(setPickupCoordinate({ lat: latitude, lng: longitude }));
                    
                    // Reverse geocode the fresh coordinates to get current address
                    const address = await reverseGeocode(latitude, longitude);
                    
                    console.log(`[Location] Reverse geocoded to: ${address}`);
                    
                    // Update the pickup location with fresh data
                    dispatch(setPickupLocation(address));
                    dispatch(setPickupCoordinate({ lat: latitude, lng: longitude, address: address }));
                    setPickupSuggestions([]); // Clear any suggestions
                    
                    toast.success(`📍 Location updated: ${address}`, { autoClose: 2500 });
                } catch (error) {
                    console.error("Error reverse geocoding:", error);
                    
                    // Even if address lookup fails, we have valid coordinates from device
                    const fallbackLocation = `📍 Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
                    dispatch(setPickupLocation(fallbackLocation));
                    dispatch(setPickupCoordinate({ lat: latitude, lng: longitude, address: fallbackLocation }));
                    toast.warning("Using GPS coordinates (address lookup unavailable)", { autoClose: 2000 });
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
            setPickupSuggestions([]);
        } else {
            dispatch(setDestination(''));
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
