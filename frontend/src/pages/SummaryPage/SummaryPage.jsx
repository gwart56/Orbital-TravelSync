import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import './SummaryPage.css';
import Header from '../../components/Header/Header';
import ItineraryInfo from '../../components/ItineraryComponents/ItineraryInfo';
// import { loadItineraryById} from '../../lib/supabaseItinerary';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllConfirmedHotelsFromArr, getHotelCheckInOutForDate, getHotelForDate, loadAllConfirmedHotelsByItineraryId } from '../../data/hotel';
// import { AutoSaveButton } from '../components/Misc/AutoSaver';
import { Activity } from '../../data/activity';
import { loadFlightsByItineraryId } from '../../data/flights';
import { loadItineraryById, updateItineraryById} from '../../data/itinerary';
import { loadTravelDaysByItineraryId} from '../../data/travelDays';
import { loadActivitiesByTravelDaysId, newActivity, loadActivitiesByItineraryId } from '../../data/activities';
import { FaPlane, FaHotel, FaWallet } from "react-icons/fa";
import { useAuthContext } from '../../lib/AuthContext';
import { fetchItin } from '../../utils/fetchingForPage';
import { supabase } from '../../lib/supabaseClient';
import { CollaboratorButton } from '../../components/Misc/AddCollaboratorForm';

function ActivityContent({dayId, checkInHotel, checkOutHotel}) {
  const [activities, setActivities] = useState([]);
    // const activities = activityArr;

    useEffect(() => { //FETCH ACTS
      const fetchActs = async () => {
        try {
          const loadedActs = await loadActivitiesByTravelDaysId(dayId);

          const updatedActs = [...loadedActs];

          if (checkInHotel) {
            updatedActs.push(newActivity(dayId, `Check in into ${checkInHotel.name}`, checkInHotel.checkInTime, checkInHotel.address, checkInHotel.address));
          }

          if (checkOutHotel) {
            updatedActs.push(newActivity(dayId, `Check out of ${checkOutHotel.name}`, checkOutHotel.checkOutTime, checkOutHotel.address, checkOutHotel.address));
          }

          setActivities(updatedActs);
        } catch (err) {
          console.error("Failed to load activities", err);
        }
      };

      fetchActs();
    }, [dayId, checkInHotel, checkOutHotel]);

  
  const activityElements = activities.filter(a => a.name).length==0
  ? (<div className="d-flex activity-row">
      <h4 className="mb-2 fw-semibold">Nothing planned for this day 😴</h4>
    </div>

    )
  :[...activities]
    .sort((a, b) => a.time.localeCompare(b.time)) //sorts the activities based on their timings
    .filter(a => a.name)
    .map((a) => 
      <div className="d-flex activity-row" key={a.id}>
  <div className="activity-time">{a.time || '--:--'}</div>
  <div className="activity-name">{a.name}</div>
</div>
    );
  return (
    <div className = "activity-grid js-activity-grid">
      {activityElements}
    </div>
  );
}

