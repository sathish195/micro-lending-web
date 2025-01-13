

import React, { useEffect, useState } from 'react';
import Joi from 'joi';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { backEndCall, backEndCallObj } from '../../services/mainServiceFile';
import { Number_Input } from '../comman/All-Inputs';
import { useFunctionContext } from '../comman/FunctionsContext';
import { useMovieContext } from '../comman/Context';
import { resendOtp } from '../../services/authService';

function EmiPayOtp() {
    const { checkErrors } = useFunctionContext();
    const { setUserprofileData, setUserData, setEmiHistory, loanList, setLoanList, emis, setEmis, EmiHistory, } = useMovieContext();
    const navigate = useNavigate();
    const location = useLocation();
    const { transaction_id, loan_id, instalmentNumber } = location.state || {};
    const [otpResponseData, setOtpResponseData] = useState(null);
    const [formData, setFormData] = useState({
        otp: "",
        transaction_id: transaction_id || "",
        loan_id: loan_id || "",
        instalmentNumber: instalmentNumber || ""
    });

    const [errors, setErrors] = useState({});
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const schema = {
        otp: Joi.string().required().label("OTP").min(6).max(6),
        transaction_id: Joi.string().required().label("Transaction ID"),
        loan_id: Joi.string().required().label("Loan ID"),
        instalmentNumber: Joi.number().required().label("instalmentNumber"),
    };

    const fetchData = async () => {
        try {
            const response = await backEndCall("/users/user_profile");
            setUserprofileData(response);
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data);
            }
        }
    };

    const loansdata = async () => {
        setBtnDisabled(true);
        try {
            setLoading(true);
            const response = await backEndCall("/users/user_loan_details");
            setLoanList(response);
            setLoading(false);
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data);
                setLoading(false);
            }
        } finally {
            setBtnDisabled(false);
        }
    };

    useEffect(() => {
        if (!transaction_id || !loan_id) {
            navigate(-1);
        }
    }, [transaction_id, loan_id, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await checkErrors(schema, formData);
            setBtnDisabled(true);
            setLoading(true);

            const otpResponse = await backEndCallObj("/emi/p2ptransfer_verify_otp", formData);
            // console.log(otpResponse, "otpresponse")
            setOtpResponseData(otpResponse)
            if (otpResponse.EMI_Status === "completed") {
                loansdata();
            }

            fetchData();
            setEmiHistory([]);
            setUserData(null);

            setShowSuccessModal(true); // Show success modal
            setFormData({
                otp: "",
                transaction_id: transaction_id,
                loan_id: loan_id,
            });

            // toast.success("EMI payment has been successfully processed.");
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data);
            }
            setBtnDisabled(false);
            setLoading(false);
        } finally {
            setBtnDisabled(false);
            setLoading(false);
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        navigate('/emihistory');
    };
    useEffect(() => {
        // Clean up errors when component unmounts
        return () => {
            setErrors({});
        };
    }, []);
    return (
        <div className="container py-5">
            <div className="row justify-content-center text-wraper">
                <div className="col-xl-6 col-lg-7 col-md-8 col-sm-10">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="card-title fs-16 mt-4">
                                <div className="text-center mb-4">
                                    <h5>Enter OTP for Withdrawal</h5>
                                    <p>Please enter the OTP sent to your registered mobile number.</p>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="otp" className="form-label">
                                        OTP <span className="text-danger">*</span>
                                    </label>
                                    <Number_Input
                                        type="text"
                                        value={formData.otp}
                                        name="otp"
                                        placeholder="Enter Your OTP"
                                        maxLength={6}
                                        SetForm={setFormData}
                                        schema={schema.otp}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary py-2 mb-3 mt-4"
                                    style={{ height: "38px", width: "100px" }}
                                    disabled={btnDisabled}
                                >
                                    {btnDisabled ? "Submitting..." : "Submit"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">Success</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseSuccessModal}></button>
                            </div>
                            <div className="modal-body px-5">
                                <div className="mb-3  text-center">
                                    <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "2rem" }}></i>
                                </div>
                                <p className="mb-0 text-center">EMI payment has been successfully processed.</p>
                                <div className="d-flex justify-content-center mb-4">
                                    <h4>₱ {otpResponseData?.emi_history?.paymentAmount || "NA"}</h4>
                                </div>

                                {/* <table className="table table-borderless pr-3">
                                    <tbody>
                                        <tr>
                                            <td className="fw-bold">Currency:</td>
                                            <td>{otpResponseData?.emi_history?.coin || "0"}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold">Payment Id:</td>
                                            <td>{otpResponseData?.emi_history?.payment_id || "0"}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold">Loan Id:</td>
                                            <td>₱ {otpResponseData?.emi_history?.loan_id || "0"}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold">Installment Number:</td>
                                            <td>{otpResponseData?.emi_history?.instalmentNumber || "0"}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold">Type:</td>
                                            <td>{otpResponseData?.emi_history?.transactionType || "0"}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold">Status:</td>
                                            <td>{otpResponseData?.emi_history?.emi_status || "0"}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold">Comment:</td>
                                            <td>{otpResponseData?.emi_history?.comment || "0"}</td>
                                        </tr>
                                    </tbody>
                                </table> */}
                                <div className="text-center">
                                    <table className="table table-borderless">
                                        <tbody>
                                            <tr>
                                                <td className="fw-bold text-start">Currency:</td>
                                                <td>{otpResponseData?.emi_history?.coin || "0"}</td>
                                            </tr>
                                            <tr>
                                                <td className="fw-bold text-start">Payment Id:</td>
                                                <td>{otpResponseData?.emi_history?.payment_id || "0"}</td>
                                            </tr>
                                            <tr>
                                                <td className="fw-bold text-start">Loan Id:</td>
                                                <td>₱ {otpResponseData?.emi_history?.loan_id || "0"}</td>
                                            </tr>
                                            <tr>
                                                <td className="fw-bold text-start">Installment Number:</td>
                                                <td>{otpResponseData?.emi_history?.instalmentNumber || "0"}</td>
                                            </tr>
                                            <tr>
                                                <td className="fw-bold text-start">Type:</td>
                                                <td>{otpResponseData?.emi_history?.transactionType || "0"}</td>
                                            </tr>
                                            <tr>
                                                <td className="fw-bold text-start">Status:</td>
                                                <td>{otpResponseData?.emi_history?.emi_status || "0"}</td>
                                            </tr>
                                            <tr>
                                                <td className="fw-bold text-start">Comment:</td>
                                                <td>{otpResponseData?.emi_history?.comment || "0"}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                            <div className="modal-footer justify-content-center">
                                <button type="button" className="btn btn-success" onClick={handleCloseSuccessModal}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal backdrop */}
            {showSuccessModal && <div className="modal-backdrop fade show" onClick={handleCloseSuccessModal}></div>}
        </div>
    );
}

export default EmiPayOtp;

