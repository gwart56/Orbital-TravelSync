import './ActivityPage.css';
import dayjs from 'dayjs';
import { MdDeleteForever } from "react-icons/md";
import { sortDates } from './utils/dates';
import { useState } from 'react';
import ActivityContainer from './components/ActivityContainer';
import Header from './components/Header';
import {addActivityArray, editActivityArray, deleteActivityArray, addDayArray, deleteDayArray, Activity, TravelDay, Itinerary, loadItinFromLocal} from './data/activity';

const itin = loadItinFromLocal();

function ActivityContent({activityArr, dayId}) {
  const [activities, setActivities] = useState([...activityArr]);

  function handleSave(id, valuesArray) {
    console.log("saved: id-" + id + ", " + valuesArray);
    const newActArr = editActivityArray(activities, id, valuesArray);
    setActivities(newActArr);
  }

  function handleDelete(id) {
    console.log("deleted: id-" + id);
    const newActArr = deleteActivityArray(activities, id);
    setActivities(newActArr);
  }

  function handleAdd() {
    console.log("added new activity");
    const newActArr = addActivityArray(activities);
    setActivities(newActArr);
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
  }

  function handleDelete(id) {
    setTravelDays(deleteDayArray(travelDays, id));
  }

  let totalNumDays = 0;
  const dayElements = sortDates([...travelDays])
    // .sort((a, b) => dayjs(a.date, "DD-MM-YYYY").diff(dayjs(b.date, "DD-MM-YYYY")))
    .map(d => 
      (<div className="travel-day-container" key={d.id}>
        <h2>
          Day {totalNumDays++ + 1}
          <button className="delete-act-butt btn btn-danger" onClick={() => {handleDelete(d.id)}}><MdDeleteForever /></button>
        </h2>
        <h5>
          Date: {d.date}
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
      <button className="btn btn-success" onClick={handleAdd}>Add Day</button>
    </div>
  )
}



function ActivityPage() {
    return (
        <>
            <Header />
            <h1 className="text-primary">Welcome to TravelSync</h1>
            <h3>{itin.name}</h3>
            <TravelDayContent 
              dayArr={itin.travelDays}
            />
            <div style={{height: "50px"}}/>
        </>
    );
}

export default ActivityPage;