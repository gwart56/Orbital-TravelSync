export default function ConfirmedHotelGroup({confirmedHotel, updateHotel, setConfirmedHotel, isEditable}){
    return (
        <div className="d-flex flex-column gap-2">

            <div className="d-flex align-items-center">
            <strong className="me-1" style={{ minWidth: "50px" }}>Name:</strong>
            <span
                className="text-truncate"
                style={{
                maxWidth: "700px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
                }}
            >
                {confirmedHotel.name}
            </span>
            </div>

            <div className="d-flex align-items-center">
                <strong className="me-1" style={{ minWidth: "50px" }}>Price:</strong>
                <span
                    className={`text-truncate ${!confirmedHotel.price ? 'fst-italic text-muted' : ''}`}
                    style={{
                    maxWidth: "150px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                    }}
                    title={confirmedHotel.price || '-'}
                >
                    ${confirmedHotel.price || '-'}
                </span>
            </div>

            <div className="d-flex align-items-center">
                <strong className="me-1" style={{ minWidth: "50px" }}>Address:</strong>
                <span
                    className={`text-truncate ${!confirmedHotel.address ? 'fst-italic text-muted' : ''}`}
                    style={{
                    maxWidth: "700px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                    }}
                    title={confirmedHotel.address || '-'}
                >
                    {confirmedHotel.address || '-'}
                </span>
            </div>

            <div className="d-flex align-items-center">
                <strong className="me-1" style={{ minWidth: "50px" }}>Check-in Time:</strong>
                <span
                    className="text-truncate"
                    style={{
                    maxWidth: "100px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                    }}
                    title={confirmedHotel.checkInTime}
                >
                    {confirmedHotel.checkInTime}
                </span>
            </div>

            <div className="d-flex align-items-center">
                <strong className="me-1" style={{ minWidth: "50px" }}>Check-out Time:</strong>
                <span
                    className="text-truncate"
                    style={{
                    maxWidth: "100px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                    }}
                    title={confirmedHotel.checkOutTime}
                >
                    {confirmedHotel.checkOutTime}
                </span>
            </div>

            {/* TODO: add an edit button and also allow user to view previous hotels*/}
            <div className="d-flex gap-2 m-3">

                <button
                    type="button"
                    className={`btn btn-md text-truncate ${confirmedHotel.link ? 'btn-info text-white' : 'btn-outline-primary'}`}
                    style={{
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                    onClick={() => {
                        if (confirmedHotel.link) {
                            window.open(confirmedHotel.link, "_blank", "noopener,noreferrer");
                        }
                    }}
                    title={confirmedHotel.link || "No link available"}
                    disabled={!confirmedHotel.link}
                >
                    🔗 Visit
                </button>

                {isEditable && <button
                    className="btn btn-danger text-white"
                    onClick={() => {
                        const updatedHotel = { ...confirmedHotel, isConfirmed: false, checkInDate: null, checkOutDate: null};
                        updateHotel(confirmedHotel.id, updatedHotel);
                        setConfirmedHotel(false);
                    }}
                >
                    🗙 Unconfirm Hotel
                </button>}
            </div>


        {/* Todo: allow page to spawn with confirmed hotel */}
        </div>);
}