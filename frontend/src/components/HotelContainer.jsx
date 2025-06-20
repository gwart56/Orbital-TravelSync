import { useState } from "react";
import LocationPicker from "./LocationPicker";
import HotelPicker from "./HotelPicker";

const HotelContainer = ({ hotel, onSave, onDelete, onConfirm }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [location, setLocation] = useState( hotel.address );
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // prevent form refresh
    const formData = new FormData(e.target);
    const updatedHotel = {
        ...hotel,
        name: formData.get("name"),
        price: formData.get("price"),
        address: formData.get("address"),
        link: formData.get("link"),
        checkInTime: formData.get("checkInTime"),
        checkOutTime: formData.get("checkOutTime")
    };
    onSave(updatedHotel);
    setIsEditing(false);
  };

   function handleLocationSave(newLocation) { //returns {locName, locAddress}
    if (!newLocation) {
      return;
    }
    console.log(newLocation);
    setLocation(newLocation.locAddress);
    setIsPickingLocation(false);
  }

  return (
    <div className="container border rounded p-3 my-3">
      {isEditing ? (
        <form onSubmit={handleSubmit}>

          <div className="mb-2">
            <strong>Name: </strong>
            <input
              type="text"
              name="name"
              defaultValue={hotel.name}
              className="form-control d-inline w-auto"
              required
            />
          </div>

          <div className="mb-3">
            <strong>Price: </strong>
            <input
              type="text"
              name="price"
              defaultValue={hotel.price}
              className="form-control d-inline w-auto"
              required
            />
          </div>

          <div className="mb-3">
            <strong>Check-in Time: </strong>
            <input
              type="time"
              name="checkInTime" 
              defaultValue={hotel.checkInTime}
              className="form-control d-inline w-auto"
            />
          </div>

          <div className="mb-3">
            <strong>Check-out Time: </strong>
            <input
              type="time"
              name="checkOutTime"
              defaultValue={hotel.checkOutTime}
              className="form-control d-inline w-auto"
            />
          </div>

          <div className="mb-3">
            <strong>Link: </strong>
            <input
              type="url"
              name="link"
              defaultValue={hotel.link}
              className="form-control"
            />
          </div>

          <div className="mb-2">
            <strong>Address: </strong>
            <input
              type="text"
              name="address"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              className="form-control"
            />
          </div>

          {isPickingLocation ? (
            <HotelPicker
              onSave={(loc) => handleLocationSave(loc)}
              onClose={() => setIsPickingLocation(false)}
              location={location}
              setLocation={setLocation}
            />) : (
              <button
              type="button"
              className="btn btn-outline-primary btn-sm ms-2 m-3"
              onClick={() => setIsPickingLocation(true)}
          >
                Pick Location
          </button>
            )}

          <div className="d-flex gap-2 justify-content-center">
            <button type="submit" className="btn btn-success me-2">
                Save
            </button>
            <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsEditing(false)}
            >
                Cancel
            </button>
          </div>
        </form>
      ) : (
        <>

      <div className="d-flex align-items-center gap-3 flex-wrap">
        {/* Name label + value */}
        <div className="d-flex align-items-center" style={{ minWidth: "0", flex: "1 1 0" }}>
          <strong className="me-1" style={{ minWidth: "50px" }}>Name:</strong>
          <span className="text-truncate" style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={hotel.name}>
            {hotel.name}
          </span>
        </div>

        {/* Price label + value */}
        <div className="d-flex align-items-center" style={{ minWidth: "0", flex: "1 1 0" }}>
          <strong className="me-1" style={{ minWidth: "50px" }}>Price:</strong>
          <span className="text-truncate" style={{ maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={hotel.price}>
            {hotel.price}
          </span>
        </div>

        {/* Address label + value */}
        <div className="d-flex align-items-start flex-wrap" style={{ minWidth: "0", flex: "2 1 0" }}>
          <strong className="me-1">Address:</strong>
          <span style={{ wordBreak: "break-word", maxWidth: "300px" }}>
            {hotel.address}
          </span>
        </div>

        {/* Buttons */}
<div className="d-grid mt-2"
     style={{ gridTemplateColumns: "1fr 1fr", gap: "0.75rem", maxWidth: "320px" }}>
  
  {/* Top Left: Visit Site */}
  <button
    type="button"
    className={`btn btn-md text-truncate ${hotel.link ? 'btn-info text-white' : 'btn-outline-primary'}`}
    style={{
      maxWidth: "100%",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    }}
    onClick={() => {
      if (hotel.link) {
        window.open(hotel.link, "_blank", "noopener,noreferrer");
      }
    }}
    title={hotel.link || "No link available"}
    disabled={!hotel.link}
  >
    🔗 Visit
  </button>

  {/* Top Right: Edit */}
  <button className="btn btn-primary btn-md" onClick={handleEditClick}>
    ✏️ Edit
  </button>

  {/* Bottom Left: Choose Hotel */}
  <button className="btn btn-success btn-md" onClick={() => onConfirm(hotel)}>
    ✅ Choose
  </button>

  {/* Bottom Right: Delete */}
  <button
    className="btn btn-danger btn-md"
    onClick={() => {
      const confirmed = window.confirm(`Are you sure you want to delete "${hotel.name}"?`);
      if (confirmed) {
        onDelete(hotel.id);
      }
    }}
  >
    🗑️ Delete
  </button>
</div>
      </div>

            </>
      )}
    </div>
  );
};

export default HotelContainer;
