import { useState, useRef, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker, Autocomplete, InfoWindow } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "60vh",
};

const centerDefault = { lat: 1.3521, lng: 103.8198 }; // Singapore default
const libraries = ["places"]; //for libs

export default function LocationPicker({ act, onClose, onSave , prevLocation}) {
    const initialPosition = act.latLng; 
    // null;
    // temporarily commented TODO: IMPLEMENT ACTIVITY LATLNG
    const [mapCenter, setMapCenter] = useState(initialPosition || centerDefault);
    const [markerPosition, setMarkerPosition] = useState(initialPosition || centerDefault);
    const [latLng, setLatLng] = useState(initialPosition || centerDefault);
    const [location, setLocation] = useState(prevLocation);
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
        if (!initialPosition) {
            // console.log("A");
            geocodeAddress(act.locAddress);
        }
      }
    },[isLoaded]);
    
    const updateAddressFromCoords = (latLng, givenName) => {//update address from coords of pin
      if (!geocoder) return; //if geocoder not ready, do nothing
      geocoder.current.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results[0]) {
          const address = results[0].formatted_address;
          // const components = results[0]?.address_components || [];
          // const premiseComponent = components.find(c => c.types.includes("premise"));
          // const name = premiseComponent?.long_name || "";
          const name = givenName || prevLocation.locName;
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
        setLatLng(newPos);
        const locName = (place.name);
        const locAddress = (place.formatted_address);
        setLocation({locName, locAddress});
      }
    };

    const geocodeAddress = (address) => {//for converting manual Text to latLng
      if (!geocoder.current || !address) return;

      geocoder.current.geocode({ address }, (results, status) => {
        if (status === "OK" && results[0]) {
          const location = results[0].geometry.location;
          const latLng = {
            lat: location.lat(),
            lng: location.lng(),
          };
          console.log("Geocoded LatLng:", latLng);

          setMapCenter(latLng);
          setMarkerPosition(latLng);
          setLatLng(latLng);
          updateAddressFromCoords(latLng);
        } else {
          console.error("Geocode failed:", status);
        }
      });
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

        setActDetails(null);
        setSelectedAct(null);
        
        const service = new window.google.maps.places.PlacesService(placesServiceDivRef.current);

        const actPos = {lat: act.geometry.location.lat(),lng: act.geometry.location.lng()};
        setMarkerPosition(actPos);
        setLatLng(actPos);
        // updateAddressFromCoords(actPos);

        const request = {
            placeId: act.place_id,
            fields: ['name', 'website', 'url', 'formatted_address','rating', 'user_ratings_total', 'price_level'],
        };

        setSelectedAct(act);

        service.getDetails(request, (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              setActDetails(place);
              const locName = (place.name);
              const locAddress = (place.formatted_address);
              setLocation({locName, locAddress});
              inputRef.current.value = locAddress;
            } else {
            console.warn("getDetails failed:", status);
            setActDetails(null);
            }
        });
    };

    //------------------------------------------------------HANDLES SAVE
    const handleSave = () => {
      onSave( location, latLng );
      onClose();
    };


    if (loadError) return <div>Error loading Google Maps</div>;
    if (!isLoaded) return <div>Loading Map...</div>;

    return (
      <div className="modal fade show d-block" tabIndex={-1}
      // style={{ // ALL THIS STYLES TO MAKE IT POP UP
      //   position:'fixed',
      //   top: '3vh',
      //   left: '10vw',
      //   width: '80vw',
      //   maxHeight: '85vh',
      //   backgroundColor: 'rgba(0,0,0,0.5)', /* dark background mayb change ltr idk*/
      //   // display: 'flex',
      //   // justifyContent: 'center',
      //   // alignItems: 'center',
      //   zIndex: 1050 
      //   }}
        >
        
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document" onClick={onClose} style={{ maxWidth: "80vw", maxHeight: "80vh" }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title">Edit Location</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <h6>*Note: Manually inputed addresses may not be marked on map accurately</h6>
              <div className="">
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
                          <option value="shopping_mall">Shopping Malls</option>
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
                  setSelectedAct(null);
                  setActDetails(null);
                }}
              >
                <Marker
                  position={markerPosition}
                  draggable={true}
                  onDragEnd={e => {
                    setMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                    updateAddressFromCoords({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                    setLatLng({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                    setSelectedAct(null);
                    setActDetails(null);
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
                          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="42" viewBox="0 0 24 36" fill="cyan">
                              <path d="M12 0C6.48 0 2 4.48 2 10c0 5.25 4.86 12.07 9.16 17.15.44.52 1.23.52 1.66 0C17.14 22.07 22 15.25 22 10c0-5.52-4.48-10-10-10z" 
                                stroke="blue"
                                stroke-width="1"
                              />
                              <circle cx="12" cy="10" r="4" fill="blue"/>
                            </svg>
                          `),
                          scaledSize: new window.google.maps.Size(30, 42)
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
                            {actDetails.rating && ( //rating
                              <p style={{ fontSize: "12px" }}>
                                 {actDetails.rating} ⭐ ({actDetails.user_ratings_total ?? 0} reviews)
                              </p>
                            )}
                            {actDetails.price_level && ( //$$$$
                              <p style={{ fontSize: "12px" }}>
                                Price Level: {actDetails.price_level==0?"Free":"$".repeat(actDetails.price_level)}
                              </p>
                            )}
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
            <div className="modal-footer border-0 pt-0">
              <button type="button" className="btn btn-success mx-2" onClick={handleSave}><strong>Choose Location</strong></button>
              <button type="button" className="btn btn-secondary mx-2" onClick={onClose}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
}
