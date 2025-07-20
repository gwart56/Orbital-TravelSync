export default function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content border-0 shadow rounded-4">
                    <div className="modal-header border-0 pb-0 d-flex justify-content-center">
                        <h5
                            className="modal-title fw-bold text-center"
                            style={{ fontSize: "1.7rem", color: "#dc3545" }} // Bootstrap danger red
                        >
                            Confirm Delete
                        </h5>
                    </div>
                    <div className="modal-body text-center pt-3 pb-4">
                        <p className="mb-0" style={{ fontSize: "1.1rem", color: "#555" }}>
                            {message}
                        </p>
                    </div>
                    <div className="modal-footer border-0 d-flex justify-content-center gap-3">
                        <button
                            type="button"
                            className="btn btn-primary px-4 py-2 rounded-pill"
                            onClick={onConfirm}
                        >
                            Confirm
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-secondary px-4 py-2 rounded-pill"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
