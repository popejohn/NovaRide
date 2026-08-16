import React from 'react';
import { toast } from 'react-toastify';
import { useMapInstance } from './MapContext';
import { FaLocationArrow } from 'react-icons/fa';
import { requestCurrentPosition, GEO_ERROR_CODES } from '../../utils/geolocation';

const CurrentLocationButton = ({ onLocationFound = null }) => {
  const { map } = useMapInstance();

  const handleLocateUser = async () => {
    try {
      const { latitude, longitude } = await requestCurrentPosition();

      if (map) {
        map.flyTo([latitude, longitude], 15, { duration: 1 });
      }
      if (onLocationFound) {
        onLocationFound({ lat: latitude, lng: longitude });
      }
    } catch (err) {
      console.warn('[CurrentLocationButton] Geolocation failed:', err.code, err.message);

      if (err.code === GEO_ERROR_CODES.LOW_ACCURACY) {
        toast.error(
          'Location accuracy is too low. Please enable GPS or Wi-Fi positioning on your device.',
          { autoClose: 6000 }
        );
      } else if (err.code === GEO_ERROR_CODES.PERMISSION_DENIED) {
        toast.error(
          'Location permission denied. Please allow location access in your browser settings.',
          { autoClose: 6000 }
        );
      } else if (err.code === GEO_ERROR_CODES.TIMEOUT) {
        toast.error('Location request timed out. Please try again.', { autoClose: 5000 });
      } else {
        toast.error('Unable to fetch your current location.', { autoClose: 5000 });
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleLocateUser}
      className="absolute bottom-6 right-6 bg-white hover:bg-neutral-100 text-neutral-800 p-3 rounded-full shadow-lg z-10 transition-transform active:scale-95 flex items-center justify-center border border-neutral-200"
      title="Current Location"
      aria-label="Locate me"
    >
      <FaLocationArrow className="text-orange-500 text-lg" />
    </button>
  );
};

export default CurrentLocationButton;
