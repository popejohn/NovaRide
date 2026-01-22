import axios from "axios";

const API_KEY = import.meta.env.VITE_LOCATIONIQ;

export const getSuggestions = async (query) => {
  if (!query || query.trim() === "") return [];

  try {
    const response = await axios.get(
      "https://us1.locationiq.com/v1/autocomplete",
      {
        params: {
          key: API_KEY,
          q: query,
          limit: 5,
          dedupe: 1,
          normalizeaddress: 1,

          // 🔥 Restrict to Ibadan ONLY
          viewbox: "3.975,7.458,3.833,7.325", // left, top, right, bottom
          bounded: 1,
          countrycodes: "ng", // Only Nigeria
        },
      }
    );

    return response.data.map(item => ({
      display: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }));
  } catch (error) {
    console.error("Autocomplete error:", error);
    return [];
  }
};
