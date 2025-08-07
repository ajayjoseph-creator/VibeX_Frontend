import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";

function MapPage() {
  const [users, setUsers] = useState([]);
  const [center, setCenter] = useState([11.2588, 75.7804]); // Default: Malappuram
  const [location, setLocation] = useState("");

  // Fetch users when map loads
  useEffect(() => {
    fetchUsers(center[0], center[1]);
  }, []);

  // 🔍 Fetch nearby users by lat/lng
  const fetchUsers = async (lat, lng) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/nearby?lat=${lat}&lng=${lng}`);
      setUsers(res.data);
      console.log("Fetched users:", res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // 🌍 Handle search input
  const handleSearch = async () => {
    if (!location.trim()) return;

    try {
      const geo = await axios.get(`http://localhost:5000/api/location/geocode?place=${location}`);
      const place = geo.data[0];
      if (place) {
        const lat = parseFloat(place.lat);
        const lon = parseFloat(place.lon);
        setCenter([lat, lon]);
        fetchUsers(lat, lon);
      } else {
        alert("Location not found.");
      }
    } catch (err) {
      console.error("Error in location search:", err);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* 🔍 Search Box */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "15px",
          background: "#f5f5f5",
          gap: "10px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Search location (e.g., Kozhikode)"
          style={{
            padding: "10px 15px",
            width: "300px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "16px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          🔍 Search
        </button>
      </div>

      {/* 🗺️ Map Display */}
      <MapContainer center={center} zoom={12} style={{ height: "calc(100vh - 70px)", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 🧍 Show all users */}
        {users.map((user, index) => {
          if (!user.geoLocation?.coordinates || user.geoLocation.coordinates.length !== 2) return null;

          const [lng, lat] = user.geoLocation.coordinates;

          return (
            <Marker
              key={user._id || index}
              position={[lat, lng]}
              icon={L.icon({
                iconUrl: markerIconPng,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              })}
            >
              <Popup>
                <div>
                  <strong>{user.name}</strong>
                  <br />
                  {user.profession || "No profession"}
                  <br />
                  <button
                    onClick={() => window.location.href = `/profile/${user._id}`}
                    style={{
                      marginTop: "5px",
                      padding: "5px 10px",
                      fontSize: "14px",
                      background: "#007bff",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    View Profile
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default MapPage;
