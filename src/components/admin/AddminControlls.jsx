

// import authService from '../../services/authService';
// import { backEndCall, backEndCallObj } from '../../services/mainServiceFile';
// import React, { useEffect, useState } from 'react';
// import { Modal, Button } from 'react-bootstrap';
// import toast, { Toaster } from 'react-hot-toast';
// import { useMovieContext } from '../comman/Context';
// import { useFunctionContext } from '../comman/FunctionsContext';
// import Loaneligibility from './Loaneligibility';

// function AddminControlls() {
//     // const [adminControlsList, setAdminControlsList] = useState([]);
//     const { adminControlsList, setAdminControlsList, selectedControls, setSelectedControls } = useMovieContext()
//     const [btnDisabled, setBtnDisabled] = useState(false);
//     const [showModal, setShowModal] = useState(false);
//     const [loading, setLoading] = useState(false);
//     // const [selectedControls, setSelectedControls] = useState([]);
//     // const { adminControlsList, setAdminControlsList } = useFunctionContext();

//     // const { adminControlsList } = useMovieContext();

//     useEffect(() => {
//         if (adminControlsList <= 0) {
//             fetchData();
//         }
//     }, []);

//     const fetchData = async () => {
//         try {
//             setLoading(true);
//             const response = await backEndCall("/admin/get_admin_controls");
//             console.log(response, "bkd response")
//             const controls = ["login", "register", "withdraw"].map((key) => ({
//                 value: response?.[key].toUpperCase(),
//                 key,
//                 heading: key.charAt(0).toUpperCase() + key.slice(1),
//             }));
//             console.log(controls)
//             setAdminControlsList(controls);
//             setLoading(false);
//             // console.log(adminControlsList, "admincontrols")
//         }
//         //  catch (error) {
//         //     console.error("Error fetching admin controls:", error);
//         //     toast.error("Failed to fetch admin controls. Please try again later.");
//         // }
//         catch (ex) {
//             if (ex.response && ex.response.status === 400) {
//                 toast.error(ex.response.data);
//             }
//         }
//     };

//     const handleAdminControls = (key, value) => {
//         const updatedControls = adminControlsList.map(control => {
//             if (control.key === key) {
//                 control.value = control.value === "ENABLE" ? "DISABLE" : "ENABLE";
//                 if (selectedControls.includes(key)) {
//                     setSelectedControls(selectedControls.filter(controlKey => controlKey !== key));
//                 } else {
//                     setSelectedControls([...selectedControls, key]);
//                 }
//             }
//             return control;
//         });
//         setAdminControlsList(updatedControls);
//     };
//     const handleSubmitButton = () => {
//         setShowModal(true);
//     };

//     const handleConfirm = async () => {
//         setBtnDisabled(true);
//         try {
//             const payload = {
//                 login: adminControlsList[0].value,
//                 register: adminControlsList[1].value,
//                 withdraw: adminControlsList[2].value,

//             };
//             const response = await backEndCallObj("/admin/admin_status", payload);
//             console.log(response, "comform")
//             toast.success("Admin Controls are updated successfully");


//             fetchData();
//             // adminControlsList()
//             setShowModal(false);

//         } catch (ex) {
//             if (ex.response && ex.response.status === 400) {
//                 toast.error(ex.response?.data);
//             }
//         } finally {
//             setBtnDisabled(false);
//         }
//     };
//     // if (authService.getCurrentUser()?.admin_type !== "1") {
//     //     window.history.back();
//     // }
//     console.log(adminControlsList, "admincontrollist")
//     return (

