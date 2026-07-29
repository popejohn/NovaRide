import React from 'react'
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { setPickupLocation, setDestination } from '../Redux/riderslice';
import { setPickupCoordinate, setDestinationCoordinate } from '../Redux/locationSlice';
import { reverseGeocode } from '../utils/reverseGeo';


const Mapcontainer = () => {
    const dispatch = useDispatch()
    const { pickupCoordinate, destinationCoordinate } = useSelector((state) => state.location);
    const {
        pickupLocation,
    } = useSelector((state) => state.getRide);

    const LocationPicker = ({ onClick }) => {
        useMapEvents({
            click(e) {
                onClick(e.latlng);
            },
        });
        return null;
    };

    const handleMapClick = async ({ lat, lng }) => {
        const address = await reverseGeocode(lat, lng);
        const displayAddress = address || 'Selected Location';
        if (!pickupLocation) {
            dispatch(setPickupLocation(displayAddress));
            dispatch(setPickupCoordinate({ lat, lng, address: displayAddress }));
        } else {
            dispatch(setDestination(displayAddress));
            dispatch(setDestinationCoordinate({ lat, lng, address: displayAddress }));
        }
    };


    const ibadanBounds = [
        [7.1, 3.8], // Southwest
        [7.5, 4.1], // Northeast
    ];

    return (
        <div className='rounded-xl overflow-hidden shadow-inner h-full'>
            <div className="w-full h-full">
                <MapContainer center={[7.3775, 3.9470]} zoom={12} minZoom={11} maxZoom={16} style={{ height: '100%', width: '100%' }} maxBounds={ibadanBounds}
                    maxBoundsViscosity={1.0}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                    />
                    <LocationPicker onClick={handleMapClick} />
                    {pickupCoordinate?.lat != null && !isNaN(pickupCoordinate.lat) && pickupCoordinate?.lng != null && !isNaN(pickupCoordinate.lng) && (
                        <Marker
                            position={[pickupCoordinate.lat, pickupCoordinate.lng]}
                            draggable={true}
                            eventHandlers={{
                                dragend: async (e) => {
                                    const { lat, lng } = e.target.getLatLng();
                                    const address = await reverseGeocode(lat, lng);
                                    const displayAddress = address || pickupLocation || 'Selected Location';
                                    dispatch(setPickupLocation(displayAddress));
                                    dispatch(setPickupCoordinate({ lat, lng, address: displayAddress }));
                                }
                            }}
                        />
                    )}
                    {destinationCoordinate?.lat != null && !isNaN(destinationCoordinate.lat) && destinationCoordinate?.lng != null && !isNaN(destinationCoordinate.lng) && (
                        <Marker
                            position={[destinationCoordinate.lat, destinationCoordinate.lng]}
                            draggable={true}
                            eventHandlers={{
                                dragend: async (e) => {
                                    const { lat, lng } = e.target.getLatLng();
                                    const address = await reverseGeocode(lat, lng);
                                    const displayAddress = address || destination || 'Selected Location';
                                    dispatch(setDestination(displayAddress));
                                    dispatch(setDestinationCoordinate({ lat, lng, address: displayAddress }));
                                }
                            }}
                        />
                    )}
                </MapContainer>
            </div>
        </div>
    )
}

export default Mapcontainer




