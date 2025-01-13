// import React, { useEffect, useState } from "react";
// import { Link, Navigate, useLocation } from "react-router-dom";
// import { backEndCallObj } from "../../services/mainServiceFile";
// import { useMovieContext } from "../comman/Context";
// import { toast } from "react-hot-toast";
// import moment from 'moment';
// import PenaltyModal from './PenaltyModal ';

// // import React, { useState } from 'react';
// import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
// import Loans from './../landingpage/Loans';
// import { Button, Modal } from "react-bootstrap";
// import { Input_text, Number_Input } from './../comman/All-Inputs';
// // import Form from './../comman/Form';
// import Joi from 'joi'
// import Tab1 from "./Tab1";
// import Tab2 from "./Tab2";


// const Tab3 = () => {


//     const { setErrorOccur, setEmiHistory, setError, loanList, setLoanList } = useMovieContext();
//     const location = useLocation(); // Use the useLocation hook to access location state

//     const [loading, setLoading] = useState(false);
//     const [activeTab, setActiveTab] = useState(0);
//     const [tabclicked, setTabClicked] = useState(false);
//     const [isZoomed, setIsZoomed] = useState(false);
//     const [btndisabled, setBtnDisabled] = useState(false)
//     const [isFetching, setIsFetching] = useState(false);
//     const [showModal, setShowModal] = useState(false);
//     const [formData, setFormData] = useState({
//         delayedAmount: "",
//         note: "",

//     })

//     const schema = {
//         delayedAmount: Joi.number()
//             .required()
//             .min(50)
//             .messages({
//                 "number.base": "Delayed amount must be a number",
//                 "any.required": "Delayed amount is required",
//                 "number.min": "Delayed amount must be at least {#limit}"
//             }),
//         note: Joi.string()
//             .min(10)
//             .max(100)
//             .required()
//             .pattern(/^[A-Za-z]/)
//             .messages({
//                 "string.base": "Note must be a string",
//                 "string.empty": "Note is required",
//                 "string.min": "Note must be at least {#limit} characters long",
//                 "string.max": "Note cannot be longer than {#limit} characters",
//                 "string.pattern.base": "Note must contain only letters"
//             })

//     }













//     const isEMIDatePast = (nextEMIDate) => {
//         const today = new Date();


//         const nextDate = new Date(nextEMIDate);
//         return today > nextDate;
//     };




//     const handleShowModal = ({ loan_id }) => {
//         console.log(loan_id, "loanid")
//         setFormData(loan_id)
//         setShowModal(true);
//     };

//     const handleCloseModal = () => {
//         setShowModal(false);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setBtnDisabled(true);
//         try {
//             // await checkErrors(schema, formData);
//             // console.log(errorOccur, "errors")
//             // setLoading(true);
//             const response = await backEndCallObj("/admin/add_penalty", { ...formData });
//             setLoading(false);
//             setErrorOccur(false);
//             setFormData({
//                 delayedAmount: "",
//                 note: ""
//             });
//             handleCloseModal();
//             toast.success("Penalty added successfully!");
//         } catch (ex) {
//             if (ex.response && ex.response.status === 400) {
//                 toast.error(ex.response.data);
//             } else {
//                 toast.error("An unexpected error occurred.");
//             }
//         } finally {
//             setLoading(false);
//             setBtnDisabled(false);
//         }
//     };

//     const formattedDate = (date) => {
//         return moment(date).format('YYYY-MM-DD HH:mm:ss');
//     };

//     return (
//         <div className="user-details-container ">
//             <h5 className="mb-4">User Profile</h5>

//             <div>






//                 <diV className="table-responsive">
//                     <table className="table border table-bordered table-centered text-center">
//                         <thead>
//                             <tr>
//                                 <th scope="col">Documents</th>
//                                 <th scope="col">Date </th>
//                                 <th scope="col"> Next EMI Date </th>
//                                 <th scope="col">user id</th>
//                                 <th scope="col">lone id</th>
//                                 <th scope="col">loan amount</th>
//                                 <th scope="col">Months</th>
//                                 <th scope="col">loan type</th>

//                                 <th scope="col">loan status</th>
//                                 {/* <th scope="col">Address</th> */}


//                                 {/* <th scope="col">pay_slip</th> */}

//                             </tr>
//                         </thead>
//                         <tbody>

//                             {loanList?.map((loan) => (
//                                 <tr key={loan?.user_id}>
//                                     <td>
//                                         <div className="d-flex">
//                                             {/* <img
//                                                 src={loan.photo}
//                                                 alt="User"
//                                                 className="object-fit-cover rounded-circle"
//                                                 style={{
//                                                     width: "45px",
//                                                     height: "45px",
//                                                 }}
//                                             /> */}
//                                             <img
//                                                 src={loan?.pay_slip}
//                                                 alt="User"
//                                                 className="object-fit-cover rounded-circle"
//                                                 style={{
//                                                     width: "45px",
//                                                     height: "45px",
//                                                 }}
//                                             />
//                                             {/* <h6>{loan.name}</h6> */}
//                                         </div>
//                                     </td>
//                                     <td>{formattedDate(loan?.date_of_applycation)}</td>
//                                     <td>{formattedDate(loan?.emi_details.nextEMIDate)}</td>


