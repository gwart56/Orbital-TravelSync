//might be overkill to make this component idk (JUST FOR EDITING NAME(maybe date next time) OF HOTEL GRP)

import { useEffect, useState } from 'react';
import { MdEdit } from "react-icons/md";
import dayjs from 'dayjs';
import './HotelGroupInfo.css';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Extend dayjs with the plugin
dayjs.extend(customParseFormat);

//may not use
function HGStartDateInput({ hg, setStartHG, newStartDate, setNewStartDate, confirmedHotel, isEditable}){
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
          <h3>🟢 Check-in: {dayjs(hg.startDate, 'DD-MM-YYYY').format('D MMMM YYYY')} </h3>
        </>
      )
      :!(editing)? (
        <>
          <h3 className="editable-start-date" onClick={() => isEditable?setEditing(true):setEditing(false)}>
            🟢 Check-in: {dayjs(hg.startDate, 'DD-MM-YYYY').format('D MMMM YYYY')}
          </h3>
        </>
      ) : (
        <>
          <h3>🟢 Check-in Date: 
            <input
              type="date"
              className="form-control d-inline w-auto"
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

function HGEndDateInput({ hg, setEndHG, newEndDate, setNewEndDate, confirmedHotel , isEditable}){
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    setEndHG(dayjs(newEndDate, 'YYYY-MM-DD').format('DD-MM-YYYY'));
    setEditing(false);
  };

  return (
    <>
      {confirmedHotel?(
        <>
          <h3>🔴 Check-out: {dayjs(hg.endDate, 'DD-MM-YYYY').format('D MMMM YYYY')} </h3>
          {/* <button className="btn btn-light" onClick={() => setEditing(true)}> Edit<MdEdit /></button></h3> */}
        </>
      )

      :!(editing)? (
        <>
          <h3 className="editable-end-date" onClick={() => isEditable?setEditing(true):setEditing(false)}>
            🔴 Check-out: {dayjs(hg.endDate, 'DD-MM-YYYY').format('D MMMM YYYY')}
          </h3>
        </>
      ) : (
        <>
          <h3>🔴 
            Check-out Date: 
              <input
                type="date"
                className="form-control d-inline w-auto"
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

function HGDateRangePicker({hg, setEndHG, setStartHG, confirmedHotel, isEditable}) {

  const [startDate, setNewStartDate] = useState(dayjs(hg.startDate, 'DD-MM-YYYY').format('YYYY-MM-DD'));
  
  const [endDate, setNewEndDate] = useState(dayjs(hg.endDate, 'DD-MM-YYYY').format('YYYY-MM-DD'));

  //CONFUSING NOTE:
  //WHEN USING startDate, setNewStartDate THEY MUST BE IN FORMAT 'YYYY-MM-DD'
  //BUT FOR setEndHG, setStartHG THEY MUST BE IN FORMAT 'DD-MM-YYYY'


  useEffect(() => {
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
        isEditable={isEditable}
      />
      <HGEndDateInput
        hg={hg}
        setEndHG={setEndHG}
        newEndDate={endDate}
        setNewEndDate={setNewEndDate}
        confirmedHotel={confirmedHotel}
        isEditable={isEditable}
      />
  </>);
}

function HGNameInput({ hg, renameHG , isEditable}){
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(hg.name);

  const handleSave = () => {
    renameHG(newName);
    setEditing(false);
  };

  return (
    <>
      {!(editing)? (
        <h3 
          className="editable-name"
          onClick={() => isEditable?setEditing(true):setEditing(false)}
        >
          {hg.name}
          {isEditable && <MdEdit className="edit-icon" />}
        </h3>
      ) : (
        <h3>
          <div className="d-flex px-5 gap-3 justify-content-center w-75 m-auto">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="input-grp-name"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') setEditing(false);
              }}
            />
            <button className="btn btn-sm btn-light" style={{flex:"1 1 0"}} onClick={handleSave}>Save</button>
            <button className="btn btn-sm btn-light" style={{flex:"1 1 0"}} onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </h3>
      )}
    </>
  );
}

export default function HGInfo({ hg, setEndHG, renameHG, setStartHG, confirmedHotel , isEditable}) {
  console.log('hotel group info', isEditable);
  return (
    <div>
      <div>
        <HGNameInput hg={hg} renameHG={renameHG} isEditable={isEditable}/>
      </div>
      <div>
        <HGDateRangePicker
          hg={hg}
          setEndHG={setEndHG}
          setStartHG={setStartHG}
          confirmedHotel={confirmedHotel}
          isEditable={isEditable}
        />
      </div>
    </div>
  );
}

