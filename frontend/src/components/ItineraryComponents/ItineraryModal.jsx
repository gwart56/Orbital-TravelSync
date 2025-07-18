import { useState, useEffect } from "react";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Extend dayjs with the plugin
dayjs.extend(customParseFormat);

export default function ItineraryModal({ onCreate, onClose }) {
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [numDays, setNumDays] = useState(0);
    const [error, setError] = useState("");

    function formatDate(date) {
        return dayjs(date, 'YYYY-MM-DD').format('DD-MM-YYYY');
    }

    useEffect(() => {
        if (startDate && endDate) {
            if (dayjs(endDate).isBefore(dayjs(startDate))) {
                setError("End date cannot be earlier than start date");
                setNumDays(0);
            } else {
                setError("");
                const days = dayjs(endDate).diff(dayjs(startDate), "day") + 1;
                setNumDays(days);
            }
        } else {
            setNumDays(0);
            setError("");
        }
    }, [startDate, endDate]);

    // When startDate changes, reset endDate if invalid
    // useEffect(() => {
    //     if (endDate && dayjs(endDate).isBefore(dayjs(startDate))) {
    //         setEndDate(startDate);
    //     }
    // }, [startDate, endDate]);

    const handleCreate = () => {
        if (!name || !startDate || !endDate || numDays <= 0) {
            alert("Please fill in all fields correctly.");
            return;
        }
        if (error) {
            alert(error);
            return;
        }
        onCreate({ name, startDate, numDays });
        setName("");
        setStartDate("");
        setEndDate("");
        setNumDays(0);
    };

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Create New Itinerary</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label">Name:</label>
                            <input
                                className="form-control"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Start Date:</label>
                            <input
                                type="date"
                                className="form-control"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">End Date:</label>
                            <input
                                type="date"
                                className="form-control"
                                min={startDate || ""}
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                required
                            />
                        </div>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <p>Number of days: <strong>{numDays}</strong></p>
                    </div>
                    <div className="modal-footer">
                        <button
                            className="btn btn-success"
                            onClick={handleCreate}
                            disabled={!!error}
                        >
                            Create
                        </button>
                        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
