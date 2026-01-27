import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'
import Navbar from './Navbar'
import OtherNav from './VerifiedNav'
import Button from './Button'
import { setPickupLocation, setDestination } from '../Redux/riderslice';
import { setPickupCoordinate, setDestinationCoordinate } from '../Redux/locationSlice'
import { itemLoaded, itemLoading } from '../Redux/showslice'
import { setUser, logout } from '../Redux/verifiedUserslice'
import profilePic from '../assets/placeholderProfile.jpg'
import { FaLocationDot } from "react-icons/fa6";
import ClickToReveal from './ClickReveal'
import { getSuggestions } from "../utils/autocomplete";
import { forwardGeocode } from '../utils/reverseGeo'
import { calculateDistanceAndETA } from '../utils/reverseGeo'
import { ClipLoader } from 'react-spinners';
import { MdOutlineHistory } from "react-icons/md";
import { FaLocationArrow } from "react-icons/fa";
import { MapContainer } from 'react-leaflet'
import Mapcontainer from './Mapcontainer'



//  Checks user authentication status using token stored in localStorage
//  Fetches and sets user data in Redux store
//  Redirects to login page if not authenticated

const Bookride = () => {
  const dispatch = useDispatch()

  // Declare state and redux selectors
  const {
    pickupLocation,
    destination,
  } = useSelector((state) => state.getRide);
  const { user, isAuthenticated } = useSelector((state) => state.verifiedUser);
  const { loading } = useSelector(state => state.loader)
  const [showCostDist, setShowCostDist] = useState(false);
  const [distance, setdistance] = useState('')
  const [eta, seteta] = useState('')
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState("");

  // End of state and redux selectors

  const destinationInputRef = useRef();

  // authenticate user with token
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('nvcr_tk');
    if (token && !user) {
      axios.get('http://localhost:5000/auth/verify-token', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          dispatch(setUser({ user: res.data.data }));
        })
        .catch((err) => {
          console.log(err.response?.data?.message || err.message);
          dispatch(logout());
          navigate('/login');
        });
    } else if (!token) {
      navigate('/login');
    }
  }, [dispatch, navigate]);

  //  Function that marks location on map when user leaves the pickup input field

  const handleFare = async () => {
    dispatch(itemLoading())
    setShowCostDist(false)
    const destCoord = await forwardGeocode(destination);
    const pickCoord = await forwardGeocode(pickupLocation)

    // Save coordinates to redux by dispatching the actions
    if (pickCoord && pickCoord.lat !== undefined && pickCoord.lng !== undefined) {
      dispatch(setPickupCoordinate({ lat: pickCoord.lat, lng: pickCoord.lng }));
    }
    if (destCoord && destCoord.lat !== undefined && destCoord.lng !== undefined) {
      dispatch(setDestinationCoordinate({ lat: destCoord.lat, lng: destCoord.lng }));
    }

    if (destCoord && pickCoord && destCoord.lat && pickCoord.lat) {
      const distanceData = await calculateDistanceAndETA(pickCoord, destCoord)
      if (distanceData) {
        setdistance(distanceData.distanceInKm);
        seteta(distanceData.durationInMin);
      }
    }
    setTimeout(() => {
      setShowCostDist(true)
      dispatch(itemLoaded())
    }, 2000);
  }



  //  Clicking filter suggestions based on active input field
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


  function cancelRide() {
    dispatch(setPickupLocation(''))
    dispatch(setDestination(''))
    seteta('')
    setdistance('')
    setShowCostDist(false)
  }

  // Clear coordinates when inputs are empty
  useEffect(() => {
    if (!pickupLocation) {
      dispatch(setPickupCoordinate(null));
    }
    if (!destination) {
      dispatch(setDestinationCoordinate(null));
    }
  }, [pickupLocation, destination, dispatch]);


  return (
    <div>
      {/*Bookride has different features for each role. Why userrole's added as a prop and only accessible to authenticated users */}
      <Navbar userrole={''} userverified={isAuthenticated} profilePic={profilePic} nav={<OtherNav />} button={<Button text={'Own a Ride'} classes={'h-9 py-1 px-3 rounded-md bg-black text-white hover:bg-white hover:text-black hover:border border-black'} />} />
      <div className='mt-24 pt-8 px-20 flex'>
        <aside className='flex flex-col w-2/5'>
          <div className='inputs-class bg-black rounded-md px-8 pt-6 pb-10 relative'>
            <div className='font-bold text-3xl text-white'>
              <span className='text-orange-400'>{user && user.firstname}</span>, where are you going today?
            </div>
            <div className='w-full flex justify-start items-center bg-neutral-100 rounded mt-4 ps-2 focus:border-2 focus:border-stone-500'>
              <FaLocationDot className='text-neutral-500 top-1/2 right-5' />
              <input
                type="text"
                placeholder="Enter current location or use map"
                value={pickupLocation}
                onChange={async (e) => {
                  const value = e.target.value;
                  dispatch(setPickupLocation(value));
                  setActiveInput("pickup");
                  if (value.length > 2) {
                    const results = await getSuggestions(value);
                    setPickupSuggestions(results);
                  } else {
                    setPickupSuggestions([]);
                  }
                }}
                className="p-2 w-full border-0 outline-0"
              />

            </div>
            <div className='w-full flex justify-start items-center bg-neutral-100 rounded mt-4 ps-2 focus:border-2 focus:border-stone-500'>
              <FaLocationArrow className='text-neutral-500 top-1/2 right-5' />
              <input
                type="text"
                placeholder="Enter destination or use map"
                value={destination}
                onChange={async (e) => {
                  const value = e.target.value;
                  dispatch(setDestination(value));
                  setActiveInput("destination");
                  if (value.length > 2) {
                    const results = await getSuggestions(value);
                    setDestinationSuggestions(results);
                  } else {
                    setDestinationSuggestions([]);
                  }
                }}
                onFocus={() => { }}
                ref={destinationInputRef}
                className="p-2 w-full border-0 outline-0"
              />
            </div>
            <div className='flex justify-start items-center gap-5'>
              <Button text={loading
                ? <div className="flex justify-center items-center w-full"><ClipLoader color="#000" size={20} /></div>
                : 'Book ride'} classes={`mt-10 w-30 h-12 rounded-md ${!destination || !pickupLocation ? 'bg-green-200 hover:bg-green-200' : 'bg-green-400 hover:bg-green-500'} shadow-md font-semibold py-2 px-3`}
                disabled={destination && pickupLocation ? false : true} onClick={handleFare} />
              {pickupLocation && destination && <Button text={'Clear'} classes={`mt-10 w-30 h-12 rounded-md bg-yellow-300 hover:bg-yellow-400 shadow-md font-semibold py-2 px-3`}
                disabled={destination && pickupLocation ? false : true} onClick={() => {
                  dispatch(setDestination(''))
                  dispatch(setPickupLocation(''))
                }} />}
            </div>
          </div>
          {activeInput === "pickup" && pickupSuggestions.length > 0 && (
            <div className="bg-white shadow-md mt-1 rounded w-full max-h-40 overflow-y-auto">
              {pickupSuggestions.map((item, idx) => (
                <div key={idx} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSuggestionClick(item, "pickup")}>
                  {item.display}
                </div>
              ))}
            </div>
          )}
          {activeInput === "destination" && destinationSuggestions.length > 0 && (
            <div className="bg-white shadow-md mt-1 rounded w-full max-h-40 overflow-y-auto">
              {destinationSuggestions.map((item, idx) => (
                <div key={idx} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSuggestionClick(item, "destination")}>
                  {item.display}
                </div>
              ))}
            </div>
          )}

          {distance && eta && showCostDist && <ClickToReveal distance={distance} duration={eta} cancelRide={cancelRide} />}
        </aside>
        <div className='ms-12 w-3/5'>
          <Mapcontainer />
        </div>

      </div>
    </div>
  )
}

export default Bookride