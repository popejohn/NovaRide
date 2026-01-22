import axios from 'axios';

const LOCATIONIQ_API_KEY = import.meta.env.VITE_LOCATIONIQ;

export const reverseGeocode = async (lat, lon) => {
  try {
    const response = await axios.get(
      `/api/locationiq/reverse.php?key=${LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lon}&format=json`
    );
    return response.data.display_name; // Full address
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return 'Unable to retrieve address';
  }
};

export const forwardGeocode = async (address) => {
  try {
    const response = await axios.get(
      `/api/locationiq/search.php?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(address)}&format=json`
    );
    const result = response.data[0]; // Take the first result
    return {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      display_name: result.display_name,
    };
  } catch (error) {
    console.error('Forward geocoding failed:', error);
    return null;
  }
};

export const calculateDistanceAndETA = async (pickup, destination) => {
  try {
    // Use LocationIQ's directions API with proper coordinate format
    const response = await axios.get(
      `/api/locationiq/directions/driving/${pickup.lng},${pickup.lat};${destination.lng},${destination.lat}`,
      {
        params: {
          key: LOCATIONIQ_API_KEY,
          geometries: 'geojson',
          overview: 'simplified',
          alternatives: false
        }
      }
    );

    // Check if response has the expected structure
    if (!response.data || !response.data.routes || !response.data.routes[0]) {
      return null;
    }

    const route = response.data.routes[0];
    const distanceInMeters = route.distance;
    const durationInSeconds = route.duration;

    const distanceInKm = distanceInMeters / 1000;
    const durationInMin = durationInSeconds / 60;

    return {
      distanceInKm: Math.round(distanceInKm * 100) / 100, // Round to 2 decimal places
      durationInMin: Math.round(durationInMin * 10) / 10,  // Round to 1 decimal place
    };
  } catch (error) {
    console.error('Error calculating distance and ETA:', error);

  }
};

