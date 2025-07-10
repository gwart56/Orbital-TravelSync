import './ActivityPage.css';
import dayjs from 'dayjs';
import { MdDeleteForever } from "react-icons/md";
import { useState, useEffect } from 'react';
import Header from '../components/Header/Header';
import {addActivityArray, editActivityArray, deleteActivityArray, insertDayIntoArray, setItinDays, swapDaysInArray} from '../data/activity';
import ItineraryInfo from '../components/ItineraryComponents/ItineraryInfo';
// import { loadItineraryById, updateItineraryById } from '../lib/supabaseItinerary';
import { useNavigate, useParams } from 'react-router-dom';
import { defConfirmedHotelArr, loadAllConfirmedHotelsByItineraryId, getHotelCheckInOutForDate, getHotelForDate } from '../data/hotel';
import { AutoSaveButton } from '../components/Misc/AutoSaver';
import ActivityContainer from '../components/ActivityPageContent/ActivityContainer';
import ConfirmModal from '../components/Misc/ConfirmModal';
import { loadItineraryById, loadItineraryRowById, updateItineraryById } from '../data/itinerary';
import { addTravelDaysIntoDB, deleteTravelDayById, loadTravelDaysByItineraryId, newTravelDay, updateTravelDayById } from '../data/travelDays';
import { addItemToArray, deleteItemFromArrayById, editItemInArrayById, insertItemIntoArrayAtIndex, reindexTravelDays, swapItemsInArray } from '../utils/arrays';
import { addActivityIntoDB, deleteactivityById, loadActivitiesByTravelDaysId, newActivity, updateactivityById } from '../data/activities';
import { LoadingMessage } from '../components/Misc/LoadingMessage';
import { useAuthContext } from '../lib/AuthContext';
import { AddCollaboratorForm } from '../components/Misc/AddCollaboratorForm';


//each ActivityContent contains multiple ActivityContainers in a day (ROWS OF ACTIVITIES)
function ActivityContent({dayId, setLoadingMessage, isEditable}) {
  const [activities, setActivities] = useState([]);
  // const activities = activityArr;
  useEffect( () => {//FETCH TRAVELDAYS
      const fetchActs = async () => {
        try {
          const loadedActs = await loadActivitiesByTravelDaysId(dayId); //wait to get itin class obj by id from supabase
          setActivities(loadedActs);
        } catch (err) {
          console.error("Failed to load traveldays", err);
        }
      }
      fetchActs();
    }
    ,[dayId]);

  async function handleSave(id, data) {
    setLoadingMessage("Saving...");
    console.log("saved: id-" + id , data);
    const {name, time, locName, locAddress} = data;
    const newAct = newActivity(dayId, name, time, locName, locAddress);
    const newActArr = editItemInArrayById(activities, newAct, id);
    // console.log('AAA',newActArr)
    await updateactivityById(id, newAct);
    setLoadingMessage("");
    setActivities(newActArr);
  }

  async function handleDelete(id) {
    setLoadingMessage("Deleting...");
    console.log("deleted: id-" + id);
    const newActArr = deleteItemFromArrayById(activities, id);
    await deleteactivityById(id);
    setLoadingMessage("");
    setActivities(newActArr);
  }

  async function handleAdd() {
    setLoadingMessage("Adding...");
    console.log("added new activity");
    const newAct = newActivity(dayId, "", "", "", "");
    const newActArr = addItemToArray(activities, newAct);
    await addActivityIntoDB(newAct);
    setLoadingMessage("");
    setActivities(newActArr);
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
        isEditable={isEditable}
      />);
  return (
    <div className = "activity-grid js-activity-grid">
      <button className="new-activity-butt btn btn-success" onClick={handleAdd} disabled={!isEditable}>
        + Add Activity
      </button>

      {activityElements}
    </div>
  );
}

