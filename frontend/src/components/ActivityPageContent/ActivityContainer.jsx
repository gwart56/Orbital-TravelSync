import './ActivityContainer.css';
import { MdDeleteForever } from "react-icons/md";
import { useState } from 'react';
import LocationPicker from "../GoogleMapsComponents/LocationPicker";

export default function ActivityContainer({ activity, handleSave, handleDelete, isEdit , isEditable}) {
  const [latLng, setLatLng] = useState(activity.latLng); //mainly for google maps api
  const { id, name, time, locName, locAddress } = activity;
  const [isEditing, setIsEditing] = useState(isEdit);
  const [location, setLocation] = useState({ locName, locAddress }); //mainly for google maps api
  const [isPickingLocation, setIsPickingLocation] = useState(false);

  function saveActivity(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const dataObj = Object.fromEntries(formData.entries());;
    setIsEditing(false);
    handleSave(id, {...dataObj, latLng});
  }

  function handleLocationSave(newLocation, pos) {
    if (!newLocation) {
      return;
    }
    console.log(newLocation);
    setLocation(newLocation);
    setLatLng(pos);
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
          <span
            className={`text-truncate ${name ? "" : "text-placeholder"}`}
            title={name}
          >
            {name || "Untitled Activity"}
          </span>
        </div>

        <div className="mb-2 d-flex align-items-start">
          <strong className="me-2 flex-shrink-0" style={{ width: "100px" }}>Time:</strong>
          <span className={time ? "" : "text-placeholder"}>
            {time || "Not set"}
          </span>
        </div>

        <div className="mb-2 d-flex align-items-start">
          <strong className="me-2 flex-shrink-0" style={{ width: "100px" }}>Location:</strong>
          <span
            className={`text-truncate ${location.locName ? "" : "text-placeholder"}`}
            title={location.locName}
          >
            {location.locName || "No location yet"}
          </span>
        </div>

        <div className="mb-3 d-flex align-items-start">
          <strong className="me-2 flex-shrink-0" style={{ width: "100px" }}>Address:</strong>
          <span
            className={`text-truncate ${location.locAddress ? "" : "text-placeholder"}`}
            title={location.locAddress}
          >
            {location.locAddress || "Select on map or enter manually"}
          </span>
        </div>

        {isEditable && <div className="activity-button-row">
          <button className="activity-container-btn edit-btn" onClick={() => setIsEditing(true)}>
            ✏️ Edit
          </button>
          <button className="activity-container-btn activity-delete-btn" onClick={() => handleDelete(id)}>
            <MdDeleteForever className="delete-icon" />
            Delete
          </button>
        </div>}

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
              placeholder="e.g. ABC Mart"
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
              placeholder="e.g. 123 Normal Rd"
            />
          </div>
          {isPickingLocation ? (
            <LocationPicker
              onSave={(loc, pos) => handleLocationSave(loc, pos)}
              onClose={() => setIsPickingLocation(false)}
              prevLocation={location}
              setLocation={setLocation}
              act={activity}
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
