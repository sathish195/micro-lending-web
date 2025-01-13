import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { backEndCall, backEndCallFile, backEndCall_forFile } from "../../services/mainServiceFile";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import toast from 'react-hot-toast';
import Recenttransections from "../authentication/Resenttransections";
import { useMovieContext } from "../comman/Context";


import axios from "axios";

import { helpers } from 'crypto-js';
// axios.defaults.headers.common["x-auth-token"] = localStorage.getItem("token");

const Admindashbord = () => {
    const { loanList, setLoanList, userData, setUserData, adminData, setAdminData, userprofileData, setUserprofileData, } = useMovieContext();
    // console.log(loanList?.[0].emi_detals?.nextEMIDate, "emi date");

    // console.log(loanList, "loanes");

    const [downloadExcelDis, setDownloadExcelDis] = useState(false);
    // const apiUrl = process.env.REACT_APP_API_URL;
    const [selectedTab, setSelectedTab] = useState(false);


    const { usereligibility, setUserEligibility, } = useMovieContext()
    const [loading, setLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(false);
    const [bkcall, setbkcall] = useState(false);
    const [downloads, setDownloads] = useState("");
    const [btndisabled, setBtnDisabled] = useState(false)
    const navigate = useNavigate();







    const fetchAdminData = async () => {
        // console.log("entered into admindata", adminData)

        try {

            // if (adminData <= 0 || !adminData) {
            const response = await backEndCall("/admin/admin_mis_stats");
            console.log(response, "adminstats")
            setAdminData(response);

            // }
            // else {
            //   setAdminData(adminData)
            // }
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data);

            }
        }
    };


    const fetchloanData = async () => {
        // console.log(userprofileData);

        try {
            if (!loanList) {

                const response = await backEndCall("/users/user_loan_details");
                // console.log(response, "loan details");
                setLoanList(response);

            }
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data);


            }
        }
    };

    useEffect(() => {



        if (adminData <= 0 || !adminData) {

            authService.IsAdmin() &&
                fetchAdminData()

        }
        if (!loanList || loanList.length === 0) {
            fetchloanData();
        }
    }, []);
    useEffect(() => {
        if (!authService.getCurrentUser()) {
            Navigate("/landing");
        }
    });

    const handlerefresh = async () => {
        // console.log("reload");
        if (isFetching) return; // Prevent multiple calls if already fetching

        setIsFetching(true); // Set fetching state to true

        try {


            if (authService.IsAdmin()) {

                setAdminData(null);
                await fetchAdminData();
            }


        } catch (error) {
            console.error("Error while fetching data:", error);
        } finally {
            setIsFetching(false); // Reset fetching state regardless of success or failure
        }
    };
    useEffect(() => {
        if (usereligibility <= 0 || !usereligibility) {
            fetchDatadashbord();
        }
    }, []);

    const fetchDatadashbord = async () => {

        try {
            setLoading(true)
            const response = await backEndCall("/users/matching_eligibility");

            setUserEligibility(response);
            setLoading(false)
        }

        catch (ex) {
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data);

            }

        }
    };


    const currentDate = new Date();


    const month = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();
    function formatDate(dateString) {
        if (!dateString) return '';

        const date = new Date(dateString);
        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        return formattedDate;
    }





    const navigateuser = () => {
        navigate("/userlist")
    }
    const navigateloans = () => {
        navigate("/verifyloan")
    }

    // const downloadExcel = () => {
    //     setDownloadExcelDis(true);

    //     axios.post(`${apiUrl}/admin/loans_data_excel_download`, {
    //         responseType: 'blob',
    //     })
    //         .then((response) => {
    //             const url = window.URL.createObjectURL(new Blob([response.data]));
    //             const a = document.createElement('a');
    //             a.href = url;
    //             a.download = 'data.xlsx';
    //             document.body.appendChild(a);
    //             a.click();
    //             document.body.removeChild(a);
    //             window.URL.revokeObjectURL(url);
    //             setDownloadExcelDis(false);
    //         })
    //         .catch(error => {
    //             console.error('Error downloading file:', error);
    //             setDownloadExcelDis(false);
    //             // Optionally, handle error feedback to the user (e.g., display error message)
    //         });
    // };

    const downladExale = async () => {
        console.log("enter")
        try {
            setbkcall(true);
            console.log("enter");

            const response = await backEndCall("/admin/loans_data_excel_download",
                { /* request body */ },
                {
                    responseType: "blob",
                    headers: {
                        "Content - Type": "application / json",
                        "Access - Control - Expose - Headers": "Content - Disposition"
                    }
                }
            );
            setbkcall(false);
            // Create a Blob object from the response data
            const blob = new Blob([response.data], { type: "application/ vnd.openxmlformats - officedocument.spreadsheetml.sheet" });
            // Create a download link for the Blob
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "loans.xlsx"); // Ensure the file name matches the one set in Content-Disposition
            document.body.appendChild(link);
            link.click();
            console.log("final");
        } catch (error) {
            console.error("Error downloading file:", error);
            // Handle error if necessary
        }
    };
    return (
        <>


            <div className="d-sm-flex d-block align-items-center justify-content-between mb-4">
                <div>
                    <h4 className="mb-2 mb-sm-0">Dashboard  </h4>

                </div>






                <button
                    className="btn btn-primary text-capitalize"
                    onClick={downladExale}
                    disabled={downloadExcelDis}
                >
                    {downloadExcelDis ? 'Downloading...' : 'Download'}
                </button>

            </div >
            {
                authService.IsAdmin() && (<><div className="row">
                    <div className="col-xl-8">
                        <div className="card">
                            <div className="card-header border-bottom-0 justify-content-between">
                                <div className="card-title">
                                    Your Micro lending Portfolio{" "}
                                    <i className="ri-information-fill fs-13 text-muted"></i>{" "}
                                    <span className="text-muted fs-12 fw-medium">
                                        {/* As on Feb 2024 */}
                                        As on {month} {year}
                                    </span>
                                </div>

                                <div onClick={handlerefresh} disabled={isFetching} className="cursor-pointer">
                                    {isFetching ? (
                                        <div className="spinner-border text-primary" role="status" style={{ height: "20px", width: "20px" }}>

                                        </div>
                                    ) : (
                                        <i className="ri-loop-right-line text-primary fs-22 cursor-pointer me-2"></i>
                                    )}
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row mb-4">

                                    <div className="col-xl-3 col-sm-12 col-lg-3 col-md-3 d-flex">
                                        <div className="bg-primary text-white mb-3 mb-md-0 p-3 rounded-2 flex-fill">
                                            <div className="d-flex justify-content-between mt-2 align-items-center">
                                                <p className="mb-0 fs-12">Total Users</p>
                                                <span className="dashboard-icons">
                                                    <i className="ri-luggage-deposit-line p-2 rounded-circle bg-white-light fs-24"></i>
                                                </span>
                                            </div>

                                            <p className="mb-0 fw-semibold mt-3 fs-18">
                                                <span onClick={navigateuser} className="cursor-pointer"> {adminData?.totalUsers || "0"}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-xl-3 col-sm-12 col-lg-3 col-md-3 d-flex">
                                        <div className="bg-primary text-white mb-3 mb-md-0 p-3 rounded-2 flex-fill">
                                            <div className="d-flex justify-content-between mt-2 align-items-center">
                                                <p className="mb-0 fs-12">Processing Loans</p>
                                                <span className="dashboard-icons">
                                                    <i className="ri-wallet-3-line p-2 rounded-circle bg-white-light fs-24"></i>
                                                </span>
                                            </div>
                                            <p className="mb-0 fw-semibold mt-3 fs-18">
                                                <span onClick={navigateloans} className="cursor-pointer">  {adminData?.loanApplications?.pending || "0"}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-xl-3 col-sm-12 col-lg-3 col-md-3 d-flex">
                                        <div className="bg-primary text-white mb-3 mb-md-0 p-3 rounded-2 flex-fill">
                                            <div className="d-flex justify-content-between mt-2 align-items-center">
                                                <p className="mb-0 fs-12"> Rejected Loans</p>
                                                <span className="dashboard-icons">
                                                    <i className="ri-database-2-line p-2 rounded-circle bg-white-light fs-24"></i>
                                                </span>
                                            </div>
                                            <p className="mb-0 fw-semibold mt-3 fs-18">
                                                <span onClick={navigateloans} className="cursor-pointer">{adminData?.loanApplications?.rejected || "0"}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-xl-3 col-sm-12 col-lg-3 col-md-3 d-flex">
                                        <div className="bg-primary text-white mb-3 mb-md-0 p-3 rounded-2 flex-fill">
                                            <div className="d-flex justify-content-between mt-2 align-items-center">
                                                <p className="mb-0 fs-12"> Approved Loans</p>
                                                <span className="dashboard-icons">
                                                    <i className="ri-database-2-line p-2 rounded-circle bg-white-light fs-24"></i>
                                                </span>
                                            </div>
                                            <p className="mb-0 fw-semibold mt-3 fs-18">
                                                <span onClick={navigateloans} className="cursor-pointer"> {adminData?.loanApplications?.approved || "0"} </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">

                                    <div className="col-xl-3 col-sm-12 col-lg-3 col-md-3 d-flex">
                                        <div className="bg-primary text-white mb-3 mb-md-0 p-3 rounded-2 flex-fill">
                                            <div className="d-flex justify-content-between mt-2 align-items-center">
                                                <p className="mb-0 fs-12">Total Loans</p>
                                                <span className="dashboard-icons">
                                                    <i className="ri-luggage-deposit-line p-2 rounded-circle bg-white-light fs-24"></i>
                                                </span>
                                            </div>

                                            <p className="mb-0 fw-semibold mt-3 fs-18">
                                                <span onClick={navigateuser} className="cursor-pointer"> {adminData?.loanApplications?.total || "0"}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-xl-3 col-sm-12 col-lg-3 col-md-3 d-flex">
                                        <div className="bg-primary text-white mb-3 mb-md-0 p-3 rounded-2 flex-fill">
                                            <div className="d-flex justify-content-between mt-2 align-items-center">
                                                <p className="mb-0 fs-12">Completed Loans</p>
                                                <span className="dashboard-icons">
                                                    <i className="ri-wallet-3-line p-2 rounded-circle bg-white-light fs-24"></i>
                                                </span>
                                            </div>
                                            <p className="mb-0 fw-semibold mt-3 fs-18">
                                                <span onClick={navigateloans} className="cursor-pointer">  {adminData?.loanApplications?.completed || "0"}</span>
                                            </p>
                                        </div>
                                    </div>
                                    {/* <div className="col-xl-3 col-sm-12 col-lg-3 col-md-3 d-flex">
                                        <div className="bg-primary text-white mb-3 mb-md-0 p-3 rounded-2 flex-fill">
                                            <div className="d-flex justify-content-between mt-2 align-items-center">
                                                <p className="mb-0 fs-12">   Reduced Loan Amount
                                                </p>
                                                <span className="dashboard-icons">
                                                    <i className="ri-database-2-line p-2 rounded-circle bg-white-light fs-24"></i>
                                                </span>
                                            </div>
                                            <p className="mb-0 fw-semibold mt-3 fs-18">
                                                <span onClick={navigateloans} className="cursor-pointer">{adminData?.loansAmount?.lose || "0"}</span>
                                            </p>
                                        </div>
                                    </div> */}

                                    <div className="col-xl-3 col-sm-12 col-lg-3 col-md-3 d-flex">
                                        <div className="bg-primary text-white mb-3 mb-md-0 p-3 rounded-2 flex-fill">
                                            <div className="d-flex justify-content-between mt-2 align-items-center">
                                                <p className="mb-0 fs-12">Loan Amount Profit                                               </p>
                                                <span className="dashboard-icons">
                                                    <i className="ri-database-2-line p-2 rounded-circle bg-white-light fs-24"></i>
                                                </span>
                                            </div>
                                            <p className="mb-0 fw-semibold mt-3 fs-18">
                                                <span onClick={navigateloans} className="cursor-pointer"> {adminData?.loansAmount?.profit || "0"} </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="row">
                            <div className="col-xl-6">
                                <div className="card micro-balance">
                                    <div className="card-header border-bottom-0 justify-content-between">
                                        <div className="card-title">
                                            Micro Wallet Balance{" "}
                                            <i className="ri-information-fill fs-13"></i>
                                        </div>
                                        <Link to="/" className="text-white">
                                            <i className="ri-arrow-right-s-line fs-22"></i>
                                        </Link>
                                    </div>
                                    <div className="card-body">
                                        <h4 className="fw-semibold mb-4">
                                            <span>₱ </span> {userprofileData?.amount || "0"}
                                        </h4>
                                        {/* <div className="availabel-balance">
                      <span className="fs-12">Available Balance</span>
                      <p className="mb-0 fw-semibold mt-2 fs-16">
                        <span>₱ </span>{userprofileData?.amount || "0"}
                      </p>
                    </div> */}
                                        <div className="d-grid mt-4">
                                            <button type="button" className="btn btn-primary">
                                                Add Funds
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header pb-0 border-bottom-0 justify-content-between">
                                        <p className=" fs-13 mb-0">
                                            Extended Internal Rate of Return{" "}
                                            <i className="ri-information-fill fs-13 text-muted"></i>
                                        </p>
                                        <Link to="/">
                                            <i className="ri-loop-right-line text-primary fs-16"></i>
                                        </Link>
                                    </div>
                                    <div className="card-body">
                                        <span className="text-muted fs-11 fw-medium">
                                            As on Feb 2024 - 10:00AM
                                        </span>
                                        <h2 className="mb-0 fw-semibold mt-3">&#8377; 0</h2>
                                        <div className="d-flex justify-content-between mb-4">
                                            <Link to="/" className="text-primary fs-11 mt-auto">
                                                <i className="ri-mail-send-line"></i> Requet XIRR Report
                                            </Link>
                                            <div className="dashboard-icons">
                                                <i className="ri-line-chart-line p-3 rounded-circle bg-primary-light fs-22"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="col-xl-6">
                                <div className="card">
                                    <div className="card-header border-bottom-0 justify-content-between">
                                        <div className="card-title">Total Investments</div>
                                        <Link to="/" className="text-primary">
                                            <i className="ri-arrow-right-s-line fs-22"></i>
                                        </Link>
                                    </div>
                                    <div className="card-body">
                                        <ul className="list-group list-unstled">
                                            <li className="list-group-item mb-2 p-0">
                                                <div className="p-3 card-item border rounded-2">
                                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                                        <div className="fs-16">
                                                            <i className="ri-shield-check-line p-2 bg-success rounded-circle me-2"></i>
                                                            <span>6 months</span>
                                                        </div>
                                                        <div className="dropdown">
                                                            <span
                                                                data-bs-auto-close="outside"
                                                                role="button"
                                                                data-bs-toggle="dropdown"
                                                                aria-expanded="false"
                                                            >
                                                                <i className="ri-more-2-line"></i>
                                                            </span>
                                                            <ul className="dropdown-menu">
                                                                <li>
                                                                    <Link className="dropdown-item" href="#">
                                                                        Edit
                                                                    </Link>
                                                                </li>
                                                                <li>
                                                                    <Link className="dropdown-item" href="#">
                                                                        View all
                                                                    </Link>
                                                                </li>
                                                                <li>
                                                                    <Link className="dropdown-item" href="#">
                                                                        Cancel
                                                                    </Link>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="fs-14">
                                                            <i className="ri-bar-chart-2-line text-success"></i>{" "}
                                                            <span>15%</span>
                                                        </div>
                                                        <div className="fs-14">
                                                            <i className="ri-calendar-check-line text-info"></i>{" "}
                                                            <span>6 months</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="list-group-item mb-2 p-0">
                                                <div className="p-3 card-item border rounded-2">
                                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                                        <div className="fs-16">
                                                            <i className="ri-shield-check-line p-2 bg-success rounded-circle me-2"></i>
                                                            <span>12 months</span>
                                                        </div>
                                                        <div className="dropdown">
                                                            <span
                                                                data-bs-auto-close="outside"
                                                                role="button"
                                                                data-bs-toggle="dropdown"
                                                                aria-expanded="false"
                                                            >
                                                                <i className="ri-more-2-line"></i>
                                                            </span>
                                                            <ul className="dropdown-menu">
                                                                <li>
                                                                    <Link className="dropdown-item" href="#">
                                                                        Edit
                                                                    </Link>
                                                                </li>
                                                                <li>
                                                                    <Link className="dropdown-item" href="#">
                                                                        View all
                                                                    </Link>
                                                                </li>
                                                                <li>
                                                                    <Link className="dropdown-item" href="#">
                                                                        Cancel
                                                                    </Link>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="fs-14">
                                                            <i className="ri-bar-chart-2-line text-success"></i>{" "}
                                                            <span>11%</span>
                                                        </div>
                                                        <div className="fs-14">
                                                            <i className="ri-calendar-check-line text-info"></i>{" "}
                                                            <span>12 months</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="list-group-item p-0">
                                                <div className="p-3 card-item border rounded-2">
                                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                                        <div className="fs-16">
                                                            <i className="ri-shield-check-line p-2 bg-success rounded-circle me-2"></i>
                                                            <span>24 months</span>
                                                        </div>
                                                        <div className="dropdown">
                                                            <span
                                                                data-bs-auto-close="outside"
                                                                role="button"
                                                                data-bs-toggle="dropdown"
                                                                aria-expanded="false"
                                                            >
                                                                <i className="ri-more-2-line"></i>
                                                            </span>
                                                            <ul className="dropdown-menu">
                                                                <li>
                                                                    <Link className="dropdown-item" href="#">
                                                                        Edit
                                                                    </Link>
                                                                </li>
                                                                <li>
                                                                    <Link className="dropdown-item" href="#">
                                                                        View all
                                                                    </Link>
                                                                </li>
                                                                <li>
                                                                    <Link className="dropdown-item" href="#">
                                                                        Cancel
                                                                    </Link>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="fs-14">
                                                            <i className="ri-bar-chart-2-line text-success"></i>{" "}
                                                            <span>05%</span>
                                                        </div>
                                                        <div className="fs-14">
                                                            <i className="ri-calendar-check-line text-info"></i>{" "}
                                                            <span>24 months</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 ">
                        <div className="card bg-secondary">
                            <div className="card-header pb-0 border-bottom-0 justify-content-between">
                                <div className="fs-15">
                                    <i className="ri-discount-percent-fill"></i> Introducing{" "}
                                    <Link to="/" className="text-warning fw-bold">
                                        <span>Loan Amount  Including Interest</span> and <span>Loan Amount  Excluding Interest</span>
                                    </Link>{" "}
                                    by Micro Lending
                                </div>
                                <Link to="/" className="text-white">
                                    <i className="ri-arrow-right-s-line fs-22"></i>
                                </Link>
                            </div>
                            <div className="card-body">
                                <div className="row mt-3">
                                    <div className="col-4">
                                        <div className="p-2 bg-white-light">
                                            {/* <p className="mb-0 fs-12">Paid Amount With Interest</p> */}
                                            <p className="mb-0 fs-12">Total received Amount, Including Interest</p>
                                            <span className="fs-11 fw-500">
                                                <i className="ri-check-double-line text-success"></i>{adminData?.loansAmount?.paidAmountWithInterest || "0"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="p-2 bg-white-light">
                                            {/* <p className="mb-0 fs-12">Paid Amount Without Interest</p> */}
                                            <p className="mb-0 fs-12">Total received  Amount, Excluding Interest</p>

                                            <span className="fs-11 fw-500">
                                                <i className="ri-check-double-line text-success"></i> {adminData?.loansAmount?.paidAmountWithoutInterest || "0"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="p-2 bg-white-light">
                                            <p className="mb-0 fs-12">Pending Amount  Including Interest</p>
                                            <span className="fs-11 fw-500">
                                                <i className="ri-check-double-line text-success"></i> {adminData?.loansAmount?.pendingAmountWithInterest || "0"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-4">
                                        <div className="p-2 bg-white-light">
                                            <p className="mb-0 fs-12">Pending Amount  Excluding Interest</p>
                                            <span className="fs-11 fw-500">
                                                <i className="ri-check-double-line text-success"></i>  {adminData?.loansAmount?.pendingAmountWithoutInterest || "0"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="p-2 bg-white-light">
                                            <p className="mb-0 fs-12">Total Amount  Including Interest</p>
                                            <span className="fs-11 fw-500">
                                                <i className="ri-check-double-line text-success"></i>  {adminData?.loansAmount?.totalAmountWithInterest || "0"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="p-2 bg-white-light">
                                            <p className="mb-0 fs-12">Total Amount  Excluding Interest</p>
                                            <span className="fs-11 fw-500">
                                                <i className="ri-check-double-line text-success"></i>  {adminData?.loansAmount?.totalAmountWithoutInterest || "0"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header pb-0 border-bottom-0 justify-content-between">
                                <div className="card-title">Refer and Earn</div>
                                <Link to="/" className="text-primary">
                                    <i className="ri-arrow-right-s-line fs-22"></i>
                                </Link>
                            </div>
                            <div className="card-body">
                                <span className="fs-12 fw-500">
                                    Earn more than ₹30,000 by referring your friends to Micro
                                    lending
                                </span>
                                <div className="p-3 bg-light mt-3 mb-2">
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <Link to="/" className="text-success">
                                                <i className="ri-whatsapp-fill" title="whatsapp"></i>
                                            </Link>
                                        </span>
                                        <span className="input-group-text" title="copied">
                                            <Link to="/">
                                                <i className="ri-file-copy-line"></i>
                                            </Link>
                                        </span>
                                        <p className="mb-0 border flex-fill d-inline-flex mx-auto justify-content-center text-center align-items-center">
                                            568G1E
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    to="/"
                                    className="text-primary fs-11 fw-500 text-decoration-underline"
                                >
                                    T&C apply
                                </Link>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header pb-0 border-bottom-0 justify-content-between">
                                <div className="card-title">Wealth Assistant</div>
                            </div>
                            <div className="card-body">
                                <div className="p-2 bg-light">
                                    <div className="d-flex align-items-center">
                                        <img
                                            src="assets/images/users/4.png"
                                            width="50"
                                            className="me-3"
                                            alt="user"
                                        />
                                        <div className="flex-grow-1 lh-1">
                                            <p className="mb-1 mt-2">{userData?.username}</p>
                                            <Link to="/" className="text-default-color fs-14">
                                                {userData?.phone_number}
                                                <i className="ri-twitter-fill text-primary"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>


                    <div className="row">
                        <div className="col-xl-12 col-xl-12 col-lg-12 col-sm-12 col-md-12">
                            <div className="card ">
                                <div className="card-body">
                                    <Recenttransections />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
                )
            }
        </>
    );
};

export default Admindashbord;
