import api from '../services/axios';

const locationCache = {
  forward: {},
  reverse: {}
};

export const reverseGeocode = async (lat, lon) => {
  const cacheKey = `${lat},${lon}`;
  if (locationCache.reverse[cacheKey]) {
    return locationCache.reverse[cacheKey];
  }

  try {
    const response = await api.get(
      `/location/reverse?lat=${lat}&lon=${lon}`
    );
    const address = response.data.display_name;
    locationCache.reverse[cacheKey] = address;
    return address;
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return 'Unable to retrieve address';
  }
};

export const forwardGeocode = async (address) => {
  const cacheKey = address.toLowerCase().trim();
  if (locationCache.forward[cacheKey]) {
    return locationCache.forward[cacheKey];
  }

  try {
    const response = await api.get(
      `/location/search?q=${encodeURIComponent(address)}`
    );
    const result = response.data[0];
    if (!result) return null;

    const data = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      display_name: result.display_name,
    };
    locationCache.forward[cacheKey] = data;
    return data;
  } catch (error) {
    console.error('Forward geocoding failed:', error);
    return null;
  }
};

export const calculateDistanceAndETA = async (pickup, destination) => {
  try {
    // Use LocationIQ's directions API with proper coordinate format via backend proxy
    const response = await api.get(
      `/location/directions/driving/${pickup.lng},${pickup.lat};${destination.lng},${destination.lat}`
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





