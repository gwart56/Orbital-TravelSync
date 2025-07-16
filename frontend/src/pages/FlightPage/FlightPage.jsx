import './FlightPage.css';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import ItineraryInfo from '../../components/ItineraryComponents/ItineraryInfo';
// import { AutoSaveButton } from '../../components/Misc/AutoSaver';
import ConfirmModal from '../../components/Misc/ConfirmModal';

// import { loadItineraryById, updateItineraryById } from '../../lib/supabaseItinerary';
import FlightContainer from '../../components/FlightPageComponents/FlightContainer';
import { loadFlightsByItineraryId, deleteFlightById, createNewFlight, updateFlightById, newFlight, addFlightsIntoDB } from '../../data/flights';
import { loadItineraryById } from '../../data/itinerary';
import { useAuthContext } from '../../lib/AuthContext';
import { LoadingMessage } from '../../components/Misc/LoadingMessage';
import { fetchItin } from '../../utils/fetchingForPage';
import { supabase } from '../../lib/supabaseClient';
// import { loadItineraryById } from '../../lib/supabaseItinerary';

function FlightContent({itinDbId , isEditable, setLoadingMessage}) {
  const [localFlights, setLocalFlights] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const fetchFlights = async () => {
      try {
        const loadedFlights = await loadFlightsByItineraryId(itinDbId);
        setLocalFlights(loadedFlights);
      } catch (err) {
        console.error("Failed to load flights", err);
      }
    };
  
  useEffect(() => {
    fetchFlights();
  }, [itinDbId]);

  useEffect(() => {
          // Initial fetch when the component mounts or itinDbId changes
          fetchFlights();
      
          const channel = supabase.channel(`flights-${itinDbId}`);
          console.log(`[Realtime] Subscribing to flights-${itinDbId}`);
      
          channel
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'flights',
                filter: `itineraryId=eq.${itinDbId}`,
              },
              (payload) => {
                console.log('[Realtime] INSERT/UPDATE/DELETE flight', payload);
                fetchFlights();
              }
            )
            .subscribe((status) => {
              console.log(`[Realtime] flights-${itinDbId} channel status:`, status);
            });
      
          // Cleanup function: This runs when itinDbId changes or component unmounts
          return () => {
            console.log(`[Cleanup] Removing flight channel for ${itinDbId}`);
            if (channel) {
              channel.unsubscribe();
            }
          };
        }, [itinDbId]);

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
      <h4>🛫 No flights added yet.</h4>
      <p>Start planning your journey by adding your first flight below!</p>

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
              isEditable={isEditable}
            />
          </div>
        ));

  return (
    <div className="flight-content">
      {flightElements}
      <button className="btn btn-success mb-3" onClick={handleAdd} disabled={!isEditable}>+ Add Flight</button>
    </div>
  );
}

function FlightPage() {
  const [loadingMessage, setLoadingMessage] = useState("");
  const [itinMeta, setItinMeta] = useState(null);   // holds user_id and itinerary_members
  const {session} = useAuthContext();
  const sessionUser = session?.user; // get user of current session
  const sessionUserId = sessionUser?.id; //get userId

  const [itin, setItin] = useState(null); //initialize itin to null

  const { id: itinDbId } = useParams(); //get the itinDbId from the URL
  const navigate = useNavigate();

  useEffect( () => {//FETCH ITIN
          fetchItin(itinDbId, setItin, setItinMeta, navigate, sessionUserId);
      }
      ,[itinDbId, sessionUserId, navigate]); //re-fetch the moment the itin id in url changes 
          //***(this is bcuz the component stays mounted even if u change url)

  useEffect(() => {//this is for realtime channel for itin
        // Initial fetch when the component mounts or itinDbId changes
        fetchItin(itinDbId, setItin, setItinMeta, navigate, sessionUserId);
    
        const channel = supabase.channel(`itins-${itinDbId}`);
        console.log(`[Realtime] Subscribing to itins-${itinDbId}`);
    
        channel
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'itins',
              filter: `id=eq.${itinDbId}`,
            },
            (payload) => {
              console.log('[Realtime] INSERT/UPDATE/DELETE itin', payload);
              fetchItin(itinDbId, setItin, setItinMeta, navigate, sessionUserId);
            }
          )
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'itinerary_members',
              filter: `itinerary_id=eq.${itinDbId}`,
            },
            (payload) => {
              console.log('[Realtime] INSERT/UPDATE/DELETE itin members', payload);
              fetchItin(itinDbId, setItin, setItinMeta, navigate, sessionUserId);
            }
          )
          .subscribe((status) => {
            console.log(`[Realtime] itins-${itinDbId} channel status:`, status);
          });
    
        // Cleanup function: This runs when hgId changes or component unmounts
        return () => {
          console.log(`[Cleanup] Removing itin channel for ${itinDbId}`);
          if (channel) {
            channel.unsubscribe();
          }
        };
      }, [itinDbId, sessionUserId, navigate]);
  
  const isEditable = (() => {
        if (!itinMeta || !sessionUserId) return false;
            const creatorId = itinMeta.user_id;
            const memberDetails = itinMeta.itinerary_members?.find(m => m.user_id == sessionUserId);
            if (sessionUserId === creatorId || (memberDetails && memberDetails.role === 'editor')) {
                console.log("YES EDITABLE");
                return true;
            }
            console.log("NO NOT EDITABLE");
            return false;
        })(); //determines whether page is editable or not

  const saveItinToDB = async (itin) => {//SAVES ITINERARY TO DATABASE
            try {
              await updateItineraryById(itinDbId, itin);
              setItin(itin);
              console.log('SAVED ITIN TO DB!');
            } catch (err) {
              console.error('Failed to update Itinerary...', err);
            }
        }


  return (
    <div className="flight-background-image d-flex flex-column align-items-center">
      <Header />

      <h1 className="welcome-text text-primary" style={{ marginTop: "80px" }}>🛫 Flight Planner</h1>
      <LoadingMessage loadingMessage={loadingMessage}/>
      {itin ? (
        <>
          <ItineraryInfo //THIS ALLOWS USER TO EDIT NAME AND START DATE OF ITIN
            itin={itin}
            onSave={saveItinToDB}
          />
          <div className="flight-page-top-buttons">
            <button className="custom-nav-btn activities-btn" onClick={() => navigate(`/activities/${itinDbId}`)}>🎯 To Activities</button>
            <button className="custom-nav-btn hotels-btn" onClick={() => navigate(`/hotels/${itinDbId}`)}>🏨 To Hotels</button>
            <button className="custom-nav-btn darkened-flights-btn">🛫 To Flights</button>
            <button className="custom-btn summary-btn" onClick={() => navigate(`/summary/${itinDbId}`)}>📝 To Summary</button>
            <button className='custom-btn home-btn' onClick={()=>navigate('/')}>🏠 Back To Home</button>
            {/* <AutoSaveButton itin={itin} saveToDB={saveToDB} /> */}
          </div>

          <FlightContent itinDbId={itinDbId} setLoadingMessage={setLoadingMessage} isEditable={isEditable}/>
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
