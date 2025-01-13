import React from 'react';

const ConfirmationModal = ({ show, onHide, onConfirm }) => {
    return (
        <div className={`modal fade ${show ? 'show' : ''}`} tabIndex="-1" role="dialog" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: show ? 'block' : 'none' }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Confirmation</h5>
                        <button type="button" className="close btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onHide}>
                            {/* <span aria-hidden="true">&times;</span> */}
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure you want to delete this admin?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onHide} style={{ display: show ? 'block' : 'none' }}>Cancel</button>
                        <button type="button" className="btn btn-danger" onClick={onConfirm}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
