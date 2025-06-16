import './ActivityPage.css';
import dayjs from 'dayjs';
import { MdDeleteForever } from "react-icons/md";
import { useState, useEffect } from 'react';
import ActivityContainer from '../components/ActivityContainer';
import Header from '../components/Header';
import {addActivityArray, editActivityArray, deleteActivityArray, loadItinFromLocal, saveToLocal} from '../data/activity';
import ItineraryInfo from '../components/ItineraryInfo';
import { loadItineraryById, updateItineraryById } from '../lib/supabaseItinerary';
import { useNavigate, useParams } from 'react-router-dom';
import { defConfirmedHotelArr, getAllConfirmedHotelsFromArr, getHotelCheckInOutForDate, getHotelForDate } from '../data/hotel';


//each ActivityContent contains multiple ActivityContainers in a day (BEIGE REGION)
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
  ? (<div className="activity-container border rounded p-3 my-3"
    style={{ maxWidth: "600px", margin: "0 auto", width: "100%" }}>
      <h3>No Activities on this Day. Please Click "Add Activity" to add new ones.</h3>
    </div>)
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
      <button className="new-activity-butt btn btn-success" onClick={handleAdd}>Add Activity</button>
      {activityElements}
    </div>
  );
}

//each TravelDayContent contains Day No., Date, ActivityContent (LIGHT GREEN REGION)
function TravelDayContent({dayArr, itin, setItin}) {
  const travelDays = dayArr;
  const confirmedHotelsArr = 
  //defConfirmedHotelArr;
  getAllConfirmedHotelsFromArr(itin.hotelGrps) ; //just for testing remove later
  console.log(confirmedHotelsArr);

  function handleAdd() {
    setItin(itin.addDay());
  }

  function handleDelete(id) {
      const confirmDelete = window.confirm("Are you sure you want to delete this day?");
      if (confirmDelete) {
          setItin(itin.removeDay(id));
      }
  }


  let totalNumDays = 0;
  let latestdate = dayjs(itin.startDate, 'DD-MM-YYYY').add(-1,'day').format('DD-MM-YYYY'); //subtracts 1 day to make up increments
  const dayElements = [...travelDays]
    .map(d => {
      latestdate = dayjs(latestdate, 'DD-MM-YYYY').add(1,'day').format('DD-MM-YYYY');
      const {checkIns, checkOuts} = getHotelCheckInOutForDate(latestdate, confirmedHotelsArr);
      const confirmedHotel = getHotelForDate(latestdate, confirmedHotelsArr);
      const checkInHotel = checkIns.length==0? undefined : checkIns[0];
      const checkOutHotel = checkOuts.length==0? undefined : checkOuts[0];

      return ( //i lazy to make container component
      <div className="travel-day-container" key={d.id}>
        <h2>
          <span>Day {totalNumDays++ + 1}</span>
          <button className="delete-act-butt btn btn-danger mb-3 m-2" onClick={() => {handleDelete(d.id)}}><MdDeleteForever /></button>
        </h2>
        <h5>
          Date: {latestdate} 
        </h5>
        {/* if no check in hotel, then display current hotel */
        !checkInHotel && !checkOutHotel && (<h5>
          {/* Hotel That Night: {!confirmedHotel ? confirmedHotel.name : "No Hotel Confirmed"} */}
          Hotel That Night: {confirmedHotel?.name || 'No Hotel Confirmed'} 
        </h5>)} 
        {/* if no check out hotel, dont display*/
        checkOutHotel && <h5>
          Check Out Hotel at {checkOutHotel?.checkOutTime} : {checkOutHotel?.name || 'Not Checking out any Hotel'}
        </h5> }
        {/* if no check in hotel, dont display*/
        checkInHotel && <h5>
          Check In Hotel at {checkInHotel?.checkInTime} : {checkInHotel?.name || 'Not Checking in any Hotel'} 
        </h5>}
        <ActivityContent
          activityArr={d.activities}
          dayId={d.id}
          itin={itin}
          setItin={setItin}
        />
      </div>);}
    );

  return (
    <div className="day-content p-5">
      {dayElements}
      <button className="btn btn-success" onClick={handleAdd}>Add New Day</button>
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

  const saveToDB = async (itin) => {
    try {
      await updateItineraryById(itinDbId, itin);
    } catch (err) {
      console.error('Failed to update Itinerary...', err);
    }
  }

    return (
        <div className="">
            <Header />
            <h1 className="text-primary" style={{margin: "20px", marginTop:"80px"}}>Welcome to TravelSync</h1>
            {itin ? ( //**makes sure itin is not null first before loading all the info and content
              <>
                <ItineraryInfo
                  itin={itin}
                  setItin={setItin}
                />
                <button className='btn btn-secondary m-3' onClick={()=>navigate(`/hotels/${itinDbId}`)}>To Hotel Comparisons</button>
                <button className='btn btn-secondary m-3' onClick={()=>navigate('/')}>Back To Home</button>
                <TravelDayContent 
                  dayArr={itin.travelDays}
                  itin={itin}
                  setItin={setItin}
                /> 
              </>)
              : (<h3 className="text-secondary">Loading Activities...</h3>)}
            <button className='btn btn-primary m-3' onClick={()=>saveToDB(itin)}>Save To Supabase</button>
            <div style={{height: "20px"}}/>
            <button className='btn btn-secondary m-3' onClick={()=>navigate('/')}>Back To Home</button>
            <div style={{height: "20px"}}/>
            {/*buttons below just for testing*/}
            {/* <div style={{height: "50px"}}/> 
            <button className='btn btn-primary' onClick={()=>saveToLocal(itin)}>Save To Local Storage</button>
            <div style={{height: "20px"}}/> 
            <button className='btn btn-primary' onClick={()=>localStorage.removeItem('itinLocal')}>Clear Local Storage</button>
            <div style={{height: "20px"}}/>  */}
            <button className='btn btn-primary' onClick={()=>console.log(itin)}>Print Itinerary in Console</button>
            <div style={{height: "50px"}}/>
        </div>
    );
}

export default ActivityPage;