import { useState, useRef, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker, Autocomplete, InfoWindow } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "400px"
};

const centerDefault = { lat: 1.3521, lng: 103.8198 }; // Singapore default
const libraries = ["places"]; //for libs

export default function HotelPicker({ initialPosition, onClose, onSave }) {
    const [mapCenter, setMapCenter] = useState(initialPosition || centerDefault);
    const [markerPosition, setMarkerPosition] = useState(initialPosition || centerDefault);
    const [latLng, setLatLng] = useState(initialPosition || centerDefault);
    const [location, setLocation] = useState(null);
    const [hotelType, setHotelType] = useState('');
    const [nearbyHotels, setNearbyHotels] = useState([]); //This is for NearbyHotels
    const [selectedHotel, setSelectedHotel] = useState(null); //This for the chosen NearbyHotel marker
    const [hotelDetails, setHotelDetails] = useState(null); //This is for the Info Window to display details


    //AutoComp => for search bar
    //geocoder => for pin -> address

    //REFS ==> makes sure it doesnt create new instance every re-render aaaauuuughhhh
    const autocompleteRef = useRef(null); // Ref for Autocomplete instance
    const inputRef = useRef(null);         // Ref for input element
    const geocoder = useRef(null);        // Ref for geocoder instance
    const mapRef = useRef(null);            // Ref for map instance
    const placesServiceDivRef = useRef(null); //Ref for hidden <div>

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
        fetchNearbyHotels(newPos);
        setLatLng(newPos);
        const locName = (place.name);
        const locAddress = (place.formatted_address);
        setLocation({locName, locAddress})
      }
    };

    const fetchNearbyHotels = () => { //uses Places API to get nearby places
        if (hotelType == "") return;
        try {
            console.log("TRYING TO FETCH HOTELS");
            if (!isLoaded || !mapRef.current) return;

            const service = new window.google.maps.places.PlacesService(mapRef.current);
            const request = {
            location: new window.google.maps.LatLng(latLng.lat, latLng.lng),
            radius: 1000,
            type: hotelType,
            };

            service.nearbySearch(request, (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    setNearbyHotels(results);
                } else {
                    console.error("PlacesService nearbySearch failed:", status);
                    setNearbyHotels([]);
                }
            });
        } catch (err) {
            console.error("fetchNearbyHotels error:", err);
        }
    };

    const handleHotelClick = (hotel) => {//handles when u click hotel marker
        setSelectedHotel(hotel);
        const service = new window.google.maps.places.PlacesService(placesServiceDivRef.current);

        const hotelPos = {lat: hotel.geometry.location.lat(),lng: hotel.geometry.location.lng()};
        setMarkerPosition(hotelPos);
        setLatLng(hotelPos);
        updateAddressFromCoords(hotelPos);
        

        const request = {
            placeId: hotel.place_id,
            fields: ['name', 'website', 'url', 'formatted_address'],
        };

        service.getDetails(request, (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setHotelDetails(place);
            } else {
            console.warn("getDetails failed:", status);
            setHotelDetails(null);
            }
        });
    };



    const handleSave = () => {
      onSave( location , latLng );
      onClose();
    };


    if (loadError) return <div>Error loading Google Maps</div>;
    if (!isLoaded) return <div>Loading Map...</div>;

    const nearbyMarkers = nearbyHotels.map(hotel => ( //generates all nearby hotel as markers
                    <Marker
                        key={hotel.place_id}
                        position={{
                        lat: hotel.geometry.location.lat(),
                        lng: hotel.geometry.location.lng()
                        }}
                        icon={{
                          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="42" viewBox="0 0 24 36" fill="blue">
                              <path d="M12 0C6.48 0 2 4.48 2 10c0 5.25 4.86 12.07 9.16 17.15.44.52 1.23.52 1.66 0C17.14 22.07 22 15.25 22 10c0-5.52-4.48-10-10-10z"/>
                              <circle cx="12" cy="10" r="4" fill="white"/>
                            </svg>
                          `),
                          scaledSize: new window.google.maps.Size(30, 42)
                        }}
                        title={hotel.name}
                        onClick={() => {handleHotelClick(hotel);}}
                    />
                    ));

    return (
      <div className="p-3 m-3 bg-light rounded" style={{ // ALL THIS STYLES TO MAKE IT POP UP
        position:'fixed',
        top: '5vh',
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
                  <div className="swap-section m-2 d-flex align-items-center gap-2 justify-content-center">
                    <label htmlFor={`type-select`} className="">🏨 Search Nearby Hotels:</label>
                        <select
                          id={`type-select`}
                          className="form-select form-select-sm"
                          value={hotelType ?? "None"}
                          style={{ maxWidth: "200px" }}
                          onChange={(e) => {
                            if (e.target.value === "") { //checks if user selected a day
                              setHotelType('');
                              return;
                            }
                            setHotelType(e.target.value);
                          }}
                        >
                          <option value="">Select Type</option>
                          <option value="lodging">All Lodging</option>
                          <option value="hotel">Hotel</option>
                          <option value="bed_and_breakfast">Bed & Breakfast</option>
                        </select>
                        <button
                      className="btn btn-outline-primary btn-sm m-2"
                      disabled={hotelType == ""}
                      onClick={() => {
                        setNearbyHotels([]);
                        fetchNearbyHotels();
                        setHotelType(''); // clear after submit
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
              <div ref={placesServiceDivRef} style={{ display: 'none' }} />
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={15}
                onLoad={map => { mapRef.current = map; }}
                onClick={e => {
                    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
                    setMarkerPosition(pos);
                    setLatLng(pos);
                    updateAddressFromCoords(pos);
                    // fetchNearbyHotels(pos);
                }}
              >
                <Marker
                  position={markerPosition}
                  draggable={true}
                  onDragEnd={e => {
                    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
                    setMarkerPosition(pos);
                    setLatLng(pos);
                    updateAddressFromCoords(pos);
                    // fetchNearbyHotels(pos);
                  }}
                />
                {nearbyMarkers}

                {hotelDetails && (
                    <InfoWindow
                        position={{
                        lat: selectedHotel.geometry.location.lat(),
                        lng: selectedHotel.geometry.location.lng()
                        }}
                        onCloseClick={() => {
                        setSelectedHotel(null);
                        setHotelDetails(null);
                        }}
                    >
                        <div style={{ maxWidth: "250px" }}>
                            <h6>{hotelDetails.name}</h6>
                            <p style={{ fontSize: "12px" }}>{hotelDetails.formatted_address}</p>
                            {hotelDetails.website ? (
                                <a href={hotelDetails.website} target="_blank" rel="noopener noreferrer">
                                    Visit Website
                                </a>
                            ) : (
                                <a href={hotelDetails.url} target="_blank" rel="noopener noreferrer">
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
