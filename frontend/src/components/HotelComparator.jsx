import { useState, useRef, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker, Autocomplete, InfoWindow } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "400px"
};

const centerDefault = { lat: 1.3521, lng: 103.8198 }; // Singapore default
const libraries = ["places"]; //for libs

export default function HotelComparator({ initialPosition, onClose, comparedHotels }) {
    const [mapCenter, setMapCenter] = useState(initialPosition || centerDefault);
    const [markerPosition, setMarkerPosition] = useState(initialPosition || centerDefault);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [hotelDetails, setHotelDetails] = useState(null);


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
      }
    };


    const handleHotelClick = (hotel) => {//handles when u click hotel marker
        setSelectedHotel(hotel);
        setHotelDetails(hotel);
    };


    if (loadError) return <div>Error loading Google Maps</div>;
    if (!isLoaded) return <div>Loading Map...</div>;

    const nearbyMarkers = comparedHotels.filter(h=>h.latLng).map(hotel => ( //generates all nearby hotel as markers
                    <Marker
                        key={hotel.id}
                        position={{
                        lat: hotel.latLng.lat,
                        lng: hotel.latLng.lng
                        }}
                        icon={{
                          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="42" viewBox="0 0 24 36" fill="blue">
                              <path d="M12 0C6.48 0 2 4.48 2 10c0 5.25 4.86 12.07 9.16 17.15.44.52 1.23.52 1.66 0C17.14 22.07 22 15.25 22 10c0-5.52-4.48-10-10-10z"/>
                              <text x="12" y="15" text-anchor="middle" font-size="10" fill="white" font-family="Arial" font-weight="bold">🏠</text>
                            </svg>
                          `),
                          scaledSize: new window.google.maps.Size(35, 45)
                        }}
                        title={hotel.name}
                        onClick={() => {handleHotelClick(hotel);}}
                    />
                    ));

    // console.log("IVE REACHED HERE");
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
              <h5 className="">Compare Locations<button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button></h5>
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
              <div ref={placesServiceDivRef} style={{ display: 'none' }} />
              <GoogleMap
                mapContainerStyle={containerStyle}
                onLoad={(map) => {
                  mapRef.current = map;

                  if (comparedHotels.length > 0) {//CENTERS THE MAP AROUND MARKERS
                    const bounds = new window.google.maps.LatLngBounds();
                    comparedHotels.filter(h=>h.latLng).forEach(hotel => {
                      bounds.extend(new window.google.maps.LatLng(hotel.latLng.lat, hotel.latLng.lng));
                    });
                    map.fitBounds(bounds);
                  } else {

                  }
                }}
                onClick={e => {
                    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
                    setMarkerPosition(pos);
                    updateAddressFromCoords(pos);
                    setSelectedHotel(null);
                    setHotelDetails(null);
                }}
              >
                <Marker
                  position={markerPosition}
                  draggable={true}
                  onDragEnd={e => {
                    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
                    setMarkerPosition(pos);
                    updateAddressFromCoords(pos);
                    setSelectedHotel(null);
                    setHotelDetails(null);
                  }}
                />
                {nearbyMarkers}

                {hotelDetails && (
                    <InfoWindow
                        position={{
                        lat: selectedHotel?.latLng.lat,
                        lng: selectedHotel?.latLng.lng
                        }}
                        onCloseClick={() => {
                          setSelectedHotel(null);
                          setHotelDetails(null);
                        }}
                    >
                        <div style={{ maxWidth: "250px" }}>
                            <h6>{hotelDetails.name}</h6>
                            <h6>{hotelDetails.price}</h6>
                            <h6>{hotelDetails.rating}</h6>
                            <p style={{ fontSize: "12px" }}>{hotelDetails.address}</p>
                            {hotelDetails.link ? (
                                <a href={hotelDetails.link} target="_blank" rel="noopener noreferrer">
                                    Visit Website
                                </a>
                            ) : (
                                <a target="_blank" rel="noopener noreferrer">
                                    No Link
                                </a>
                            )}
                        </div>
                    </InfoWindow>
                    )}
              </GoogleMap>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary m-2" onClick={onClose}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
}
