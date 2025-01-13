import React, { useEffect, useState } from 'react';
import { toast } from "react-hot-toast";
import { backEndCallObj } from '../../services/mainServiceFile';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Modal } from 'react-bootstrap';
import { useMovieContext } from '../comman/Context';

function EmiDetails() {
    // const [emis, setEmis] = useState({});
    const { emis, setEmis, userprofileData, setUserprofileData, userData, setUserData } = useMovieContext()
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const location = useLocation();
    const formId = location.state.formId;
    // console.log(formId, "what ")
    const navigate = useNavigate()
    useEffect(() => {


        fetchEMIDetails();

    }, [formId]);


    const fetchEMIDetails = async () => {
        // setBtnDisabled(true)
        try {
            setLoading(true)
            const response = await backEndCallObj("/emi/get_emi_details", { loan_id: formId });
            console.log(response, "emaisdata")
            setEmis(response);
            setLoading(false);
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data);
            }
            setLoading(false);
            // setBtnDisabled(false)
        }
    };

    const showModel = () => {
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
    };

    const handlePayEMI = async () => {
        setBtnDisabled(true)
        try {
            setLoading(true)
            const payload = {

                loan_id: emis?.loan_id,
                paymentAmount: emis?.emi_details?.totalInstallmentAmount,
                // instalmentNumber: emis?.emi_details?.installmentNumber,

                // delayedAmount: emis?.emi_details.delayedAmount
            };

            // console.log(payload, "payload")
            const response = await backEndCallObj("/emi/pay_emi", payload);
            // console.log(response, "response")
            const transaction_id = response.Transaction_id;

            // console.log(transaction_id, "transection id")
            navigate('/emipayotp', { state: { transaction_id, loan_id: emis?.loan_id, instalmentNumber: emis?.emi_details?.installmentNumber } });
            // setUserprofileData(null);
            // setUserprofileData(null)
            // setUserData(null)
            // toast.success(response.message, "EMI payment successful!");

            setShowModal(false);

        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data);
                setBtnDisabled(false)
                setLoading(false)
                setShowModal(false);
            }
        }
        finally {
            setBtnDisabled(false)
            setLoading(false)
            setShowModal(false);
        };


        const formatDateTime = (date) => {
            if (!date) return "";
            return moment(date).format("DD-MMM-YYYY hh:mm A");
        };
    }
    return (

        <div className="user-details-container">
            <h5>EMI Details</h5>

            <div className="row">
                <div className="col-12">

                    <div className='card'>
                        <div className='card-body shadow-sm'>

                            <div className='table-responsive'>
                                <table className='table table-bordered table'>
                                    <thead>
                                        <tr className='text-center'>

                                            <th>Loan Id</th>
                                            <th>Loan Amount</th>
                                            <th>Interest Rate</th>
                                            {/* <th>Duration Time</th> */}
                                            {/* <th>Delay Days</th> */}
                                            <th>Delayed Amount</th>
                                            {/* <th>Emi Status</th> */}
                                            <th>Installment Amount</th>
                                            {/* <th> Total Installment Amount</th> */}
                                            <th>Installment Number</th>
                                            {/* <th>Remaining EMI Amount</th> */}
                                            {/* <th>Emi Start Date</th>
                                            <th>Emi End Date</th>
                                            <th>Next Emi Date</th> */}
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="7" className="text-center">
                                                    <div className="spinner-border spiner-border-sm" style={{ color: "blue" }} role="status">
                                                        <span className="sr-only"></span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            <tr className='text-center'>
                                                <td>{emis?.loan_id || "NA"}</td>
                                                <td>  ₱ {emis?.loan_amount || "NA"}</td>
                                                <td>{emis?.emi_details?.interestRate || "NA"}%</td>
                                                <td>{emis?.emi_details?.delayedAmount || "0"}</td>
                                                <td> ₱ {emis?.emi_details?.totalInstallmentAmount || "0"}</td>
                                                <td>  {emis?.emi_details?.installmentNumber || "0"}</td>
                                                {/* <td>{formatDateTime(emis?.startDate) || "NA"}</td>
                                            <td>{formatDateTime(emis?.endDate) || "NA"}</td>
                                            <td>{formatDateTime(emis?.nextEMIDate) || "NA"}</td> */}
                                                <td>
                                                    <div className='my-4'>
                                                        <button className='btn-primary btn' onClick={showModel} disabled={btnDisabled}>PAY EMI</button>
                                                    </div>
                                                </td>
                                            </tr>)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div></div>
            {showModal ? (<Modal show={true} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>PAY EMI</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Do you want to proceed with the EMI payment?</p>

                    <h5><span>₱ </span>{emis?.emi_details?.totalInstallmentAmount}</h5>
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-secondary' onClick={handleClose} disabled={btnDisabled}>Cancel</button>
                    <button className='btn btn-primary' onClick={handlePayEMI} disabled={btnDisabled}>Proceed to Pay</button>
                </Modal.Footer>
            </Modal>) : null}
        </div>
    );
}

export default EmiDetails;
