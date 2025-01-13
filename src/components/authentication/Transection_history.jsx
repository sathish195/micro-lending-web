
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from "react-hot-toast";
import { backEndCallObj } from '../../services/mainServiceFile';
import moment from 'moment';
import Joi from 'joi';
import { Date_Input, SearchInput } from '../comman/All-Inputs';
import { useMovieContext } from '../comman/Context';
import { useFunctionContext } from '../comman/FunctionsContext';
import authService from '../../services/authService';

function TransactionHistory() {
    const { transactionHistory, setTransactionHistory, limit, setSkip, } = useMovieContext();


    const [loading, setLoading] = useState(false);
    const [filterDisabled, setFilterDisabled] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [loadMore, setLoadMore] = useState(false);
    const [bkcoll, setbkcall] = useState(false)
    const observer = useRef();
    const { checkErrors } = useFunctionContext();

    const [formData, setFormData] = useState({
        start_date: "",
        end_date: "",
        id: ""
    });

    const schema = {
        start_date: Joi.date().allow('').optional(),
        end_date: Joi.date().allow('').optional(),
        id: Joi.string().min(4).max(12).required().allow('').optional()
    };

    const fetchData = async () => {
        setLoading(true);

        try {
            setbkcall(false)
            const obj = { skip: transactionHistory.length, limit };
            const response = await backEndCallObj('/users/transaction_history_all', obj);
            // console.log(response, "transections user")
            if (response?.length === 0) {
                setLoadMore(true);
                toast.info("No more users to fetch.");
            } else {
                setTransactionHistory(prevtransection => [...prevtransection, ...response]);

            }
        } catch (ex) {
            if (ex.response && ex.response?.status === 400) {
                toast.error(ex.response?.data);
            }
        } finally {
            setLoading(false);
        }
    };
    const fetchDataadmin = async () => {
        setLoading(true);
        try {
            setbkcall(false)
            const obj = { skip: transactionHistory.length, limit };
            const response = await backEndCallObj('/admin/transaction_history_all', obj);
            // console.log(response, "transections admin")
            if (response?.length === 0) {
                setLoadMore(true);
                toast.info("No more users to fetch.");
            } else {
                setTransactionHistory(prevtransection => [...prevtransection, ...response]);

            }
        } catch (ex) {
            if (ex.response && ex.response?.status === 400) {
                toast.error(ex.response?.data);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (transactionHistory.length == 0) {
            // console.log("hello")
            {
                authService.IsAdmin() ? fetchDataadmin() :
                    fetchData();
            }
        }
    }, []);

    // console.log(transactionHistory.length, "transection")


    //     (node) => {
    //         if (loadMore) return;
    //         if (loading) return;
    //         if (bkcoll) return
    //         console.log("handle ref")


    //         if (observer.current) observer.current.disconnect();

    //         observer.current = new IntersectionObserver((entries) => {
    //             if (entries[0].isIntersecting) {

    //                 if (transactionHistory.length !== 0) {
    //                     console.log("enter")
    //                     fetchData()
    //                 }
    //             }
    //         });

    //         if (node) observer.current.observe(node);
    //     },
    // );
    const handleRef = useCallback(
        (node) => {
            if (loadMore || loading || bkcoll) return; // Do not proceed if conditions are met

            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {

                    if (transactionHistory.length >= 10) {
                        // console.log("Intersection observed, fetching more data...");

                        {
                            authService.IsAdmin() ? fetchDataadmin() :
                                fetchData();
                        }


                    }
                }
            }, {
                threshold: 1 // Ensure fetchData is called when last row completely visible
            });

            if (node) observer.current.observe(node);

            return () => {
                if (observer.current) observer.current.disconnect();
            };
        },
        [loadMore, loading, bkcoll, transactionHistory.length] // Dependencies for useCallback
    );

    const handleRefresh = async () => {
        if (isFetching) return;
        setIsFetching(true);
        try {

            {
                authService.IsAdmin() ? await fetchDataadmin() :
                    await fetchData();
            }




        } finally {
            setIsFetching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (moment(formData.end_date).isBefore(formData.start_date)) {
            toast.error("End Date cannot be less than Start Date");
            return;
        }
        try {
            setFilterDisabled(true);
            setLoading(true);
            await checkErrors(schema, formData);
            const formDataToSend = { ...formData, id: formData.id.toUpperCase() };
            const response = await backEndCallObj("/users/transaction_filtered", formDataToSend);
            setTransactionHistory(response || []);
            setFormData({ start_date: "", end_date: "", id: "" });

        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                setTransactionHistory([]);
                toast.error(ex.response.data);
            }
        } finally {
            setFilterDisabled(false);
            setLoading(false);
        }
    };

    const formattedDate = (date) => moment(date).format('YYYY-MM-DD HH:mm:ss');
    const capitalizeFirstLetter = (string) => string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
    // console.log("kkkkk")
    return (
        <>
            <h5 className="mb-4">Transaction History</h5>
            <div className='card'>
                <div className="card-body">
                    <form onSubmit={handleSubmit} className='flex-fill'>
                        <div className='d-flex'>
                            <div onClick={handleRefresh} disabled={isFetching} className="mb-4 mb-sm-0">
                                {isFetching ? (
                                    <div className="spinner-border text-primary" role="status" style={{ height: "20px", width: "20px" }}></div>
                                ) : (
                                    <i className="ri-loop-right-line text-primary fs-22 cursor-pointer me-2"></i>
                                )}
                            </div>
                        </div>
                        <div className="row mb-3 d-flex justify-content-end">
                            <div className="col-6 col-xl-2 col-md-6 col-sm-6">
                                <label htmlFor="startDate" className="form-label">Start Date</label>
                                <Date_Input
                                    type="date"
                                    value={formData["start_date"]}
                                    name="start_date"
                                    SetForm={setFormData}
                                    schema={schema["start_date"]}
                                    max={moment().format("YYYY-MM-DD")}
                                    required
                                />
                            </div>
                            <div className="col-6 col-xl-2 col-md-6 col-sm-6">
                                <label htmlFor="endDate" className="form-label">End Date</label>
                                <Date_Input
                                    type="date"
                                    value={formData["end_date"]}
                                    name="end_date"
                                    SetForm={setFormData}
                                    schema={schema["end_date"]}
                                    max={moment().format("YYYY-MM-DD")}
                                    required
                                />
                            </div>
                            <div className="col-6 col-xl-2 col-md-6 col-sm-6 mt-auto">
                                <SearchInput
                                    type="text"
                                    name="id"
                                    value={formData["id"]}
                                    placeholder="Transaction id"
                                    SetForm={setFormData}
                                    schema={schema["id"]}
                                />
                            </div>
                            <div className='col-6 col-xl-2 col-md-6 col-sm-6 my-xl-auto'>
                                <button
                                    type="submit"
                                    className="btn btn-primary mt-1 mt-xl-2"
                                    disabled={filterDisabled || !(formData.start_date && formData.end_date || formData.id)}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="table-responsive">
                        <table className="table border table-bordered table-centered">
                            <thead>
                                <tr className="table-head text-center">
                                    <th scope="col">Date</th>
                                    <th scope="col">Transaction Id</th>
                                    <th scope="col">Loan Id</th>
                                    <th scope="col">Amount</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Comment</th>
                                    <th scope="col">Status</th>
                                </tr>
                            </thead>
                            <tbody className="table-body text-center">
                                {transactionHistory && transactionHistory.length > 0 && transactionHistory.map(history => (
                                    <tr key={history?.transaction_id} ref={handleRef}>
                                        <td>{formattedDate(history?.transactionDate)}</td>
                                        <td>{history?.transaction_id}</td>
                                        <td>{history?.loan_id}</td>
                                        <td>₱ {history?.amount}</td>
                                        <td>{capitalizeFirstLetter(history?.transactionType)}</td>
                                        <td>{history?.comment}</td>
                                        <td>{capitalizeFirstLetter(history?.transaction_status)}</td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                        {loading && (
                            <div className="d-flex justify-content-center align-items-center">
                                <div className="spinner-border spiner-border-sm" style={{ color: "blue" }} role="status">
                                    <span className="sr-only"></span>
                                </div>
                            </div>
                        )}
                        {transactionHistory?.length === 0 && !loading && (
                            <div className="d-flex justify-content-center align-items-center">
                                <div className="text-center">
                                    No transactions found.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default TransactionHistory;
