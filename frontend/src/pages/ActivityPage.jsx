import './ActivityPage.css';
import dayjs from 'dayjs';
import { MdDeleteForever } from "react-icons/md";
import { useState, useEffect } from 'react';
import ActivityContainer from '../components/ActivityContainer';
import Header from '../components/Header';
import {addActivityArray, editActivityArray, deleteActivityArray, insertDayIntoArray, setItinDays, swapDaysInArray} from '../data/activity';
import ItineraryInfo from '../components/ItineraryInfo';
import { loadItineraryById, updateItineraryById } from '../lib/supabaseItinerary';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllConfirmedHotelsFromArr, getHotelCheckInOutForDate, getHotelForDate } from '../data/hotel';
import { AutoSaveButton } from '../components/AutoSaver';


//each ActivityContent contains multiple ActivityContainers in a day (ROWS OF ACTIVITIES)
function ActivityContent({activityArr, dayId, itin, setItin}) {
  const activities = activityArr;

  function handleSave(id, valuesArray) {
    console.log("saved: id-" + id + ", " + valuesArray);
    const newActArr = editActivityArray(activities, id, valuesArray);
    setItin(itin.setActivitiesOfDay(dayId, newActArr)); //updates itinerary
  }

  function handleDelete(id) {
    console.log("deleted: id-" + id);
    const newActArr = deleteActivityArray(activities, id);
    setItin(itin.setActivitiesOfDay(dayId, newActArr));
  }

  function handleAdd() {
    console.log("added new activity");
    const newActArr = addActivityArray(activities);
    setItin(itin.setActivitiesOfDay(dayId, newActArr));
  }

  const activityElements = activities.length==0
  ? (<div className="empty-activity-box text-center p-4 my-4 rounded shadow-sm fade-in">
      <div className="emoji mb-2" style={{ fontSize: "2rem" }}>😴</div>
      <h4 className="mb-2 fw-semibold">This day’s still empty</h4>
      <p className="mb-3 text-muted">Let’s add some fun plans to your itinerary 📝</p>
    </div>

    )
  :[...activities]
    .sort((a, b) => a.time.localeCompare(b.time)) //sorts the activities based on their timings
    .map((a) => 
      <ActivityContainer 
        key={a.id}
        activity={a}
        handleSave={handleSave}
        handleDelete={handleDelete}
        isEdit={false} //determines if activity container is being edited or not
      />);
  return (
    <div className = "activity-grid js-activity-grid">
      <button className="new-activity-butt btn btn-success" onClick={handleAdd}>
        + Add Activity
      </button>

      {activityElements}
    </div>
  );
}

