import React from 'react';
import { Navigate } from 'react-router-dom';
import { useMovieContext } from '../src/components/comman/Context';

const KycProtectedRoute = ({ children }) => {
    const { userprofileData } = useMovieContext();
    const isKycVerified = userprofileData && userprofileData?.kyc_status === "verified";

    return isKycVerified ? children : <Navigate to="/kyc" />;
};

export default KycProtectedRoute;
