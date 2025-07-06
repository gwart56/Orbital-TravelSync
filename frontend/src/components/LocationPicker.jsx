import { useState, useRef, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker, Autocomplete, InfoWindow } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "400px"
};

const centerDefault = { lat: 1.3521, lng: 103.8198 }; // Singapore default
const libraries = ["places"]; //for libs

export default function LocationPicker({ initialPosition, onClose, onSave }) {
    const [mapCenter, setMapCenter] = useState(initialPosition || centerDefault);
    const [markerPosition, setMarkerPosition] = useState(initialPosition || centerDefault);
    const [latLng, setLatLng] = useState(centerDefault);
    const [location, setLocation] = useState(null);
    const [activityType, setActivityType] = useState('');
    const [nearbyActivities, setNearbyActivities] = useState([]);
    const [selectedAct, setSelectedAct] = useState(null);
    const [actDetails, setActDetails] = useState(null);
    const placesServiceDivRef = useRef(null);


    //AutoComp => for search bar
    //geocoder => for pin -> address

    //REFS ==> makes sure it doesnt create new instance every re-render aaaauuuughhhh
    const autocompleteRef = useRef(null); // Ref for Autocomplete instance
    const inputRef = useRef(null);         // Ref for input element
    const geocoder = useRef(null);        // Ref for geocoder instance
    const mapRef = useRef(null);

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
          const components = results[0]?.address_components || [];
          const premiseComponent = components.find(c => c.types.includes("premise"));
          const name = premiseComponent?.long_name || "Dropped Pin";
          // const name = "Dropped Pin";
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

    const fetchNearbyActivities = () => { //uses Places API to get nearby places
        if (activityType == "") return;
        try {
            console.log("TRYING TO FETCH " + activityType);
            if (!isLoaded || !mapRef.current) return;

            const service = new window.google.maps.places.PlacesService(mapRef.current);
            const request = {
            location: new window.google.maps.LatLng(latLng.lat, latLng.lng),
            radius: 1000,
            type: activityType,
            };

            service.nearbySearch(request, (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    const topResults = results.slice(0, 12); // e.g., max 12 results
                    setNearbyActivities(topResults);
                } else {
                    console.error("PlacesService nearbySearch failed:", status);
                    setNearbyActivities([]);
                }
            });
        } catch (err) {
            console.error("fetchNearbyAct error:", err);
        }
    };

    //------------------------------------------------------HANDLES CLICKING ON ACT MARKER
    const handleActClick = (act) => {//handles when u click act marker
        setSelectedAct(act);
        const service = new window.google.maps.places.PlacesService(placesServiceDivRef.current);

        const request = {
            placeId: act.place_id,
            fields: ['name', 'website', 'url', 'formatted_address'],
        };

        service.getDetails(request, (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setActDetails(place);
            } else {
            console.warn("getDetails failed:", status);
            setActDetails(null);
            }
        });
    };

    //------------------------------------------------------HANDLES SAVE
    const handleSave = () => {
      onSave( location );
      onClose();
    };


    if (loadError) return <div>Error loading Google Maps</div>;
    if (!isLoaded) return <div>Loading Map...</div>;

    return (
      <div className="p-3 m-3 bg-light rounded" style={{ // ALL THIS STYLES TO MAKE IT POP UP
        position:'fixed',
        top: '5vh',
        left: '10vw',
        width: '80vw',
        maxHeight: '85vh',
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
                  <div className="swap-section m-2 d-flex align-items-center gap-2 justify-content-center">
                    <label htmlFor={`type-select`} className="">🔍 Search Nearby Activities:</label>
                        <select
                          id={`type-select`}
                          className="form-select form-select-sm"
                          value={activityType ?? "None"}
                          style={{ maxWidth: "200px" }}
                          onChange={(e) => {
                            if (e.target.value === "") { //checks if user selected a day
                              setActivityType('');
                              return;
                            }
                            setActivityType(e.target.value);
                          }}
                        >
                          <option value="">Select Type</option>
                          <option value="tourist_attraction">Tourist Attractions</option>
                          <option value="restaurant">Restaurants</option>
                          <option value="park">Parks</option>
                        </select>
                        <button
                      className="btn btn-outline-primary btn-sm m-2"
                      disabled={activityType == ""}
                      onClick={() => {
                        setNearbyActivities([]);
                        fetchNearbyActivities()
                        setActivityType(''); // clear after swapping
                      }}
                    >
                      Search
                    </button>
                  </div>
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
              <div ref={placesServiceDivRef} style={{ display: 'none' }} 
                // HIDDEN DIV FOR DISPLAYING PLACES SERVICE
              /> 
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                onLoad={map => { mapRef.current = map; }}
                zoom={15}
                onClick={e => {
                  setMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                  updateAddressFromCoords({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                  setLatLng({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                }}
              >
                <Marker
                  position={markerPosition}
                  draggable={true}
                  onDragEnd={e => {
                    setMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                    updateAddressFromCoords({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                    setLatLng({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                  }}
                />
                {nearbyActivities.map(act => ( //generates all nearby act as markers
                    <Marker
                        key={act.place_id}
                        position={{
                        lat: act.geometry.location.lat(),
                        lng: act.geometry.location.lng()
                        }}
                        icon={{
                        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" // different icon for acts
                        }}
                        title={act.name}
                        onClick={() => {handleActClick(act);}}
                    />
                    ))
                }
                {actDetails && (
                    <InfoWindow
                        position={{
                          lat: selectedAct.geometry.location.lat(),
                          lng: selectedAct.geometry.location.lng()
                        }}
                        onCloseClick={() => {
                        setSelectedAct(null);
                        setActDetails(null);
                        }}
                    >
                        <div style={{ maxWidth: "250px" }}>
                            <h6>{actDetails.name}</h6>
                            <p style={{ fontSize: "12px" }}>{actDetails.formatted_address}</p>
                            {actDetails.website ? (
                                <a href={actDetails.website} target="_blank" rel="noopener noreferrer">
                                    Visit Website
                                </a>
                            ) : (
                                <a href={actDetails.url} target="_blank" rel="noopener noreferrer">
                                    View on Google Maps
                                </a>
                            )}
                        </div>
                    </InfoWindow>
                  )}
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
