import { useState, useRef, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "400px"
};

const centerDefault = { lat: 1.3521, lng: 103.8198 }; // Singapore default
const libraries = ["places"]; //for libs

export default function LocationPicker({ initialPosition, onClose, onSave }) {
    const [mapCenter, setMapCenter] = useState(initialPosition || centerDefault);
    const [markerPosition, setMarkerPosition] = useState(initialPosition || centerDefault);
    const [location, setLocation] = useState(null);

    //AutoComp => for search bar
    //geocoder => for pin -> address

    //REFS ==> makes sure it doesnt create new instance every re-render aaaauuuughhhh
    const autocompleteRef = useRef(null); // Ref for Autocomplete instance
    const inputRef = useRef(null);         // Ref for input element
    const geocoder = useRef(null);        // Ref for geocoder instance

    const { isLoaded, loadError } = useJsApiLoader({// loads api
      googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, //*** USE THIS LINE WHEN USING NPM RUN DEV
      // googleMapsApiKey: process.env.VITE_GOOGLE_MAPS_API_KEY,
      libraries: libraries
    });

    useEffect( () => {
      if (isLoaded && !geocoder.current) { //make sure is BOTH loaded AND no exisitng geocoder instance
        geocoder.current = new window.google.maps.Geocoder(); //creates new geocoder instance
      }
    },[isLoaded]);
    
    const updateAddressFromCoords = (latLng) => {//update address from coords of pin
      if (!geocoder) return; //if geocoder not ready, do nothing
      geocoder.current.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results[0]) {
          const address = results[0].formatted_address;
          // const components = results[0]?.address_components || [];
          // const premiseComponent = components.find(c => c.types.includes("premise"));
          // const name = premiseComponent?.long_name || "Dropped Pin";
          const name = "Dropped Pin";
          inputRef.current.value = address;
          setLocation({ locName: name, locAddress: address });
        }
      });
    }
    

    const handlePlaceChanged = () => {// this sets the marker position and map center position
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
      <div className="p-3 m-3 bg-light rounded" style={{ // ALL THIS STYLES TO MAKE IT POP UP
        position:'fixed',
        top: '10vh',
        left: '10vw',
        width: '80vw',
        height: '85vh',
        backgroundColor: 'rgba(0,0,0,0.5)', /* dark background mayb change ltr idk*/
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
        zIndex: 1050 
        }}>
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
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();     // Prevents form submit
                          e.stopPropagation();    // Stops the event from bubbling
                          // handleSave();
                          }
                      }}
                  />
                  </Autocomplete>
              </div>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={15}
                onClick={e => {
                  setMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                  updateAddressFromCoords({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                }}
              >
                <Marker
                  position={markerPosition}
                  draggable={true}
                  onDragEnd={e => {
                    setMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                    updateAddressFromCoords({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                  }}
                />
              </GoogleMap>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-success m-2" onClick={handleSave}><strong>Choose Location</strong></button>
              <button type="button" className="btn btn-secondary m-2" onClick={onClose}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
}
