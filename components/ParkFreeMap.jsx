"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const ParkFreeMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Only run if the window object is available (client-side)
    if (typeof window !== "undefined" && mapRef.current && !mapRef.current._leaflet_id) {
      const map = L.map(mapRef.current).setView([51.505, -0.09], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Example marker (can be replaced with real data)
      L.marker([51.505, -0.09]).addTo(map).bindPopup("You are here").openPopup();
    }
  }, []);

  return (
    <div>
      <h2>ParkFree Map</h2>
      <div
        ref={mapRef}
        style={{
          height: "500px",
          width: "100%",
          borderRadius: "12px",
          border: "1px solid #ccc",
        }}
      />
    </div>
  );
};

export default ParkFreeMap;
