import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const MovieContext = createContext();

export const MovieContextProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem("userDataJwt") ? jwtDecode(localStorage.getItem("userDataJwt")) : "");
  const [adminControlsList, setAdminControlsList] = useState([]);
  const [selectedControls, setSelectedControls] = useState([]);
  const [AddadminData, setAddadminData] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorOccur, setErrorOccur] = useState(false);


  const [usersList, setUsersList] = useState([]);

  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [textDisplay, setTextDisplay] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [EmiHistory, setEmiHistory] = useState([]);
  const [RecenttransactionHistory, setRecentTransactionHistory] = useState([]);
  // dashbord
  const [userData, setUserData] = useState(null);
  const [adminData, setAdminData] = useState(null);
  // verifyloans
  const [loanStatus, setLoanStatus] = useState("");
  const [verifyloan, setVerifyloan] = useState(
    []
  );
  const [bankDetails, setBankDetails] = useState({});
  const [eligibility, setEligibility] = useState([]);
  const [usereligibility, setUserEligibility] = useState(null)
  const [loanList, setLoanList] = useState(null);
  const [emis, setEmis] = useState({});
  // const [loading, setLoading] = useState();
  const [error, setError] = useState(null);

  const [userprofileData, setUserprofileData] = useState(null)
  const [transactionHistoryuser, setTransactionHistoryuser] = useState([])
  const [EmiHistoryuser, setEmiHistoryuser] = useState([])
  const [LoanListuser, setLoanListuser] = useState([])
  const [adminprofileData, setAdminprofileData] = useState(null)
  const [kycRoot, setKycRoot] = useState("");
  const [bkcall, setbkcall] = useState(false)
  useEffect(() => {
    return () => {
      setErrors({});
    };
  }, []);

  return (
    <MovieContext.Provider
      value={{
        user,
        setUser,

        adminControlsList, setAdminControlsList,
        selectedControls, setSelectedControls,
        errors,
        setErrors,
        errorOccur,
        setErrorOccur,
        loading,
        setLoading,
        usersList, setUsersList,

        skip, setSkip,
        limit, setLimit,
        textDisplay,
        setTextDisplay,
        transactionHistory, setTransactionHistory,
        RecenttransactionHistory, setRecentTransactionHistory,
        error, setError,
        userData, setUserData,
        adminData, setAdminData,
        AddadminData, setAddadminData,
        loanStatus, setLoanStatus,
        verifyloan,
        setVerifyloan,
        eligibility, setEligibility,
        usereligibility, setUserEligibility,
        loanList, setLoanList,
        emis, setEmis,
        userprofileData, setUserprofileData,
        EmiHistory, setEmiHistory,
        adminprofileData, setAdminprofileData,
        kycRoot, setKycRoot,
        bkcall, setbkcall,
        bankDetails, setBankDetails,
        transactionHistoryuser, setTransactionHistoryuser,
        EmiHistoryuser, setEmiHistoryuser,
        LoanListuser,
        setLoanListuser,
      }}
    >
      {children}
    </MovieContext.Provider>

  );
};

export const useMovieContext = () => {
  return useContext(MovieContext);
};
