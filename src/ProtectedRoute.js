import React from "react";
import { Route, Navigate } from "react-router-dom";
import authService from "./services/authService";

const ProtectedRoute = ({ children }) => {
 
  return authService.getCurrentUser() ? (
    <>{children}</>
  ) : (
    <>
      <Navigate to="/landing"/>
    </>
  );
};
export default ProtectedRoute;

