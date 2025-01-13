import React, { useCallback, useRef } from 'react';
import moment from 'moment';

function Tab2({ EmiHistoryuser, setEmiHistoryuser, handleTabEMI, loading, loadMore }) {
    const observer = useRef();

    const handleRef = useCallback(node => {
        if (loading || !loadMore) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                handleTabEMI();
            }
        });

        if (node) observer.current.observe(node);

        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, [loading, loadMore, handleTabEMI]);

    const formattedDate = (date) => {
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
    };

    const capitalizeFirstLetter = (string) => {
        if (!string) return "";
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <div className="user-details-container">
            <h5 className="mb-4">EMI History</h5>
            <div className='card transections-hisroty'>
                <div className='card-body'>
                    < div className='d-flex'>


                    </div>
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
                                {EmiHistoryuser && EmiHistoryuser.length > 0 && (
                                    EmiHistoryuser.map((history, index) => (
                                        <tr key={history?.payment_id} ref={index === EmiHistoryuser.length - 1 ? handleRef : null}>
                                            <td>{formattedDate(history?.paymentDate)}</td>
                                            <td>{history?.payment_id}</td>
                                            <td>{history?.loan_id}</td>
                                            <td>₱ {history?.paymentAmount}</td>
                                            <td>{history?.instalmentNumber}</td>
                                            <td>{history?.transactionType}</td>
                                            <td>{history?.comment}</td>
                                            <td>{history?.emi_status}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>

                        </table>
                        {loading && (
                            <div className="d-flex justify-content-center align-items-center">
                                <div className="spinner-border spiner-border-sm" style={{ color: "blue" }} role="status">
                                    <span className="sr-only"></span>
                                </div>
                            </div>
                        )}
                        {EmiHistoryuser?.length === 0 && (
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

export default Tab2;

