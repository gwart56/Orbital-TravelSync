import React, { useState, useRef } from "react";
import {
  GoogleMap,
  Marker,
  LoadScript,
  Autocomplete
} from "@react-google-maps/api";
import Header from "../components/Header";

const libraries = ["places"];

const containerStyle = {
  width: "100%",
  height: "400px"
};

const defaultCenter = {
  lat: 1.3521, // Singapore
  lng: 103.8198
};

function MapWithSearch() {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markerPos, setMarkerPos] = useState(defaultCenter);
  const autocompleteRef = useRef(null);
//   const libraries = ["places"];

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const location = place.geometry.location;
      const newPos = {
        lat: location.lat(),
        lng: location.lng()
      };
      setMapCenter(newPos);
      setMarkerPos(newPos);
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <div className="container" style={{ marginTop:"100px"}}>
        <div className="mb-3">
          <Autocomplete
            onLoad={(ref) => (autocompleteRef.current = ref)}
            onPlaceChanged={handlePlaceChanged}
          >
            <input
              type="text"
              className="form-control"
              placeholder="Search for a place"
            />
          </Autocomplete>
        </div>

        <div className="border rounded shadow-sm" style={{ overflow: "hidden" }}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={14}
            onClick={(e) =>
              setMarkerPos({ lat: e.latLng.lat(), lng: e.latLng.lng() })
            }
          >
            <Marker
              position={markerPos}
              draggable={true}
              onDragEnd={(e) =>
                setMarkerPos({ lat: e.latLng.lat(), lng: e.latLng.lng() })
              }
            />
          </GoogleMap>
        </div>

        <div className="mt-3">
          <strong>Selected Location:</strong>
          <div>Lat: {markerPos.lat.toFixed(5)}</div>
          <div>Lng: {markerPos.lng.toFixed(5)}</div>
        </div>
      </div>
    </LoadScript>
  );
}

export default function MapPage() {
    return (<>
    <Header />
    <MapWithSearch />
    </>) ;
}