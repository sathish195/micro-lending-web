
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from "react-hot-toast";
import { backEndCall, backEndCallObj } from '../../services/mainServiceFile';
import { useMovieContext } from '../comman/Context';
import moment from 'moment';
// import Joi from 'joi-browser';
import Joi from 'joi';

import { Date_Input, SearchInput } from '../comman/All-Inputs';
import { Link } from 'react-router-dom';
import { useFunctionContext } from '../comman/FunctionsContext';
import authService from '../../services/authService';

function EmiHistory() {
    const { EmiHistory, setEmiHistory, limit } = useMovieContext();
    const [loadMore, setLoadMore] = useState(false);
    const observer = useRef();
    const { checkErrors } = useFunctionContext()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null)
    const [filterDisabled, setFilterDisabled] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [btndisabled, setBtnDisabled] = useState(false)
    const [bkcoll, setbkcall] = useState(false)
    const [formData, setFormData] = useState({
        start_date: "",
        end_date: "",
        id: ""
    });


    const schema = {
        start_date: Joi.date().allow('').optional(),
        end_date: Joi.date().allow('').optional(),
        id: Joi.string().min(4).max(13).required().allow('').optional()
    };


    const fetchEmiHistory = async () => {
        setLoading(true);

        try {
            setbkcall(false)
            const obj = { skip: EmiHistory.length, limit };
            const response = await backEndCallObj('/emi/emi_history', obj);
            // console.log(response, "emi user")
            if (response?.length === 0) {
                setLoadMore(true);
                toast.info("No more users to fetch.");
            } else {
                setEmiHistory(prevEmiHistory => [...prevEmiHistory, ...response]);

            }
        } catch (ex) {
            if (ex.response && ex.response?.status === 400) {
                toast.error(ex.response?.data);
            }
        } finally {
            setLoading(false);
        }
    };
    const fetchEmiHistoryadmin = async () => {
        setLoading(true);

        try {
            setbkcall(false)
            const obj = { skip: EmiHistory.length, limit };
            const response = await backEndCallObj('/admin/emi_history', obj);
            // console.log(response, "emi user")
            if (response?.length === 0) {
                setLoadMore(true);
                toast.info("No more users to fetch.");
            } else {
                setEmiHistory(prevEmiHistory => [...prevEmiHistory, ...response]);

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
        if (EmiHistory?.length == 0) {
            {
                authService.IsAdmin() ? fetchEmiHistoryadmin() :
                    fetchEmiHistory();
            }
        }
    }, []);



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (moment(formData.end_date).isBefore(formData.start_date)) {
            toast.error("End Date cannot be less than Start Date");
            return;
        }
        try {
            setLoading(true);
            setFilterDisabled(true);

            await checkErrors(schema, formData);

            const formDataToSend = {
                ...formData,
                id: formData.id.toUpperCase()
            };

            const response = await backEndCallObj("/emi/emi_filters", formDataToSend);
            // console.log(response, "emi details")
            setEmiHistory(response);
            // console.log(response, "filteremi")
            setFormData({
                start_date: "",
                end_date: "",
                id: ""
            });


        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data);

                setEmiHistory("")
            }
        }
        finally {
            setFilterDisabled(false);
            setLoading(false);

            setFormData({
                start_date: "",
                end_date: "",
                id: ""
            })

        }
    };
    const handleRef = useCallback(
        (node) => {
            if (loadMore || loading || bkcoll) return; // Do not proceed if conditions are met

            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {

                    if (EmiHistory?.length >= 10) {
                        // console.log("Intersection observed, fetching more data...");

                        {
                            authService.IsAdmin() ? fetchEmiHistoryadmin() :
                                fetchEmiHistory();
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
        [loadMore, loading, bkcoll, EmiHistory.length] // Dependencies for useCallback
    );

    const handleRefresh = async () => {
        if (isFetching) return;
        setIsFetching(true);
        try {

            {
                authService.IsAdmin() ? await fetchEmiHistoryadmin() :
                    await fetchEmiHistory();
            }




        } finally {
            setIsFetching(false);
        }
    };



    const formattedDate = (date) => moment(date).format('YYYY-MM-DD HH:mm:ss');
    const capitalizeFirstLetter = (string) => string ? string.toUpperCase() + string.slice(1) : "";
    // console.log("kkkkk")

    return (
        <div className="user-details-container">
            <h5 className="mb-4">EMI History</h5>
            <div className='card transections-hisroty'>
                <div className='card-body'>

                    <form onSubmit={handleSubmit} className='flex-fill'>
                        <div div className='d-flex ' >

                            <div onClick={handleRefresh} disabled={isFetching} calssName="mb-4 mb-sm-0">
                                {isFetching ? (
                                    <div className="spinner-border text-primary" role="status" style={{ height: "20px", width: "20px" }}>

                                    </div>
                                ) : (
                                    <i className="ri-loop-right-line text-primary fs-22 cursor-pointer me-2"></i>
                                )}
                            </div>

                        </div >
                        <div className="row mb-3 d-flex justify-content-end">
                            <div className="col-6  col-xl-2 col-md-6 col-sm-6">

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
                            <div className="col-6  col-xl-2 col-md-6 col-sm-6">

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

                            <div className="col-6  col-xl-2 col-md-6 col-sm-6 mt-auto">

                                <SearchInput

                                    type="text"
                                    name="id"
                                    value={formData["id"]}
                                    placeholder="Payment Id"
                                    SetForm={setFormData}
                                    schema={schema["id"]}

                                />
                            </div>
                            <div className='col-6  col-xl-2 col-md-6 col-sm-6 my-xl-auto'>


                                <button
                                    type="submit"
                                    className="btn btn-primary mt-1 mt-xl-2"
                                    disabled={filterDisabled || !(formData.start_date && formData.end_date || formData.id)}
                                >
                                    Search
                                </button>

                            </div>
                        </div>
                    </form >
                    <div className="table-responsive">
                        <table className="table border table-bordered table-centered">
                            <thead>
                                <tr className="table-head text-center">


                                    <th scope="col">Date</th>
                                    <th scope="col">Payment Id</th>

                                    <th scope="col">Loan Id</th>
                                    <th scope="col">EMI Amount</th>
                                    <th scope="col">installment Number</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">comment</th>
                                    <th scope="col"> Status</th>

                                </tr>
                            </thead>
                            <tbody className="table-body text-center">
                                {EmiHistory && EmiHistory?.length > 0 && EmiHistory?.map(history => (
                                    <tr key={history?.payment_id} ref={handleRef}>
                                        <td>{formattedDate(history?.paymentDate)}</td>
                                        <td>{history?.payment_id}</td>
                                        <td>{history?.loan_id}</td>
                                        <td>₱ {history?.paymentAmount}</td>
                                        <td>{history?.instalmentNumber}</td>

                                        <td>{history?.transactionType}</td>
                                        <td>{history?.comment}</td>
                                        <td>{history?.emi_status}</td>

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
                        {EmiHistory?.length === 0 && !loading && (
                            <div className="d-flex justify-content-center align-items-center">
                                <div className="text-center">
                                    No transactions found.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}

export default EmiHistory;

