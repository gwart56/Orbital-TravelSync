import { useState } from 'react';
// import { updateItinName, updateItinStartDate } from '../../data/activity';
import { FaEdit } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import "./ItineraryInfo.css";
import dayjs from 'dayjs';

function ItineraryDateInput({ itin, onSave }){
  const [editing, setEditing] = useState(false);
  const [newStartDate, setNewStartDate] = useState(itin.startDate);

  const handleSave = () => {
    onSave({...itin, startDate: newStartDate});
    setEditing(false);
  };

  return (
    <>
      {!editing ? (
        <h3 onClick={() => setEditing(true)} style={{ cursor: 'pointer' }} className="start-date">
          📆 Adventure Begins: {dayjs(itin.startDate, "YYYY-MM-DD").format("D MMMM YYYY")}
        </h3>
      ) : (
        <h3>
          📆 Adventure Begins: 
          <input
            type="date"
            className='form-control'
            value={newStartDate}
            onChange={(e) => setNewStartDate(e.target.value)}
          />
          <button className="btn btn-light" onClick={handleSave}>Save</button>
          <button className="btn btn-light" onClick={() => setEditing(false)}>Cancel</button>
        </h3>
      )}
    </>
  );
}

function ItineraryNameInput({ itin, onSave }){
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(itin.name);

  const handleSave = () => {
    onSave({...itin, name:newName});
    setEditing(false);
  };

  return (
    <>
      {!editing ? (
        <h1 onClick={() => setEditing(true)} className="trip-title">
          {itin.name}
        </h1>
      ) : (
        <h2>
          <div className='d-flex w-100 justify-content-center gap-2'>
          <input
            className='input-name'
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button className="btn btn-light mx-2 p-2 flex-grow-1 flex-basis-0" onClick={handleSave}>Save</button>
          <button className="btn btn-light mx-2 p-2 flex-grow-1 flex-basis-0" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </h2>
      )}

    </>
  );
}

export default function ItineraryInfo({ itin, onSave }) {
  // const [editing, setEditing] = useState(false);
  // const [newStartDate, setNewStartDate] = useState(itin.startDate);

  // const handleSave = () => {
  //   onSave(updateItinStartDate(itin, newStartDate));
  //   setEditing(false);
  // };

  return (
    <>
      <ItineraryNameInput
        itin={itin}
        onSave={onSave}
      />
      <ItineraryDateInput 
        itin={itin}
        onSave={onSave}
      />
    </>
  );
}
