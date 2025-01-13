
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Joi from 'joi-browser';
import moment from 'moment';
import { toast } from 'react-hot-toast';
import { Button, Modal } from 'react-bootstrap';
import { useMovieContext } from '../comman/Context';
import { backEndCallObj } from '../../services/mainServiceFile';
import { Date_Input, SearchInput } from '../comman/All-Inputs';
import { Navigate, useNavigate } from 'react-router-dom';
import { useFunctionContext } from '../comman/FunctionsContext';

function VerifyLoan() {
    const navigate = useNavigate();
    const { verifyloan, setVerifyloan, limit } = useMovieContext();
    const [showModel, setShowModel] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedLoanId, setSelectedLoanId] = useState(null);
    const [actionType, setActionType] = useState("");
    const [filterDisabled, setFilterDisabled] = useState(false);
    const [loadMore, setLoadMore] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const observer = useRef();

    const { checkErrors } = useFunctionContext();

    const [formData, setFormData] = useState({
        start_date: "",
        end_date: "",
        id: ""
    });

    const schema = {
        start_date: Joi.date().required().allow(""),
        end_date: Joi.date().required().allow(""),
        id: Joi.string().min(4).max(12).allow('').optional()
    };

    const fetchData = useCallback(async () => {
        if (loading || isFetching) return;

        setLoading(true);
        try {

            const obj = { skip: verifyloan[activeTab]?.length || 0, limit };
            const response = await backEndCallObj("/admin/loans_list", obj);

            if (response?.length === 0) {
                setLoadMore(false);
                toast.info("No more loans to fetch.");
            } else {
                setVerifyloan(prev => ({
                    ...prev,
                    [activeTab]: [...(prev[activeTab] || []), ...response]
                }));
                setLoadMore(true);
            }
        }

        catch (ex) {
            if (ex.response && ex.response?.status === 400) {
                toast.error(ex.response?.data);
            }
        } finally {
            setLoading(false);
            setBtnDisabled(false);
        }
    }, [activeTab, loading, verifyloan, limit]);

    const handleRef = useCallback(node => {
        if (loading || !loadMore) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                fetchData();
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, loadMore, fetchData]);

    useEffect(() => {
        if (!verifyloan[activeTab]?.length) {
            fetchData();
        }
    }, [activeTab]);

    const handleRejectLoan = (loan_id) => {
        setSelectedLoanId(loan_id);
        setActionType("reject");
        setShowModel(true);
    };

    const handleApproveLoan = (loan_id) => {
        setSelectedLoanId(loan_id);
        setActionType("approve");
        setShowModel(true);
    };

    const handleConfirm = async () => {
        setShowModel(false);
        setBtnDisabled(true);
        setLoading(true);

        try {
            if (selectedLoanId && actionType) {
                const loanStatus = actionType === "approve" ? "Approved" : "Rejected";
                const response = await backEndCallObj("/admin/loan_approvel", { loan_id: selectedLoanId, loan_status: loanStatus });
                // console.log(response.message, "response loalist")
                toast.success(response);

                // fetchData();
                // setVerifyloan(prev => ({
                //     ...prev,
                //     [activeTab]: prev[activeTab].map(loan =>
                //         loan.loan_id === selectedLoanId ? { ...loan, loan_status: loanStatus } : loan
                //     )
                // }));
                setVerifyloan(prev => ({
                    ...prev,
                    [activeTab]: prev[activeTab].map(loan => {
                        if (loan.loan_id === selectedLoanId) {
                            // console.log(`Updating loan_id: ${loan.loan_id} to status: ${loanStatus}`);
                            return { ...loan, loan_status: loanStatus };
                        }
                        return loan;
                    })
                }));
            }
        } catch (ex) {
            console.error("Error confirming action:", ex);
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data);
                fetchData();
            }
        } finally {
            setLoading(false);
            setBtnDisabled(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { error } = Joi.validate(formData, schema, { abortEarly: false });
        if (error) {
            const errorMessage = error.details.map(err => err.message).join("\n");
            toast.error(errorMessage);
            return;
        }

        try {
            setFilterDisabled(true);
            setLoading(true);
            const formDataToSend = {
                ...formData,
                id: formData.id.toUpperCase()
            };

            const response = await backEndCallObj("/admin/loan_search_filters", formDataToSend);
            // console.log(response, "response filterdata")
            setVerifyloan({ [activeTab]: response });  // Clear previous data and set new filtered data
            setFormData({
                start_date: "",
                end_date: "",
                id: ""
            });
            setLoadMore(false);
        } catch (ex) {
            console.error("Error filtering transactions:", ex);
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data);
            }
        } finally {
            setFilterDisabled(false);
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        if (isFetching) return;
        setIsFetching(true);
        try {
            await fetchData();
        } finally {
            setIsFetching(false);
        }
    };

    const handleTabClick = async (index, loan_status) => {
        setActiveTab(index);

        try {
            if (isFetching) return;
            setBtnDisabled(true);
            setIsFetching(true);
            setLoading(true);

            if (!verifyloan[loan_status]) {
                const response = await backEndCallObj("/admin/loan_filters", { loan_status });
                // console.log(response, "filterd data")
                setVerifyloan(prev => ({ ...prev, [index]: response || [] }));
            }
            setBtnDisabled(false);
        } catch (ex) {
            console.error("Error filtering transactions:", ex);
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data);
            }
        } finally {
            setIsFetching(false);
            setLoading(false);
            setBtnDisabled(false);
        }
    };

    const formattedDate = (date) => {
        return date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '';
    };

    const userprofile = async (user_id) => {
        try {
            navigate("/userinfo", { state: { user_id } });
        } catch (error) {
            console.error("Error navigating to user info page:", error);
        }
    };

    return (
        <div className="user-details-container">
            <h5 className="mb-4">Loan Applications</h5>
            <div className='card'>
                <div className='card-body scrolleHidden' style={{ overflowY: "auto", height: "70vh" }}>
                    <div onClick={handleRefresh} disabled={isFetching} className="mb-4 mb-sm-0">
                        {isFetching ? (
                            <div className="spinner-border text-primary" role="status" style={{ height: "20px", width: "20px" }}></div>
                        ) : (
                            <i className="ri-loop-right-line text-primary fs-22 cursor-pointer me-2"></i>
                        )}
                    </div>
                    <form onSubmit={handleSubmit} className='flex-fill'>
                        <div className="row mb-3 d-flex justify-content-end">
                            <div className="col-12 col-xl-2 col-md-2 col-sm-12">
                                <label htmlFor="startDate" className="form-label">Start Date</label>
                                <Date_Input
                                    type={"date"}
                                    value={formData["start_date"]}
                                    name={"start_date"}
                                    SetForm={setFormData}
                                    schema={schema["start_date"]}
                                    max={moment().format("YYYY-MM-DD")}
                                    required
                                />
                            </div>
                            <div className="col-12 col-xl-2 col-md-2 col-sm-12">
                                <label htmlFor="endtDate" className="form-label">End Date</label>
                                <Date_Input
                                    type={"date"}
                                    value={formData["end_date"]}
                                    name={"end_date"}
                                    SetForm={setFormData}
                                    schema={schema["end_date"]}
                                    max={moment().format("YYYY-MM-DD")}
                                    required
                                />
                            </div>
                            <div className="col-12 col-xl-2 col-md-2 col-sm-12 mt-auto">
                                <SearchInput
                                    type="text"
                                    name="id"
                                    value={formData["id"]}
                                    placeholder="Loan id "
                                    SetForm={setFormData}
                                    schema={schema["id"]}
                                />
                            </div>
                            <div className='col-12 col-xl-2 col-md-2 col-sm-12 my-auto'>
                                <button
                                    type="submit"
                                    className="btn btn-primary mt-2"
                                    disabled={filterDisabled || !(formData.start_date && formData.end_date || formData.id)}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </form>
                    <span className="tabs d-flex ">
                        <div className={activeTab === 0 ? "tab active" : "tab"} onClick={() => handleTabClick(0, "Processing")}><button className='btn btn-primary me-2 mb-3' disabled={btnDisabled}>Processing</button></div>
                        <div className={activeTab === 1 ? "tab active" : "tab"} onClick={() => handleTabClick(1, "Approved")}><button className='btn btn-success me-2 mb-3' disabled={btnDisabled}>Approved</button></div>
                        <div className={activeTab === 2 ? "tab active" : "tab"} onClick={() => handleTabClick(2, "Rejected")}><button className='btn btn-danger me-2 mb-3' disabled={btnDisabled}>Rejected</button></div>
                    </span>
                    <div className="table-responsive">
                        <table className="table border table-bordered table-centered">
                            <thead>
                                <tr className="table-head text-center align-middle">
                                    <th>Date</th>
                                    <th>Loan ID</th>
                                    <th>User ID</th>
                                    <th>Phone Number</th>
                                    <th>Loan Amount</th>
                                    <th>Months</th>
                                    <th>Loan Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody className="table-body align-middle text-center">
                                {verifyloan[activeTab]?.map((loan, index) => (
                                    <tr key={loan.id} ref={index === verifyloan[activeTab].length - 1 ? handleRef : null}>
                                        <td>{loan.date_of_applycation ? formattedDate(loan.date_of_applycation) : ''}</td>
                                        <td>{loan.loan_id}</td>
                                        <td className="text-uppercase font-weight-bold underline-style text-primary cursor" onClick={() => userprofile(loan.user_id)}>
                                            {loan.user_id}
                                        </td>
                                        <td>{loan.phone_number}</td>
                                        <td>₱ {loan.loan_amount}</td>
                                        <td>{loan.months}</td>
                                        <td>
                                            <div className={`loan_status ${loan.loan_status === "completed"
                                                ? "bg-success  fw-bold"
                                                : loan.loan_status === "Processing"
                                                    ? "bg-warning fw-bold"
                                                    : loan.loan_status === "Rejected"
                                                        ? "bg-secondary fw-bold"
                                                        : loan.loan_status === "Cancelled"
                                                            ? "bg-danger fw-bold"
                                                            : loan.loan_status === "Approved"
                                                                ? "bg-info fw-bold"
                                                                : "bg-dark fw-bold"
                                                }`}>
                                                {loan.loan_status}
                                            </div>
                                        </td>
                                        <td>
                                            {loan.loan_status === "Processing" ? (
                                                <>
                                                    <Button variant="success" onClick={() => handleApproveLoan(loan.loan_id)} disabled={btnDisabled} className='me-1 mb-1'>Approve</Button>
                                                    <Button variant="danger" onClick={() => handleRejectLoan(loan.loan_id)} disabled={btnDisabled}>Reject</Button>
                                                </>
                                            ) : loan.loan_status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {verifyloan[0] == 0 && <p className='text-center'>there is no data found</p>}
                    {loading && (
                        <div className="text-center mt-3">
                            <div className="spinner-border spiner-border-sm" style={{ color: "blue" }} role="status">
                                <span className="sr-only"></span>
                            </div>
                        </div>
                    )}




                </div>
            </div>
            {showModel && (
                <Modal show={showModel} onHide={() => setShowModel(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Action</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to perform this action?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModel(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleConfirm} disabled={btnDisabled}>Confirm</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}

export default VerifyLoan;