//each TravelDayContent contains Day No., Date, ActivityContent 
function TravelDayContent({itinDbId, itin, confirmedHotelsArr}) {
  const [travelDays, setTravelDays] = useState([]);
  // const [confirmedHotelsArr, setConfirmedHotelsArr] = useState([]);
  useEffect( () => {//FETCH TRAVELDAYS
        const fetchTDs = async () => {
          try {
            const loadedTDs = await loadTravelDaysByItineraryId(itinDbId); //wait to get itin class obj by id from supabase
            setTravelDays(loadedTDs);
          } catch (err) {
            console.error("Failed to load traveldays", err);
          }
        }
        fetchTDs();
      }
      ,[itinDbId]);
  
  //   useEffect( () => {//FETCH COnfirmed HOTELS
  //       const fetchCHs = async () => {
  //         try {
  //           const loadedCHs = await loadAllConfirmedHotelsByItineraryId(itinDbId); //wait to get itin class obj by id from supabase
  //           setConfirmedHotelsArr(loadedCHs);
  //         } catch (err) {
  //           console.error("Failed to load confirmed hotels", err);
  //         }
  //       }
  //       fetchCHs();
  //     }
  //     ,[itinDbId]);
  // console.log("CONFIRMED HOTELS", confirmedHotelsArr);


  const dayElements = travelDays.length==0
  ? (
    <div className="empty-itinerary-warning text-center">
      <h4>
        🧭 No Travel Days Yet
      </h4>
    </div>
    )
  :[...travelDays]
    .map((d, index) => {
      const latestdate = dayjs(itin.startDate, 'YYYY-MM-DD').add(index,'day').format('D MMMM YYYY');
      const {checkIns, checkOuts} = getHotelCheckInOutForDate(latestdate, confirmedHotelsArr);
      const confirmedHotel = getHotelForDate(latestdate, confirmedHotelsArr);
      // console.log("THAT DAY HOTEL", confirmedHotel);
      const checkInHotel = checkIns.length==0? undefined : checkIns[0];
      const checkOutHotel = checkOuts.length==0? undefined : checkOuts[0];

      return ( //i lazy to make container component
        <div className="travel-day-container-sum" key={d.id}>
          <div className="travel-day-left" style={{ flex: "1", alignItems: "flex-start" }}>
            <div className="day-header">
              <h2>Day {index + 1}</h2>
            </div>
            <h5 className="day-subtext">📅 {latestdate}</h5>
            {confirmedHotel?.name ? (
              <div className="day-subtext hotel-info">
                <span>Hotel That Night:</span>
                <div>{confirmedHotel.name}</div>
              </div>
            ) : (
              <h5 className="day-subtext no-hotel">No Hotel Confirmed</h5>
            )}
          </div>

          <div className="activity-section" style={{ flex: "2" }}>
            <ActivityContent
              checkInHotel={checkInHotel}
              checkOutHotel={checkOutHotel}
              dayId={d.id}
            />
          </div>
        </div>

      );}
    );

  return (
    <div className="day-content p-2">
      {dayElements}
    </div>
  );
}

function FlightContent({flights}) {
  const flightElements = flights.length==0
  ? (
    <div className="empty-itinerary-warning text-center">
      <h4>
        🧭 No Flights Booked Yet
      </h4>
    </div>
    )
    :flights.map(f=>
  (
      <div className="summary-page-flight-container border rounded p-3 my-3" style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }} key={f.id}>
        <div className="mb-2 d-flex align-items-start">
          <strong className="me-2 flex-shrink-0" style={{ width: "120px" }}>Airline:</strong>
          <span className={f.airline ? "" : "text-placeholder"}>{f.airline || "Not set"}</span>
        </div>

        <div className="mb-2 d-flex align-items-start">
          <strong className="me-2 flex-shrink-0" style={{ width: "120px" }}>Flight No.:</strong>
          <span className={f.flightNumber ? "" : "text-placeholder"}>{f.flightNumber || "Not set"}</span>
        </div>

        <div className="mb-2 d-flex align-items-start">
          <strong className="me-2 flex-shrink-0" style={{ width: "120px" }}>From Airport:</strong>
          <span className={f.departureAirport ? "" : "text-placeholder"}>{f.departureAirport || "Not set"}</span>
        </div>

        <div className="mb-2 d-flex align-items-start">
          <strong className="me-2 flex-shrink-0" style={{ width: "120px" }}>To Airport:</strong>
          <span className={f.arrivalAirport ? "" : "text-placeholder"}>{f.arrivalAirport || "Not set"}</span>
        </div>

        <div className="mb-2 d-flex align-items-start">
          <strong className="me-2 flex-shrink-0" style={{ width: "120px" }}>Departure:</strong>
          <span className={f.departureTime ? "" : "text-placeholder"}>
            {f.departureTime ? dayjs(f.departureTime).format('DD MMM YYYY, HH:mm') : "Not set"}
          </span>
        </div>

        <div className="mb-2 d-flex align-items-start">
          <strong className="me-2 flex-shrink-0" style={{ width: "120px" }}>Arrival:</strong>
          <span className={f.arrivalTime ? "" : "text-placeholder"}>
            {f.arrivalTime ? dayjs(f.arrivalTime).format('DD MMM YYYY, HH:mm') : "Not set"}
          </span>
        </div>

        {f.seatNumber && <div className="mb-2 d-flex align-items-start">
          <strong className="me-2 flex-shrink-0" style={{ width: "120px" }}>Seat Number:</strong>
          <span className={f.seatNumber ? "" : "text-placeholder"}>{f.seatNumber || "Not set"}</span>
        </div>}

        
        {f.isReturn && (
            <div className="mb-2 d-flex align-items-start">
              <strong className="me-2 flex-shrink-0" style={{ width: "120px" }}></strong>
              <span className="text-success">This is a return flight</span>
            </div>
          )}

          {!f.isReturn && (
            <div className="mb-2 d-flex align-items-start">
              <strong className="me-2 flex-shrink-0" style={{ width: "120px" }}>Price:</strong>
              <span className={f.price ? "" : "text-placeholder"}>
                {f.price ? `$${f.price}` : "Not set"}
              </span>
            </div>
          )}

      </div>
    )
  )
  return flightElements;
}

