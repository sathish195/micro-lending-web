
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { backEndCall } from '../../services/mainServiceFile';
import { useMovieContext } from '../comman/Context';
import Updateprofile from './Updateprofile';
import authService from '../../services/authService';
import { Navigate } from 'react-router-dom';

function KycRoot() {

    const [loading, setLoading] = useState(false);
    const { userprofileData, kycRoot, setKycRoot } = useMovieContext();

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await backEndCall("/users/get_kyc_url");
            // console.log(response, "kyc")
            setKycRoot(response);

            setLoading(false);
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data);
                // console.log(ex.response.data)
                setLoading(false);
            }
        }
    };

    useEffect(() => {

        if (authService.kycStatus() == "pending" && userprofileData?.topwallet_user_id !== "0") {
            fetchData();
        }
    }, []);

    const openKycIntegration = () => {
        const newWindow = window.open(kycRoot, "_self");
        if (newWindow) {
            // Close the current tab (old tab)
            window.close()
        } else {
            // Handle if pop-up blocker prevents opening the new tab
            toast.error('Failed to open KYC integration. Please check your browser settings.');
        }
    };
    // const openKycIntegration = () => {
    //     window.open(kycRoot, '_blank');
    //     // authService.logout()
    // };
    {
        if (userprofileData == null && loading) {
            return (
                <div className="text-center mt-3">
                    <div className="spinner-border spiner-border-sm" style={{ color: "blue" }} role="status">
                        <span className="sr-only"></span>
                    </div>
                </div>
            );
        }
    }
    return (
        <div>
            {/* {userprofileData?.topwallet_user_id === "0" ? (


                < Updateprofile />
            ) : ( */}
            <div className="user-details-container">
                <h5 className="mb-4">KYC Integration</h5>
                <div className="row justify-content-center"> {/* Centering the card */}
                    <div className="col-sm-10 col-md-8 col-lg-8 col-xl-8"> {/* Adjust width for different screen sizes */}
                        <div className="card">
                            <div className="card-body text-center">
                                <p className="mb-3">Please complete your KYC to continue using our services. Click the button below to start the KYC process.</p>
                                <p className="mb-3 text-muted">Your KYC information helps us verify your identity and keep your account secure. Make sure to have your identification documents ready.</p>

                                <div className="kyc-url-container p-3 bg-light mt-3 mb-2">
                                    {loading ? (
                                        <div className="kyc-url-container p-3 bg-light mt-3 mb-2">
                                            <button className='btn btn-primary' disabled>Loading...</button>
                                        </div>
                                    ) : (
                                        kycRoot && (
                                            <div className="kyc-url-container p-3 bg-light mt-3 mb-2">
                                                <button className='btn btn-primary' onClick={openKycIntegration}>KYC Start</button>
                                            </div>
                                        )
                                    )}
                                    {/* <button className='btn btn-primary' onClick={() => openKycIntegration(kycRoot)}>KYC Integration</button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* )} */}
        </div>

    );
}

export default KycRoot;
