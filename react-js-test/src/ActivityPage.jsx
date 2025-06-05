import './ActivityPage.css';
import dayjs from 'dayjs';
import { MdDeleteForever } from "react-icons/md";
import { sortDates } from './utils/dates';
import { useState } from 'react';
import ActivityContainer from './components/ActivityContainer';
import Header from './components/Header';
import {addActivityArray, editActivityArray, deleteActivityArray, addDayArray, deleteDayArray, Activity, TravelDay, Itinerary, loadItinFromLocal, saveToLocal} from './data/activity';

const itin = loadItinFromLocal();

function ActivityContent({activityArr, dayId}) {
  const [activities, setActivities] = useState([...activityArr]);

  function handleSave(id, valuesArray) {
    console.log("saved: id-" + id + ", " + valuesArray);
    const newActArr = editActivityArray(activities, id, valuesArray);
    setActivities(newActArr);
    itin.setActivitiesOfDay(dayId, newActArr);
  }

  function handleDelete(id) {
    console.log("deleted: id-" + id);
    const newActArr = deleteActivityArray(activities, id);
    setActivities(newActArr);
    itin.setActivitiesOfDay(dayId, newActArr);
  }

  function handleAdd() {
    console.log("added new activity");
    const newActArr = addActivityArray(activities);
    setActivities(newActArr);
    itin.setActivitiesOfDay(dayId, newActArr);
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

function TravelDayContent({dayArr}) {
  const [travelDays, setTravelDays] = useState([...dayArr]);

  function handleAdd() {
    setTravelDays(addDayArray(travelDays));
    itin.addDay();
  }

  function handleDelete(id) {
    setTravelDays(deleteDayArray(travelDays, id));
    itin.removeDay(id);
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
  console.log(itin);
    return (
        <>
            <Header />
            <h1 className="text-primary">Welcome to TravelSync</h1>
            <h3>{itin.name}</h3>
            <TravelDayContent 
              dayArr={itin.travelDays}
            />
            <div style={{height: "50px"}}/> 
            <button className='btn btn-primary' onClick={()=>saveToLocal(itin)}>Save To Local Storage</button>
            <div style={{height: "20px"}}/> 
            <button className='btn btn-primary' onClick={()=>console.log(itin)}>Print Itinerary in Console</button>
            <div style={{height: "50px"}}/>
        </>
    );
}

export default ActivityPage;