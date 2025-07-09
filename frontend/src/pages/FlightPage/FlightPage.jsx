import './FlightPage.css';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import ItineraryInfo from '../../components/ItineraryComponents/ItineraryInfo';
import { AutoSaveButton } from '../../components/Misc/AutoSaver';
import ConfirmModal from '../../components/Misc/ConfirmModal';

// import { loadItineraryById, updateItineraryById } from '../../lib/supabaseItinerary';
import FlightContainer from '../../components/FlightPageComponents/FlightContainer';
import { loadFlightsByItineraryId, deleteFlightById, createNewFlight, updateFlightById, newFlight, addFlightsIntoDB } from '../../data/flights';
import { loadItineraryById } from '../../data/itinerary';
// import { loadItineraryById } from '../../lib/supabaseItinerary';

function FlightContent({ flights, itinDbId }) {
  const [localFlights, setLocalFlights] = useState(flights);
  const [deletingId, setDeletingId] = useState(null);

  async function handleAdd() {
    const emptyFlight = newFlight({
      itineraryId: itinDbId,
      airline: '',
      flightNumber: '',
      departureAirport: '',
      arrivalAirport: ''
    });
      addFlightsIntoDB(emptyFlight);
      setLocalFlights([...localFlights, emptyFlight]);
  }

  async function handleSave(id, updatedData) {
    updateFlightById(id, updatedData).then(() => {
      setLocalFlights(localFlights.map(f => f.id === id ? { ...f, ...updatedData } : f));
    });
  }

  function handleDelete(id) {
    setDeletingId(id);
  }

  async function confirmDelete(id) {
    deleteFlightById(id).then(() => {
      setLocalFlights(localFlights.filter(f => f.id !== id));
      setDeletingId(null);
    });
  }

  const flightElements = localFlights.length === 0
    ? <div className="empty-itinerary-warning text-center">
      <h4>
        ✈️ No flights added yet.
      </h4>
      <p>
         Click below to add one
      </p>
    </div>
    : localFlights
        .sort((a, b) => dayjs(a.departureTime).unix() - dayjs(b.departureTime).unix())
        .map(flight => (
          <div key={flight.id}>
            {deletingId === flight.id && (
              <ConfirmModal
                message={`Delete flight ${flight.flightNumber}?`}
                onConfirm={() => confirmDelete(flight.id)}
                onCancel={() => setDeletingId(null)}
              />
            )}
            <FlightContainer
              flight={flight}
              handleSave={handleSave}
              handleDelete={() => handleDelete(flight.id)}
            />
          </div>
        ));

  return (
    <div className="flight-content">
      {flightElements}
      <button className="btn btn-success mb-3" onClick={handleAdd}>+ Add Flight</button>
    </div>
  );
}

function FlightPage() {
  const [itin, setItin] = useState(null);
  const [flights, setFlights] = useState([]);

  const { id: itinDbId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loadedItin = await loadItineraryById(itinDbId);
        // const loadedFlights = [{itineraryId: itinDbId}]
        const loadedFlights = await loadFlightsByItineraryId(itinDbId);
        setItin(loadedItin);
        setFlights(loadedFlights);
      } catch (err) {
        console.error("Failed to load itinerary or flights", err);
      }
    };
    fetchData();
  }, [itinDbId]);


  return (
    <div className="flight-background-image d-flex flex-column align-items-center">
      <Header />
      <h1 className="welcome-text text-primary" style={{ marginTop: "80px" }}>🛫 Flight Planner</h1>
      {itin ? (
        <>
          <ItineraryInfo itin={itin} setItin={setItin} />
          <div className="flight-page-top-buttons">
            <button className="custom-nav-btn hotels-btn" onClick={() => navigate(`/hotels/${itinDbId}`)}>🏨 To Hotels</button>
            <button className="custom-nav-btn activities-btn" onClick={() => navigate(`/activities/${itinDbId}`)}>🎯 To Activities</button>
            <button className="custom-btn summary-btn" onClick={() => navigate(`/summary/${itinDbId}`)}>📝 To Summary</button>
            <button className='custom-btn home-btn' onClick={()=>navigate('/')}>🏠 Back To Home</button>
            {/* <AutoSaveButton itin={itin} saveToDB={saveToDB} /> */}
          </div>

          <FlightContent flights={flights} itinDbId={itinDbId} />
        </>
      ) : (
        <h3 className="text-secondary">Loading Flights...</h3>
      )}

      <div className="button-row">
        <button className="back-btn themed-button" onClick={() => navigate('/')}>🏠 Back To Home</button>
      </div>
    </div>
  );
}

export default FlightPage;
