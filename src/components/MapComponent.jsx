import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Circle, Marker } from "@react-google-maps/api";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

const options = {
  fillColor: "rgba(0, 123, 255, 0.3)",
  strokeColor: "#007bff",
  strokeOpacity: 0.8,
  strokeWeight: 2,
};

const mapOptions = {
  disableDefaultUI: true, 
  zoomControl: false, 
  fullscreenControl: false, 
  streetViewControl: false, 
  mapTypeControl: false, 
  styles: [
    { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
    { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] },
    { "featureType": "landscape.man_made", "elementType": "geometry", "stylers": [{ "color": "#383838" }] },
    { "featureType": "landscape.man_made", "elementType": "labels.text.fill", "stylers": [{ "color": "#bdbdbd" }] },

    { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#2c2c2c" }] },
    { "featureType": "poi.business", "stylers": [{ "visibility": "on" }] }, 
    { "featureType": "poi.business", "elementType": "geometry", "stylers": [{ "color": "#404040" }] },
    { "featureType": "poi.business", "elementType": "labels.text.fill", "stylers": [{ "color": "#ffffff" }] },
    { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#181818" }] },
    { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
    { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#2c2c2c" }] },
    { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#8a8a8a" }] },
    { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#3c3c3c" }] },
    { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#bdbdbd" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#121212" }] },
    { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#3d3d3d" }] }
  ]
};


const MapComponent = () => {
  const [location, setLocation] = useState(null);
  const radius = 50; 

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(newLocation);
          socket.emit("send-location", newLocation);
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }

    socket.on("update-location", (newLocation) => {
      setLocation(newLocation);
    });
  }, []);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={location || { lat: 0, lng: 0 }} zoom={19.5} options={mapOptions}>
        {location && (
          <>
            <Marker position={location} />
            <Circle center={location} radius={radius} options={options} />
          </>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;