// import React, { useState, useEffect } from 'react';
// import { useHistory, useNavigate, useParams } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { backEndCallObj } from '../../services/mainServiceFile';
// import { Navigate } from 'react-router-dom';

// function EligibilityForm() {
//     const Navigate = useNavigate();
//     const { id } = useParams(); // Get the ID of the eligibility to edit from the URL params
//     const [eligibilityData, setEligibilityData] = useState({
//         cibilScore: '',
//         minLoanAmount: '',
//         maxLoanAmount: '',
//         tenure: [{ months: '', interest: '' }]
//     });
//     const [btnDisabled, setBtnDisabled] = useState(false);
//     const isEditMode = !!id;
//     useEffect(() => {
//         if (eligibility <= 0) {
//             fetchData();
//         }
//     }, []);

//     const fetchData = async () => {
//         try {
//             setLoading(true);
//             const response = await backEndCall("/admin/get_admin_controls");
//             setEligibility(response?.eligibility || []);
//             setLoading(false);
//         } catch (ex) {
//             if (ex.response && ex.response.status === 400) {
//                 toast.error(ex.response.data);
//             }
//         }
//     };
//     useEffect(() => {
//         if (isEditMode) {
//             fetchData(id)
//         }
//     }, [isEditMode, id]);

//     const handleFormSubmit = async (e) => {
//         e.preventDefault();
//         setBtnDisabled(true);
//         try {
//             if (isEditMode) {
//                 const response = await backEndCall("/admin/get_admin_controls");
//                 toast.success("Eligibility updated successfully");
//             } else {
//                 // Add eligibility logic...
//                 const response = await backEndCallObj("/admin/admin_controls_update", newEligibility);
//             }
//            Navigate('/'); // Redirect to the main page after adding/editing eligibility
//         } catch (ex) {
//             // Error handling
//         } finally {
//             setBtnDisabled(false);
//         }
//     };

//     return (
//         <>
//             <h5 className="mb-4">{isEditMode ? 'Edit Eligibility' : 'Add New Eligibility'}</h5>
//             <form onSubmit={handleFormSubmit}>
//                 <form onSubmit={handleAddEligibility}>
//                     <div className="mb-3">
//                         <label htmlFor="nameControlInput" className="form-label">CIBIL Score</label>
//                         <input
//                             className='form-control'
//                             type="text"
//                             placeholder="CIBIL Score"
//                             value={newEligibility.cibilScore}
//                             onChange={e => setNewEligibility(prevState => ({ ...prevState, cibilScore: e.target.value }))}
//                             required
//                         />
//                     </div>
//                     <div className="mb-3">
//                         <label htmlFor="nameControlInput" className="form-label">Minimum Loan Amount</label>
//                         <input
//                             className='form-control'
//                             type="number"
//                             placeholder="Minimum Loan Amount"
//                             value={newEligibility.minLoanAmount}
//                             onChange={e => setNewEligibility(prevState => ({ ...prevState, minLoanAmount: e.target.value }))}
//                             required
//                         />
//                     </div>
//                     <div className="mb-3">
//                         <label htmlFor="nameControlInput" className="form-label">Maximum Loan Amount</label>
//                         <input
//                             className='form-control'
//                             type="number"
//                             placeholder="Maximum Loan Amount"
//                             value={newEligibility.maxLoanAmount}
//                             onChange={e => setNewEligibility(prevState => ({ ...prevState, maxLoanAmount: e.target.value }))}
//                             required
//                         />
//                     </div>
//                     <div className="mb-3">
//                         <label>Tenure:</label>
//                         {newEligibility.tenure.map((tenure, index) => (
//                             <div key={index}>
//                                 <label htmlFor="nameControlInput" className="form-label">Months</label>
//                                 <input
//                                     className='form-control mb-3'
//                                     type="number"
//                                     placeholder="Months"
//                                     value={tenure.months}
//                                     onChange={e => {
//                                         const updatedTenure = [...newEligibility.tenure];
//                                         updatedTenure[index] = { ...updatedTenure[index], months: e.target.value };
//                                         setNewEligibility(prevState => ({ ...prevState, tenure: updatedTenure }));
//                                     }}
//                                     name={`months_${index}`}
//                                 />
//                                 <label htmlFor="nameControlInput" className="form-label">Interest</label>
//                                 <input
//                                     className='form-control mb-3'
//                                     type="number"
//                                     placeholder="Interest"
//                                     value={tenure.interest}
//                                     onChange={e => {
//                                         const updatedTenure = [...newEligibility.tenure];
//                                         updatedTenure[index] = { ...updatedTenure[index], interest: e.target.value };
//                                         setNewEligibility(prevState => ({ ...prevState, tenure: updatedTenure }));
//                                     }}
//                                     name={`interest_${index}`}
//                                 />
//                                 <button className="btn-primary btn" onClick={() => handleDeleteTenure(index)}>Delete</button>
//                             </div>
//                         ))}
//                     </div>
//                     <div>
//                         <button className="btn-primary btn me-2" onClick={handleAddTenure}>Add Tenure</button>
//                         <Button variant="primary" type="submit" disabled={btnDisabled}>{editIndex !== null ? "Update" : "Submit"}</Button>
//                     </div>
//                 </form>
//                 <button className="btn-primary btn me-2" onClick={handleAddTenure}>Add Tenure</button>
//                 <button className="btn-primary btn" type="submit" disabled={btnDisabled}>{isEditMode ? 'Update' : 'Submit'}</button>
//             </form>
//         </>
//     );
// }
// export default EligibilityForm;