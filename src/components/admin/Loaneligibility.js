

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Modal, Button, Form } from 'react-bootstrap';
import { useMovieContext } from '../comman/Context';
import { backEndCall, backEndCallObj } from '../../services/mainServiceFile';
import Joi from 'joi';

function Loaneligibility() {
    const { eligibility, setEligibility, setErrors } = useMovieContext();
    const [showAddEligibilityModal, setShowAddEligibilityModal] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [newEligibility, setNewEligibility] = useState({
        cibilScore: '',
        minLoanAmount: '',
        maxLoanAmount: '',
        tenure: [{ months: '', interest: '' }]
    });
    const schema = Joi.object({
        cibilScore: Joi.string()
            .pattern(/^\d+-\d+$/)
            .required()
            .messages({
                "string.pattern.base": "Invalid CIBIL Score format. Please enter a valid format like '300-900'.",
                "any.required": "CIBIL Score is required."
            }),
        minLoanAmount: Joi.number().min(0)
            .required()
            .messages({
                "number.min": "Minimum Loan Amount must be at least 0.",
                "any.required": "Minimum Loan Amount is required."
            }),
        maxLoanAmount: Joi.number().min(500)
            .required()
            .messages({
                "number.min": "Maximum Loan Amount must be at least 500.",
                "any.required": "Maximum Loan Amount is required."
            }),
        tenure: Joi.array().items(
            Joi.object({
                months: Joi.number().min(1).required().messages({
                    "number.min": "Months must be at least 1.",
                    "any.required": "Months are required."
                }),
                interest: Joi.number().min(0).required().messages({
                    "number.min": "Interest must be at least 0.",
                    "any.required": "Interest is required."
                })
            })
        )
    });
    const [loading, setLoading] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deletingCibilRangeId, setDeletingCibilRangeId] = useState(null);
    const [errors, setFormErrors] = useState({});
    useEffect(() => {
        if (eligibility <= 0) {
            fetchData();
        }
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await backEndCall("/admin/get_admin_controls");
            // console.log(response,"response")
            setEligibility(response?.eligibility || []);
            setLoading(false);
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data);
            }
        }
    };
    // const handleAddEligibility = async (e) => {
    //     e.preventDefault();
    //     setBtnDisabled(true);
    //     try {
    //         setLoading(true);
    //         const { error } = schema.validate(newEligibility, { abortEarly: false });
    //         if (error) {
    //             const validationErrors = {};
    //             error.details.forEach(detail => {
    //                 validationErrors[detail.path[0]] = detail.message;
    //             });
    //             setFormErrors(validationErrors);
    //             setLoading(false);
    //             setBtnDisabled(false);
    //             return;
    //         }

    //         const updatedEligibility = [...eligibility];
    //         updatedEligibility[editIndex] = newEligibility;

    //         const response = await backEndCallObj("/admin/admin_controls_update", newEligibility);
    //         setEligibility(response.eligibility);

    //         toast.success("Eligibility updated successfully");
    //         setShowAddEligibilityModal(false);
    //         setNewEligibility({
    //             cibilScore: '',
    //             minLoanAmount: '',
    //             maxLoanAmount: '',
    //             tenure: [{ months: '', interest: '' }]
    //         });
    //     } catch (ex) {
    //         if (ex.response && ex.response.status === 400) {
    //             toast.error(ex.response?.data);
    //         }
    //     } finally {
    //         setBtnDisabled(false);
    //         setLoading(false);
    //     }
    // };


    // const handleAddEligibility = async (e) => {
    //     e.preventDefault();
    //     setBtnDisabled(true);
    //     console.log("enter")
    //     try {
    //         setLoading(true);
    //         console.log("enter2")
    //         const { error } = schema.validate(newEligibility, { abortEarly: false });
    //         if (error) {
    //             const validationErrors = {};
    //             error.details.forEach(detail => {
    //                 validationErrors[detail.path[0]] = detail.message;
    //             });
    //             setFormErrors(validationErrors);
    //             setLoading(false);
    //             setBtnDisabled(false);
    //             return;
    //         }
    //         console.log("enter3")

    //         if (editIndex !== null) {

    //             const updatedEligibility = [...eligibility];
    //             updatedEligibility[editIndex] = newEligibility;
    //             const obj1String = JSON.stringify(eligibility)
    //             const obj2String = JSON.stringify(updatedEligibility)
    //             if (obj1String === obj2String) {
    //                 window.location.href = '/loaneligibility';
    //                 // console.log('same');
    //             }
    //             console.log("enter4")
    //             const response = await backEndCallObj("/admin/admin_controls_update", newEligibility);
    //             console.log(response, "response")
    //             fetchData();
    //             setLoading(false);
    //             setEligibility(response.eligibility);
    //             setEditIndex(null);
    //         } else {
    //             const response = await backEndCallObj("/admin/admin_controls_update", newEligibility);
    //             fetchData();
    //             setLoading(false);
    //         }
    //         setShowAddEligibilityModal(false);
    //         setNewEligibility({
    //             cibilScore: '',
    //             minLoanAmount: '',
    //             maxLoanAmount: '',
    //             tenure: [{ months: '', interest: '' }]
    //         });
    //         toast.success("New eligibility added successfully");
    //     } catch (ex) {
    //         if (ex.response && ex.response.status === 400) {
    //             // console.log(ex.response?.data);
    //             toast.error(ex.response?.data);
    //         }
    //     } finally {
    //         setBtnDisabled(false);
    //         setLoading(false);
    //     }
    // };
    const handleAddEligibility = async (e) => {
        e.preventDefault();
        setBtnDisabled(true);
        try {
            setLoading(true);

            // Validate form inputs against Joi schema
            const { error } = schema.validate(newEligibility, { abortEarly: false });

            if (error) {
                // Handle validation errors
                const validationErrors = {};
                error.details.forEach(detail => {
                    validationErrors[detail.path[0]] = detail.message;
                });
                setFormErrors(validationErrors);
                setLoading(false);
                setBtnDisabled(false);
                return;
            }

            // Clear form errors if validation passes
            setFormErrors({});

            if (editIndex !== null) {
                // Update existing eligibility
                const updatedEligibility = [...eligibility];
                updatedEligibility[editIndex] = newEligibility;
                const obj1String = JSON.stringify(eligibility);
                const obj2String = JSON.stringify(updatedEligibility);
                if (obj1String === obj2String) {
                    window.location.href = '/loaneligibility'; // Redirect if no changes
                } else {
                    const response = await backEndCallObj("/admin/admin_controls_update", newEligibility);
                    setEligibility(response.eligibility);
                    toast.success("Eligibility updated successfully");
                }
            } else {
                // Add new eligibility
                const response = await backEndCallObj("/admin/admin_controls_update", newEligibility);
                setEligibility(response.eligibility);
                toast.success("New eligibility added successfully");
            }

            // Reset form state after successful backend call
            setShowAddEligibilityModal(false);
            setNewEligibility({
                cibilScore: '',
                minLoanAmount: '',
                maxLoanAmount: '',
                tenure: [{ months: '', interest: '' }]
            });
        } catch (ex) {
            // Handle API call errors
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response?.data);
            }
        } finally {
            // Ensure loading and button state are reset regardless of success or failure
            setLoading(false);
            setBtnDisabled(false);
        }
    };

    const handleShow = () => setShowAddEligibilityModal(true);

    const handleEditClick = (index) => {
        setEditIndex(index);
        setShowAddEligibilityModal(true);
        const selectedEligibility = eligibility[index];
        setNewEligibility(selectedEligibility);
    };

    const handleClose = () => {
        setShowAddEligibilityModal(false);
        setEditIndex(null);
        setNewEligibility({
            cibilScore: '',
            minLoanAmount: '',
            maxLoanAmount: '',
            tenure: [{ months: '', interest: '' }]
        });
        setFormErrors({});
    };
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update the state for the input field
        setNewEligibility(prevState => {
            const updatedState = {
                ...prevState,
                [name]: value
            };

            // Validate the updated state against the Joi schema
            const { error } = schema.validate(updatedState, { abortEarly: false });

            // Update the error state based on validation results
            if (error) {
                const validationErrors = {};
                error.details.forEach(detail => {
                    validationErrors[detail.path[0]] = detail.message;
                });
                setFormErrors(validationErrors);
            } else {
                // Clear errors if there are no validation errors
                setFormErrors({});
            }

            return updatedState;
        });
    };
    const handleTenureChange = (index, field, value) => {
        setNewEligibility(prevState => {
            const updatedTenure = [...prevState.tenure];
            updatedTenure[index][field] = value;
            const updatedState = {
                ...prevState,
                tenure: updatedTenure
            };

            // Validate the updated state against the Joi schema
            const { error } = schema.validate(updatedState, { abortEarly: false });

            // Update the error state based on validation results
            if (error) {
                const validationErrors = {};
                error.details.forEach(detail => {
                    validationErrors[detail.path[0]] = detail.message;
                });
                setFormErrors(validationErrors);
            } else {
                // Clear errors if there are no validation errors
                setFormErrors({});
            }

            return updatedState;
        });
    };

    const handleAddTenure = (e) => {
        setBtnDisabled(true);
        e.preventDefault();
        setNewEligibility(prevState => ({
            ...prevState,
            tenure: [...prevState.tenure, { months: '', interest: '' }]
        }));
        setBtnDisabled(false);
    };

    const handleDeleteTenure = (tenureIndex) => {
        setBtnDisabled(true);
        setNewEligibility(prevState => {
            const updatedTenure = [...prevState.tenure];
            updatedTenure.splice(tenureIndex, 1);
            return {
                ...prevState,
                tenure: updatedTenure
            };
        });
        setBtnDisabled(false);
    };

    const handleDeleteClick = (cibilRangeId) => {
        setDeletingCibilRangeId(cibilRangeId);
        // console.log("handle delete")
        setShowDeleteConfirmation(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await handleDelete(deletingCibilRangeId);
            setShowDeleteConfirmation(false);
            setDeletingCibilRangeId(null);
        } catch (error) {
            // Handle error if necessary
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirmation(false);
        setDeletingCibilRangeId(null);
    };

    const handleDelete = async (cibilRangeId) => {
        setBtnDisabled(true);
        try {
            const response = await backEndCallObj("/admin/remove_eligibility", { cibilRangeId });
            toast.success("Eligibility deleted successfully");

            setEligibility(response.eligibility);
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response?.data);
            }
        } finally {
            setBtnDisabled(false);
        }
    };
    useEffect(() => {
        // Clean up errors when component unmounts
        return () => {
            setErrors({});
        };
    }, []);
    return (
        <>
            <div className="user-details-container">
                <h5 className="mb-4">Eligibility Loans</h5>
                <div className='card'>
                    <div className='card-body scrolleHidden ' style={{ overflowY: "auto", height: "70vh" }}>
                        <Button variant="primary mb-4" onClick={handleShow} disabled={btnDisabled}>
                            Add New eligibility
                        </Button>


                        <div className="table-responsive">
                            <table className="table table-bordered table-centered">
                                <thead className='text-center'>
                                    <tr>
                                        <th>Credit Score</th>
                                        {/* <th>Present credit score</th> */}
                                        <th>Min Loan Amount</th>
                                        <th>Max Loan Amount</th>
                                        <th>Tenure</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='align-middle text-center'>
                                    {eligibility.map((eligibilityItem, index) => (
                                        <tr key={index}>
                                            <td>{eligibilityItem.cibilScore}</td>
                                            <td>{eligibilityItem.minLoanAmount}</td>
                                            <td>{eligibilityItem.maxLoanAmount}</td>
                                            <td>
                                                <ul>
                                                    {eligibilityItem.tenure.map((tenureItem, tenureIndex) => (
                                                        <li key={tenureIndex}>
                                                            {tenureItem.months} months at {tenureItem.interest}% interest
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td>
                                                <Button onClick={() => handleEditClick(index)} className="me-2 mb-2" disabled={btnDisabled} >Edit</Button>
                                                <Button onClick={() => handleDeleteClick(eligibilityItem.cibilRangeId)} disabled={btnDisabled} className='mb-2 me-2'>Delete</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <>
                            {loading && (
                                <div className="text-center mt-3">
                                    <div className="spinner-border spiner-border-sm" style={{ color: "blue" }} role="status">
                                        <span className="sr-only"></span>
                                    </div>
                                </div>)}
                        </>



                        {showAddEligibilityModal &&
                            <Modal show={showAddEligibilityModal} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Add/Edit Eligibility</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form onSubmit={handleAddEligibility}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>CIBIL Score</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="CIBIL Score"
                                                name="cibilScore"
                                                value={newEligibility.cibilScore}
                                                onChange={handleChange}
                                                isInvalid={!!errors.cibilScore}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.cibilScore}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Minimum Loan Amount</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Minimum Loan Amount"
                                                name="minLoanAmount"
                                                value={newEligibility.minLoanAmount}
                                                onChange={handleChange}
                                                isInvalid={!!errors.minLoanAmount}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.minLoanAmount}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Maximum Loan Amount</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Maximum Loan Amount"
                                                name="maxLoanAmount"
                                                value={newEligibility.maxLoanAmount}
                                                onChange={handleChange}
                                                isInvalid={!!errors.maxLoanAmount}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.maxLoanAmount}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tenure</Form.Label>
                                            {newEligibility.tenure.map((tenureItem, index) => (
                                                <div key={index} className="row mb-3">
                                                    <div className="col">
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="Months"
                                                            value={tenureItem.months}
                                                            onChange={(e) => handleTenureChange(index, 'months', e.target.value)}
                                                            isInvalid={!!errors[`tenure.${index}.months`]}
                                                        />
                                                        <Form.Control.Feedback type="invalid">{errors[`tenure.${index}.months`]}</Form.Control.Feedback>
                                                    </div>
                                                    <div className="col">
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="Interest %"
                                                            value={tenureItem.interest}
                                                            onChange={(e) => handleTenureChange(index, 'interest', e.target.value)}
                                                            isInvalid={!!errors[`tenure.${index}.interest`]}
                                                        />
                                                        <Form.Control.Feedback type="invalid">{errors[`tenure.${index}.interest`]}</Form.Control.Feedback>
                                                    </div>
                                                    <div className="col">
                                                        {index === newEligibility.tenure.length - 1 && (
                                                            <Button variant="link" onClick={handleAddTenure} className="p-0">
                                                                + Add More
                                                            </Button>
                                                        )}
                                                        {index !== 0 && (
                                                            <Button variant="link" onClick={() => handleDeleteTenure(index)} className="p-0 text-danger">
                                                                - Remove
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            {/* <Button variant="danger" onClick={() => handleDeleteTenure(index)}>Delete</Button>
                                        </div>
                                            ))} */}
                                            {/* <Button variant="success" onClick={handleAddTenure} className="mt-2">Add Tenure</Button>*/}
                                        </Form.Group>
                                        <Button variant="primary" type="submit" disabled={btnDisabled}>
                                            {editIndex !== null ? "Update" : "Submit"}
                                        </Button>
                                    </Form>
                                </Modal.Body>
                            </Modal>
                        }

                        {showDeleteConfirmation && (
                            <Modal show={showDeleteConfirmation} onHide={handleCancelDelete}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Confirmation</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    Are you sure you want to delete this eligibility?
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCancelDelete} disabled={btnDisabled}>
                                        Cancel
                                    </Button>
                                    <Button variant="danger" onClick={handleConfirmDelete} disabled={btnDisabled}>
                                        Delete
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        )}

                    </div>
                </div>
            </div >
        </>
    );
}

export default Loaneligibility;

