// import './ActivityContainer.css';
import { MdDeleteForever } from "react-icons/md";
import { useState } from 'react';

export default function ActivityContainer({ activity, handleSave, handleDelete, isEdit }) {
  const { id, name, time, locName, locAddress } = activity;
  const [isEditing, setIsEditing] = useState(isEdit);

  function saveActivity(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const valuesArray = Array.from(formData.values());
    setIsEditing(false);
    handleSave(id, valuesArray);
  }

  const labelStyle = { minWidth: "100px", display: "inline-block" };

  return (
    <div className="activity-container border rounded p-3 my-3"
    style={{ maxWidth: "600px", margin: "0 auto", width: "100%" }}>
      {!isEditing ? (
        <>
        <div className="mb-2 d-flex align-items-start">
            <strong className="me-2 flex-shrink-0" style={{ width: "100px" }}>Activity:</strong>
            <span className="text-truncate" style={{ overflow: "hidden", whiteSpace: "nowrap" }} title={name}>{name}</span>
        </div>

        <div className="mb-2 d-flex align-items-start">
            <strong className="me-2 flex-shrink-0" style={{ width: "100px" }}>Time:</strong>
            <span>{time}</span>
        </div>

        <div className="mb-2 d-flex align-items-start">
            <strong className="me-2 flex-shrink-0" style={{ width: "100px" }}>Location:</strong>
            <span className="text-truncate" style={{ overflow: "hidden", whiteSpace: "nowrap" }} title={locName}>{locName}</span>
        </div>

        <div className="mb-3 d-flex align-items-start">
            <strong className="me-2 flex-shrink-0" style={{ width: "100px" }}>Address:</strong>
            <span className="text-truncate" style={{ overflow: "hidden", whiteSpace: "nowrap" }} title={locAddress}>{locAddress}</span>
        </div>

          <div className="d-flex gap-2 justify-content-end">
            <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(true)}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(id)}><MdDeleteForever /></button>
          </div>
        </>
      ) : (
        <form onSubmit={saveActivity}>
          <div className="mb-2 d-flex align-items-center">
            <strong style={labelStyle}>Activity:</strong>
            <input
              className="form-control form-control-sm"
              type="text"
              name="name"
              defaultValue={name}
              required
              placeholder="e.g. shopping"
            />
          </div>
          <div className="mb-2 d-flex align-items-center">
            <strong style={labelStyle}>Time:</strong>
            <input
              className="form-control form-control-sm"
              type="time"
              name="time"
              defaultValue={time}
              required
            />
          </div>
          <div className="mb-2 d-flex align-items-center">
            <strong style={labelStyle}>Location:</strong>
            <input
              className="form-control form-control-sm"
              type="text"
              name="locName"
              defaultValue={locName}
              required
              placeholder="e.g. McDonald's"
            />
          </div>
          <div className="mb-3 d-flex align-items-center">
            <strong style={labelStyle}>Address:</strong>
            <input
              className="form-control form-control-sm"
              type="text"
              name="locAddress"
              defaultValue={locAddress}
              required
              placeholder="e.g. 123 Normal Rd"
            />
          </div>
          <div className="d-flex gap-2 justify-content-end">
            <button type="submit" className="btn btn-success btn-sm">Save</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
