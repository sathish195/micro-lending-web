
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from 'react-bootstrap';
import { backEndCall } from '../../services/mainServiceFile';
import { useNavigate } from 'react-router-dom';
import { useMovieContext } from '../comman/Context';

function LoaneligibilityDetails() {
    const navigate = useNavigate();
    const { usereligibility, setUserEligibility, userprofileData } = useMovieContext();
    const [loading, setLoading] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);

    useEffect(() => {
        if (usereligibility <= 0 || !usereligibility) {
            fetchData();
        }
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await backEndCall("/users/matching_eligibility");
            console.log(response, "responsedata")
            setUserEligibility(response);
            setLoading(false);
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data);
            }
        }
    };

    const calculateEMI = (loanAmount, interestRate, tenureMonths) => {
        const calculateEMI = (loanAmount * (interestRate / 100 * tenureMonths / 12) + loanAmount) / tenureMonths;
        return calculateEMI.toFixed(2);
    };

    const handleApplyLoan = (minLoanAmount, maxLoanAmount, tenureItem) => {
        if (userprofileData?.topwallet_user_id == "0") {
            navigate("/updateprofile");
        } else if (userprofileData?.topwallet_user_id !== "0" && userprofileData?.kyc_status !== "verified") {
            navigate("/kyc");
        } else {
            navigate('/applyloan', {
                state: {
                    minAmount: minLoanAmount,
                    maxAmount: maxLoanAmount
                }
            });
        }
    };

    return (
        <>
            <div className="user-details-container">
                <h5 className="mb-4">Eligibility Loans</h5>
                <div className='card'>
                    <div className='card-body'>
                        <div className="table-responsive">
                            <table className="table table-bordered mb-5">
                                <thead className='text-center'>
                                    <tr>
                                        <th>Credit Score</th>
                                        <th>Min Loan Amount</th>
                                        <th>Max Loan Amount</th>
                                        <th>Tenure</th>
                                        <th>Interest</th>
                                        <th>Apply</th>
                                    </tr>
                                </thead>
                                <tbody className='align-middle text-center'>
                                    {
                                        usereligibility?.map((dataItem, dataIndex) => (
                                            <tr key={dataIndex}>
                                                <td>{dataItem.cibilScore}</td>
                                                <td>₱ {dataItem.minLoanAmount}</td>
                                                <td>₱ {dataItem.maxLoanAmount}</td>
                                                <td>
                                                    <table className="table table-borderless mb-0">
                                                        <tbody>
                                                            {dataItem.tenure?.map((tenureItem, tenureIndex) => (
                                                                <tr key={tenureIndex}>
                                                                    <td className='border-bottom'>{tenureItem?.months} months</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </td>
                                                <td>
                                                    <table className="table table-borderless mb-0">
                                                        <tbody>
                                                            {dataItem.tenure?.map((tenureItem, tenureIndex) => (
                                                                <tr key={tenureIndex}>
                                                                    <td className='border-bottom'>{tenureItem?.interest}%</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </td>
                                                <td>
                                                    <Button onClick={() => handleApplyLoan(dataItem.minLoanAmount, dataItem.maxLoanAmount)}>Apply</Button>

                                                    {/* <Button onClick={() => handleApplyLoan(usereligibility.minLoanAmount, usereligibility.maxLoanAmount)}>Apply</Button> */}
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            {loading && (
                                <div className="d-flex justify-content-center align-items-center">
                                    <div className="spinner-border spiner-border-sm" style={{ color: "blue" }} role="status">
                                        <span className="sr-only"></span>
                                    </div>
                                </div>
                            )}
                            {usereligibility?.length === 0 && !loading && (
                                <div className="d-flex justify-content-center align-items-center">
                                    <div className="text-center">
                                        No data found.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoaneligibilityDetails;

