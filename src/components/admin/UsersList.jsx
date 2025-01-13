import React, { useEffect, useState, useRef, useCallback } from "react";
import moment from "moment";
import { toast } from "react-hot-toast";

import { backEndCallObj } from "../../services/mainServiceFile";
import { useNavigate } from 'react-router-dom';
import { useMovieContext } from "../comman/Context";
import { useFunctionContext } from "../comman/FunctionsContext";
import Joi from "joi"; // Import Joi
import { SearchInput } from "../comman/All-Inputs";

const UsersList = () => {
    const { usersList, textDisplay, limit, setSkip, setUsersList, } = useMovieContext();
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    // console.log(usersList, "first line");

    const observer = useRef();
    const [loading, setLoading] = useState(false);
    const [loadMore, setLoadMore] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [filterDisabled, setFilterDisabled] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [bkcoll, setbkcall] = useState(false)
    const [formData, setFormData] = useState({
        user_id: "",

    });


    const schema = Joi.object({
        user_id: Joi.string()
            .trim()
            .min(4).max(12).required().optional().label("Serch"),

    });

    const fetchData = async () => {
        // console.log(usersList, "entered fetch data")

        setLoading(true);
        try {
            setbkcall(false)
            const obj = { skip: usersList.length, limit };
            const response = await backEndCallObj("/admin/users_list", obj);

            if (response?.length === 0) {
                setLoadMore(true)
                toast.info("No more users to fetch.");
            } else {
                setUsersList(prevUsers => [...prevUsers, ...response]);
            }
        } catch (ex) {
            if (ex.response && ex.response?.status === 400) {
                toast.error(ex.response?.data);
            }
        } finally {
            setLoading(false);
        }
    };
    // console.log(usersList.length, "length------->");

    useEffect(() => {


        if (usersList.length == 0) {
            fetchData();

        }
    }, []);

    const handleRef = useCallback(
        (node) => {
            if (loadMore) return;
            if (loading) return;
            if (bkcoll) return


            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {

                    fetchData()
                }
            });

            if (node) observer.current.observe(node);
        },
    );
    const handleRefresh = async () => {
        if (isFetching) return;

        setIsFetching(true);
        try {
            await fetchData();
        } finally {
            setIsFetching(false);
        }
    };


    const userprofile = async (user_id) => {
        try {

            navigate("/userinfo", { state: { user_id } });
        } catch (error) {
            console.error("Error navigating to user info page:", error);
        }
    };

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
            const updatedUsersList = usersList.map(user => {
                if (user.user_id === selectedUser.user_id) {
                    return { ...user, user_active: obj.user_active };
                } else {
                    return user;
                }
            });
            setUsersList(updatedUsersList);
            setBtnDisabled(false)
            toast.success("User status toggled successfully.");
        } catch (error) {
            console.error("Error toggling user status:", error);
            toast.error("Failed to toggle user status. Please try again later.");
        } finally {
            closeConfirmModal();
            setBtnDisabled(false)
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            setLoading(true);

            // Validate formData against schema
            const { error } = schema.validate(formData);
            if (error) {
                toast.error(error.details[0].message)
                throw new Error(error.details[0].message);
            }

            const formDataToSend = {
                ...formData,
                user_id: formData.user_id.toUpperCase()
            };
            setbkcall(true)
            const response = await backEndCallObj("/admin/find_user", formDataToSend);

            // console.log(response, "responsedate");

            setUsersList(response);
            // setLoadMore(false);
            setFormData({
                user_id: "",

            })


            setLoading(false);
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                // setUsersList([]);
                toast.error(ex.response.data, "eroor");
                // console.log(ex.response.data, "error")
                // setLoading(false);
                // setbkcall(false)
            } else {
                console.error(ex);
            }
        }
    };


    const formattedDate = (date) => {
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
    };
    // console.log("jhfghjkhj")
    return (
        <div className="container-fluid">
            <h5 className="card-title m-0">All Users List</h5>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card shadow-none mt-0">
                        <div className="card-body scrolleHidden cursor-pointer" style={{ overflowY: "auto", height: "70vh" }}>
                            <div onClick={handleRefresh} disabled={isFetching}>
                                {isFetching ? (
                                    <div className="spinner-border text-primary" role="status" style={{ height: "20px", width: "20px" }}>

                                    </div>
                                ) : (
                                    <i className="ri-loop-right-line text-primary fs-22 cursor-pointer me-2"></i>
                                )}
                            </div>

                            <form onSubmit={handleSubmit} className='flex-fill'>
                                <div className="row mb-3 d-flex justify-content-end">
                                    <div className="col-12 col-xl-4 col-md-4 col-sm-12 mt-4">
                                        <SearchInput
                                            type="text"
                                            name="user_id"
                                            value={formData["user_id"]}
                                            placeholder="User Id or PhoneNumber"
                                            maxLength={20}
                                            SetForm={setFormData}
                                            schema={schema["user_id"]}
                                        />
                                    </div>
                                    <div className='col-12 col-xl-2 col-md-2 col-sm-12 my-auto'>
                                        <button
                                            type="submit"
                                            className="btn btn-primary mt-2"
                                        // disabled={filterDisabled || !(formData.start_date && formData.end_date || formData.id)}
                                        >
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </form>
                            <div className="table-responsive">
                                <table className="table table-bordered table-centered">
                                    <thead className="text-center">
                                        <tr className="table-head">
                                            <th scope="col">Date</th>
                                            <th scope="col">User Id</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Phone Number</th>
                                            <th scope="col">Credit Score</th>
                                            <th scope="col">User Status</th>
                                            <th scope="col">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-body text-center">
                                        {usersList?.map((user, index) => (
                                            <tr key={user?.user_id} ref={handleRef}>
                                                <td>{formattedDate(user.date_of_register)}</td>
                                                <td className="text-uppercase font-weight-bold underline-style text-primary cursor" onClick={() => userprofile(user.user_id)}>
                                                    {user.user_id}
                                                </td>
                                                <td>{user?.full_name && user.last_name == 0 ? "NA" : `${user?.full_name}`}</td>
                                                <td>{user?.phone_number}</td>
                                                <td>{user?.credit_score}</td>
                                                <td>{user?.user_active}</td>
                                                <td>
                                                    <button
                                                        className="btn primary"
                                                        onClick={() => openConfirmModal(user)}
                                                        style={{
                                                            width: "150px",
                                                            backgroundColor: user?.user_active === "Enable" ? "#28a745a8" : "rgb(240 110 32 / 76%)",
                                                        }}
                                                    >
                                                        {user?.user_active === "Enable" ? "Disable" : "Enable"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {usersList.length == 0 && !loading && (
                                    <div className="text-center mt-3 mb-3">There is no data to view</div>
                                )}
                            </div>
                            {loading && (
                                <div className="text-center mt-3">
                                    <div className="spinner-border spiner-border-sm" style={{ color: "blue" }} role="status">
                                        <span className="sr-only"></span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Confirm Modal */}
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
    );
};

export default UsersList;