function expenditure({ flights, hotels, activities }) {
  const totalFlightCost = flights.reduce((sum, f) => sum + (f.price || 0), 0);
  const totalHotelCost = hotels.reduce((sum, h) => sum + (h.price || 0), 0);
  const totalActivitycost = activities.reduce((sum, a) => sum + (a.price || 0), 0);
  const totalExpenditure = totalFlightCost + totalHotelCost + totalActivitycost;

  return (
    <div className="expenditure-summary-container fade-in">
      <h3 className="summary-title">Expenditure Summary</h3>

      <div className="summary-item">
        <FaWallet className="summary-icon expenditure" />
        <span>Total Activities Cost:</span>
        <strong>${totalActivitycost.toFixed(2)}</strong>
      </div>
      
      <div className="summary-item">
        <FaPlane className="summary-icon flight" />
        <span>Total Flight Cost:</span>
        <strong>${totalFlightCost.toFixed(2)}</strong>
      </div>

      <div className="summary-item">
        <FaHotel className="summary-icon hotel" />
        <span>Total Hotel Cost:</span>
        <strong>${totalHotelCost.toFixed(2)}</strong>
      </div>

      <div className="summary-divider"></div>

      <div className="summary-total">
        <FaWallet className="summary-icon total" />
        <span>Total Expenditure:</span>
        <strong>${totalExpenditure.toFixed(2)}</strong>
      </div>

    </div>
  );
}

