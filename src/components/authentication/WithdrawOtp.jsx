import React, { useEffect, useState } from 'react';
import Joi from 'joi';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { backEndCall, backEndCallObj } from '../../services/mainServiceFile';
import { Number_Input } from '../comman/All-Inputs';
import { useFunctionContext } from '../comman/FunctionsContext';

function WithdrawOtp() {
    const { checkErrors } = useFunctionContext();
    const navigate = useNavigate();
    const location = useLocation();  // Add useLocation hook
    const [loading, setLoading] = useState(false);
    const { state } = location;
    const { transaction_id } = state || {};
    const [formData, setFormData] = useState({
        otp: "",
        transaction_id: transaction_id,
    });
    // console.log(transaction_id, "transection id")

    const [errors, setErrors] = useState({});
    const [btnDisabled, setBtnDisabled] = useState(false);

    const schema = {
        otp: Joi.string().required().label("OTP").min(6).max(6),
        transaction_id: Joi.string().required().label("Transaction ID"),
    };

    useEffect(() => {
        if (!transaction_id) {
            navigate(-1);
        }
    }, [transaction_id, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await checkErrors(schema, formData);
            setBtnDisabled(true);
            setLoading(true);

            // Send request to verify OTP
            const otpResponse = await backEndCallObj("/users/withdrawal_verify_otp", formData);
            // console.log(otpResponse, "otp");

            // Wait for 2 seconds before checking transaction status
            setFormData({
                otp: "",
                transaction_id: "",
            })
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data, "error");
                // console.log(ex.response.data, "error");
                setBtnDisabled(false);
                setLoading(false);
                // navigate('/')
            }
        }
        finally {

        }
    };

    // if (loading) {
    //     return (
    //         <div>
    //             <div className="text-center mt-3">
    //                 <div className="spinner-border spiner-border-sm" style={{ color: "blue" }} role="status">
    //                     <span className="sr-only"></span>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

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
                                    {/* {transaction_id && (
                                        <p><strong>Transaction ID:</strong> {transaction_id}</p>
                                    )} */}
                                </div>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="otp" className="form-label">
                                        OTP <span className="text-danger">*</span>
                                    </label>
                                    <Number_Input
                                        type="text"
                                        value={formData["otp"] === "0" ? "" : formData["otp"]}
                                        name="otp"
                                        placeholder="Enter Your OTP"
                                        maxLength={6}
                                        SetForm={setFormData}
                                        schema={schema["otp"]}
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
        </div>
    );
}

export default WithdrawOtp;
