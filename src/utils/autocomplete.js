import api from '../services/axios';

export const getSuggestions = async (query) => {
  if (!query || query.trim() === "") return [];

  try {
    const response = await api.get(
      `/location/autocomplete?q=${encodeURIComponent(query)}`
    );

    return response.data
      .map(item => {
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);
        return {
          display: item.display_name,
          lat: isNaN(lat) ? null : lat,
          lng: isNaN(lng) ? null : lng,
        };
      })
      .filter(item => item.lat !== null && item.lng !== null);
  } catch (error) {
    console.error("Autocomplete error:", error);
    return [];
  }
};




