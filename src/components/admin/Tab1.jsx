
import React, { useCallback, useRef } from 'react';
import moment from 'moment';

function Tab1({ transactionHistoryuser, handleTabTransection, loading, loadMore }) {
    const observer = useRef();

    const handleRef = useCallback(node => {
        if (loading || !loadMore) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                handleTabTransection()
            }
        });

        if (node) observer.current.observe(node);

        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, [loading, loadMore, handleTabTransection]);

    const formattedDate = (date) => {
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
    };

    const capitalizeFirstLetter = (string) => {
        if (!string) return "";
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <div className='card'>
            <div className="card-body">
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
                            {transactionHistoryuser && transactionHistoryuser.length > 0 && transactionHistoryuser.map((history, index) => (
                                <tr key={history?.transaction_id} ref={index === transactionHistoryuser.length - 1 ? handleRef : null}>
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

                    {transactionHistoryuser?.length === 0 && !loading && (
                        <div className="d-flex justify-content-center align-items-center">
                            <div className="text-center">
                                No transactions found.
                            </div>
                        </div>
                    )}
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
    );
}

export default Tab1;