//                                     <td className="text-primary">
//                                         {loan.user_id}
//                                     </td>
//                                     <td>{loan?.loan_id}</td>
//                                     <td> ₱ {loan?.loan_amount}</td>
//                                     <td>{loan?.months}</td>
//                                     <td>{loan?.loan_type}</td>
//                                     <td>
//                                         <div
//                                             className={`loan_status ${loan.loan_status === "completed"
//                                                 ? "bg-success  fw-bold"
//                                                 : loan?.loan_status === "Processing"
//                                                     ? "bg-warning fw-bold"
//                                                     : loan?.loan_status === "Rejected"
//                                                         ? "bg-danger fw-bold"
//                                                         : loan?.loan_status === "Approved"
//                                                             ? "bg-info fw-bold"
//                                                             : "bg-dark fw-bold"
//                                                 }`}
//                                         >
//                                             {loan?.loan_status}

//                                         </div>{" "}

//                                         {isEMIDatePast(loan?.emi_details.nextEMIDate) && (
//                                             <button className="btn btn-primary" onClick={() => handleShowModal(loan.loan_id)}>
//                                                 Add PenaltyModal
//                                             </button>


//                                         )}
//                                     </td>




//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                     {showModal &&
//                         <Modal show={showModal} onHide={handleCloseModal}>
//                             <Modal.Header closeButton>
//                                 <Modal.Title> Add Penalty </Modal.Title>
//                             </Modal.Header>
//                             <Modal.Body>
//                                 <form onSubmit={(e) => handleSubmit(e)} className="addAdmin_form">
//                                     <div className="mb-3">
//                                         <label htmlFor="delayedAmount" className="form-label">Delayed Amount</label>
//                                         <Number_Input
//                                             type="text"

//                                             placeholder="Enter delayed amount here"


//                                             value={formData["delayedAmount"]}
//                                             name="delayedAmount"

//                                             SetForm={setFormData}
//                                             schema={schema["delayedAmount"]}
//                                         />
//                                     </div>
//                                     <div className="mb-3">
//                                         <label htmlFor="note" className="form-label">Note</label>
//                                         <Input_text
//                                             type="text"
//                                             placeholder="Enter note here"
//                                             name="note"
//                                             value={formData["note"]}
//                                             SetForm={setFormData}
//                                             schema={schema["note"]}
//                                         />
//                                     </div>
//                                     <Button variant="primary" type="submit">Submit</Button>
//                                     <Button variant="secondary" onClick={handleCloseModal}>
//                                         Close
//                                     </Button>
//                                 </form>

//                             </Modal.Body>

//                         </Modal>}
//                     {loanList === 0 && (
//                         <tr>
//                             <td colSpan="7" className="text-center">No transactions found.</td>
//                         </tr>)
//                     }
//                 </diV>



//             </div>
//         </div >
//     );
// };

// export default Tab3;

import React, { useCallback, useRef, useState } from 'react';
import moment from 'moment';
import { Input_text, Number_Input } from '../comman/All-Inputs';
import { Button, Modal } from 'react-bootstrap';
import Joi from 'joi';
import { backEndCallObj } from '../../services/mainServiceFile';
import toast from 'react-hot-toast';

