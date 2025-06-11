import './ActivityPage.css';
import dayjs from 'dayjs';
import { MdDeleteForever } from "react-icons/md";
import { useState, useEffect } from 'react';
import ActivityContainer from '../components/ActivityContainer';
import Header from '../components/Header';
import {addActivityArray, editActivityArray, deleteActivityArray, loadItinFromLocal, saveToLocal} from '../data/activity';
import ItineraryInfo from '../components/ItineraryInfo';
import { loadItineraryById, updateItineraryById } from '../lib/supabaseItinerary';
import { useParams } from 'react-router-dom';


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

  const activityElements = [...activities]
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

  function handleAdd() {
    setItin(itin.addDay());
  }

  function handleDelete(id) {
    setItin(itin.removeDay(id));
  }

  let totalNumDays = 0;
  let latestdate = dayjs(itin.startDate, 'DD-MM-YYYY').add(-1,'day').format('DD-MM-YYYY'); //subtracts 1 day to make up increments
  const dayElements = [...travelDays]
    .map(d => 
      (<div className="travel-day-container" key={d.id}>
        <h2>
          Day {totalNumDays++ + 1}
          <button className="delete-act-butt btn btn-danger" onClick={() => {handleDelete(d.id)}}><MdDeleteForever /></button>
        </h2>
        <h5>
          Date: {latestdate = dayjs(latestdate, 'DD-MM-YYYY').add(1,'day').format('DD-MM-YYYY')} 
        </h5> 
        <ActivityContent
          activityArr={d.activities}
          dayId={d.id}
          itin={itin}
          setItin={setItin}
        />
      </div>)
    );

  return (
    <div className="day-content">
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

  console.log(itin);
    return (
        <>
            <Header />
            <h1 className="text-primary" style={{margin: "20px", marginTop:"80px"}}>Welcome to TravelSync</h1>
            {itin && ( //**makes sure itin is not null first before loading all the info and content
              <>
                <ItineraryInfo
                  itin={itin}
                  setItin={setItin}
                />
                <TravelDayContent 
                  dayArr={itin.travelDays}
                  itin={itin}
                  setItin={setItin}
                /> 
              </>)}
            <button className='btn btn-primary' onClick={()=>saveToDB(itin)}>Save To Supabase</button>
            <div style={{height: "20px"}}/>
            {/*buttons below just for testing*/}
            <div style={{height: "50px"}}/> 
            <button className='btn btn-primary' onClick={()=>saveToLocal(itin)}>Save To Local Storage</button>
            <div style={{height: "20px"}}/> 
            <button className='btn btn-primary' onClick={()=>localStorage.removeItem('itinLocal')}>Clear Local Storage</button>
            <div style={{height: "20px"}}/> 
            <button className='btn btn-primary' onClick={()=>console.log(itin)}>Print Itinerary in Console</button>
            <div style={{height: "50px"}}/>
        </>
    );
}

export default ActivityPage;