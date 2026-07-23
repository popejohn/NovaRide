import React from 'react';
import { useMapInstance } from './MapContext';
import { FaLocationArrow } from 'react-icons/fa';

const CurrentLocationButton = ({ onLocationFound = null }) => {
  const { map } = useMapInstance();

  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (map) {
          map.flyTo({
            center: [longitude, latitude],
            zoom: 15,
            duration: 1000
          });
        }
        if (onLocationFound) {
          onLocationFound({ lat: latitude, lng: longitude });
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
      },
      { enableHighAccuracy: true }
    );
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
