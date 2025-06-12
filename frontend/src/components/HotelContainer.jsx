import { useState } from "react";

const HotelContainer = ({ hotel, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);

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
    };
    onSave(updatedHotel);
    setIsEditing(false);
  };

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
          <div className="mb-2">
            <strong>Name: </strong>
            <span>{hotel.name}</span>
          </div>
          <div className="mb-3">
            <strong>Price: </strong>
            <span>{hotel.price}</span>
          </div>
          <div className="d-flex gap-2 justify-content-center">
            <button className="btn btn-primary" onClick={handleEditClick}>
              Edit
            </button>
            <button className="btn btn-danger" onClick={() => onDelete(hotel.id)}>
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HotelContainer;