function Tab3({ LoanListuser, setLoanListuser, setErrorOccur, setLoading, handleTabLOAN, loading, loadMore }) {
    const observer = useRef();
    const [showModal, setShowModal] = useState(false);
    const [btndisabled, setBtnDisabled] = useState(false)
    const [formData, setFormData] = useState({
        delayedAmount: "",
        note: "",

    })

    const schema = {
        delayedAmount: Joi.number()
            .required()
            .min(50)
            .messages({
                "number.base": "Delayed amount must be a number",
                "any.required": "Delayed amount is required",
                "number.min": "Delayed amount must be at least {#limit}"
            }),
        note: Joi.string()
            .min(10)
            .max(100)
            .required()
            .pattern(/^[A-Za-z]/)
            .messages({
                "string.base": "Note must be a string",
                "string.empty": "Note is required",
                "string.min": "Note must be at least {#limit} characters long",
                "string.max": "Note cannot be longer than {#limit} characters",
                "string.pattern.base": "Note must contain only letters"
            })

    }
    const isEMIDatePast = (nextEMIDate) => {
        const today = new Date();


        const nextDate = new Date(nextEMIDate);
        return today > nextDate;
    };




    const handleShowModal = ({ loan_id }) => {
        // console.log(loan_id, "loanid")
        setFormData(loan_id)
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setBtnDisabled(true);
        try {
            // await checkErrors(schema, formData);
            // console.log(errorOccur, "errors")
            // setLoading(true);
            const response = await backEndCallObj("/admin/add_penalty", { ...formData });
            setLoading(false);
            setErrorOccur(false);
            setFormData({
                delayedAmount: "",
                note: ""
            });
            handleCloseModal();
            toast.success("Penalty added successfully!");
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data);
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
            setBtnDisabled(false);
        }
    };
    const handleRef = useCallback(node => {
        if (loading || !loadMore) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                handleTabLOAN();
            }
        });

        if (node) observer.current.observe(node);

        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, [loading, loadMore, handleTabLOAN]);

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
                    <diV className="table-responsive">
                        <table className="table border table-bordered table-centered text-center">
                            <thead>
                                <tr>
                                    <th scope="col">Documents</th>
                                    <th scope="col">Date </th>
                                    <th scope="col"> Next EMI Date </th>
                                    <th scope="col">user id</th>
                                    <th scope="col">lone id</th>
                                    <th scope="col">loan amount</th>
                                    <th scope="col">Months</th>
                                    <th scope="col">loan type</th>

                                    <th scope="col">loan status</th>
                                    {/* <th scope="col">Address</th> */}


                                    {/* <th scope="col">pay_slip</th> */}

                                </tr>
                            </thead>
                            <tbody>

                                {LoanListuser && LoanListuser.length > 0 && (
                                    LoanListuser.map((loan, index) => (
                                        <tr key={loan?.payment_id} ref={index === LoanListuser.length - 1 ? handleRef : null}>
                                            <td>
                                                <div className="d-flex">
                                                    {/* <img
                                                src={loan.photo}
                                                alt="User"
                                                className="object-fit-cover rounded-circle"
                                                style={{
                                                    width: "45px",
                                                    height: "45px",
                                                }}
                                            /> */}
                                                    <img
                                                        src={loan?.pay_slip}
                                                        alt="User"
                                                        className="object-fit-cover rounded-circle"
                                                        style={{
                                                            width: "45px",
                                                            height: "45px",
                                                        }}
                                                    />
                                                    {/* <h6>{loan.name}</h6> */}
                                                </div>
                                            </td>
                                            <td>{formattedDate(loan?.date_of_applycation)}</td>
                                            <td>{formattedDate(loan?.emi_details.nextEMIDate)}</td>


                                            <td className="text-primary">
                                                {loan.user_id}
                                            </td>
                                            <td>{loan?.loan_id}</td>
                                            <td> ₱ {loan?.loan_amount}</td>
                                            <td>{loan?.months}</td>
                                            <td>{loan?.loan_type}</td>
                                            <td>
                                                <div
                                                    className={`loan_status ${loan.loan_status === "completed"
                                                        ? "bg-success  fw-bold"
                                                        : loan?.loan_status === "Processing"
                                                            ? "bg-warning fw-bold"
                                                            : loan?.loan_status === "Rejected"
                                                                ? "bg-danger fw-bold"
                                                                : loan?.loan_status === "Approved"
                                                                    ? "bg-info fw-bold"
                                                                    : "bg-dark fw-bold"
                                                        }`}
                                                >
                                                    {loan?.loan_status}

                                                </div>{" "}

                                                {isEMIDatePast(loan?.emi_details.nextEMIDate) && (
                                                    <button className="btn btn-primary" onClick={() => handleShowModal(loan.loan_id)}>
                                                        Add PenaltyModal
                                                    </button>


                                                )}
                                            </td>




                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        {showModal &&
                            <Modal show={showModal} onHide={handleCloseModal}>
                                <Modal.Header closeButton>
                                    <Modal.Title> Add Penalty </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <form onSubmit={(e) => handleSubmit(e)} className="addAdmin_form">
                                        <div className="mb-3">
                                            <label htmlFor="delayedAmount" className="form-label">Delayed Amount</label>
                                            <Number_Input
                                                type="text"

                                                placeholder="Enter delayed amount here"


                                                value={formData["delayedAmount"]}
                                                name="delayedAmount"

                                                SetForm={setFormData}
                                                schema={schema["delayedAmount"]}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="note" className="form-label">Note</label>
                                            <Input_text
                                                type="text"
                                                placeholder="Enter note here"
                                                name="note"
                                                value={formData["note"]}
                                                SetForm={setFormData}
                                                schema={schema["note"]}
                                            />
                                        </div>
                                        <Button variant="primary" type="submit">Submit</Button>
                                        <Button variant="secondary" onClick={handleCloseModal}>
                                            Close
                                        </Button>
                                    </form>

                                </Modal.Body>

                            </Modal>}
                        {LoanListuser?.length === 0 && (
                            <div className="d-flex justify-content-center align-items-center">
                                <div className="text-center">
                                    No loans found.
                                </div>
                            </div>
                        )}
                        {loading && (
                            <div className="d-flex justify-content-center align-items-center">
                                <div className="spinner-border spiner-border-sm" style={{ color: "blue" }} role="status">
                                    <span className="sr-only"></span>
                                </div>
                            </div>
                        )}
                    </diV>


                </div>
            </div>
        </div >
    );
}

export default Tab3;

