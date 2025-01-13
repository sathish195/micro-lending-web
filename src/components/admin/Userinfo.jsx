import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { backEndCallObj } from "../../services/mainServiceFile";
import { useMovieContext } from "../comman/Context";
import { toast } from "react-hot-toast";
import moment from 'moment';
import PenaltyModal from './PenaltyModal ';

// import React, { useState } from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import Loans from './../landingpage/Loans';
import { Button, Modal } from "react-bootstrap";
import { Input_text, Number_Input } from './../comman/All-Inputs';
// import Form from './../comman/Form';
import Joi from 'joi'
import Tab1 from "./Tab1";
import Tab2 from "./Tab2";
import Tab3 from "./Tab3";
import { log } from "joi-browser";
import TransactionHistory from './../authentication/Transection_history';


const Userinfo = () => {


    const {
        adminprofileData,
        setAdminprofileData,
        transactionHistoryuser,
        setTransactionHistoryuser,
        errorOccur,
        EmiHistoryuser,
        setEmiHistoryuser,
        setErrorOccur,
        setError,
        LoanListuser,
        setLoanListuser,
        limit,
    } = useMovieContext();

    const location = useLocation(); // Use the useLocation hook to access location state

    const [loadMore, setLoadMore] = useState(false);
    const [bkcoll, setbkcall] = useState(false)
    const observer = useRef();

    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [tabclicked, setTabClicked] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [btndisabled, setBtnDisabled] = useState(false)
    const [isFetching, setIsFetching] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        delayedAmount: "",
        note: "",

    })

    const schema = {
        delayedAmount: Joi.number()
            .required()
            .min(50)
            .messages({
                "number.base": "Delayed amount must be a number",
                "any.required": "Delayed amount is required",
                "number.min": "Delayed amount must be at least {#limit}"
            }),
        note: Joi.string()
            .min(10)
            .max(100)
            .required()
            .pattern(/^[A-Za-z]/)
            .messages({
                "string.base": "Note must be a string",
                "string.empty": "Note is required",
                "string.min": "Note must be at least {#limit} characters long",
                "string.max": "Note cannot be longer than {#limit} characters",
                "string.pattern.base": "Note must contain only letters"
            })

    }
    const fetchData = async () => {
        try {

            setLoading(true)

            const user_id = location.state.user_id;

            const response = await backEndCallObj("/admin/users_profile", { user_id });
            // console.log(response, "gffg")
            setAdminprofileData(response);
            setLoading(false);

        } catch (error) {
            console.error("Error fetching user profile:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTabTransection = useCallback(async () => {
        if (loading) return;

        setLoading(true);
        try {
            const user_id = location.state.user_id;
            const obj = { skip: transactionHistoryuser.length, limit, user_id };
            const response = await backEndCallObj('/admin/user_transaction_history', obj);
            if (response?.length === 0) {
                setLoadMore(false);
                toast.info("No more transactions to fetch.");
            } else {
                setTransactionHistoryuser(prev => [...prev, ...response]);
                setLoadMore(true);
            }
        } catch (ex) {
            console.error("Error fetching transaction history:", ex);
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data);
            }
        } finally {
            setLoading(false);
        }
    }, [transactionHistoryuser.length, loading]);

    const handleTabEMI = useCallback(async () => {
        if (loading) return;

        setLoading(true);
        try {
            const user_id = location.state.user_id;
            const obj = { skip: EmiHistoryuser.length, limit, user_id };
            const response = await backEndCallObj('/admin/user_emi_history', obj);
            if (response?.length === 0) {
                setLoadMore(false);
                toast.info("No more EMI to fetch.");
            } else {
                setEmiHistoryuser(prev => [...prev, ...response]);
                setLoadMore(true);
            }
        } catch (ex) {
            console.error("Error fetching EMI history:", ex);
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data);
            }
        } finally {
            setLoading(false);
        }
    }, [EmiHistoryuser.length, loading]);

    const handleTabLOAN = useCallback(async () => {
        setLoading(true);
        try {
            const user_id = location.state.user_id;
            const obj = { skip: LoanListuser.length, limit, user_id };
            const response = await backEndCallObj("/admin/individual_user_loan_details", obj);
            // console.log(response, "loanshello")
            if (response?.length === 0) {
                setLoadMore(false);
                toast.info("No more EMI to fetch.");
            } else {
                setLoanListuser(prev => [...prev, ...response]);
                setLoadMore(true);
            }
        } catch (ex) {
            console.error("Error fetching EMI history:", ex);
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data);
            }
        } finally {
            setLoading(false);
        }
    }, [LoanListuser.length, loading]);



    const handleTabClick = useCallback(
        (index) => {
            setActiveTab(index);
            switch (index) {
                case 0:
                    handleTabTransection();
                    break;
                case 1:
                    handleTabEMI();
                    break;
                case 2:
                    handleTabLOAN();
                    break;
                default:
                    break;
            }
        },
        [handleTabTransection, handleTabEMI, handleTabLOAN]
    );

    const formattedDate = (date) => {
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
    };




    const toggleZoom = () => {
        setIsZoomed(!isZoomed);
    };






    //     return today > nextDate;
    // };




    // const handleShowModal = ({ loan_id }) => {
    //     console.log(loan_id, "loanid")
    //     setFormData(loan_id)
    //     setShowModal(true);
    // };

    // const handleCloseModal = () => {
    //     setShowModal(false);
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setBtnDisabled(true);
    //     try {
    //         // await checkErrors(schema, formData);
    //         // console.log(errorOccur, "errors")
    //         // setLoading(true);
    //         const response = await backEndCallObj("/admin/add_penalty", { ...formData });
    //         setLoading(false);
    //         setErrorOccur(false);
    //         setFormData({
    //             delayedAmount: "",
    //             note: ""
    //         });
    //         handleCloseModal();
    //         toast.success("Penalty added successfully!");
    //     } catch (ex) {
    //         if (ex.response && ex.response.status === 400) {
    //             toast.error(ex.response.data);
    //         } else {
    //             toast.error("An unexpected error occurred.");
    //         }
    //     } finally {
    //         setLoading(false);
    //         setBtnDisabled(false);
    //     }
    // };
    function capitalizeFirstLetter(string) {
        if (!string) return "";
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <div className="user-details-container ">
            <h5 className="mb-4">User Profile</h5>
            <div className="row">
                <div className="col-xl-4">
                    <div className="card overflow-hidden">
                        <div className="px-3 profile_page d-flex align-items-center">
                            <div className="d-flex align-items-center">
                                <div className="position-relative">
                                    {adminprofileData?.photo && <img
                                        src={adminprofileData?.photo}

                                        alt="img"
                                        width={60}
                                        height={60}
                                        className="rounded-circle object-fit-cover"
                                    />}

                                </div>
                                <h5 className="mb-0 ms-3 text-white text-capitalize">

                                    {adminprofileData?.full_name == "0" ? "" : adminprofileData?.full_name}
                                </h5>
                            </div>

                            <span className="badge bg-success fs-12 ms-auto">
                                {adminprofileData?.user_status == "0" ? "NA" : adminprofileData?.user_status}
                            </span>
                        </div>
                        <div className="card-body">


                            <div className="my-3">
                                KYC Status:{" "}
                                <span
                                    className={`fs-18 bold ${adminprofileData?.kyc_status === "verified"
                                        ? "text-success"
                                        : adminprofileData?.kyc_status === "pending"
                                            ? "text-danger"
                                            : "text-muted"
                                        }`}
                                >
                                    {adminprofileData?.kyc_status === "0"
                                        ? "NA"
                                        : adminprofileData?.kyc_status === "verified"
                                            ? "Verified"
                                            : adminprofileData?.kyc_status === "pending"
                                                ? "Pending"
                                                : adminprofileData?.kyc_status}
                                </span>
                            </div>

                            <div className="mt-3">
                                <>
                                    <label className="form-label me-1">PhoneNumber :</label>
                                    <span className="text-capitalize">
                                        {adminprofileData?.phone_number === "0" ? "NA" : adminprofileData?.phone_number}
                                    </span>
                                </>
                            </div>
                            <div className="mt-3">
                                <>
                                    <label className="form-label me-1">Amount :</label>
                                    <span className="text-capitalize">
                                        {adminprofileData?.amount === "0" ? "NA" : adminprofileData?.amount}
                                    </span>
                                </>
                            </div>

                            <div className="mt-3">
                                <>
                                    <label className="form-label me-1">Bank Id
                                        :</label>
                                    <span className="text-capitalize">
                                        {adminprofileData?.bank_id
                                            === "0" ? "NA" : adminprofileData?.bank_id
                                        }
                                    </span>
                                </>
                            </div>
                            <div className="mt-3">
                                <>
                                    <label className="form-label me-1">Bank Code
                                        :</label>
                                    <span className="text-capitalize">
                                        {adminprofileData?.bank_code
                                            === "0" ? "NA" : adminprofileData?.bank_code
                                        }
                                    </span>
                                </>
                            </div>
                            <div className="mt-3">
                                <>
                                    <label className="form-label me-1">Email Id
                                        :</label>
                                    <span className="text-primary">
                                        {adminprofileData?.member_email
                                            === "0" ? "NA" : adminprofileData?.member_email
                                        }
                                    </span>
                                </>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-8">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-sm-flex justify-content-between align-items-center mb-3">
                                <h6 className="fs-18">Personal Information</h6>


                            </div>
                            <div className="row border rounded-3 p-2 py-3 row-sm mb-3">
                                <div className="col-12 ">
                                    <div>
                                        <label className="text-muted fw-normal form-label me-2">

                                            Full Name
                                        </label>
                                        <span className="text-capitalize">
                                            {adminprofileData?.full_name == "0" ? "NA" : capitalizeFirstLetter(adminprofileData?.full_name)}

                                        </span>
                                    </div>
                                </div>

                            </div>

                            <div className="row border rounded-3 p-2 py-3 row-sm mb-3">
                                <div className="col-12 col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                    <div>
                                        <label className="text-muted fw-normal form-label me-2">
                                            DOB :{" "}
                                        </label>
                                        <span className="text-capitalize">
                                            {" "}
                                            {adminprofileData?.dob == "0" ? "NA" : adminprofileData?.dob}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-12 col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                    <div>
                                        <label className="text-muted fw-normal form-label me-2">
                                            Gender :{" "}
                                        </label>
                                        <span className="text-capitalize">
                                            {" "}
                                            {adminprofileData?.gender == null ? "NA" : adminprofileData?.gender}
                                        </span>
                                    </div>
                                </div>
                            </div>


                            <div className="row border rounded-3 p-2 py-3 row-sm mb-3">

                                <div className="col-12 col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                    <div>
                                        <label className="text-muted fw-normal form-label me-2">
                                            Tin Number :
                                        </label>
                                        <span>{adminprofileData?.tin_number == "0" ? "NA" : adminprofileData?.tin_number}</span>
                                    </div>
                                </div>
                                <div className="col-12 col-xl-5 col-lg-6 col-md-6 col-sm-6">
                                    <div>
                                        <label className="text-muted fw-normal form-label me-2">
                                            Passport Number :
                                        </label>
                                        <span>{adminprofileData?.passport_number == "0" ? "NA" : adminprofileData?.passport_number}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="row border rounded-3 p-2 py-3 row-sm mb-3">

                                <div className="col-12 col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                    <div>
                                        <label className="text-muted fw-normal form-label me-2">
                                            Employement :
                                        </label>
                                        <span> {adminprofileData?.employment == null ? "NA" : adminprofileData.employment}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="row border rounded-3 p-2 py-3 row-sm mb-3">
                                <h6 className="mb-2 fs-17">Address Details</h6>
                                <div className="col-12 col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                    <div>
                                        <label className="text-muted fw-normal form-label me-2">
                                            Province :
                                        </label>
                                        <span>{adminprofileData?.residence?.province == 0 ? "NA" : capitalizeFirstLetter(adminprofileData?.residence?.province)}</span>
                                    </div>

                                    <div>
                                        <label className="text-muted fw-normal form-label me-2">
                                            Barangay :
                                        </label>
                                        <span>{adminprofileData?.residence?.barangay == 0 ? "NA" : capitalizeFirstLetter(adminprofileData?.residence?.barangay)}</span>
                                    </div>

                                </div>



                                <div className="col-12 col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                    <div>
                                        <label className="text-muted fw-normal form-label me-2">
                                            City :
                                        </label>
                                        <span>{adminprofileData?.residence?.city == 0 ? "NA" : capitalizeFirstLetter(adminprofileData?.residence?.city)}</span>
                                    </div>
                                    <div>
                                        <label className="text-muted fw-normal form-label me-2">
                                            Pincode :
                                        </label>
                                        <span>{adminprofileData?.residence?.pin_code == 0 ? "NA" : adminprofileData?.residence?.pin_code}</span>
                                    </div>
                                    <div>
                                        <label className="text-muted fw-normal form-label me-2">
                                            House No :
                                        </label>
                                        <span>{adminprofileData?.houseno == 0 ? "NA" : adminprofileData?.houseno}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



                <div className="container">
                    {/* <div className="row mb-3">


                        <div className="col-12 col-md-6 d-block d-sm-flex justify-content-md-start  gap-md-2 mt-2 mt-md-0
">
                            <div className={activeTab === 0 ? "tab active" : "tab"} onClick={() => handleTabTransection(0)}>
                                <button class="btn btn-primary w-100 mb-2 mb-4" disabled={btndisabled}>Transaction History</button>
                            </div>
                            <div className={activeTab === 1 ? "tab active" : "tab"} onClick={() => handleTabEMI(1)}>
                                <button class="btn btn-primary w-100 mb-2 mb-4" disabled={btndisabled}>EMI History</button>
                            </div>
                            <div className={activeTab === 2 ? "tab active" : "tab"} onClick={() => handleTabLOAN(2)}>
                                <button class="btn btn-primary w-100 mb-4" disabled={btndisabled}>Loan Details</button>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-6">

                        </div>
                    </div> */}
                    {/* {loading && (
                        <div className="text-center mt-3">
                            <div className="spinner-border spiner-border-sm" style={{ color: "blue" }} role="status">
                                <span className="sr-only"></span>
                            </div>
                        </div>
                    )} */}
                    <div className="row mb-3">
                        <Tabs selectedIndex={activeTab} onSelect={handleTabClick}>

                            <TabList>
                                <div className="col-12 col-md-6 d-block d-sm-flex justify-content-md-start  gap-md-2 mt-2 mt-md-0
">
                                    <Tab>

                                        <button className="btn btn-primary w-100 mb-2 mb-4" disabled={loading}>
                                            Transaction History
                                        </button>

                                    </Tab>
                                    <Tab>
                                        <button className="btn btn-primary w-100 mb-2 mb-4" disabled={loading}>
                                            EMI History
                                        </button>
                                    </Tab>
                                    <Tab>
                                        <button className="btn btn-primary w-100 mb-4" disabled={loading}>
                                            Loan Details
                                        </button>
                                    </Tab>
                                </div>
                            </TabList>

                            <TabPanel>
                                <Tab1
                                    transactionHistoryuser={transactionHistoryuser}
                                    handleTabTransection={handleTabTransection}
                                    loading={loading}
                                    loadMore={loadMore}
                                />
                            </TabPanel>
                            <TabPanel>
                                <Tab2
                                    EmiHistoryuser={EmiHistoryuser}
                                    handleTabEMI={handleTabEMI}
                                    loading={loading}
                                    loadMore={loadMore}
                                />
                            </TabPanel>
                            <TabPanel>
                                <Tab3 LoanListuser={LoanListuser}
                                    handleTabLOAN={handleTabLOAN}
                                    loading={loading}
                                    loadMore={loadMore} />
                            </TabPanel>
                        </Tabs>
                    </div>

                </div>

            </div>
        </div >
    );
};

export default Userinfo;
