import client from "../api/client";

export const getSuggestions = async (query) => {
  if (!query || query.trim() === "") return [];

  try {
    const response = await client.get(
      `/location/autocomplete?q=${encodeURIComponent(query)}`
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
