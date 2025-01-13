


import Joi from 'joi';
import React, { useEffect, useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { backEndCall, backEndCallObj } from '../../services/mainServiceFile';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
// import './WithdrawalPage.css'; // Import a custom CSS file for additional styling
import { numeric } from 'numeric';
import { Amount_Input, Number_Input, Radio_input } from '../comman/All-Inputs';
import { useMovieContext } from '../comman/Context';
import { useFunctionContext } from '../comman/FunctionsContext';

function WithdrawalPage() {
    const navigate = useNavigate()
    const { checkErrors } = useFunctionContext();
    const { errors, setLoading, loading, setErrorOccur, setErrors } = useMovieContext();
    const [btndisabled, setBtndisabled] = useState(false)
    const [formData, setFormData] = useState({
        account_number: "",
        amount: "",
        channel: "INSTAPAY"
    });

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const location = useLocation();
    const { state } = location;
    const { bankCode, fullName, bank } = state;

    const schema = {
        account_number: Joi.string().required().label("Account Number").min(12).max(12),
        amount: Joi.number().required().label("Amount").positive().min(2).max(99999).precision(12),
        channel: Joi.string().required().label("Payment Method")
    };



    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await checkErrors(schema, formData);
            setLoading(true);
            setBtndisabled(true)
            const response = await backEndCallObj("/users/Withdrawal_funds", formData);

            // console.log(response, "transection id")

            const transaction_id = response.Transaction_id;

            // console.log(transaction_id, "transection id")

            navigate('/withdrawOtp', { state: { transaction_id } });
            setFormData({
                account_number: "",
                amount: "",
                channel: "INSTAPAY"
            });

        } catch (ex) {
            if (ex.response && ex.response.status === 400) {

                toast.error(ex.response.data, "eroor");
                console.log(ex.response.data, "error")

            } else {
                console.error(ex);
            }
        } finally {
            setBtndisabled(false)
            setFormData({
                account_number: "",
                amount: "",
                channel: "INSTAPAY"
            });
        }
    };

    // if (loading) {
    //     return <div><div className="text-center mt-3">
    //         <div className="spinner-border spiner-border-sm" style={{ color: "blue" }} role="status">
    //             <span className="sr-only"></span>
    //         </div>
    //     </div></div>;
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
                    <div className='card shadow-sm'>
                        <div className='card-body'>
                            <div className='text-center mb-4'>
                                {bankCode && <h5> {bankCode}</h5>}
                                {fullName && <p> {fullName}</p>}
                                {/* {bank && <p><strong>name</strong>{bank.settlement_rail.PESONET?.name}</p>} */}
                                {/* <img src="./assets/images/SBI-Logo.png" alt="SBI Logo" className="sbi-logo" /> */}
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="account_number" className="form-label">Account Number</label>
                                    <Number_Input
                                        type={"text"}
                                        value={(formData["account_number"] === "0" ? "" : formData["account_number"])}
                                        name={"account_number"}
                                        placeholder={"Enter Your account number"}
                                        maxLength={12}
                                        // inputMode={numeric}
                                        SetForm={setFormData}
                                        schema={schema["account_number"]}

                                    />

                                </div>
                                <div className="mb-3">
                                    <label htmlFor="amount" className="form-label">Amount</label>
                                    <Amount_Input
                                        type={"text"}
                                        value={(formData["amount"] === "0" ? "" : formData["amount"])}
                                        name={"amount"}
                                        placeholder={"Enter Your amount"}
                                        maxLength={20}
                                        // inputMode={numeric}
                                        SetForm={setFormData}
                                        schema={schema["amount"]}

                                    />

                                </div>
                                <div className="mb-3">

                                    <div className="mb-3">
                                        <label htmlFor="channel" className="form-label">Payment Method</label>
                                        <Radio_input
                                            name="channel"
                                            options={[
                                                { label: "INSTAPAY", value: "INSTAPAY" },
                                                { label: "PESONET", value: "PESONET" }
                                            ]}
                                            value={formData.channel}
                                            SetForm={setFormData}
                                            schema={schema["channel"]}
                                        />
                                        {errors.channel && <div className="text-danger">{errors.channel}</div>}
                                    </div>

                                </div>
                                <button className='btn btn-primary' type="submit" disabled={btndisabled}>
                                    {btndisabled ? 'Submitting...' : 'Submit'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}

export default WithdrawalPage;

