import axios from "axios";

export const getCoordinatesFromPlace = async (place) => {
  try {
    const res = await axios.get("http://localhost:5000/api/location/geocode", {
      params: { place },
    });

    if (res.data.length > 0) {
      const { lat, lon } = res.data[0];
      return { lat: parseFloat(lat), lon: parseFloat(lon) };
    }

    return null;
  } catch (err) {
    console.error("Geocode error:", err.message);
    return null;
  }
};