export function SummaryPage() {
    const [itin, setItin] = useState(null); //initialize itin to null
    const [flights, setFlights] = useState(null);
    const [itinMeta, setItinMeta] = useState(null);   // holds user_id and itinerary_members
    const {session} = useAuthContext();
    const sessionUser = session?.user; // get user of current session
    const sessionUserId = sessionUser?.id; //get userId
    const [confirmedHotelsArr, setConfirmedHotelsArr] = useState([]);

  const { id: itinDbId } = useParams(); //get the itinDbId from the URL

  const navigate = useNavigate();

  useEffect( () => {//FETCH COnfirmed HOTELS
        const fetchCHs = async () => {
          try {
            const loadedCHs = await loadAllConfirmedHotelsByItineraryId(itinDbId); //wait to get itin class obj by id from supabase
            setConfirmedHotelsArr(loadedCHs);
          } catch (err) {
            console.error("Failed to load confirmed hotels", err);
          }
        }
        fetchCHs();
      }
      ,[itinDbId]);

  useEffect( () => {
      const fetchFlights = async () => {
        try {
          // const loadedItin = await loadItineraryById(itinDbId); //wait to get itin class obj by id from supabase
          // setItin(loadedItin);
          const loadedFlights = await loadFlightsByItineraryId(itinDbId);
          setFlights(loadedFlights);
        } catch (err) {
          console.error("Failed to load flights", err);
        }
      }
      fetchItin(itinDbId, setItin, setItinMeta, navigate, sessionUserId);
      fetchFlights();
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

    let isOwner = false;

    const isEditable = (() => {
      if (!itinMeta || !sessionUserId) return false;
      const creatorId = itinMeta.user_id;
      const memberDetails = itinMeta.itinerary_members?.find(m => m.user_id == sessionUserId);
      if (sessionUserId === creatorId) {
        isOwner = true;
      }
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

    const [activities, setActivities] = useState([]);
    const fetchActs = async () => {
            try {
              const loadedActs = await loadActivitiesByItineraryId(itinDbId); //wait to get itin class obj by id from supabase
              setActivities(loadedActs);
            } catch (err) {
              console.error("Failed to load activities", err);
            }
          }
    useEffect( () => {//FETCH ACTIVITIES for the current itinDbId
          fetchActs();
        }
        ,[itinDbId]); // Re-fetch activities when dayId changes

    return (
        <div className="background-image summary-background d-flex flex-column align-items-center">
            <Header />
            <h1 className="welcome-text text-primary" style={{margin: "20px", marginTop:"80px"}}>📝 Summary</h1>
            {itin && flights ? ( //**makes sure itin is not null first before loading all the info and content
              <>
                <ItineraryInfo //THIS ALLOWS USER TO EDIT NAME AND START DATE OF ITIN
                  itin={itin}
                  onSave={saveItinToDB}
                  isEditable={false}
                />

                <div className="activity-page-top-buttons">
                  <button className="custom-btn activities-btn" onClick={()=>navigate(`/activities/${itinDbId}`)}>🎯 To Activities</button>
                  <button className="custom-btn hotels-btn" onClick={()=>navigate(`/hotels/${itinDbId}`)}>🏨 To Hotels</button>
                  <button className="custom-btn flights-btn" onClick={()=>navigate(`/flights/${itinDbId}`)}>🛫 To Flights</button>
                  <button className="custom-btn darkened-summary-btn">📝 To Summary</button>
                  <button className='custom-btn home-btn' onClick={()=>navigate('/')}>🏠 Back To Home</button>
                  {/* <AutoSaveButton itin={itin} saveToDB={saveToDB}/> */}
                </div>

                <CollaboratorButton itineraryId={itinDbId} creatorId={itinMeta?.user_id} isEditable={isOwner}/>

                <div 
                className='summary-flight-container fade-in'
                >
                  <h4>Flight Details</h4>
                    <FlightContent  //CONTAINER FOR ALL TRAVEL DAYS
                        flights={flights}
                    /> 
                </div>
                
                <div 
                className='summary-itinerary-container fade-in'
                >
                  <h4>Summary Of Itinerary</h4>
                    <TravelDayContent  //CONTAINER FOR ALL TRAVEL DAYS
                        itinDbId={itinDbId}
                        confirmedHotelsArr={confirmedHotelsArr}
                        itin={itin}
                    /> 
                </div>

                {expenditure({ 
                  flights, 
                  hotels: confirmedHotelsArr,
                  activities
                })}   

              </>)
              : (<h3 className="text-secondary">Loading Summary...</h3>)}
              <div className="button-row">
                <button className="back-btn themed-button" onClick={() => navigate('/')}>🏠 Back To Home</button>
                {/* <button className="save-btn themed-button" onClick={() => saveToDB(itin)}>💾 Save</button> */}
              </div>
        </div>
    );
}