// import './ActivityContainer.css';
import { MdDeleteForever } from "react-icons/md";
import { useState } from 'react';
import LocationPicker from "./LocationPicker";

export default function ActivityContainer({ activity, handleSave, handleDelete, isEdit }) {
  const { id, name, time, locName, locAddress } = activity;
  const [isEditing, setIsEditing] = useState(isEdit);
  const [location, setLocation] = useState({ locName, locAddress }); //mainly for google maps api
  const [isPickingLocation, setIsPickingLocation] = useState(false);

  function saveActivity(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const valuesArray = Array.from(formData.values());
    setIsEditing(false);
    handleSave(id, valuesArray);
  }

  function handleLocationSave(newLocation) {
    if (!newLocation) {
      return;
    }
    console.log(newLocation);
    setLocation(newLocation);
    setIsPickingLocation(false);
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
            <span className="text-truncate" style={{ overflow: "hidden", whiteSpace: "nowrap" }} title={locName}>{location.locName}</span>
        </div>

        <div className="mb-3 d-flex align-items-start">
            <strong className="me-2 flex-shrink-0" style={{ width: "100px" }}>Address:</strong>
            <span className="text-truncate" style={{ overflow: "hidden", whiteSpace: "nowrap" }} title={locAddress}>{location.locAddress}</span>
        </div>

          <div className="d-flex gap-2 justify-content-end">
            <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(true)}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(id)}><span>Delete </span> <MdDeleteForever /></button>
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
              value={location.locName}
              onChange={(e) =>
                setLocation((prev) => ({ ...prev, locName: e.target.value }))
              }
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
              value={location.locAddress}
              onChange={(e) =>
                setLocation((prev) => ({ ...prev, locAddress: e.target.value }))
              }
              required
              placeholder="e.g. 123 Normal Rd"
            />
          </div>
          {isPickingLocation ? (
            <LocationPicker
              onSave={(loc) => handleLocationSave(loc)}
              onClose={() => setIsPickingLocation(false)}
              location={location}
              setLocation={setLocation}
            />
          ) : (
            <button
                type="button"
                className="btn btn-outline-primary btn-sm ms-2"
                onClick={() => setIsPickingLocation(true)}
              >
                Choose Address On Map
          </button>
          )}
          <div className="d-flex gap-2 justify-content-end">
            <button type="submit" className="btn btn-success btn-sm">Save</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
