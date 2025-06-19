import { useState, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px"
};

const centerDefault = { lat: 1.3521, lng: 103.8198 }; // Singapore default
const libraries = ["places"];

export default function LocationPicker({ initialPosition, onClose, onSave }) {
  const [mapCenter, setMapCenter] = useState(initialPosition || centerDefault);
  const [markerPosition, setMarkerPosition] = useState(initialPosition || centerDefault);
  const [location, setLocation] = useState(null);

  const autocompleteRef = useRef(null); // Ref for Autocomplete instance
  const inputRef = useRef(null);         // Ref for input element

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries
  });

   const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    console.log(place);
    if (place.geometry) {
      const location = place.geometry.location;
      const newPos = {
        lat: location.lat(),
        lng: location.lng()
      };
      setMapCenter(newPos);
      setMarkerPosition(newPos);
      const locName = (place.name);
      const locAddress = (place.formatted_address);
      setLocation({locName, locAddress})
    }
  };


  const handleSave = () => {
    onSave( location );
    onClose();
  };


  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading Map...</div>;

  return (
     <div className="p-2 m-3 bg-light rounded">
      <div className=" -lg" role="document" onClick={onClose}>
        <div className="" onClick={e => e.stopPropagation()}>
          <div className="">
            <h5 className="">Edit Location <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button></h5>
          </div>
          <div className="-body">
            <div className="mb-3">
                <Autocomplete
                    onLoad={(ref) => (autocompleteRef.current = ref)}
                    onPlaceChanged={handlePlaceChanged}
                >
                <input
                    ref={inputRef}
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search location"
                />
                </Autocomplete>
            </div>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={15}
              onClick={e => setMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
            >
              <Marker
                position={markerPosition}
                draggable={true}
                onDragEnd={e => setMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
              />
            </GoogleMap>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={handleSave}>Save Location</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