//each TravelDaysContent contains Day No., Date, ActivityContent -----------------------------------------------------
function TravelDaysContent({itinDbId, itin, setLoadingMessage, isEditable}) {
  const [travelDays, setTravelDays] = useState([]);
  const [deletingDayId, setDeletingDayId] = useState(null);
  const [swapSelections, setSwapSelections] = useState({}); //dayselections for swapping
  // const travelDays = dayArr;
  const [confirmedHotelsArr, setConfirmedHotelsArr] = useState([]);
  // defConfirmedHotelArr;
  // getAllConfirmedHotelsFromArr(itin.hotelGrps) ;
  console.log("CONFIRMED HOTELS", confirmedHotelsArr);

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

  async function handleAdd() {
    try {
      setLoadingMessage("Adding...");
      const newDay = newTravelDay(itinDbId, travelDays.length);
      // Insert to DB and get inserted row back
      const insertedRows = await addTravelDaysIntoDB([newDay]);
      const insertedDay = insertedRows[0];
      // await updateItineraryById(itinDbId, {...itin, numOfDays: itin.numOfDays+1});
      // Update local state
      setTravelDays([...travelDays, insertedDay]);
    } catch (err) {
      console.error("Failed to add travel day", err);
    } finally {
      setLoadingMessage("");
    }
  }

  // Insert a day before given index, reindex all days
  async function handleInsert(indexToInsert) {
    try {
      setLoadingMessage("Inserting...");
      const latestDays = await loadTravelDaysByItineraryId(itinDbId);

      // Create new day with dummy index
      const newDay = newTravelDay(itinDbId, indexToInsert);

      // Insert the new day first
      const insertedDays = await addTravelDaysIntoDB([newDay]);
      const insertedDay = insertedDays[0];

      // Insert the newly inserted day into the array at the index
      const updatedDays = reindexTravelDays(
        insertItemIntoArrayAtIndex(latestDays, insertedDay, indexToInsert)
      );

      // Update the indexes of all days (including insertedDay)
      await Promise.all(updatedDays.map(d => 
        updateTravelDayById(d.id, { index: d.index })
      ));

      const freshDays = await loadTravelDaysByItineraryId(itinDbId);
      // await updateItineraryById(itinDbId, {...itin, numOfDays: itin.numOfDays + 1});
      setTravelDays(freshDays);
    } catch (err) {
      console.error("Insert failed:", err);
      const fallback = await loadTravelDaysByItineraryId(itinDbId);
      setTravelDays(fallback);
    } finally {
      setLoadingMessage("");
    }
}


  // Swap two travel days by their indices, update indexes in DB
  async function handleSwap(index1, index2) {
    if (index1 === index2) return;

    try {
      setLoadingMessage("Swapping...");
      const latestDays = await loadTravelDaysByItineraryId(itinDbId);
      // console.log("SWAP A", latestDays);

      // Swap in local array
      const swappedDays = swapItemsInArray(latestDays, index1, index2);
      // console.log("SWAP B", swappedDays);

      // Reindex swapped days
      const reindexedDays = swappedDays.map((d, i) => ({ ...d, index: i }));
      // console.log("SWAP C", reindexedDays);


      // Update all affected rows in DB
      await Promise.all(
        reindexedDays.map(d => 
          updateTravelDayById(d.id, { index: d.index })
        )
      );

      // Update local state
      setTravelDays(reindexedDays);
    } catch (err) {
      console.error("Failed to swap travel days", err);
      const freshDays = await loadTravelDaysByItineraryId(itinDbId);
      setTravelDays(freshDays);
    } finally {
      setLoadingMessage("");
    }
  }

  // Delete a travel day by travelDayId and reindex
  async function handleDelete(travelDayId) {
    try {
      setLoadingMessage("Deleting...");
      console.log('traveldayid delete',travelDayId);
      // Delete from DB
      await deleteTravelDayById(travelDayId);

      // Fetch latest travel days
      const latestDays = await loadTravelDaysByItineraryId(itinDbId);

      // Reindex remaining days
      const reindexedDays = reindexTravelDays(latestDays);

      // Update DB indexes
      await Promise.all(
        reindexedDays.map(d => updateTravelDayById(d.id, { index: d.index }))
      );

      // await updateItineraryById(itinDbId, {...itin, numOfDays: itin.numOfDays-1});
      // Update local state
      setTravelDays(reindexedDays);
    } catch (err) {
      console.error("Failed to delete travel day", err);
      const fallback = await loadTravelDaysByItineraryId(itinDbId);
      setTravelDays(fallback);
    } finally {
      setLoadingMessage("");
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
    .map((d, renderIndex) => {
      const index = d.index;
      const latestdate = dayjs(itin.startDate, 'YYYY-MM-DD').add(index,'day').format('D MMMM YYYY');
      const {checkIns, checkOuts} = getHotelCheckInOutForDate(latestdate, confirmedHotelsArr);
      const confirmedHotel = getHotelForDate(latestdate, confirmedHotelsArr);
      // console.log("THAT DAY HOTEL", confirmedHotel);
      const checkInHotel = checkIns.length==0? undefined : checkIns[0];
      const checkOutHotel = checkOuts.length==0? undefined : checkOuts[0];
      const dayNo = index + 1; //the day num
 
      return ( //i lazy to make container component
      <div key={d.id}>
        {isEditable && <button className="add-new-day-btn themed-button m-3" onClick={() => handleInsert(renderIndex)}>+ Insert Day Before</button>}
        <div className="travel-day-container" key={d.id}>
          <div className="day-header">
            <span className="day-label">Day {dayNo}</span>
            {isEditable && <button className="delete-btn delete-btn-top" onClick={() => {setDeletingDayId(d.id);}}>
              <span>Delete</span> <MdDeleteForever />
            </button>}
          </div>

            {deletingDayId==d.id && <ConfirmModal
                message={`Are you sure you want to delete Day ${dayNo}?`}
                onConfirm={() => {handleDelete(d.id); setDeletingDayId(null);}}
                onCancel={()=>setDeletingDayId(null)}
              />
            }

          <h5 className="day-subtext">
            📅 Date: {latestdate}
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
              disabled={swapSelections[index] == null || !isEditable}
              onClick={() => {
                handleSwap(index, swapSelections[index]);
                setSwapSelections({}); // clear after swapping
              }}
            >
              Swap Days
            </button>
          </div>


          <ActivityContent
            dayId={d.id}
            setLoadingMessage={setLoadingMessage}
            isEditable={isEditable}
          />
        </div>
      </div>
      );}
    );

  return (
    <div className="day-content p-2">
      {dayElements}
      {isEditable && <button className="add-new-day-btn themed-button" onClick={handleAdd}>+ Add New Day</button>}
    </div>
  );
}
//---------------------------------------------------------------------------------------------------------------------


function ActivityPage() {

  const [loadingMessage, setLoadingMessage] = useState("");
  const [itinMeta, setItinMeta] = useState(null);  // holds user_id and itinerary_members
  const {session} = useAuthContext();
  const sessionUser = session?.user; // get user of current session
  const sessionUserId = sessionUser?.id; //get userId

  const [itin, setItin] = useState(null); //initialize itin to null

  const { id: itinDbId } = useParams(); //get the itinDbId from the URL

  const navigate = useNavigate();

  useEffect( () => {//FETCH ITIN
      const fetchItin = async () => {
        try {
          // const loadedItin = await loadItineraryById(itinDbId); //wait to get itin class obj by id from supabase
          const data = await loadItineraryRowById(itinDbId); // gives {id, user_id, itinerary_data, created_at, itinerary_members(ARRAY)}
          
          setItinMeta(data);

          const creatorId = data.user_id;
          const itinMembers = data.itinerary_members;
          const memberDetails = itinMembers.find(m => m.user_id == sessionUserId);

          console.log("session user", sessionUserId);
          console.log("itin user id", creatorId);

          if (sessionUserId !== creatorId && !memberDetails) {
            alert("You do not have permission to view this itinerary.");
            navigate('/');
            return;
          }

          const loadedItin = data.itinerary_data;
          setItin(loadedItin);
        } catch (err) {
          console.error("Failed to load itinerary", err);
        }
      }
      fetchItin();
    }
    ,[itinDbId]); //re-fetch the moment the itin id in url changes 
    //***(this is bcuz the component stays mounted even if u change url)

  // const saveToDB = async (itin) => {//SAVES ITINERARY TO DATABASE
  //   try {
  //     await updateItineraryById(itinDbId, itin);
  //     console.log('SAVED TO DB!');
  //   } catch (err) {
  //     console.error('Failed to update Itinerary...', err);
  //   }
  // }
     const isEditable = (() => {
        if (!itinMeta || !sessionUserId) return false;
        const creatorId = itinMeta.user_id;
        const memberDetails = itinMeta.itinerary_members?.find(m => m.user_id == sessionUserId);
        if (sessionUserId === creatorId || memberDetails?.role === 'editor') {
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
        <div className="background-image d-flex flex-column align-items-center">
            <Header />
            <h1 className="welcome-text text-primary" style={{margin: "20px", marginTop:"80px"}}>✈️TravelSync</h1>
            {/* {loadingMessage && (
              <div className="loading-overlay">
                <span className="spinner-border mb-2 mx-2" role="status"></span>
                <p>{loadingMessage}</p>
              </div>
            )} */}
            <LoadingMessage loadingMessage={loadingMessage}/>
            <AddCollaboratorForm itineraryId={itinDbId} />
            {itin ? ( //**makes sure itin is not null first before loading all the info and content
              <>
                <ItineraryInfo //THIS ALLOWS USER TO EDIT NAME AND START DATE OF ITIN
                  itin={itin}
                  onSave={saveItinToDB}
                  isEditable={isEditable}
                />

                <div className="activity-page-top-buttons">
                  <button className="custom-btn hotels-btn" onClick={()=>navigate(`/hotels/${itinDbId}`)}>🏢 To Hotels</button>
                  <button className="custom-btn flights-btn" onClick={()=>navigate(`/flights/${itinDbId}`)}> 🛫 To Flights</button>
                  <button className="custom-btn summary-btn" onClick={()=>navigate(`/summary/${itinDbId}`)}> 📝 To Summary</button>
                  <button className='custom-btn home-btn' onClick={()=>navigate('/')}>🏠 Back To Home</button>
                  {/* <AutoSaveButton itin={itin} saveToDB={saveToDB}/> */}
                </div>

                <TravelDaysContent  //CONTAINER FOR ALL TRAVEL DAYS
                  // dayArr={itin.travelDays}
                  itin={itin}
                  // setItin={setItin}
                  itinDbId={itinDbId}
                  setLoadingMessage={setLoadingMessage}
                  isEditable={isEditable}
                /> 
              </>)
              : (<h3 className="text-secondary">Loading Activities...</h3>)}
              <div className="button-row">
                <button className="back-btn themed-button" onClick={() => navigate('/')}>🏠 Back To Home</button>
              </div>
            {/* <div style={{height: "20px"}}/> */}
            {/* <button className='btn btn-primary' onClick={()=>console.log(itin)}>Print Itinerary in Console</button> */}
            {/* <div style={{height: "50px"}}/> */}
        </div>
    );
}

export default ActivityPage;