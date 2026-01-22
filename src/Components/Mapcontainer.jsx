import React, { useState, useRef } from 'react'
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { setPickupLocation, setDestination, setRideCost, setRidersNearby, setSelectedRider } from '../Redux/riderslice';
import { setPickupCoordinate, setDestinationCoordinate } from '../Redux/locationSlice';
import { reverseGeocode } from '../utils/reverseGeo';
import L from 'leaflet';
// Fix default marker icon issue with Leaflet in Webpack/CRA
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';


const Mapcontainer = () => {
  const dispatch = useDispatch()
  const [showPickRider, setShowPickRider] = useState(false);
  const destinationInputRef = useRef();
 const { pickupCoordinate, destinationCoordinate } = useSelector((state) => state.location);

const LocationPicker = ({ onClick }) => {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
};

  const handleMapClick = async({ lat, lng }) => {
    const address = await reverseGeocode(lat, lng);
    if (!pickupLocation) {
      dispatch(setPickupLocation(address));
      dispatch(setPickupCoordinate({lat, lng}))
    } else {
      dispatch(setDestination(address));
      dispatch(setDestinationCoordinate({lat, lng}))
    }
  };

  const fetchNearbyRiders = () => {
    // Mock data or API call to get nearby riders
    const dummyRiders = [
      { id: 1, name: 'John Doe', location: pickupLocation },
      { id: 2, name: 'Jane Smith', location: pickupLocation },
    ];
    dispatch(setRidersNearby(dummyRiders));
  };

  const handlePickRider = (rider) => {
    dispatch(setSelectedRider(rider));
    dispatch(setRideCost(1500)); // mock calculation
  };

  const {
    pickupLocation,
    destination,
    rideCost,
    ridersNearby,
    selectedRider,
  } = useSelector((state) => state.getRide);

  const ibadanBounds = [
  [7.1, 3.8], // Southwest
  [7.5, 4.1], // Northeast
];

  return (
    <div className='rounded-lg'>
      <div className="w-full" style={{height: '500px'}}>
              <MapContainer center={[7.3775, 3.9470]} zoom={12} minZoom={11} maxZoom={16}   style={{ height: '100%', width: '100%' }} maxBounds={ibadanBounds}
                    maxBoundsViscosity={1.0}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <LocationPicker onClick={handleMapClick} />
                {pickupCoordinate?.lat != null && pickupCoordinate?.lng != null && (<Marker position={[pickupCoordinate.lat, pickupCoordinate.lng]} />)}
                {destinationCoordinate?.lat != null && destinationCoordinate?.lng != null && (<Marker position={[destinationCoordinate.lat, destinationCoordinate.lng]} />)}
              </MapContainer>
          </div>
    </div>
  )
}

export default Mapcontainer