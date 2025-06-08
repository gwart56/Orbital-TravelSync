import { useState } from 'react';
import { updateItinName, updateItinStartDate } from '../data/activity';
import { FaEdit } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

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
        <>
          <h3>START DATE: {itin.startDate}
          <button className="btn btn-light" onClick={() => setEditing(true)}> Edit<MdEdit /></button></h3>
        </>
      ) : (
        <>
          <h3>START DATE: 
            <input
              type="date"
              value={newStartDate}
              onChange={(e) => setNewStartDate(e.target.value)}
            />
            <button className="btn btn-light" onClick={handleSave}>Save</button>
            <button className="btn btn-light" onClick={() => setEditing(false)}>Cancel</button>
          </h3>
        </>
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
        <>
          <h2>NAME: {itin.name}
          <button className="btn btn-light" onClick={() => setEditing(true)}> Edit<MdEdit /></button></h2>
        </>
      ) : (
        <>
          <h2>NAME: 
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button className="btn btn-light" onClick={handleSave}>Save</button>
            <button className="btn btn-light" onClick={() => setEditing(false)}>Cancel</button>
          </h2>
        </>
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