//each TravelDayContent contains Day No., Date, ActivityContent 
function TravelDayContent({dayArr, itin, setItin}) {
  const [swapSelections, setSwapSelections] = useState({});
  const travelDays = dayArr;
  const confirmedHotelsArr = 
  //defConfirmedHotelArr;
  getAllConfirmedHotelsFromArr(itin.hotelGrps) ;
  console.log("CONFIRMED HOTELS", confirmedHotelsArr);

  function handleAdd() {
    setItin(itin.addDay());
  }

  function handleInsert(i) {
    const newDayArr = insertDayIntoArray(dayArr, i);
    setItin(setItinDays(itin, newDayArr));
  }

  function handleSwap(index1, index2) {
    if (index1 === index2 || index1 == null || index2 == null) return;
    const newDayArr = swapDaysInArray(dayArr, index1, index2);
    setItin(setItinDays(itin, newDayArr));
  }


  function handleDelete(id) {
      const confirmDelete = window.confirm("Are you sure you want to delete this day?");
      if (confirmDelete) {
          setItin(itin.removeDay(id));
      }
  }

  const dayElements = travelDays.length==0
  ? (
    <div className="empty-itinerary-warning text-center">
      <h4>
        🧭 No Travel Days Yet
      </h4>
      <p>
        Let’s start your journey - click <strong>"Add New Day"</strong> to begin planning!
      </p>
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

      return ( //i lazy to make container component
      <div key={d.id}>
        <button className="add-new-day-btn themed-button m-3" onClick={() => handleInsert(index)}>+ Insert Day Before</button>
        <div className="travel-day-container" key={d.id}>
          <div className="day-header">
            <span className="day-label">Day {index + 1}</span>
            <button className="delete-btn delete-btn-top" onClick={() => handleDelete(d.id)}>
              <span>Delete</span> <MdDeleteForever />
            </button>
          </div>



          <h5 className="day-subtext">
            📅 Date: {dayjs(latestdate, "DD-MM-YYYY").format("D MMMM YYYY")}
          </h5>

          {!checkInHotel && !checkOutHotel && (
            <h5 className="day-subtext">
              {confirmedHotel?.name ? '🛏️ Hotel That Night:' : '🏨'} {confirmedHotel?.name || 'No Hotel Confirmed Yet'}
            </h5>
          )}

          {checkOutHotel && (
            <h5 className="day-subtext">
              🛄 Check-Out at {checkOutHotel?.checkOutTime}: {checkOutHotel?.name}
            </h5>
          )}

          {checkInHotel && (
            <h5 className="day-subtext">
              🛎️ Check-In at {checkInHotel?.checkInTime}: {checkInHotel?.name}
            </h5>
          )}

          <div className="swap-section m-2 d-flex align-items-center gap-2 justify-content-center">
            <label htmlFor={`swap-select-${index}`} className="">🔁 Swap Day with:</label>
            <select
              id={`swap-select-${index}`}
              className="form-select form-select-sm"
              value={swapSelections[index] ?? ""}
              style={{ maxWidth: "200px" }}
              onChange={(e) => {
                if (e.target.value === "") { //checks if user selected a day
                  setSwapSelections({});
                  return;
                }
                const targetIndex = parseInt(e.target.value);
                setSwapSelections({[index]: targetIndex });
              }}
            >
              <option value="">Select Day</option>
              {travelDays.map((_, i) => (
                i !== index && <option key={i} value={i}>Day {i + 1}</option>
              ))}
            </select>

            <button
              className="btn btn-outline-primary btn-sm m-2"
              disabled={swapSelections[index] == null}
              onClick={() => {
                handleSwap(index, swapSelections[index]);
                setSwapSelections({}); // clear after swapping
              }}
            >
              Swap Days
            </button>
          </div>


          <ActivityContent
            activityArr={d.activities}
            dayId={d.id}
            itin={itin}
            setItin={setItin}
          />
        </div>
      </div>
      );}
    );

  return (
    <div className="day-content p-2">
      {dayElements}
      <button className="add-new-day-btn themed-button" onClick={handleAdd}>+ Add New Day</button>
    </div>
  );
}



function ActivityPage() {
  // const [itin, setItin] = useState(loadItinFromLocal()); //loads itinerary from localstorage
  // useEffect(() => { //saves to localstorage everytime there is an update to itin
  //   saveToLocal(itin);
  // }, [itin]);

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

  const saveToDB = async (itin) => {//SAVES ITINERARY TO DATABASE
    try {
      await updateItineraryById(itinDbId, itin);
      console.log('SAVED TO DB!');
    } catch (err) {
      console.error('Failed to update Itinerary...', err);
    }
  }

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
                  <button className="custom-btn hotels-btn" onClick={()=>navigate(`/hotels/${itinDbId}`)}>🏢 To Hotels</button>
                  <button className="custom-btn home-btn" onClick={()=>navigate(`/summary/${itinDbId}`)}> 📝 To Summary</button>
                  <button className='custom-btn home-btn' onClick={()=>navigate('/')}>🏠 Back To Home</button>
                  <AutoSaveButton itin={itin} saveToDB={saveToDB}/>
                </div>

                <TravelDayContent  //CONTAINER FOR ALL TRAVEL DAYS
                  dayArr={itin.travelDays}
                  itin={itin}
                  setItin={setItin}
                /> 
              </>)
              : (<h3 className="text-secondary">Loading Activities...</h3>)}
              <div className="button-row">
                <button className="back-btn themed-button" onClick={() => navigate('/')}>🏠 Back To Home</button>
                <button className="save-btn themed-button" onClick={() => saveToDB(itin)}>💾 Save</button>
              </div>
            {/* <div style={{height: "20px"}}/> */}
            {/* <button className='btn btn-primary' onClick={()=>console.log(itin)}>Print Itinerary in Console</button> */}
            {/* <div style={{height: "50px"}}/> */}
        </div>
    );
}

export default ActivityPage;