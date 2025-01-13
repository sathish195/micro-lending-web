import React from 'react';
import { useLocation } from 'react-router-dom';
import moment from 'moment';

function LoanDetails() {
    const location = useLocation();
    const { loan } = location.state;

    const formattedDate = (date) => {
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
    };

    return (
        <div className="loan-details-container">
            <h2>Loan Details for {loan.name}</h2>
            <div className="loan-details">
                <p><strong>Customer Name:</strong> {loan.name}</p>
                <p><strong>Applied Date:</strong> {formattedDate(loan.date_of_applycation)}</p>
                <p><strong>Passport NO:</strong> {loan.passport_number}</p>
                <p><strong>Tin NO:</strong> {loan.tin_number}</p>
                <p><strong>Loan Amount:</strong>  ₱ {loan.loan_amount}</p>
                <p><strong>Months:</strong> {loan.months}</p>
                <p><strong>Loan Type:</strong> {loan.loan_type}</p>
                <p><strong>Loan Status:</strong> {loan.loan_status}</p>

            </div>
            <div className="application-form">
                <h3>Application Form</h3>
                {/* Render the application form details here */}
            </div>
        </div>
    );
}

export default LoanDetails;
