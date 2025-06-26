import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MapSearch from "./MapSearch";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const FlyToLocation = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 18); // zoom level 10
    }
  }, [position, map]);
  return null;
};
const BangladeshMap = () => {
  const centerPosition = [23.685, 90.3563];
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const popupRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  useEffect(() => {
    fetch("/warehouses.json")
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.error("Failed to load data:", err));
  }, []);
  const handleSearch = (e) => {
    e.preventDefault();

    const term = searchTerm.toLowerCase();
    console.log(term);
    const match = locations.find(
      (loc) =>
        loc.district.toLowerCase() === term || loc.city.toLowerCase() === term
    );
    if (match) {
      setSelectedLocation(match);
    } else {
      alert("No match found");
    }
  };
  return (
    <div className="">
      <MapSearch
        handleSearch={handleSearch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      {/* Map */}
      <MapContainer
        center={centerPosition}
        zoom={8}
        style={{ height: "90vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <FlyToLocation
          position={
            selectedLocation
              ? [selectedLocation.latitude, selectedLocation.longitude]
              : null
          }
        />

        {locations.map((location, index) => (
          <Marker
            key={index}
            position={[location.latitude, location.longitude]}
            eventHandlers={{
              add: (e) => {
                if (
                  selectedLocation &&
                  selectedLocation.district === location.district
                ) {
                  popupRef.current = e.target;
                  setTimeout(() => e.target.openPopup(), 300);
                }
              },
            }}
          >
            <Popup>
              <strong>{location.district}</strong>
              <br />
              Region: {location.region}
              <br />
              City: {location.city}
              <br />
              Covered: {location.covered_area.join(", ")}
              <br />
              <a href={location.flowchart} target="_blank" rel="noreferrer">
                Flowchart
              </a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default BangladeshMap;
