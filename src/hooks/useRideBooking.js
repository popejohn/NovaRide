import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPickupLocation, setDestination } from '../Redux/riderslice';
import { setPickupCoordinate, setDestinationCoordinate } from '../Redux/locationSlice';
import { itemLoaded, itemLoading } from '../Redux/showslice';
import { setUser, logout } from '../Redux/verifiedUserslice';
import client from '../api/client';
import { getSuggestions } from "../utils/autocomplete";
import { forwardGeocode, reverseGeocode, calculateDistanceAndETA } from '../utils/reverseGeo';

export const useRideBooking = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { pickupLocation, destination } = useSelector((state) => state.getRide);
    const { user, isAuthenticated } = useSelector((state) => state.verifiedUser);
    const { loading } = useSelector(state => state.loader);

    const [showCostDist, setShowCostDist] = useState(false);
    const [distance, setDistance] = useState('');
    const [eta, setEta] = useState('');
    const [pickupSuggestions, setPickupSuggestions] = useState([]);
    const [destinationSuggestions, setDestinationSuggestions] = useState([]);
    const [activeInput, setActiveInput] = useState("");

    const destinationInputRef = useRef();

    useEffect(() => {
        const token = localStorage.getItem('nvcr_tk');
        if (token) {
            client.get('/auth/verify-token')
                .then((res) => {
                    dispatch(setUser({ user: res.data.data, isAuthenticated: true }));
                })
        }
    }, [dispatch]);

    const handleFare = async () => {
        dispatch(itemLoading());
        setShowCostDist(false);
        try {
            const destCoord = await forwardGeocode(destination);
            const pickCoord = await forwardGeocode(pickupLocation);

            if (pickCoord?.lat !== undefined && pickCoord?.lng !== undefined) {
                dispatch(setPickupCoordinate({ lat: pickCoord.lat, lng: pickCoord.lng }));
            }
            if (destCoord?.lat !== undefined && destCoord?.lng !== undefined) {
                dispatch(setDestinationCoordinate({ lat: destCoord.lat, lng: destCoord.lng }));
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
            dispatch(setPickupCoordinate({ lat: item.lat, lng: item.lng }));
            setPickupSuggestions([]);
        } else {
            dispatch(setDestination(item.display));
            dispatch(setDestinationCoordinate({ lat: item.lat, lng: item.lng }));
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
            console.error("Geolocation is not supported by your browser");
            return;
        }

        dispatch(itemLoading());
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const address = await reverseGeocode(latitude, longitude);
                    dispatch(setPickupLocation(address));
                    dispatch(setPickupCoordinate({ lat: latitude, lng: longitude }));
                } catch (error) {
                    console.error("Error fetching current location address:", error);
                } finally {
                    dispatch(itemLoaded());
                }
            },
            (error) => {
                console.error("Error getting geolocation:", error);
                dispatch(itemLoaded());
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
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
