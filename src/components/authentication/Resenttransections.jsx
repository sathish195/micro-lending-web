import React, { useEffect, useState } from 'react';
import { toast } from "react-hot-toast";
import { backEndCall } from '../../services/mainServiceFile';

import { useMovieContext } from '../comman/Context';
import TransactionHistory from './Transection_history';
import { Navigate } from 'react-router-dom';
import moment from 'moment';
import authService from '../../services/authService';

function Resenttransections() {
    const { RecenttransactionHistory, setRecentTransactionHistory, error, setError } = useMovieContext();
    const [loading, setLoading] = useState(false)

    const fetchTransactionHistory = async () => {
        setLoading(true)
        try {
            const response = await backEndCall('/users/transaction_history');
            // console.log(response, "recent user")
            if (Array.isArray(response)) {
                setRecentTransactionHistory(response);
            } else {
                setRecentTransactionHistory([]);
            }
            setLoading(false);
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data);
            }
            setError(ex.message);
            setLoading(false);
        }
    };

    const fetchTransactionHistoryAdmin = async () => {
        setLoading(true)
        try {
            const response = await backEndCall('/admin/transaction_history');
            // console.log(response, "recent admin")
            if (Array.isArray(response)) {
                setRecentTransactionHistory(response);
            } else {
                setRecentTransactionHistory([]);
            }
            setLoading(false);
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data);
            }
            setError(ex.message);
            setLoading(false);
        }
    };
    useEffect(() => {
        if (RecenttransactionHistory.length == 0) {
            {
                authService.IsAdmin() ? fetchTransactionHistoryAdmin() :
                    fetchTransactionHistory();
            }
        }
    }, [setRecentTransactionHistory, setLoading, setError]);

    // useEffect(() => {
    //     if (RecenttransactionHistory.length < 0) {
    //         fetchTransactionHistory();
    //     }
    // }, [setRecentTransactionHistory, setLoading, setError]);
    const formattedDate = (date) => {
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
    };
    function capitalizeFirstLetter(string) {
        if (!string) return ""; // Handle cases where string is undefined or null
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return (
        <div className="user-details-container">
            <h5 className="mb-4"> Recent Transactions</h5>
            <div className='card Recentttransections-hisroty'>
                <div className='card-body'>
                    <div className="table-responsive">
                        <table className="table border table-bordered table-centered text-center">
                            <thead>

                                <tr className="table-head">
                                    <th scope="col"> Date</th>
                                    <th scope="col">Transaction Id</th>
                                    <th scope="col">Loan Id</th>
                                    {/* <th scope="col">Receiver Id</th>
                                    <th scope="col">Sender Id</th> */}
                                    <th scope="col">Amount</th>
                                    <th scope="col">Type</th>


                                    {/* <th scope="col">Comment</th> */}
                                    <th scope="col">Status</th>

                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {
                                    RecenttransactionHistory.map(history => (
                                        <tr key={history?.transaction_id}>
                                            <td>{formattedDate(history?.transactionDate)}</td>
                                            <td>{history.transaction_id}</td>
                                            <td>{history?.loan_id}</td>
                                            {/* <td>{history.receiver_id}</td>
                                            <td>{history.sender_id}</td> */}
                                            <td>₱ {history?.amount}</td>
                                            <td>{capitalizeFirstLetter(history?.transactionType)}</td>


                                            <td>{capitalizeFirstLetter(history?.transaction_status)}</td>

                                        </tr>

                                    ))




                                }


                            </tbody>

                        </table>
                        {loading && (
                            <div>
                                <div className="d-flex justify-content-center align-items-center">
                                    <div className="spinner-border spiner-border-sm" style={{ color: "blue" }} role="status">
                                        <span className="sr-only"></span>
                                    </div>
                                </div>
                            </div>

                        )}
                        {RecenttransactionHistory?.length === 0 && !loading && (
                            <div className="d-flex justify-content-center align-items-center" >
                                <div className="text-center">
                                    No transactions found.
                                </div>
                            </div>

                        )}


                        {RecenttransactionHistory.length !== 0 &&
                            <div className='text-center '>
                                <a href="/transection_history">show more....</a>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Resenttransections;
