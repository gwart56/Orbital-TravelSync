import dayjs from 'dayjs';
import { MdDeleteForever } from "react-icons/md";
import { useState, useEffect } from 'react';
import './ActivityPage.css';
import Header from '../components/Header';
import ItineraryInfo from '../components/ItineraryInfo';
import { loadItineraryById, updateItineraryById } from '../lib/supabaseItinerary';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllConfirmedHotelsFromArr, getHotelCheckInOutForDate, getHotelForDate } from '../data/hotel';
import { AutoSaveButton } from '../components/AutoSaver';
import { Activity } from '../data/activity';

function ActivityContent({activityArr}) {
  const activities = activityArr;

  
  const activityElements = activities.length==0
  ? (<div className="empty-activity-box text-center p-4 my-4 rounded shadow-sm fade-in">
      <div className="emoji mb-2" style={{ fontSize: "2rem" }}>😴</div>
      <h4 className="mb-2 fw-semibold">This day’s still empty</h4>
      <p className="mb-3 text-muted">Let’s add some fun plans to your itinerary 📝</p>
    </div>

    )
  :[...activities]
    .sort((a, b) => a.time.localeCompare(b.time)) //sorts the activities based on their timings
    .filter(a => a.name)
    .map((a) => 
      <div className="d-flex activity-row">
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
function TravelDayContent({dayArr, itin, setItin}) {
  const travelDays = dayArr;
  const confirmedHotelsArr = 
  //defConfirmedHotelArr;
  getAllConfirmedHotelsFromArr(itin.hotelGrps) ;
  console.log("CONFIRMED HOTELS", confirmedHotelsArr);


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
      const latestdate = dayjs(itin.startDate, 'DD-MM-YYYY').add(index,'day').format('DD-MM-YYYY');
      const {checkIns, checkOuts} = getHotelCheckInOutForDate(latestdate, confirmedHotelsArr);
      const confirmedHotel = getHotelForDate(latestdate, confirmedHotelsArr);
      // console.log("THAT DAY HOTEL", confirmedHotel);
      const checkInHotel = checkIns.length==0? undefined : checkIns[0];
      const checkOutHotel = checkOuts.length==0? undefined : checkOuts[0];
      const activitiesArr = [...d.activities];

      if (checkInHotel) {
        activitiesArr.push(new Activity([`Check in into ${checkInHotel.name}`, checkInHotel.checkInTime, checkInHotel.address, checkInHotel.address]));
      }

      if (checkOutHotel) {
        activitiesArr.push(new Activity([`Check out of ${checkOutHotel.name}`, checkOutHotel.checkOutTime, checkOutHotel.address, checkOutHotel.address]));
      }

      return ( //i lazy to make container component
      <>
        <div className="travel-day-container-sum" key={d.id}>
          <div className="d-flex" style={{flex:"1", flexDirection:"column", alignItems:"flex-end"}}>  
          <div className="day-header">
            <h5 className="mx-3">Day {index + 1}</h5>
          </div>

          <h6 className="mx-3">
             Date: {dayjs(latestdate, "DD-MM-YYYY").format("D MMMM YYYY")}
          </h6>

         {((!checkInHotel && !checkOutHotel) || (confirmedHotel)) && (
            <h6 className="">
              {confirmedHotel?.name ? 'Hotel That Night:' : ''} {confirmedHotel?.name || 'No Hotel Confirmed Yet'}
            </h6>
          )}

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
                activityArr={activitiesArr}
                dayId={d.id}
            />
          </div>
          
        </div>
      </>
      );}
    );

  return (
    <div className="day-content p-2">
      {dayElements}
    </div>
  );
}


export function SummaryPage() {
    const [itin, setItin] = useState(null); //initialize itin to null

  const { id: itinDbId } = useParams(); //get the itinDbId from the URL

  const navigate = useNavigate();

  useEffect( () => {
      const fetchItin = async () => {
        try {
          const loadedItin = await loadItineraryById(itinDbId); //wait to get itin class obj by id from supabase
          setItin(loadedItin);
        } catch (err) {
          console.error("Failed to load itinerary", err);
        }
      }
      fetchItin();
    }
    ,[itinDbId]); //re-fetch the moment the itin id in url changes 
    //***(this is bcuz the component stays mounted even if u change url)


    return (
        <div className="background-image d-flex flex-column align-items-center">
            <Header />
            <h1 className="welcome-text text-primary" style={{margin: "20px", marginTop:"80px"}}>✈️TravelSync</h1>
            {itin ? ( //**makes sure itin is not null first before loading all the info and content
              <>
                <ItineraryInfo //THIS ALLOWS USER TO EDIT NAME AND START DATE OF ITIN
                  itin={itin}
                  setItin={setItin}
                />

                <div className="activity-page-top-buttons">
                  <button className="custom-btn hotels-btn" onClick={()=>navigate(`/activities/${itinDbId}`)}>🎯 To Activities</button>
                  <button className='custom-btn home-btn' onClick={()=>navigate('/')}>🏠 Back To Home</button>
                  {/* <AutoSaveButton itin={itin} saveToDB={saveToDB}/> */}
                </div>

                <div 
                className='bg-light p-4 rounded'
                >
                  <h4>Summary Of Itinerary</h4>
                    <TravelDayContent  //CONTAINER FOR ALL TRAVEL DAYS
                        dayArr={itin.travelDays}
                        itin={itin}
                        setItin={setItin}
                    /> 
                </div>
              </>)
              : (<h3 className="text-secondary">Loading Activities...</h3>)}
              <div className="button-row">
                <button className="back-btn themed-button" onClick={() => navigate('/')}>🏠 Back To Home</button>
                {/* <button className="save-btn themed-button" onClick={() => saveToDB(itin)}>💾 Save</button> */}
              </div>
        </div>
    );
}