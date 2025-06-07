import './ActivityPage.css';
import dayjs from 'dayjs';
import { MdDeleteForever } from "react-icons/md";
import { sortDates } from '../utils/dates';
import { useState, useEffect } from 'react';
import ActivityContainer from '../components/ActivityContainer';
import Header from '../components/Header';
import {addActivityArray, editActivityArray, deleteActivityArray, addDayArray, deleteDayArray, Activity, TravelDay, Itinerary, loadItinFromLocal, saveToLocal} from '../data/activity';
import { use } from 'react';

function ActivityContent({activityArr, dayId, itin, setItin}) {
  // const [activities, setActivities] = useState([...activityArr]);
  const activities = activityArr;

  function handleSave(id, valuesArray) {
    console.log("saved: id-" + id + ", " + valuesArray);
    const newActArr = editActivityArray(activities, id, valuesArray);
    // setActivities(newActArr);
    setItin(itin.setActivitiesOfDay(dayId, newActArr));
  }

  function handleDelete(id) {
    console.log("deleted: id-" + id);
    const newActArr = deleteActivityArray(activities, id);
    // setActivities(newActArr);
    setItin(itin.setActivitiesOfDay(dayId, newActArr));
  }

  function handleAdd() {
    console.log("added new activity");
    const newActArr = addActivityArray(activities);
    // setActivities(newActArr);
    setItin(itin.setActivitiesOfDay(dayId, newActArr));
  }

  const activityElements = [...activities]
    .sort((a, b) => a.time.localeCompare(b.time))
    .map((a) => 
      <ActivityContainer 
        key={a.id}
        activity={a}
        handleSave={handleSave}
        handleDelete={handleDelete}
        isEdit={false}
      />);
  return (
    <div className = "activity-grid js-activity-grid">
      <button className="new-activity-butt btn btn-secondary" onClick={handleAdd}>Add Activity</button>
      {activityElements}
    </div>
  );
}

function TravelDayContent({dayArr, itin, setItin}) {
  // const [travelDays, setTravelDays] = useState([...dayArr]);
  const travelDays = dayArr;

  function handleAdd() {
    // setTravelDays(addDayArray(travelDays));
    setItin(itin.addDay());
  }

  function handleDelete(id) {
    // setTravelDays(deleteDayArray(travelDays, id));
    setItin(itin.removeDay(id));
  }

  let totalNumDays = 0;
  let latestdate = itin.startDate;
  const dayElements = sortDates([...travelDays])
    // .sort((a, b) => dayjs(a.date, "DD-MM-YYYY").diff(dayjs(b.date, "DD-MM-YYYY")))
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
  const [itin, setItin] = useState(loadItinFromLocal()); //loads itinerary from localstorage

  useEffect(() => { //saves to localstorage everytime there is an update to itin
    saveToLocal(itin);
  }, [itin]);

  console.log(itin);
    return (
        <>
            <Header />
            <h1 className="text-primary">Welcome to TravelSync</h1>
            <h3>{itin.name}</h3>
            <TravelDayContent 
              dayArr={itin.travelDays}
              itin={itin}
              setItin={setItin}
            />
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