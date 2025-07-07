import { useState } from 'react';
import { updateItinName, updateItinStartDate } from '../../data/activity';
import { FaEdit } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import "./ItineraryInfo.css";
import dayjs from 'dayjs';

function ItineraryDateInput({ itin, setItin }){
  const [editing, setEditing] = useState(false);
  const [newStartDate, setNewStartDate] = useState(itin.startDate);

  const handleSave = () => {
    setItin(updateItinStartDate(itin, newStartDate));
    setEditing(false);
  };

  return (
    <>
      {!editing ? (
        <h3 onClick={() => setEditing(true)} style={{ cursor: 'pointer' }} className="start-date">
          📆 Adventure Begins: {dayjs(itin.startDate, "DD-MM-YYYY").format("D MMMM YYYY")}
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

function ItineraryNameInput({ itin, setItin }){
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(itin.name);

  const handleSave = () => {
    setItin(updateItinName(itin, newName));
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

export default function ItineraryInfo({ itin, setItin }) {
  const [editing, setEditing] = useState(false);
  const [newStartDate, setNewStartDate] = useState(itin.startDate);

  const handleSave = () => {
    setItin(updateItinStartDate(itin, newStartDate));
    setEditing(false);
  };

  return (
    <>
      <ItineraryNameInput
        itin={itin}
        setItin={setItin}
      />
      <ItineraryDateInput 
        itin={itin}
        setItin={setItin}
      />
    </>
  );
}
