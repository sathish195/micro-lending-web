

import React, { useEffect, useState } from 'react';
import { backEndCallObj } from '../../services/mainServiceFile';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-hot-toast";
import AddAdmin from './Addadmin';
import { useMovieContext } from "../comman/Context";
import moment from 'moment';
import { Modal, Button } from 'react-bootstrap';
import { Input_email, Input_text, Number_Input, Select_input } from '../comman/All-Inputs';
import authService from '../../services/authService';

function AdminList() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { AddadminData, setAddadminData } = useMovieContext();
    const [showAddAdminModal, setShowAddAdminModal] = useState(false);
    const [deletingAdmin, setDeletingAdmin] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [showEditAdminModal, setShowEditAdminModal] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [formData, setFormData] = useState({});
    const [options, setOptions] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await backEndCallObj("/admin/admins_list");
            console.log(response)
            setAddadminData(response);
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (AddadminData.length === 0) {
            fetchData();
        }
    }, []);

    const handleDeleteAdmin = async (user_id) => {
        try {

            setDeletingAdmin(user_id);
            setShowConfirmationModal(true);
        } catch (error) {
            console.error("Error deleting admin:", error);
            toast.error("Failed to delete admin. Please try again later.");
        }
    };

    const handleConfirmDelete = async () => {
        setBtnDisabled(true);
        try {
            const response = await backEndCallObj("/admin/admin_remove", { user_id: deletingAdmin });
            fetchData();
            toast.success("Admin deleted successfully.");
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data);
            }
        } finally {
            setBtnDisabled(false);
            setDeletingAdmin(null);
            setShowConfirmationModal(false);
        }
    };

    const handleCancelDelete = () => {
        setBtnDisabled(true);
        setShowConfirmationModal(false);
    };

    const formattedDate = (date) => {
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
    };

    const handleEditAdmin = (admin) => {
        setEditingAdmin(admin);
        setShowEditAdminModal(true);
        setFormData({
            full_name: admin.full_name,
            member_email: admin.member_email,
            admin_type: admin.admin_type,
            phone_number: admin.phone_number,
            user_id: admin.user_id
        });
    };

    const handleUpdateAdmin = async () => {

        setBtnDisabled(true)
        try {
            const { user_id, full_name, member_email, phone_number, admin_type } = formData;

            // Create the payload with the required fields
            const payload = {
                user_id,
                full_name,
                member_email,
                phone_number,
                admin_type
            };
            const response = await backEndCallObj("/admin/create_admin",
                payload
            );
            // console.log(response, "edite admin")

            setShowEditAdminModal(false);
            setAddadminData(response)

            fetchData()
            setBtnDisabled(false)
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data);
            }
            setBtnDisabled(false)
        }
    }
    const openConfirmModal = (user) => {
        setSelectedUser(user);
        setConfirmModalOpen(true);

    };

    const closeConfirmModal = () => {
        setSelectedUser(null);

        setConfirmModalOpen(false);

    };

    const confirmStatusChange = async () => {
        setBtnDisabled(true)
        if (!selectedUser) return;

        try {
            const obj = { user_id: selectedUser.user_id, user_active: selectedUser.user_active === "Enable" ? "Disable" : "Enable" };
            const response = await backEndCallObj("/admin/user_disable", obj);
            // console.log(response);

            // Update user status locally
            const updatedUsersList = AddadminData.map(admin => {
                if (admin.user_id === selectedUser.user_id) {
                    return { ...admin, user_active: obj.user_active };
                } else {
                    return admin;
                }
            });
            setAddadminData(updatedUsersList);
            setBtnDisabled(false)
            toast.success("User status toggled successfully.");
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data);
            }
        } finally {
            closeConfirmModal();
            setBtnDisabled(false)
        }
    };

    // console.log(authService.getCurrentUser().admin_type)
    if (authService.getCurrentUser().admin_type !== "1") {
        // console.log("yes")
        window.history.back()
    }

    return (
        <div className="user-details-container">
            <h5 className="mb-4">Admin List</h5>
            <div className='card'>
                <div className='card-body scrolleHidden ' style={{ overflowY: "auto", height: "70vh" }}>
                    <div className="table-responsive">
                        <button
                            type="button"
                            className="btn btn-primary btn-block mb-3"
                            onClick={() => setShowAddAdminModal(true)}
                        >
                            Add Admin
                        </button>

                        <table className="table border table-bordered table-centered">
                            <thead>
                                <tr className="table-head text-center">
                                    <th scope="col">Date</th>
                                    <th scope="col">Admin ID</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Phone Number</th>
                                    <th scope="col">Admin Type</th>
                                    <th scope="col">status</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody className="table-body text-center">
                                {AddadminData?.map((admin) => (
                                    <tr key={admin.user_id}>
                                        <td>{formattedDate(admin.date_of_register)}</td>
                                        <td>{admin.user_id}</td>
                                        <td>{admin.full_name}</td>
                                        <td>{admin.phone_number}</td>
                                        <td>{admin.admin_type}</td>
                                        <td>
                                            {/* <button
                                                type="button"
                                                className="btn btn-danger btn-block me-2 mb-2"
                                                onClick={() => handleDeleteAdmin(admin.user_id)}
                                            >
                                                Delete
                                            </button> */}
                                            <button
                                                className="btn primary"
                                                onClick={() => openConfirmModal(admin)}
                                                style={{
                                                    width: "150px",
                                                    backgroundColor: admin?.user_active === "Enable" ? "#28a745a8" : "rgb(240 110 32 / 76%)",
                                                }}
                                            >
                                                {admin?.user_active === "Enable" ? "Disable" : "Enable"}

                                            </button>






                                        </td>

                                        <td>

                                            <Button className="btn btn-danger btn-block me-2 mb-2" onClick={() => handleEditAdmin(admin)}>Edit</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {loading && (
                        <div className="text-center mt-3">
                            <div className="spinner-border spiner-border-sm" style={{ color: "blue" }} role="status">
                                <span className="sr-only"></span>
                            </div>
                        </div>
                    )}
                    {AddadminData.length == 0 && !loading && (<p className="text-center">there is no data found</p>)}
                </div>
                {showEditAdminModal &&
                    <Modal show={showEditAdminModal} onHide={() => setShowEditAdminModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Admin</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="full_name" className="form-label">Name</label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        placeholder="Enter name here"
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="member_email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        value={formData.member_email}
                                        name="member_email"
                                        placeholder="Enter email here"
                                        onChange={(e) => setFormData({ ...formData, member_email: e.target.value })}
                                        className="form-control"
                                    />
                                </div>

                                <div className="mb-3">

                                    <label htmlFor="phone_number" className="form-label">Phone Number</label>
                                    <div className="position-relative applyloan">
                                        {/* <span className="apply_loan p-2 positon_absolute font-bold me-2">+63</span> */}
                                        <input
                                            type="phone_number"
                                            value={formData.phone_number}
                                            name="phone_number"
                                            placeholder="Enter phone number here"
                                            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                            maxLength={12}

                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="admin_type" className="form-label">Admin Type</label>
                                    {/* <select
                                        name="admin_type"
                                        className="form-control"
                                        onChange={(e) => setFormData({ ...formData, admin_type: e.target.value })}
                                        value={formData.admin_type}
                                        options={[
                                            { value: "2", label: "2" },
                                            { value: "3", label: "3" },
                                        ]}
                                    /> */}
                                    <select
                                        onChange={(e) => setFormData({ ...formData, admin_type: e.target.value })}
                                        name="admin_type"
                                        className="form-control"
                                        value={formData.admin_type}



                                    // Make sure this value is correctly set
                                    >
                                        <option value="">-- Select --</option>
                                        <option value="2"> 2</option>
                                        <option value="3"> 3</option>

                                        {options && options.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {/* <Button variant="primary" type="submit" disabled={btnDisabled}>Submit</Button> */}
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowEditAdminModal(false)}>
                                Close
                            </Button>
                            <Button variant="primary" disabled={btnDisabled} onClick={handleUpdateAdmin}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>
                }
                {showAddAdminModal && (
                    <AddAdmin show={showAddAdminModal} onHide={() => setShowAddAdminModal(false)} />
                )}

                {/* {showConfirmationModal && (
                    <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Action</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Are you sure you want to delete this admin?</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCancelDelete}>Cancel</Button>
                            <Button variant="primary" onClick={handleConfirmDelete} disabled={btnDisabled} >Confirm</Button>
                        </Modal.Footer>
                    </Modal>
                )} */}
                {confirmModalOpen && (

                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: "block" }} >
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirm Status Change</h5>
                                    <button type="button" className="btn-close" data-dismiss="modal" aria-label="Close" onClick={closeConfirmModal}>
                                        {/* <span aria-hidden="true">&times;</span> */}
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <p>Are you sure you want to {selectedUser?.user_active === "Enable" ? "disable" : "enable"} this user?</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeConfirmModal}>Cancel</button>
                                    <button type="button" className="btn btn-primary" onClick={confirmStatusChange} disabled={btnDisabled}>Confirm</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}

export default AdminList;