//         <div className="container-fluid">
//             <div className="row">
//                 <div className="col-lg-12">
//                     <div className="card shadow-none mt-0">
//                         <div className="card-header">
//                             <h5 className="card-title mb-0">ADMIN CONTROLS</h5>
//                         </div>
//                         <div className="card-body">
//                             <div className="table-responsive">
//                                 <table className="table border table-bordered table-centered">
//                                     <thead>
//                                         <tr>
//                                             <th scope="col">Admin Controls</th>
//                                             <th scope="col">Current Status</th>
//                                             <th scope="col">Enable / Disable</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {adminControlsList && adminControlsList.map((control, index) => (
//                                             <tr key={index}>
//                                                 <td>{control.heading}</td>
//                                                 <td>{control.value.toUpperCase()}</td>
//                                                 <td>
//                                                     <button
//                                                         type="button"
//                                                         className="btn btn-light"
//                                                         onClick={() => handleAdminControls(control.key, control.value)}
//                                                         style={{
//                                                             width: "150px",
//                                                             backgroundColor: Object.values(control)[0].toUpperCase() === "DISABLE" ? "#28a745a8" : "rgb(240 110 32 / 76%)",
//                                                         }}
//                                                     >
//                                                         {control.value.toUpperCase() === "ENABLE" ? "DISABLE" : "ENABLE"}
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                             {loading && (
//                                 <div className="text-center mt-3">
//                                     <div
//                                         className="spinner-border spinner-border-s"
//                                         style={{ color: "blue" }}
//                                         role="status"
//                                     >
//                                         <span className="sr-only"></span>
//                                     </div>
//                                 </div>
//                             )}
//                             {!loading && (
//                                 <div className="card-footer d-flex justify-content-end">
//                                     <button
//                                         className="btn btn-primary"
//                                         onClick={handleSubmitButton}
//                                     >
//                                         Save Changes
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                     {showModal ? (
//                         <Modal
//                             show={true}
//                         // aria-labelledby="contained-modal-title-vcenter"
//                         // centered
//                         >
//                             <Modal.Header>
//                                 <h4>Confirmation</h4>
//                             </Modal.Header>
//                             <Modal.Body>
//                                 <p>
//                                     Do you really want to change{" "}
//                                     <strong>{selectedControls.join(", ").toUpperCase()}</strong> admin controls status?
//                                 </p>
//                             </Modal.Body>
//                             <Modal.Footer>
//                                 <button
//                                     className="btn btn-secondary btn-sm"
//                                     onClick={() => setShowModal(false)}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     className="btn btn-primary"
//                                     onClick={handleConfirm}
//                                     disabled={btnDisabled}
//                                 >
//                                     Confirm
//                                 </button>
//                             </Modal.Footer>
//                         </Modal>) : null}
//                 </div>
//             </div>

//         </div>

//     );
// }

// export default AddminControlls;


import React, { useEffect, useState } from 'react';
import { backEndCall, backEndCallObj } from '../../services/mainServiceFile';
import { Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useMovieContext } from '../comman/Context';
import Kyc_url from './kyc_url';

function AddminControlls() {
    const { adminControlsList, setAdminControlsList, selectedControls, setSelectedControls } = useMovieContext();
    const [btnDisabled, setBtnDisabled] = useState(true); // Initially disabled
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (adminControlsList.length === 0) {
            fetchData();
        }
    }, []);

    useEffect(() => {
        // Check if any admin control's status has changed
        const hasChanges = adminControlsList.some(control => control.value !== control.originalValue);
        setBtnDisabled(!hasChanges); // Disable if no changes, enable if changes
    }, [adminControlsList]);
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await backEndCall("/admin/get_admin_controls");
            // console.log(response, "response")
            const controls = ["login", "register", "withdraw", "emi_type"].map(key => ({
                value: response[key]?.toUpperCase(),
                originalValue: response[key]?.toUpperCase(),
                key,
                heading: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
            }));
            setAdminControlsList(controls);
            setLoading(false);
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data);
            }
        }
    };
    // const fetchData = async () => {
    //     try {
    //         setLoading(true);
    //         const response = await backEndCall("/admin/get_admin_controls");
    //         console.log(response, "resposne")
    //         const controls = ["login", "register", "withdraw", "emi_type"].map(key => ({
    //             value: response[key].toUpperCase(),
    //             originalValue: response[key].toUpperCase(),
    //             key,
    //             heading: key.charAt(0).toUpperCase() + key.slice(1),
    //         }));
    //         setAdminControlsList(controls);
    //         setLoading(false);
    //     } catch (ex) {
    //         if (ex.response && ex.response.status === 400) {
    //             toast.error(ex.response.data);
    //         }
    //     }
    // };

    // const handleAdminControls = (key, value) => {
    //     const updatedControls = adminControlsList.map(control => {
    //         if (control.key === key) {
    //             control.value = control.value === "ENABLE" ? "DISABLE" : "ENABLE";
    //             control.value = control.value === "standard" ? "floating’" : "ENABLE";

    //             if (selectedControls.includes(key)) {
    //                 setSelectedControls(selectedControls.filter(controlKey => controlKey !== key));
    //             } else {
    //                 setSelectedControls([...selectedControls, key]);
    //             }
    //         }
    //         return control;
    //     });
    //     setAdminControlsList(updatedControls);
    // };

    const handleAdminControls = (key, value) => {
        const updatedControls = adminControlsList.map(control => {
            if (control.key === key) {
                if (control.key === "emi_type") {
                    control.value = control.value === "STANDARD" ? "FLOATING" : "STANDARD";
                } else {
                    control.value = control.value === "ENABLE" ? "DISABLE" : "ENABLE";
                }

                if (selectedControls.includes(key)) {
                    setSelectedControls(selectedControls.filter(controlKey => controlKey !== key));
                } else {
                    setSelectedControls([...selectedControls, key]);
                }
            }
            return control;
        });
        setAdminControlsList(updatedControls);
    };

    const handleSubmitButton = () => {
        setShowModal(true);
    };

    const handleConfirm = async () => {
        setBtnDisabled(true);
        try {
            const payload = {
                login: adminControlsList[0].value,
                register: adminControlsList[1].value,
                withdraw: adminControlsList[2].value,
                emi_type: adminControlsList[3].value,


            };
            const response = await backEndCallObj("/admin/admin_status", payload);
            console.log(response, "comform")
            toast.success("Admin Controls are updated successfully");


            fetchData();
            // adminControlsList()
            setShowModal(false);

        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response?.data);
            }
        } finally {
            setBtnDisabled(false);
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-12">
                    <div className="card shadow-none mt-0">
                        <div className="card-header">
                            <h5 className="card-title mb-0">Admin Controls</h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table border table-bordered table-centered text-center">
                                    <thead className='text-center'>
                                        <tr>
                                            <th scope="col">Admin Controls</th>
                                            <th scope="col">Current Status</th>
                                            <th scope="col">Enable / Disable</th>
                                        </tr>
                                    </thead>
                                    <tbody className='text-center'>
                                        {adminControlsList && adminControlsList.map((control, index) => (
                                            <tr key={index}>
                                                <td>{control.heading}</td>
                                                <td>{control.value.toUpperCase()}</td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-light"
                                                        onClick={() => handleAdminControls(control.key, control.value)}
                                                        // style={{
                                                        //     width: "150px",
                                                        //     backgroundColor: Object.values(control)[0].toUpperCase() === "DISABLE" ? "#28a745a8" : "rgb(240 110 32 / 76%)",
                                                        // }}
                                                        style={{
                                                            width: "150px",
                                                            backgroundColor: control.key === "emi_type"
                                                                ? (control.value === "STANDARD" ? "rgb(240 110 32 / 76%)" : "#28a745a8") // Blue for STANDARD, Yellow for FLOATING
                                                                : (control.value === "DISABLE" ? "#28a745a8" : "rgb(240 110 32 / 76%)"),
                                                        }}
                                                    >
                                                        {/* {control.value.toUpperCase() === "ENABLE" ? "DISABLE" : "ENABLE"} */}
                                                        {control.key === "emi_type"
                                                            ? (control.value === "STANDARD" ? "FLOATING" : "STANDARD")
                                                            : (control.value === "ENABLE" ? "DISABLE" : "ENABLE")}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {loading && (
                                <div className="text-center mt-3">
                                    <div className="spinner-border spiner-border-sm" style={{ color: "blue" }} role="status">
                                        <span className="sr-only"></span>
                                    </div>
                                </div>
                            )}
                            <div className="card-footer d-flex justify-content-end">
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSubmitButton}
                                    disabled={btnDisabled} // Disable button when no changes
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                        <Kyc_url></Kyc_url>
                    </div>

                    {/* Modal for confirmation */}

                    {showModal && (
                        <Modal show={true}>



                            <Modal.Header>
                                <h4>Confirmation</h4>
                            </Modal.Header>
                            <Modal.Body>
                                <p>
                                    Do you really want to change{" "}
                                    {/* <strong>{selectedControls.join(", ").toUpperCase()}</strong> */}
                                    admin controls status?
                                </p>
                            </Modal.Body>
                            <Modal.Footer>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleConfirm}
                                    disabled={btnDisabled}
                                >
                                    Confirm
                                </button>
                            </Modal.Footer>

                        </Modal>
                    )}
                </div>
            </div>
        </div >
    );
}

export default AddminControlls;
