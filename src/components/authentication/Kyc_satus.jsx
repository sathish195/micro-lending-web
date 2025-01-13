import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { backEndCall } from '../../services/mainServiceFile';
import { useMovieContext } from '../comman/Context';

function KycStatus() {
    const { setUserprofileData } = useMovieContext();

    const fetchData = async () => {
        try {
            const existingToken = localStorage.getItem('token');
            const response = await backEndCall("/users/update_jwt");

            if (response.token) {
                if (existingToken) {
                    localStorage.removeItem('token'); // Remove existing token
                }
                localStorage.setItem('token', response.token); // Set new token from response

                // Fetch user profile data after updating the token
                const profileResponse = await backEndCall("/users/user_profile");
                setUserprofileData(profileResponse);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 custom-card-width">
                    <div className="card text-center">
                        <div className="card-body">
                            <h3 className="card-title text-success">KYC SUCCESS</h3>
                            <div className="kyc-url-container p-3 bg-light mt-3 mb-2">
                                <img
                                    className="img-fluid rounded"
                                    src="./assets/images/Verifier-passes-or-rejects-the-KYC-Application-after-verification.png"
                                    alt="KYC Verification Process"
                                />
                            </div>
                            <Link to="/">
                                <button className='btn btn-primary'>Back</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default KycStatus;
