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
    seatNumber,
    price,
    isReturn
  } = flight;

  const [isEditing, setIsEditing] = useState(!flight.airline);
  const [localIsReturn, setLocalIsReturn] = useState(isReturn); // track return flight checkbox
  const [localPrice, setLocalPrice] = useState(price);           // track price


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
      seatNumber: formData.get('seatNumber') || '',
      price: localIsReturn ? 0 : localPrice,
      isReturn: localIsReturn
    };

    handleSave(id, updatedData);
    setIsEditing(false);
  }

  return (
    <div className="flight-container border rounded p-3 my-3 fade-in" style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
      {!isEditing ? (
        <>
          <div className="mb-2 d-flex align-items-start">
            <strong className="me-2 flex-shrink-0" style={{ width: "120px" }}>Airline:</strong>
            <span className={airline ? "" : "text-placeholder"}>{airline || "Not set"}</span>
          </div>

          <div className="mb-2 d-flex align-items-start">
            <strong className="me-2 flex-shrink-0" style={{ width: "120px" }}>Flight Number:</strong>
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

          <div className="mb-2 d-flex align-items-start">
            <strong className="me-2 flex-shrink-0" style={{ width: "120px" }}>Arrival:</strong>
            <span className={arrivalTime ? "" : "text-placeholder"}>
              {arrivalTime ? dayjs(arrivalTime).format('DD MMM YYYY, HH:mm') : "Not set"}
            </span>
          </div>

           {seatNumber && <div className="mb-2 d-flex align-items-start">
            <strong className="me-2 flex-shrink-0" style={{ width: "120px" }}>Seat Number:</strong>
            <span className={seatNumber ? "" : "text-placeholder"}>{seatNumber || "Not set"}</span>
          </div>}

          {isReturn && (
            <div className="mb-2 d-flex align-items-start">
              <strong className="me-2 flex-shrink-0" style={{ width: "120px" }}></strong>
              <span className="text-success">This is a return flight</span>
            </div>
          )}

          {!isReturn && (
            <div className="mb-2 d-flex align-items-start">
              <strong className="me-2 flex-shrink-0" style={{ width: "120px" }}>Price:</strong>
              <span className={price ? "" : "text-placeholder"}>
                {price ? `$${price}` : "Not set"}
              </span>
            </div>
          )}

          {isEditable && <div className="activity-button-row">
            <button className="activity-container-btn edit-btn" onClick={() => setIsEditing(true)}>
              ✏️ Edit
            </button>
            <button className="activity-container-btn activity-delete-btn" onClick={handleDelete}>
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
              placeholder="e.g. Singapore Airlines"
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
              placeholder="e.g. SQ123"
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
              placeholder="e.g. Singapore Changi Airport (SIN) Terminal 1"
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
              placeholder="e.g. London Heathrow Airport (LHR) Terminal 5"
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

          <div className="mb-3 d-flex align-items-center">
            <strong style={labelStyle}>Price:</strong>
            <input
              className="form-control form-control-sm"
              type="number"
              name="price"
              value={localIsReturn ? 0 : localPrice}
              disabled={localIsReturn}
              onChange={(e) => setLocalPrice(e.target.value)}
              min="0"
              step="0.01"
              placeholder="e.g. 500"
              required={!localIsReturn} // price is required unless it's a return flight
            />
          </div>

          <div className="mb-3 d-flex align-items-center justify-content-start ms-3">
            <label className="form-check-label me-2" htmlFor="returnFlightCheckbox">
              <strong>Return Flight</strong>
            </label>
            <input
              className="form-check-input"
              type="checkbox"
              id="returnFlightCheckbox"
              checked={localIsReturn}
              onChange={(e) => {
                const checked = e.target.checked;
                setLocalIsReturn(checked);
                if (checked) setLocalPrice(0); // force price to 0 if return flight
              }}
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
