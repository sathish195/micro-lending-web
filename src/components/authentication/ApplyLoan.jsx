
import React, { useEffect, useRef, useState } from "react";
import Joi from "joi";
import { backEndCall, backEndCallObj } from "../../services/mainServiceFile";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Userdetails from "./Userdetails";
import Compress from 'react-image-file-resizer';
import { logDOM } from "@testing-library/react";
import { Input_text, Select_input, Date_Input, File_Input, Number_Input, Input_Name, Input_docnumbers, Input_address } from './../comman/All-Inputs';
import { useMovieContext } from "../comman/Context";
import { useFunctionContext } from "../comman/FunctionsContext";
import { toast } from "react-hot-toast";
import Dashboard from "../dashbord/Dashbord";
import LoanStatus from "./LoanStatus";
import numeric from "numeric";
import authService from "../../services/authService";


const ApplyLoan = () => {
    // console.log(minAmount, maxAmount)
    // const location = useLocation();
    const navigate = useNavigate()

    const location = useLocation();
    const minAmount = location.state.minAmount;
    const maxAmount = location.state.maxAmount;
    // console.log(minAmount, "minloanamount")
    console.log(maxAmount, "maxAmountloanamount")
    const [formData, setFormData] = useState({
        income_proof: "",

        loan_type: "",

        loan_amount: "",
        months: "",

        pay_slip: ""
    });

    const { errors, setLoading, setErrorOccur, setErrors, loanList, setLoanList, userData, setUserData } = useMovieContext()
    const { checkErrors } = useFunctionContext()
    const fileInputRef = useRef(null);
    const [updateddata, setUpdateddata] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const schema = {
        loan_type: Joi.string().valid('Business', 'Personal', 'Home').required().label("loan Type"),
        loan_amount: Joi.number().greater(-1).required().label("Loan Amount").min(1000).max(100000),
        months: Joi.number().min(3).max(12).required().label("Months"),
        income_proof: Joi.string().required().label("income_proof"),
        pay_slip: Joi.string().required().label("Pay Slip"),

    }
    const handleChange = async (e) => {
        const { name, type, files } = e.target;
        try {
            if (type === "file") {
                const file = e.target.files[0];
                if (file) {
                    if (file.size > 2 * 1024 * 1024) { // 2MB in bytes
                        toast.error("File size exceeds 2MB");
                        deleting(name);
                        fileInputRef.current.value = "";
                        return;
                    }

                    setErrors(prevErrors => ({
                        ...prevErrors,
                        [name]: ""
                    }));

                    if (file.type.slice(-3) === 'pdf') {
                        const pdfs = { ...formData };
                        const res = URL.createObjectURL(file);
                        pdfs[name] = res;
                        setFormData(pdfs);
                    } else {
                        Compress.imageFileResizer(
                            file,
                            480,
                            480,
                            'JPEG',
                            40,
                            0,
                            (uri) => {
                                const images = { ...formData };
                                images[name] = uri;
                                setFormData(images);
                            },
                            'base64'
                        );
                    }
                } else {
                    deleting(name);
                    fileInputRef.current.value = "";
                }
            } else {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    [name]: e.target.value
                }));
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const deleting = (property) => {
        setFormData((prevForm) => {
            const updatedForm = { ...prevForm };
            updatedForm[property] = "";
            setErrorOccur(true);
            return updatedForm;
        });

        const input = document.getElementById(property);
        if (input) {
            input.value = "";
        }
    };







    const handleSubmit = async (e) => {

        e.preventDefault();
        setBtnDisabled(true);
        try {
            await checkErrors(schema, formData);
            setLoading(true);



            const response = await backEndCallObj("/user/apply_loan", {
                ...formData,

            });

            setLoanList(null)
            // console.log(response, "sformdata")
            toast.success(response)
            setUpdateddata(true);

            navigate("/loanstatus")
            setLoading(false);
            setErrorOccur(false);
            setFormData({
                income_proof: "",
                pay_slip: "",
                loan_amount: "",
                months: "",
            });
        } catch (ex) {
            setErrorOccur(true);
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response?.data)
            }
        } finally {
            setLoading(false);
            setBtnDisabled(false);
        }
    };

    const validate = () => {
        const { error } = schema.validate(formData, { abortEarly: false });
        if (!error) return null;

        const validationErrors = {};
        for (let item of error.details) {
            validationErrors[item.path[0]] = item.message;
        }
        return validationErrors;
    };
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
    // console.log(errors)

    const fetchUserData = async () => {
        try {
            if (userData <= 0 || !userData) {
                const response = await backEndCall("/users/user_stats");
                // console.log(response, "userdeta")

                setUserData(response);

                // console.log(response, "total amount")
            }
            // else {
            //   setUserData(userData)
            // }
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response.data);
            }
        }
    };

    useEffect(() => {

        { !authService.IsAdmin() && fetchUserData() };

    }, []);

    useEffect(() => {
        // Clean up errors when component unmounts
        return () => {
            setErrors({});
        };
    }, []);


    return (
        <>


            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="mb-0 fw-bold">Apply Loan</h5>
                                    <div className="p-3 bg-primary text-white rounded ms-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <p className="mb-0 fs-6">User Limit:</p>
                                            <p className="mb-0 fs-4 fw-semibold ms-3">{userData?.userLimit || "0"}</p>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <form onSubmit={handleSubmit}>
                                    {/* <h5 className="mb-4 fw-bold">Apply Loan</h5>
                                    <hr />
                                    <div className="d-flex gap-5 mb-4">
                                        <div className="btn-primary p-3">
                                            <div className="d-flex justify-content-between mt-2 align-items-center">
                                                <p className="mb-0 fs-12">User Limit:</p>
                                            </div>
                                            <p className="mb-0 fw-semibold mt-3 fs-18">
                                                <span>{userData?.userLimit ? userData?.userLimit : "0"}</span>
                                            </p>
                                        </div>
                                    </div> */}

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="loan_type" className="form-label">Loan Type <span className="text-danger">*</span></label>
                                            <Select_input
                                                name="loan_type"
                                                SetForm={setFormData}
                                                schema={schema["loan_type"]}
                                                options={[
                                                    { value: "Business", label: "Business" },
                                                    { value: "Personal", label: "Personal" },
                                                    { value: "Home", label: "Home" },
                                                ]}
                                                autoFocus={true}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="months" className="form-label">Months <span className="text-danger">*</span></label>
                                            <Select_input
                                                name="months"
                                                SetForm={setFormData}
                                                schema={schema["months"]}
                                                options={[
                                                    { value: "3", label: "3" },
                                                    { value: "6", label: "6" },
                                                    { value: "9", label: "9" },
                                                    { value: "12", label: "12" }
                                                ]}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="loan_amount" className="form-label">Loan Amount <span className="text-danger">*</span></label>
                                            <Number_Input
                                                type={"loan_amount"}
                                                value={formData["loan_amount"]}
                                                name={"loan_amount"}
                                                placeholder={"₱ 10000"}
                                                SetForm={setFormData}
                                                schema={schema["loan_amount"]}
                                                inputMode={"numeric"}
                                                maxLength={10}
                                            />
                                            <div className="mt-2" style={{ color: "#ff5722" }}>
                                                <strong>Note:</strong>
                                                <p>Min Loan Amount ₱ {minAmount}<br />
                                                    Max Loan Amount ₱ {maxAmount}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <h5 className="mb-4">Upload Documents <span className="text-danger">*</span></h5>
                                    <div className="row mb-4">
                                        <div className="col-md-6 mb-3 position-relative">
                                            <label htmlFor="pay_slip" className="form-label">Pay Slip <span className="text-danger">*</span></label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                id="pay_slip"
                                                name="pay_slip"
                                                ref={fileInputRef}
                                                accept="image/*,.jpg,.jpeg,.png,.gif,.bmp,.doc,.docx,.pdf"
                                                onChange={handleChange}
                                            />
                                            {errors.pay_slip && (
                                                <div className="error  mt-2">{errors.pay_slip}</div>
                                            )}
                                            <span className="delete_image" onClick={() => deleting("pay_slip")}><i className="ri-delete-bin-5-line"></i></span>
                                            <div className="position-relative">
                                                {formData?.pay_slip.includes("image") ? (
                                                    <img src={formData.pay_slip} className="document_image1 mt-1 rounded-2" alt="Pay Slip" />
                                                ) : formData.pay_slip ? (
                                                    <embed src={formData.pay_slip} className="document_image1 mt-1 rounded-2" />
                                                ) : ""}
                                                {formData.pay_slip && <a href={formData.pay_slip} target="_blank" rel="noopener noreferrer">View Pay Slip</a>}
                                            </div>
                                        </div>

                                        <div className="col-md-6 mb-3 position-relative">
                                            <label htmlFor="income_proof" className="form-label">Income Proof <span className="text-danger">*</span></label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                id="income_proof"
                                                name="income_proof"
                                                accept="image/*,.pdf"
                                                onChange={handleChange}
                                            />
                                            <span className="delete_image" onClick={() => deleting("income_proof")}><i className="ri-delete-bin-5-line"></i></span>
                                            <div className="position-relative">
                                                {formData.income_proof?.includes("image") ? (
                                                    <img src={formData?.income_proof} className="document_image1 mt-1 rounded-2" alt="Income Proof" />
                                                ) : formData.income_proof ? (
                                                    <embed src={formData.income_proof} className="document_image1 mt-1 rounded-2" />
                                                ) : ""}
                                                {formData.income_proof && <a href={formData.income_proof} target="_blank" rel="noopener noreferrer">View Income Proof</a>}
                                            </div>
                                            {errors.income_proof && (
                                                <div className="error mt-2">{errors.income_proof}</div>
                                            )}
                                        </div>

                                        <div style={{ color: "#ff5722" }}>
                                            <p><strong>Note:</strong> Maximum File Upload Size 2MB Only</p>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary" disabled={btnDisabled}>
                                        {btnDisabled ? "Applying..." : "Apply for Loan"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="container-fluid mt-5">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="card shadow-sm">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="mb-0 fw-bold">Apply Loan</h5>
                                    <div className="p-3 bg-primary text-white rounded ms-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <p className="mb-0 fs-6">User Limit:</p>
                                            <p className="mb-0 fs-4 fw-semibold ms-3">{userData?.userLimit || "0"}</p>
                                        </div>
                                    </div>
                                </div>
                                <hr />

                                <form onSubmit={handleSubmit}>
                                    <div className="row mb-4">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="loan_type" className="form-label">Loan Type <span className="text-danger">*</span></label>
                                            <Select_input
                                                name="loan_type"
                                                SetForm={setFormData}
                                                schema={schema["loan_type"]}
                                                options={[
                                                    { value: "Business", label: "Business" },
                                                    { value: "Personal", label: "Personal" },
                                                    { value: "Home", label: "Home" },
                                                ]}
                                                autoFocus={true}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="months" className="form-label">Months <span className="text-danger">*</span></label>
                                            <Select_input
                                                name="months"
                                                SetForm={setFormData}
                                                schema={schema["months"]}
                                                options={[
                                                    { value: "3", label: "3" },
                                                    { value: "6", label: "6" },
                                                    { value: "9", label: "9" },
                                                    { value: "12", label: "12" }
                                                ]}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="loan_amount" className="form-label">Loan Amount <span className="text-danger">*</span></label>
                                        <Number_Input
                                            type={"loan_amount"}
                                            value={formData["loan_amount"]}
                                            name={"loan_amount"}
                                            placeholder={"₱ 10000"}
                                            SetForm={setFormData}
                                            schema={schema["loan_amount"]}
                                            inputMode={"numeric"}
                                            maxLength={10}
                                        />
                                        <div className="mt-2 text-danger">
                                            <strong>Note:</strong>
                                            <p>Min Loan Amount ₱ {minAmount}<br />
                                                Max Loan Amount ₱ {maxAmount}</p>
                                        </div>
                                    </div>

                                    <h5 className="mb-4">Upload Documents <span className="text-danger">*</span></h5>
                                    <div className="row mb-4">
                                        <div className="col-md-6 mb-3 position-relative">
                                            <label htmlFor="pay_slip" className="form-label">Pay Slip <span className="text-danger">*</span></label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                id="pay_slip"
                                                name="pay_slip"
                                                ref={fileInputRef}
                                                accept="image/*,.jpg,.jpeg,.png,.gif,.bmp,.doc,.docx,.pdf"
                                                onChange={handleChange}
                                            />
                                            {errors.pay_slip && (
                                                <div className="error">{errors.pay_slip}</div>
                                            )}
                                            <span className="delete_image" onClick={() => deleting("pay_slip")}><i className="ri-delete-bin-5-line"></i></span>
                                            <div className="position-relative">
                                                {formData?.pay_slip.includes("image") ? (
                                                    <img src={formData.pay_slip} className="document_image1 mt-1 rounded-2" alt="Pay Slip" />
                                                ) : formData.pay_slip ? (
                                                    <embed src={formData.pay_slip} className="document_image1 mt-1 rounded-2" />
                                                ) : ""}
                                                {formData.pay_slip && <a href={formData.pay_slip} target="_blank" rel="noopener noreferrer">View Pay Slip</a>}
                                            </div>
                                        </div>

                                        <div className="col-md-6 mb-3 position-relative">
                                            <label htmlFor="income_proof" className="form-label">Income Proof <span className="text-danger">*</span></label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                id="income_proof"
                                                name="income_proof"
                                                accept="image/*,.pdf"
                                                onChange={handleChange}
                                            />
                                            <span className="delete_image" onClick={() => deleting("income_proof")}><i className="ri-delete-bin-5-line"></i></span>
                                            <div className="position-relative">
                                                {formData.income_proof?.includes("image") ? (
                                                    <img src={formData?.income_proof} className="document_image1 mt-1 rounded-2" alt="Income Proof" />
                                                ) : formData.income_proof ? (
                                                    <embed src={formData.income_proof} className="document_image1 mt-1 rounded-2" />
                                                ) : ""}
                                                {formData.income_proof && <a href={formData.income_proof} target="_blank" rel="noopener noreferrer">View Income Proof</a>}
                                            </div>
                                            {errors.income_proof && (
                                                <div className="error">{errors.income_proof}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-danger">
                                        <p><strong>Note:</strong> Maximum File Upload Size 2MB Only</p>
                                    </div>


                                </form>
                                <button type="submit" className="btn btn-primary w-100" disabled={btnDisabled}>
                                    {btnDisabled ? "Applying..." : "Apply for Loan"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}


        </>
    );
};

export default ApplyLoan;

