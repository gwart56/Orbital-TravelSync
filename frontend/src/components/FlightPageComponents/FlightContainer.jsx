import './FlightContainer.css';
import { useState } from 'react';
import { MdDeleteForever } from 'react-icons/md';
import dayjs from 'dayjs';

export default function FlightContainer({ flight, handleSave, handleDelete , isEditable}) {
  const {
    id,
    airline,
    flightNumber,
    departureAirport,
    arrivalAirport,
    departureTime,
    arrivalTime,
    seatNumber
  } = flight;

  const [isEditing, setIsEditing] = useState(false);

  const labelStyle = { minWidth: "120px", display: "inline-block" };

  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const updatedData = {
      airline: formData.get('airline') || '',
      flightNumber: formData.get('flightNumber') || '',
      departureAirport: formData.get('departureAirport') || '',
      arrivalAirport: formData.get('arrivalAirport') || '',
      departureTime: formData.get('departureTime') || '',
      arrivalTime: formData.get('arrivalTime') || '',
      seatNumber: formData.get('seatNumber') || ''
    };

    handleSave(id, updatedData);
    setIsEditing(false);
  }

  return (
    <div className="flight-container border rounded p-3 my-3" style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
      {!isEditing ? (
        <>
          <div className="mb-2 d-flex align-items-start">
            <strong className="me-2 flex-shrink-0" style={{ width: "120px" }}>Airline:</strong>
            <span className={airline ? "" : "text-placeholder"}>{airline || "Not set"}</span>
          </div>

          <div className="mb-2 d-flex align-items-start">
            <strong className="me-2 flex-shrink-0" style={{ width: "120px" }}>Flight No.:</strong>
            <span className={flightNumber ? "" : "text-placeholder"}>{flightNumber || "Not set"}</span>
          </div>

          <div className="mb-2 d-flex align-items-start">
            <strong className="me-2 flex-shrink-0" style={{ width: "120px" }}>From Airport:</strong>
            <span className={departureAirport ? "" : "text-placeholder"}>{departureAirport || "Not set"}</span>
          </div>

          <div className="mb-2 d-flex align-items-start">
            <strong className="me-2 flex-shrink-0" style={{ width: "120px" }}>To Airport:</strong>
            <span className={arrivalAirport ? "" : "text-placeholder"}>{arrivalAirport || "Not set"}</span>
          </div>

          <div className="mb-2 d-flex align-items-start">
            <strong className="me-2 flex-shrink-0" style={{ width: "120px" }}>Departure:</strong>
            <span className={departureTime ? "" : "text-placeholder"}>
              {departureTime ? dayjs(departureTime).format('DD MMM YYYY, HH:mm') : "Not set"}
            </span>
          </div>

          <div className="mb-3 d-flex align-items-start">
            <strong className="me-2 flex-shrink-0" style={{ width: "120px" }}>Arrival:</strong>
            <span className={arrivalTime ? "" : "text-placeholder"}>
              {arrivalTime ? dayjs(arrivalTime).format('DD MMM YYYY, HH:mm') : "Not set"}
            </span>
          </div>

           {seatNumber && <div className="mb-3 d-flex align-items-start">
            <strong className="me-2 flex-shrink-0" style={{ width: "120px" }}>Seat Number:</strong>
            <span className={seatNumber ? "" : "text-placeholder"}>{seatNumber || "Not set"}</span>
          </div>}

          {isEditable && <div className="flight-button-row">
            <button className="btn btn-sm btn-outline-primary" onClick={() => setIsEditing(true)}>✏️ Edit</button>
            <button className="btn btn-sm btn-danger" onClick={handleDelete}>
              <MdDeleteForever className="delete-icon" />
              Delete
            </button>
          </div>}
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-2 d-flex align-items-center">
            <strong style={labelStyle}>Airline:</strong>
            <input
              className="form-control form-control-sm"
              type="text"
              name="airline"
              defaultValue={airline}
              required
            />
          </div>
          <div className="mb-2 d-flex align-items-center">
            <strong style={labelStyle}>Flight Number:</strong>
            <input
              className="form-control form-control-sm"
              type="text"
              name="flightNumber"
              defaultValue={flightNumber}
              required
            />
          </div>
          <div className="mb-2 d-flex align-items-center">
            <strong style={labelStyle}>Departure Airport:</strong>
            <input
              className="form-control form-control-sm"
              type="text"
              name="departureAirport"
              defaultValue={departureAirport}
            //   required
            />
          </div>
          <div className="mb-2 d-flex align-items-center">
            <strong style={labelStyle}>Arrival Airport:</strong>
            <input
              className="form-control form-control-sm"
              type="text"
              name="arrivalAirport"
              defaultValue={arrivalAirport}
            //   required
            />
          </div>
          <div className="mb-2 d-flex align-items-center">
            <strong style={labelStyle}>Departure Time:</strong>
            <input
              className="form-control form-control-sm"
              type="datetime-local"
              name="departureTime"
              defaultValue={departureTime ? dayjs(departureTime).format('YYYY-MM-DDTHH:mm') : ''}
              required
            />
          </div>
          <div className="mb-3 d-flex align-items-center">
            <strong style={labelStyle}>Arrival Time:</strong>
            <input
              className="form-control form-control-sm"
              type="datetime-local"
              name="arrivalTime"
              defaultValue={arrivalTime ? dayjs(arrivalTime).format('YYYY-MM-DDTHH:mm') : ''}
              required
            />
          </div>
          <div className="mb-2 d-flex align-items-center">
            <strong style={labelStyle}>Seat Number:</strong>
            <input
              className="form-control form-control-sm"
              type="text"
              name="seatNumber"
              defaultValue={seatNumber}
              placeholder='(optional)'
            //   required
            />
          </div>
          <div className="d-flex gap-2 justify-content-end">
            <button type="submit" className="btn btn-sm btn-success">Save</button>
            <button type="button" className="btn btn-sm btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
