
import React, { useState, useEffect } from 'react';
import { toast } from "react-hot-toast";
import { backEndCall, backEndCallObj } from '../../services/mainServiceFile';
import authService from '../../services/authService';
import moment from 'moment';
import Joi from 'joi';
import { Date_Input, SearchInput } from '../comman/All-Inputs';
import { Link } from 'react-router-dom';

import { useMovieContext } from '../comman/Context';
import { useFunctionContext } from '../comman/FunctionsContext';

function TransactionHistory() {

    const { transactionHistory, setTransactionHistory, errors, setErrors, setErrorOccur } = useMovieContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filterDisabled, setFilterDisabled] = useState(false);

    const { checkErrors } = useFunctionContext()


    const fetchTransactionHistory = async () => {

        // console.log(transactionHistory.length)
        try {

            // console.log("yes")
            setLoading(true);
            const response = await backEndCall('/users/transaction_history');

            setLoading(false);
            setTransactionHistory(response || []);
        }


        catch (ex) {
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data);
            }
            setError(ex.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        // if (transactionHistory <= 0) {
        fetchTransactionHistory();
        // }
    }, []);



    // console.log(transactionHistory)
    const formattedDate = (date) => {
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
    };

    return (
        <>
            <h5 className="mb-4">Transaction History</h5>
            <div className='card'>
                <div className="card-body">

                    <div className="table-responsive">



                        <table className="table border table-bordered table-centered">
                            <thead>
                                <tr className="table-head">
                                    <th scope="col">Transaction Id</th>
                                    <th scope="col">Receiver Id</th>
                                    <th scope="col">Sender Id</th>
                                    <th scope="col">Transaction Type</th>
                                    <th scope="col">Transaction Status</th>
                                    <th scope="col">Amount</th>
                                    <th scope="col">Comment</th>
                                    <th scope="col">Transaction Date</th>
                                </tr>
                            </thead>
                            <tbody className="table-body text-center">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            <div className="spinner-border spiner-border-sm" style={{ color: "blue" }} role="status">
                                                <span className="sr-only"></span>
                                            </div>
                                        </td>
                                    </tr>

                                ) : transactionHistory.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center">No transactions found.</td>
                                    </tr>
                                ) : (


                                    transactionHistory?.map(history => (
                                        <tr key={history.transaction_id}>
                                            <td>{history.transaction_id}</td>
                                            <td>{history.receiver_id}</td>
                                            <td>{history.sender_id}</td>
                                            <td>{history.transactionType}</td>
                                            <td>{history.transaction_status}</td>
                                            <td>{history.amount}</td>
                                            <td>{history.comment}</td>
                                            <td>{formattedDate(history.transactionDate)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                    </div >
                </div >
            </div>
        </>
    );
}


export default TransactionHistory;
