//might be overkill to make this component idk (JUST FOR EDITING NAME(maybe date next time) OF HOTEL GRP)

import { useEffect, useState } from 'react';
import { updateItinName, updateItinStartDate } from '../data/activity';
import { MdEdit } from "react-icons/md";
import dayjs from 'dayjs';

//may not use
function HGStartDateInput({ hg, setStartHG, newStartDate, setNewStartDate }){
  const [editing, setEditing] = useState(false);
  
  const handleSave = () => {
    setStartHG(dayjs(newStartDate, 'YYYY-MM-DD').format('DD-MM-YYYY'));
    setEditing(false);
  };

  return (
    <>
      {!editing ? (
        <>
          <h3>START DATE: {hg.startDate}
          <button className="btn btn-light" onClick={() => setEditing(true)}> Edit<MdEdit /></button></h3>
        </>
      ) : (
        <>
          <h3>START DATE: 
            <input
              type="date"
              value={newStartDate}
              onChange={(e) => setNewStartDate(e.target.value)
                //FORMATS DATE
              }
            />
            <button className="btn btn-light" onClick={handleSave}>Save</button>
            <button className="btn btn-light" onClick={() => setEditing(false)}>Cancel</button>
          </h3>
        </>
      )}
    </>
  );
}

function HGEndDateInput({ hg, setEndHG, newEndDate, setNewEndDate }){
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    setEndHG(dayjs(newEndDate, 'YYYY-MM-DD').format('DD-MM-YYYY'));
    setEditing(false);
  };

  return (
    <>
      {!editing ? (
        <>
          <h3>END DATE: {hg.endDate}
          <button className="btn btn-light" onClick={() => setEditing(true)}> Edit<MdEdit /></button></h3>
        </>
      ) : (
        <>
          <h3>END DATE: 
            <input
              type="date"
              value={newEndDate}
              onChange={(e) => setNewEndDate(e.target.value)
                  //FORMATS DATE
              }
            />
            <button className="btn btn-light" onClick={handleSave}>Save</button>
            <button className="btn btn-light" onClick={() => setEditing(false)}>Cancel</button>
          </h3>
        </>
      )}
    </>
  );
}

function HGDateRangePicker({hg, setEndHG, setStartHG }) {

  const [startDate, setNewStartDate] = useState(dayjs(hg.startDate, 'DD-MM-YYYY').format('YYYY-MM-DD'));
  
  const [endDate, setNewEndDate] = useState(dayjs(hg.endDate, 'DD-MM-YYYY').format('YYYY-MM-DD'));

  //CONFUSING NOTE:
  //WHEN USING startDate, setNewStartDate THEY MUST BE IN FORMAT 'YYYY-MM-DD'
  //BUT FOR setEndHG, setStartHG THEY MUST BE IN FORMAT 'DD-MM-YYYY'


  useEffect(() => {
    // console.log(startDate)
    // console.log(endDate)
    // console.log(dayjs(startDate).isAfter(dayjs(endDate)));
    if (startDate && endDate && dayjs(startDate).isAfter(dayjs(endDate))) {
      setNewEndDate(dayjs(startDate, 'YYYY-MM-DD')); // Auto-correct
      setEndHG(dayjs(startDate, 'YYYY-MM-DD').format('DD-MM-YYYY'));
    }
  }, [startDate]);

  return (<>
      <HGStartDateInput
        hg={hg}
        setStartHG={setStartHG}
        newStartDate={startDate}
        setNewStartDate={setNewStartDate}
      />
      <HGEndDateInput
        hg={hg}
        setEndHG={setEndHG}
        newEndDate={endDate}
        setNewEndDate={setNewEndDate}
      />
  </>);
}

function HGNameInput({ hg, renameHG }){
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(hg.name);

  const handleSave = () => {
    renameHG(newName);
    setEditing(false);
  };

  return (
    <>
      {!editing ? (
        <>
          <h3>NAME: {hg.name}
          <button className="btn btn-light" onClick={() => setEditing(true)}> Edit<MdEdit /></button></h3>
        </>
      ) : (
        <>
          <h3>NAME: 
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button className="btn btn-light" onClick={handleSave}>Save</button>
            <button className="btn btn-light" onClick={() => setEditing(false)}>Cancel</button>
          </h3>
        </>
      )}
    </>
  );
}

export default function HGInfo({ hg, setEndHG, renameHG, setStartHG }) {
  const [editing, setEditing] = useState(false);

//   const handleSave = () => {
//     setItin(updateItinStartDate(itin, newStartDate));
//     setEditing(false);
//   };

  return (
    <>
      <HGNameInput
        hg={hg}
        renameHG={renameHG}
      />
      <HGDateRangePicker
        hg={hg}
        setEndHG={setEndHG}
        setStartHG={setStartHG}
      />
    </>
  );
}
