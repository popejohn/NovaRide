import React, { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { setPickupLocation, setDestination } from '../Redux/riderslice';
import { setPickupCoordinate, setDestinationCoordinate } from '../Redux/locationSlice';
import { reverseGeocode } from '../utils/reverseGeo';
import { toast } from 'react-toastify';

// Helper to strictly validate and extract [lat, lng] as numbers
const getValidCoord = (coord) => {
    if (!coord || typeof coord !== 'object') return null;
    const lat = typeof coord.lat === 'number' ? coord.lat : parseFloat(coord.lat);
    const lng = typeof coord.lng === 'number' ? coord.lng : parseFloat(coord.lng);
    if (typeof lat === 'number' && typeof lng === 'number' && Number.isFinite(lat) && Number.isFinite(lng)) {
        return [lat, lng];
    }
    return null;
};

// Component to handle map re-centering and flying to updated coordinates safely
const MapViewUpdater = ({ pickupCoordinate, destinationCoordinate }) => {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const pickupPoint = getValidCoord(pickupCoordinate);
        const destPoint = getValidCoord(destinationCoordinate);

        const updateView = () => {
            try {
                map.invalidateSize();
                const size = map.getSize();
                
                // If map container is not yet visible or has 0 dimensions, skip or defer view update
                if (!size || size.x === 0 || size.y === 0) return;

                if (pickupPoint && destPoint) {
                    map.fitBounds([pickupPoint, destPoint], { padding: [50, 50], maxZoom: 16 });
                } else if (pickupPoint) {
                    map.setView(pickupPoint, 15, { animate: true });
                } else if (destPoint) {
                    map.setView(destPoint, 15, { animate: true });
                }
            } catch (err) {
                console.warn('[MapViewUpdater] View update ignored due to unmounted/zero-size container:', err);
            }
        };

        // Run immediately and defer one frame for flex/modal layout calculations
        updateView();
        const animationFrameId = requestAnimationFrame(updateView);
        return () => cancelAnimationFrame(animationFrameId);
    }, [
        pickupCoordinate?.lat,
        pickupCoordinate?.lng,
        destinationCoordinate?.lat,
        destinationCoordinate?.lng,
        map
    ]);

    return null;
};

const Mapcontainer = () => {
    const dispatch = useDispatch();
    const { pickupCoordinate, destinationCoordinate } = useSelector((state) => state.location);
    const { pickupLocation, destination } = useSelector((state) => state.getRide);

    const pickupPoint = getValidCoord(pickupCoordinate);
    const destPoint = getValidCoord(destinationCoordinate);

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
        
        if (!address) {
            // Reverse geocoding failed - don't set location and show error
            toast.error('Failed to fetch location, please check your internet', { autoClose: 5000 });
            return;
        }
        
        if (!pickupLocation) {
            dispatch(setPickupLocation(address));
            dispatch(setPickupCoordinate({ lat, lng, address }));
        } else {
            dispatch(setDestination(address));
            dispatch(setDestinationCoordinate({ lat, lng, address }));
        }
    };

    // Default center fallback (Ibadan center or current valid pickup location)
    const initialCenter = pickupPoint || [7.3775, 3.9470];

    return (
        <div className='rounded-xl overflow-hidden shadow-inner h-full'>
            <div className="w-full h-full">
                <MapContainer
                    center={initialCenter}
                    zoom={13}
                    minZoom={3}
                    maxZoom={18}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                    />
                    <MapViewUpdater pickupCoordinate={pickupCoordinate} destinationCoordinate={destinationCoordinate} />
                    <LocationPicker onClick={handleMapClick} />
                    {pickupPoint && (
                        <Marker
                            position={pickupPoint}
                            draggable={true}
                            eventHandlers={{
                                dragend: async (e) => {
                                    const { lat, lng } = e.target.getLatLng();
                                    const address = await reverseGeocode(lat, lng);
                                    if (address) {
                                        dispatch(setPickupLocation(address));
                                        dispatch(setPickupCoordinate({ lat, lng, address }));
                                    } else {
                                        toast.error('Failed to fetch location, please check your internet', { autoClose: 5000 });
                                    }
                                }
                            }}
                        />
                    )}
                    {destPoint && (
                        <Marker
                            position={destPoint}
                            draggable={true}
                            eventHandlers={{
                                dragend: async (e) => {
                                    const { lat, lng } = e.target.getLatLng();
                                    const address = await reverseGeocode(lat, lng);
                                    if (address) {
                                        dispatch(setDestination(address));
                                        dispatch(setDestinationCoordinate({ lat, lng, address }));
                                    } else {
                                        toast.error('Failed to fetch location, please check your internet', { autoClose: 5000 });
                                    }
                                }
                            }}
                        />
                    )}
                </MapContainer>
            </div>
        </div>
    );
};

export default Mapcontainer;




