import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

// 🛠 Fix Leaflet marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// 📍 Auto-move to current location
const AutoLocation = ({ setSelected }) => {
  const map = useMap();

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        map.setView([lat, lng], 15);

        fetch(
          `http://localhost:5000/api/location/reverse-geocode?lat=${lat}&lon=${lng}`
        )
          .then((res) => res.json())
          .then((data) => {
            const locationName = data.display_name || "Your location";
            setSelected({ lat, lng, locationName });
          })
          .catch(() => {
            setSelected({ lat, lng, locationName: "Error fetching address" });
          });
      },
      (err) => {
        console.warn("Location denied", err);
      }
    );
  }, [map, setSelected]);

  return null;
};

// 🧭 Click-to-select on map
const LocationMarker = ({ setSelected }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      fetch(
        `http://localhost:5000/api/location/reverse-geocode?lat=${lat}&lon=${lng}`
      )
        .then((res) => res.json())
        .then((data) => {
          const locationName = data.display_name || "Unknown location";
          setSelected({ lat, lng, locationName });
        })
        .catch((err) => {
          console.error("Error fetching address:", err);
          setSelected({ lat, lng, locationName: "Error fetching address" });
        });
    },
  });

  return null;
};

// 🔎 Search component
const SearchControl = ({ setSelected }) => {
  const map = useMap();
  const provider = new OpenStreetMapProvider();
  const searchControlRef = useRef();

  useEffect(() => {
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: false,
      autoClose: true,
      retainZoomLevel: false,
    });

    map.addControl(searchControl);
    searchControlRef.current = searchControl;

    map.on("geosearch/showlocation", async (result) => {
      const lat = result.location.y;
      const lng = result.location.x;

      fetch(
        `http://localhost:5000/api/location/reverse-geocode?lat=${lat}&lon=${lng}`
      )
        .then((res) => res.json())
        .then((data) => {
          const locationName = data.display_name || "Searched location";
          setSelected({ lat, lng, locationName });
        })
        .catch(() => {
          setSelected({ lat, lng, locationName: "Error fetching address" });
        });
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map, provider, setSelected]);

  return null;
};

const LocationPickerModal = ({ onClose, onSelect }) => {
  const [selected, setSelected] = useState(null);
  const defaultCenter = [10.0159, 76.3419]; // Kerala

  const handleSelect = () => {
    if (selected) {
      onSelect(selected); // Send lat, lng & locationName
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
        <h2 className="text-xl font-bold mb-4">Pick a Location</h2>

        <MapContainer
          center={defaultCenter}
          zoom={10}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <AutoLocation setSelected={setSelected} />
          <LocationMarker setSelected={setSelected} />
          <SearchControl setSelected={setSelected} />
          {selected && <Marker position={[selected.lat, selected.lng]} />}
        </MapContainer>

        {selected && (
          <p className="mt-2 text-sm text-gray-600 italic">
            📍 {selected.locationName}
          </p>
        )}

        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onClose}
            className="text-red-500 hover:underline transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSelect}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Select Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPickerModal;
