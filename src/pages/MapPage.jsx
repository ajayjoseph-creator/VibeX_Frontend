import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";

// ✅ Fix Leaflet icon issue in React
const defaultIcon = L.icon({
  iconUrl: markerIconPng,
  iconRetinaUrl: markerIconPng,
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// 🔹 Helper component to move map center dynamically
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom);
  }, [center, zoom, map]);
  return null;
}

function MapPage() {
  const [users, setUsers] = useState([]);
  const [center, setCenter] = useState([11.2588, 75.7804]); // Malappuram default
  const [location, setLocation] = useState("");
  const [autoPopupIds, setAutoPopupIds] = useState([]); // store which markers to auto-open

  // Fetch nearby users on mount
  useEffect(() => {
    fetchNearby(center[0], center[1]);
  }, []);

  // 🌍 Fetch nearby users
  const fetchNearby = async (lat, lng) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/map/nearby?lat=${lat}&lng=${lng}&distance=10000`
      );
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error fetching nearby:", err);
    }
  };

  // 🔍 Search by location name
  const handleSearch = async () => {
  if (!location.trim()) return;

  try {
    // Step 1: Get coords for searched location
    const res = await axios.get(
      `http://localhost:5000/api/map/searchlocation?location=${location}`
    );

    const { coords } = res.data || {};
    if (coords && coords.length === 2) {
      setCenter([coords[1], coords[0]]);

      // Step 2: Fetch nearby users from those coords
      const nearbyRes = await axios.get(
        `http://localhost:5000/api/map/nearby?lat=${coords[1]}&lng=${coords[0]}&distance=10000`
      );

      setUsers(nearbyRes.data || []);
      setAutoPopupIds((nearbyRes.data || []).map((u) => u._id));
    } else {
      console.warn("No coordinates found for search");
    }
  } catch (err) {
    console.error("Error searching location:", err);
  }
};


  return (
    <div className="w-full h-screen flex flex-col bg-gray-100">
      {/* 🔍 Search Bar */}
      <div className="flex items-center gap-2 p-4 bg-white shadow-md z-10">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Search location (e.g., Kozhikode)"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition"
        >
        Search
        </button>
      </div>

      {/* 🗺️ Map */}
      <div className="flex-1">
        <MapContainer center={center} zoom={12} className="w-full h-full z-0">
          {/* 🔹 Make map move to updated center */}
          <ChangeView center={center} zoom={12} />

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {Array.isArray(users) &&
            users.map((user, index) => {
              if (!user.geoLocation?.coordinates) return null;
              const [lng, lat] = user.geoLocation.coordinates;

              return (
                <Marker
                  key={user._id || index}
                  position={[lat, lng]}
                  icon={defaultIcon}
                  ref={(marker) => {
                    if (marker && autoPopupIds.includes(user._id)) {
                      marker.openPopup();
                    }
                  }}
                >
                 <Popup autoPan={true}>
  <div
    className="text-center cursor-pointer"
    onClick={() => window.location.href = `/profile/${user._id}`}
  >
    {/* Profile image */}
    {user.profileImage && (
      <img
        src={user.profileImage}
        alt={user.name}
        className="w-16 h-16 object-cover rounded-full mx-auto mb-2 border border-gray-300"
      />
    )}
    {/* Name */}
    <strong className="text-lg block">{user.name}</strong>
    {/* Profession */}
    <span className="text-gray-600 block">
      {user.profession || "No profession"}
    </span>
  </div>
</Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapPage;
