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
import { loadActivitiesByTravelDaysId, newActivity } from '../../data/activities';

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
      <h4 className="mb-2 fw-semibold">No activities</h4>
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
          <div className="d-flex" style={{flex:"1", flexDirection:"column", alignItems:"flex-end"}}>  
          <div className="day-header">
            <h5 className="mx-3">Day {index + 1}</h5>
          </div>

          <h6 className="mx-3">
             Date: {latestdate}
          </h6>

         {/* {((!checkInHotel && !checkOutHotel) || (confirmedHotel)) && ( */}
            <h6 className="">
              {confirmedHotel?.name ? 'Hotel That Night:' : ''} {confirmedHotel?.name || 'No Hotel Confirmed Yet'}
            </h6>

          {/*{checkOutHotel && (
            <h6 className="">
               Check-Out at {checkOutHotel?.checkOutTime}: {checkOutHotel?.name}
            </h6>
          )}

          {checkInHotel && (
            <h6 className="">
               Check-In at {checkInHotel?.checkInTime}: {checkInHotel?.name}
            </h6>
          )} */}
          </div>
          <div style={{flex:"2"}}>
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
      <div className="flight-container border rounded p-3 my-3" style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }} key={f.id}>
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

        
        <div className="mb-2 d-flex align-items-start">
          <strong className="me-2 flex-shrink-0" style={{ width: "120px" }}>Price:</strong>
          <span className={f.price ? "" : "text-placeholder"}>
            {f.isReturn
              ? "Return Flight"
              : f.price
                ? `$${f.price}`
                : "Not set"}
          </span>
        </div>

      </div>
    )
  )
  return flightElements;
}

function expenditure({ flights, hotels }) {
  const totalFlightCost = flights.reduce((sum, f) => sum + (f.price || 0), 0);
  const totalHotelCost = hotels.reduce((sum, h) => sum + (h.price || 0), 0);
  const totalExpenditure = totalFlightCost + totalHotelCost;

  return (
    <div className="expenditure-summary">
      <h5>Total Flight Cost: ${totalFlightCost.toFixed(2)}</h5>
      <h5>Total Hotel Cost: ${totalHotelCost.toFixed(2)}</h5>
      <h4 className="text-primary">Total Expenditure: ${totalExpenditure.toFixed(2)}</h4>
    </div>
  );
}

export function SummaryPage() {
    const [itin, setItin] = useState(null); //initialize itin to null
    const [flights, setFlights] = useState(null);
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
      const fetchItin = async () => {
        try {
          const loadedItin = await loadItineraryById(itinDbId); //wait to get itin class obj by id from supabase
          setItin(loadedItin);
          const loadedFlights = await loadFlightsByItineraryId(itinDbId);
          setFlights(loadedFlights);
        } catch (err) {
          console.error("Failed to load itinerary", err);
        }
      }
      fetchItin();
    }
    ,[itinDbId]); //re-fetch the moment the itin id in url changes 
    //***(this is bcuz the component stays mounted even if u change url)

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
        <div className="background-image summary-background d-flex flex-column align-items-center">
            <Header />
            <h1 className="welcome-text text-primary" style={{margin: "20px", marginTop:"80px"}}>📝 Summary</h1>
            {itin && flights ? ( //**makes sure itin is not null first before loading all the info and content
              <>
                <ItineraryInfo //THIS ALLOWS USER TO EDIT NAME AND START DATE OF ITIN
                  itin={itin}
                  onSave={saveItinToDB}
                />

                <div className="activity-page-top-buttons">
                  <button className="custom-btn activities-btn" onClick={()=>navigate(`/activities/${itinDbId}`)}>🎯 To Activities</button>
                  <button className="custom-btn hotels-btn" onClick={()=>navigate(`/hotels/${itinDbId}`)}>🏨 To Hotels</button>
                  <button className="custom-btn flights-btn" onClick={()=>navigate(`/flights/${itinDbId}`)}>🛫 To Flights</button>
                  <button className="custom-btn darkened-summary-btn">📝 To Summary</button>
                  <button className='custom-btn home-btn' onClick={()=>navigate('/')}>🏠 Back To Home</button>
                  {/* <AutoSaveButton itin={itin} saveToDB={saveToDB}/> */}
                </div>

                <div 
                className='bg-light p-4 rounded m-3'
                >
                  <h4>Flight Details</h4>
                    <FlightContent  //CONTAINER FOR ALL TRAVEL DAYS
                        flights={flights}
                    /> 
                </div>
                
                <div 
                className='bg-light p-4 rounded m-3'
                >
                  <h4>Summary Of Itinerary</h4>
                    <TravelDayContent  //CONTAINER FOR ALL TRAVEL DAYS
                        itinDbId={itinDbId}
                        confirmedHotelsArr={confirmedHotelsArr}
                        itin={itin}
                    /> 
                </div>

                <div className='bg-light p-4 rounded m-3'>
                  <h4>Expenditure Summary</h4>
                  {expenditure({ 
                    flights, 
                    hotels: confirmedHotelsArr
                  })}
                </div>

              </>)
              : (<h3 className="text-secondary">Loading Summary...</h3>)}
              <div className="button-row">
                <button className="back-btn themed-button" onClick={() => navigate('/')}>🏠 Back To Home</button>
                {/* <button className="save-btn themed-button" onClick={() => saveToDB(itin)}>💾 Save</button> */}
              </div>
        </div>
    );
}