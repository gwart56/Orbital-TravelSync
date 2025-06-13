//might be overkill to make this component idk (JUST FOR EDITING NAME(maybe date next time) OF HOTEL GRP)

import { useState } from 'react';
import { updateItinName, updateItinStartDate } from '../data/activity';
import { MdEdit } from "react-icons/md";

//may not use
// function HGDateInput({ hg, redateHG }){
//   const [editing, setEditing] = useState(false);
//   const [newDate, setNewStartDate] = useState(itin.startDate);

//   const handleSave = () => {
//     redateHG(newDate);
//     setEditing(false);
//   };

//   return (
//     <>
//       {!editing ? (
//         <>
//           <h3>START DATE: {itin.startDate}
//           <button className="btn btn-light" onClick={() => setEditing(true)}> Edit<MdEdit /></button></h3>
//         </>
//       ) : (
//         <>
//           <h3>START DATE: 
//             <input
//               type="date"
//               value={newDate}
//               onChange={(e) => setNewDate(e.target.value)}
//             />
//             <button className="btn btn-light" onClick={handleSave}>Save</button>
//             <button className="btn btn-light" onClick={() => setEditing(false)}>Cancel</button>
//           </h3>
//         </>
//       )}
//     </>
//   );
// }

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

export default function HGInfo({ hg, redateHG, renameHG }) {
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
    </>
  );
}
