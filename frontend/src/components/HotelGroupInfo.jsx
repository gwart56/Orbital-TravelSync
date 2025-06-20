//might be overkill to make this component idk (JUST FOR EDITING NAME(maybe date next time) OF HOTEL GRP)

import { useEffect, useState } from 'react';
import { updateItinName, updateItinStartDate } from '../data/activity';
import { MdEdit } from "react-icons/md";
import dayjs from 'dayjs';

//may not use
function HGStartDateInput({ hg, setStartHG, newStartDate, setNewStartDate, confirmedHotel}){
  const [editing, setEditing] = useState(false);
  
  const handleSave = () => {
    setStartHG(dayjs(newStartDate, 'YYYY-MM-DD').format('DD-MM-YYYY'));
    setEditing(false);
  };

  return (
    <>
      {//THIS IS SO THAT YOU CANNOT EDIT START AND END DATES WHEN YOU CONFIRM A HOTEL
      confirmedHotel?( 
        <>
          <h3>START DATE: {hg.startDate} </h3>
          {/* <button className="btn btn-light" onClick={() => setEditing(true)}> Edit<MdEdit /></button></h3> */}
        </>
      )
      :!editing? (
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

function HGEndDateInput({ hg, setEndHG, newEndDate, setNewEndDate, confirmedHotel }){
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    setEndHG(dayjs(newEndDate, 'YYYY-MM-DD').format('DD-MM-YYYY'));
    setEditing(false);
  };

  return (
    <>
      {confirmedHotel?(
        <>
          <h3>END DATE: {hg.endDate} </h3>
          {/* <button className="btn btn-light" onClick={() => setEditing(true)}> Edit<MdEdit /></button></h3> */}
        </>
      )

      :!editing ? (
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

function HGDateRangePicker({hg, setEndHG, setStartHG, confirmedHotel }) {

  const [startDate, setNewStartDate] = useState(dayjs(hg.startDate, 'DD-MM-YYYY').format('YYYY-MM-DD'));
  
  const [endDate, setNewEndDate] = useState(dayjs(hg.endDate, 'DD-MM-YYYY').format('YYYY-MM-DD'));

  //CONFUSING NOTE:
  //WHEN USING startDate, setNewStartDate THEY MUST BE IN FORMAT 'YYYY-MM-DD'
  //BUT FOR setEndHG, setStartHG THEY MUST BE IN FORMAT 'DD-MM-YYYY'


  useEffect(() => {
    // console.log(startDate)
    // console.log(endDate)
    // console.log(dayjs(startDate).isAfter(dayjs(endDate)));
    if (startDate && endDate && dayjs(startDate).isSameOrAfter(dayjs(endDate))) {
      setNewEndDate(dayjs(startDate, 'YYYY-MM-DD').add(1, 'day')); // Auto-correct
      setEndHG(dayjs(startDate, 'YYYY-MM-DD').add(1, 'day').format('DD-MM-YYYY'));
    }
  }, [startDate, endDate]);

  return (<>
      <HGStartDateInput
        hg={hg}
        setStartHG={setStartHG}
        newStartDate={startDate}
        setNewStartDate={setNewStartDate}
        confirmedHotel={confirmedHotel}
      />
      <HGEndDateInput
        hg={hg}
        setEndHG={setEndHG}
        newEndDate={endDate}
        setNewEndDate={setNewEndDate}
        confirmedHotel={confirmedHotel}
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

export default function HGInfo({ hg, setEndHG, renameHG, setStartHG, confirmedHotel }) {
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
        confirmedHotel={confirmedHotel}
      />
    </>
  );
}
