

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { backEndCall, backEndCallObj } from "../../services/mainServiceFile";
import { useNavigate } from "react-router-dom";
import { useMovieContext } from "../comman/Context";
import moment, { months } from "moment";
import { Modal, Button } from "react-bootstrap";
import { saveAs } from 'file-saver';
function LoanStatus() {
  const { loanList, setLoanList, userprofileData, setUserEligibility, usereligibility } = useMovieContext();
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [cancelLoanId, setCancelLoanId] = useState(null);
  const [interest, setInterest] = useState('');
  const [emi, setEmi] = useState('');



  const navigate = useNavigate();

  const fetchData = async () => {
    // console.log(userprofileData);
    setBtnDisabled(true);
    try {
      if (!loanList) {
        setLoading(true);
        const response = await backEndCall("/users/user_loan_details");
        // console.log(response, "loan details");
        setLoanList(response);
        setLoading(false);
      } else {
        setLoanList(loanList);
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error(ex.response.data);
        // navigate("/loaneligibilitydetails");
        setLoading(false);
      }
    } finally {
      setBtnDisabled(false);
    }
  };

  useEffect(() => {
    if (!loanList || loanList.length === 0) {
      fetchData();
    }
  }, [loanList]);
  useEffect(() => {

    if (usereligibility <= 0 || !usereligibility) {
      fetchDataeligbity();
    }
  }, []);

  const fetchDataeligbity = async () => {
    try {
      setLoading(true);
      const response = await backEndCall("/users/matching_eligibility");
      // console.log(response, "response")

      setUserEligibility(response);
      setLoading(false);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error(ex.response.data);
      }
    }
  };

  const findInterest = (months, loan_amount) => {
    // console.log(months, loan_amount, "intrest")

    const filteredData = usereligibility[0]?.tenure.filter(item => item.months === months);
    // console.log(filteredData, "filterdata")
    const calculateEMI = (loan_amount * (filteredData[0]?.interest / 100 * months / 12) + loan_amount) / months

    setEmi(calculateEMI.toFixed(2));

    setInterest(filteredData[0]?.interest)


    return ""
  }


  const formattedDate = (date) => {
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
  };

  const handleEdit = async (loan_id, loan_status) => {
    try {
      setBtnDisabled(true);
      setLoading(true);
      const payload = { loan_id, loan_status };
      const response = await backEndCallObj("/user/cancel_loan", payload);
      // console.log(response);
      setLoanList((prevLoanList) => {
        const updatedLoanList = prevLoanList.map((loan) =>
          loan.loan_id === loan_id
            ? { ...loan, loan_status: "Cancelled" }
            : loan
        );
        return updatedLoanList;
      });

    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error(ex.response.data);
      }
    } finally {
      setLoading(false);
      setBtnDisabled(false);
    }
  };

  const handleShowModal = (loan) => {
    setSelectedLoan(loan);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLoan(null);
  };
  const handleConfirmationModal = (loan_id) => {
    setCancelLoanId(loan_id);
    setShowConfirmationModal(true);
  };

  // Function to handle canceling the loan
  const handleCancelLoan = async () => {
    try {
      setBtnDisabled(true);
      setLoading(true);
      const payload = { loan_id: cancelLoanId, loan_status: "Cancelled" };
      const response = await backEndCallObj("/user/cancel_loan", payload);
      // console.log(response);
      setLoanList((prevLoanList) => {
        const updatedLoanList = prevLoanList.map((loan) =>
          loan.loan_id === cancelLoanId
            ? { ...loan, loan_status: "Cancelled" }
            : loan
        );
        return updatedLoanList;
      });
      toast.success("Loan cancelled successfully!");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error(ex.response.data);
      }
    } finally {
      setLoading(false);
      setBtnDisabled(false);
      setShowConfirmationModal(false); // Close the confirmation modal
    }
  };

  const generateDownloadableContent = () => {
    const content = `
        Customer Name: ${userprofileData?.full_name || "N/A"}
        Loan Amount: ₱ ${selectedLoan?.loan_amount || "N/A"}
        Applied Date: ${formattedDate(selectedLoan?.date_of_applycation) || "N/A"}
        Months: ${selectedLoan?.months || "N/A"}
        Loan Id: ${selectedLoan?.loan_id || "N/A"}
        Interest: ${interest || "N/A"}%
        Passport No: ${userprofileData?.passport_number || "N/A"}
        EMI: ₱ ${emi || "N/A"}
        Tin No: ${userprofileData?.tin_number || "N/A"}
        Loan Type: ${selectedLoan?.loan_type || "N/A"}
        Phone Number: ${userprofileData?.phone_number || "N/A"}
        Loan Status: ${selectedLoan?.loan_status || "N/A"}
        
       
    `;

    return new Blob([content], { type: "text/plain;charset=utf-8" });
  };

  const handleDownload = () => {
    const blob = generateDownloadableContent();
    saveAs(blob, "loan_details.txt");
  };

  return (
    <div className="user-details-container">
      <style>
        {`
        .table th, .table td {
          border: 1px solid #dee2e6;
        }
        .modal-header, .modal-body, .modal-footer {
          background-color: #f8f9fa;
        }
      `}
      </style>
      <h5 className="mb-4">Loan Status</h5>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="Loan_Status">
                <div className="table-responsive">
                  <table className="table table-bordered table-centered text-center">
                    <thead>
                      <tr>
                        {/* <th scope="col">Customer</th> */}
                        <th scope="col">Applied Date</th>
                        <th scope="col">Passport NO</th>
                        <th scope="col">Tin No</th>
                        <th scope="col">Loan Amount</th>
                        <th scope="col">Months</th>
                        <th scope="col">Loan Type</th>
                        <th scope="col">Loan Status</th>
                        <th scope="col">Loan Details</th>


                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loanList &&
                        loanList.length > 0 &&
                        loanList.map((loan, index) => (
                          <tr key={index}>
                            {/* <td className="text-center">


                              {loan.photo?.includes("image") ? (
                                <img src={loan?.photo} className="document_image1 mt-1 rounded-2" />
                              ) : <embed src={loan?.photo} className="document_image1 mt-1 rounded-2" />
                              }
                              <h6>{loan?.name}</h6>

                            </td> */}

                            <td>{formattedDate(loan?.date_of_applycation)}</td>

                            <td>{userprofileData?.passport_number == null ? " N/A " : userprofileData?.passport_number}</td>

                            <td>{userprofileData?.tin_number == null ? " N/A " : userprofileData?.tin_number}</td>

                            <td className="text-primary">
                              ₱ {loan?.loan_amount}
                            </td>

                            <td>{loan?.months}</td>

                            <td>{loan?.loan_type}</td>

                            <td>
                              <div
                                className={`loan_status ${loan?.loan_status === "completed"
                                  ? "bg-success fw-bold"
                                  : loan.loan_status === "Processing"
                                    ? "bg-warning fw-bold"
                                    : loan.loan_status === "Rejected"
                                      ? "bg-danger fw-bold"
                                      : loan.loan_status === "Cancelled"
                                        ? "bg-secondary fw-bold"
                                        : loan.loan_status === "Approved"
                                          ? "bg-info fw-bold"
                                          : "bg-dark fw-bold"
                                  }`}
                              >
                                {loan?.loan_status}
                              </div>
                            </td>

                            <td>
                              <div

                                onClick={() => { handleShowModal(loan); findInterest(loan.months, loan.loan_amount); }}

                                style={{ cursor: "pointer", color: "blue" }}
                              >
                                View Details
                              </div>
                            </td>

                            <td>
                              {loan?.loan_status === "Processing" && (
                                <button
                                  className="btn btn-danger mt-2"
                                  onClick={() => handleConfirmationModal(loan.loan_id)} // Open the confirmation modal
                                  disabled={btnDisabled}
                                >
                                  Cancel Loan
                                </button>
                              )}
                              {loan.loan_status == "Approved" && (
                                <button
                                  className="btn btn-primary"
                                  onClick={() =>
                                    navigate("/emidetails", {
                                      state: { formId: loan.loan_id },
                                    })
                                  }
                                >
                                  Go to Emi Details
                                </button>
                              )}
                              {(loan?.loan_status === "Cancelled" || loan?.loan_status === "Rejected" || loan?.loan_status === "completed") && (
                                "Your loan application has been " + loan.loan_status.toUpperCase()
                                // + ". Please contact support for further assistance."
                              )}

                            </td>

                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <div>
                    {/* Next EMI Date: {getNextNearestEMIDate()} */}
                  </div>
                </div>
                {loading && (
                  <div className="text-center mt-3">
                    <div
                      className="spinner-border spiner-border-sm"
                      style={{ color: "blue" }}
                      role="status"
                    >
                      <span className="sr-only"></span>
                    </div>
                  </div>
                )}
                {loanList?.length === 0 && (
                  <div className="text-center mt-3">
                    <p>No data found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for loan details */}
      {selectedLoan && (
        <Modal
          show={showModal}
          onHide={handleCloseModal}
          dialogClassName="modal-dialog "
        //  dialogClassName="modal-xl"
        >
          <Modal.Header closeButton>
            <Modal.Title>Loan Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <div className="d-flex justify-content-center mb-4">
                {/* <img
                  src={selectedLoan.photo}
                  alt="User"
                  className="object-fit-cover rounded-circle"
                  style={{ width: "45px", height: "45px" }}
                /> */}
                <h6>{selectedLoan?.name}</h6>
              </div>
            </div>
            {/* {console.log(selectedLoan?.photo, "photo")}
            {console.log(selectedLoan?.pay_slip, "payslip")} */}
            <div className="row ">
              <div className="col-6">
                <p>
                  <strong>Customer Name:</strong> {userprofileData?.full_name}{" "}
                </p>
              </div>
              <div className="col-6">
                <p>
                  <strong>Loan Amount:</strong>  ₱ {selectedLoan.loan_amount}
                </p>
              </div>
              <div className="col-6">
                <p>
                  <strong>Applied Date:</strong>{" "}
                  {formattedDate(selectedLoan.date_of_applycation)}
                </p>
              </div>
              <div className="col-6">
                <p>
                  <strong>Months:</strong> {selectedLoan.months}
                </p>
              </div>

              <div className="col-6">
                <p>
                  <strong>Loan Id:</strong> {selectedLoan?.loan_id}
                </p>
              </div>
              <div className="col-6">
                <p>
                  <strong>Interest:</strong> {interest}%
                </p>
              </div>
              <div className="col-6">
                <p>
                  <strong>Passport No:</strong>{" "}
                  {userprofileData?.passport_number ? userprofileData?.passport_number : "NA"}
                </p>
              </div>
              <div className="col-6">
                <p>
                  <strong>EMI:</strong>  ₱ {emi}
                </p>
              </div>


              <div className="col-6">
                <p>
                  <strong>Tin No:</strong> {userprofileData?.tin_number ? userprofileData?.tin_number : "NA"}
                </p>
              </div>

              <div className="col-6">
                <p>
                  <strong>Loan Type:</strong> {selectedLoan.loan_type}
                </p>
              </div>

              <div className="col-6">
                <p>
                  <strong>Phone Number:</strong> {userprofileData?.phone_number}
                </p>
              </div>


              <div className="col-6">
                <p>
                  <strong>Loan Status:</strong> {selectedLoan.loan_status}
                </p>
              </div>
            </div>

            <div className="d-flex justify-content-center">
              <div className="my-3 me-3">
                Pay Slip:{" "}
                {selectedLoan?.pay_slip && (
                  <div className="mt-2">
                    <a
                      href={selectedLoan?.pay_slip}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Pay Slip
                    </a>
                  </div>
                )}
              </div>
              <div className="my-3">
                Income Proof:{" "}
                {selectedLoan?.income_proof && (
                  <div className="mt-2">
                    <a
                      href={selectedLoan?.income_proof}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Income Proof
                    </a>
                  </div>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleDownload}>
              Download
            </Button>
            <Button variant="danger" onClick={handleCloseModal}>
              Close
            </Button>

          </Modal.Footer>
        </Modal>
      )}
      {showConfirmationModal &&
        <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to cancel this loan?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleCancelLoan} disabled={btnDisabled}>
              Confirm
            </Button>

          </Modal.Footer>
        </Modal>}
    </div>
  );
}

export default LoanStatus;
