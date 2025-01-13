
import { createContext, useContext, useEffect, useState } from "react";
import Joi from "joi";
import { backEndCall, backEndCallObj } from "../../services/mainServiceFile";
import { useMovieContext } from "./Context";

const FunctionsContext = createContext();

export const FunctionsContextProvider = ({ children }) => {
  const {
    setErrors,
    setAddadminData,
    setLoading,
    setErrorOccur,
    usersList, setUsersList,
    skip, setSkip,
    limit, setLimit,
    textDisplay,
    setTextDisplay,
    transactionHistory, setTransactionHistory,
    RecenttransactionHistory, setRecentTransactionHistory,
    userData, setUserData,
    adminData, setAdminData,
    loanStatus, setLoanStatus,
    toast
  } = useMovieContext();

  const handleChange = (e, schema, newSetForm) => {
    const { name, value } = e.target;
    // console.log(schema)
    // debugger
    //  const schema = Joi.object(mainSchema);
    const errorMessage = schema?.validate(value)?.error?.message;
    // console.log(errorMessage, "mabakjsjk")
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    newSetForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const checkErrors = async (mainSchema, formData) => {
    // console.log(mainSchema, formData, "0poiuytrtyui")
    const schema = Joi.object(mainSchema);
    const { error } = schema.validate(formData, { abortEarly: false });

    if (error) {
      const newErrors = {};
      error.details.forEach((detail) => {
        newErrors[detail.path[0]] = detail.message;
      });
      setErrors(newErrors);
      return Promise.reject('Validation error occurred');
    }

    return Promise.resolve();
  };

  const UsersListData = async () => {
    setLoading(true);
    try {
      const obj = { skip, limit };
      const response = await backEndCallObj("/admin/users_list", obj);
      if (response?.length === 0) {
        setTextDisplay(true);
      } else {
        setUsersList(prevUsers => [...prevUsers, ...response]);
        if (response?.length >= 0) {
          setSkip(prevSkip => prevSkip + limit);
        }
      }
    } catch (ex) {
      setErrorOccur(true);
      if (ex.response && ex.response?.status === 400) {
        toast.error(ex.response?.data);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    return () => {
      setErrorOccur(false);
    };
  }, []);

  return (
    <FunctionsContext.Provider
      value={{
        handleChange,
        checkErrors,
        UsersListData,
        setUsersList,
        textDisplay,
        setTextDisplay,
        transactionHistory, setTransactionHistory,
        RecenttransactionHistory, setRecentTransactionHistory,


        setErrors // Add setErrors to context provider
      }}
    >
      {children}
    </FunctionsContext.Provider>
  );
};

export const useFunctionContext = () => {
  return useContext(FunctionsContext);
};
