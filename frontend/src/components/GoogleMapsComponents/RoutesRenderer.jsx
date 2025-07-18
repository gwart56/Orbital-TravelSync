import { GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import { useState } from "react";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const center = { lat: 1.3521, lng: 103.8198 }; // default center, e.g. Singapore

const libraries = ["places"];

export function RouteRender({ origin, destination }) {
  const [directions, setDirections] = useState(null);
  const [steps, setSteps] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [totalDistance, setTotalDistance] = useState("");
  const [totalDuration, setTotalDuration] = useState("");
  const [showStepsModal, setShowStepsModal] = useState(false);
  const [transitMode, setTransitMode] = useState("TRANSIT");

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const handleRouteRequest = (transitMode) => {
    if (!origin || !destination) return;

    console.log("Origin:", origin);
    console.log("Destination:", destination);

    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        travelMode: transitMode,
        transitOptions: {
            departureTime: new Date(),  // This is the correct way to specify for TRANSIT
            // modes: [google.maps.TransitMode.BUS, google.maps.TransitMode.TRAIN],
            // routingPreference: google.maps.TransitRoutePreference.LESS_WALKING
        },
        provideRouteAlternatives: true
      },
      (result, status) => {
        if (status === "OK") {
        const leg = result.routes[0].legs[0];

        const loadedSteps = leg.steps.map((step, idx) => ({
            instruction: step.instructions, // HTML string (can render with dangerouslySetInnerHTML)
            duration: step.duration.text,   // e.g. "4 mins"
            distance: step.distance.text,   // e.g. "0.3 km"
            travelMode: step.travel_mode,   // e.g. "WALKING", "TRANSIT"
            transitDetails: step.transit ? step.transit : null
        }));

        const loadedTotalDuration = leg.duration.text; // e.g. "23 mins"
        const loadedTotalDistance = leg.distance.text; // e.g. "5.1 km"

        setSteps(loadedSteps);
        setTotalDistance(loadedTotalDistance);
        setTotalDuration(loadedTotalDuration);
        setDirections(result);
        setErrorMessage("");
        } else {
            setDirections(null);
            setErrorMessage(`Error: Unable to find Route via ${transitMode.toLowerCase()}.`);
            console.error("Directions request failed", result);
        }
    }
    );
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (origin && destination &&
    <div>
        <div className="d-flex justify-content-center mb-2">
            <select
                id={`type-select`}
                className="form-select form-select-sm mx-2"
                value={transitMode}
                style={{ maxWidth: "200px" }}
                onChange={(e) => {
                    setTransitMode(e.target.value);
                    setDirections(null); setSteps(null); setErrorMessage("");
                }}
            >
                <option value="TRANSIT">Transit</option>
                <option value="DRIVING">Driving</option>
                <option value="WALKING">Walking</option>
            </select>
            <button onClick={() => {if (directions) {setDirections(null); setSteps(null); setErrorMessage("");} else handleRouteRequest(transitMode)}} className="btn btn-primary">
                {!directions? 'Show Route': 'Hide Route'}
            </button>
        </div>

        {directions && 
        <>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
            <DirectionsRenderer directions={directions} />
        </GoogleMap>
        <button onClick={() => setShowStepsModal(true)} className="btn btn-primary m-2">
            Show Steps
        </button>
        {totalDistance && <p><strong>Total Distance: </strong> {totalDistance}</p>}
        {totalDuration && <p><strong>Total Duration: </strong> {totalDuration}</p>}
        </>}
        {errorMessage && <p className="text-danger">{errorMessage}</p>}

        {/* Modal for displaying steps */}
        {showStepsModal && (
            <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Route Steps</h5>
                            <button type="button" className="btn-close" onClick={() => setShowStepsModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            {steps && steps.map((step, i) => (
                                <div key={i} style={{ marginBottom: "10px" }} className="bg-light rounded p-2">
                                    <div dangerouslySetInnerHTML={{ __html: step.instruction }} />
                                    <div>{step.duration} • {step.distance}</div>
                                    {step.travelMode === "TRANSIT" && step.transitDetails && (
                                        <div className="text-muted d-flex flex-row justify-content-center gap-2" style={{ fontSize: "0.9em" }}>
                                            <div><strong>Route:</strong> {step.transitDetails.line.short_name || step.transitDetails.line.name}</div>
                                            <div><strong>From:</strong> {step.transitDetails.departure_stop.name}</div>
                                            <div><strong>To:</strong> {step.transitDetails.arrival_stop.name}</div>
                                            <div><strong>Stops:</strong> {step.transitDetails.num_stops}</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowStepsModal(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}