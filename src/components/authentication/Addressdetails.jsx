
import React, { useEffect, useRef, useState } from "react";
import Joi from "joi";
import { backEndCall, backEndCallObj } from "../../services/mainServiceFile";
import { useNavigate } from "react-router-dom";
import { Input_text, Select_input, Date_Input, Number_Input, Input_Name, Input_docnumbers, Input_address, Input_email } from './../comman/All-Inputs';
import { useMovieContext } from "../comman/Context";
import { useFunctionContext } from "../comman/FunctionsContext";
import { toast } from "react-hot-toast";
import { regions, provinces, cities, barangays } from 'select-philippines-address';

const Updateprofile = () => {
    const { setUserprofileData, setUserEligibility, setUserData } = useMovieContext();
    const [loading, setLoading] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedBarangay, setSelectedBarangay] = useState('');
    const [formData, setFormData] = useState(
        {
            first_name: "",
            last_name: "",
            dob: "",

            gender: "",
            // photo: "",
            tin_number: "",
            passport_number: "",
            employment: "",
            // permanentAddress: "",
            // currentAddress: "",
            city: "",

            pin_code: "",
            // income_proof: "",

            member_email: "",

            region: "",
            province: "",

            houseno: "",
            barangay: "",
            user_politician: "",
            user_familymember_politician: "",
            // user_politician_details: "",
            // user_familymember_politician_details: ""
        }
    );
    const navigate = useNavigate();
    const { errors, setErrors, setErrorOccur } = useMovieContext();
    const { checkErrors } = useFunctionContext();
    const fileInputRef = useRef(null);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [updateddata, setUpdateddata] = useState(false);
    const [provinceList, setProvinceList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [barangayList, setBarangayList] = useState([]);
    const [regionList, setRegionList] = useState([]);

    const currentYear = new Date().getFullYear();
    const schema = {
        first_name: Joi.string()
            .trim()
            .min(3)
            .max(50)
            .regex(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)
            .required()
            .label("First Name")
            .messages({
                'string.pattern.base': 'First name should not contain special characters ',
            }),
        last_name: Joi.string()
            .trim()
            .min(3)
            .max(50)
            .regex(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)
            .required()
            .label("Last Name")
            .messages({
                'string.pattern.base':
                    'Last name should not contain special characters ',
            }),


        dob: Joi.date()
            .max("now")
            .less(`${currentYear - 20}-01-01`)
            .greater(`${currentYear - 80}-01-01`)
            .required()
            .iso()
            .messages({
                "any.required": "Date of birth is required",
                "date.base": "Date of birth must be a valid date",
                "date.max": "Date of birth cannot be in the future",
                "date.less": "Date of birth must be at most 20 years ago",
                "date.greater": "Date of birth must be less than or equal to 60 years",
                "date.iso": "Date of birth must be in the format “YYYY - MM - DD”``"
            }),

        gender: Joi.string().valid('Male', 'Female', 'Transgender').required().label("Gender"),
        tin_number: Joi.string()
            .min(10)
            .max(12)
            .length(12)
            .required()
            .label("TIN Number")
            .regex(/^[A-Za-z0-9]+$/)
            .messages({
                'any.required': 'TIN Number is required',
                'string.pattern.base':
                    'TIN Number must contain only letters and numbers',
                'string.min': 'TIN Number must be at least 10 characters long',
                'string.max': 'TIN Number cannot be longer than 12 characters',
            }),
        passport_number: Joi.string()
            .min(10)
            .max(12)
            .length(12)
            .required()
            .label("Passport Number")
            .regex(/^[A-Za-z0-9]+$/)
            .messages({
                'any.required': 'Passport number is required',
                'string.pattern.base':
                    'Passport number must contain only letters and numbers',
                'string.min': 'Passport number must be at least 12 characters long',
                'string.max': 'Passport number cannot be longer than 20 characters',
            }),
        employment: Joi.string()
            .valid('SalariedEmployee', 'SelfEmployed', 'Business')
            .required().label("Employment"),

        city: Joi.string()
            .min(3)
            .max(50)
            .required()
            .label("City")
            .regex(/^[A-Za-z ]+$/)
            .message('City must contain only alphabets.'),

        pin_code: Joi.string()
            .length(6)
            .required()
            .label("Pin Code")
            .regex(/^[0-9]+$/)
            .message('Pin code must contain only numbers.'),



        // user_politician_details: Joi.string().required().label('Politician'),


        member_email: Joi.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
            .options({
                messages: {
                    "string.pattern.base": "Please enter a valid email address. (e.g., example@example.com)",
                },
            }).required().label("Email Id").min(5).max(50),


        region: Joi.string()
            .min(3)
            .max(50)
            .required()
            .pattern(/^[A-Za-z ]+$/)
            .message("Region must contain only alphabets.")
            .label("Region"),
        province: Joi.string()
            .min(3)
            .max(50)
            .required()
            .label("Province")
            .pattern(/^[A-Za-z ]+$/)
            .message("Province must contain only alphabets."),
        // houseno: Joi.string().required().label("houseno").regex(/^[a-zA-Z0-9]/),
        houseno: Joi.string()
            .min(3)
            .max(50)
            .label("House No")
            .required()
            .pattern(new RegExp("^[a-zA-Z0-9/ _,-]+$"))
            .message("House No must contain only alphabets."),
        barangay: Joi.string()
            .min(3)
            .max(50)
            .label("Barangay")
            .required()
            .pattern(/^[A-Za-z ]+$/)
            .message("Barangay must contain only alphabets."),


        user_politician: Joi.string()
            .valid('yes', 'no')
            .optional()
            .label('User Politician')
            .messages({
                'any.only': 'User Politician must be either "yes" or "no".',
            }),

        user_politician_details: Joi.string()

            .required()
            .min(4)
            .max(25)
            .allow('', null)
            .optional()
            .label('Position details')

            .messages({
                'any.required': 'Position details is required when User Politician is "yes".',
                'string.empty': 'Position details cannot be empty.',
                'string.min': 'Position details must have at least {#limit} characters.',
                'string.max': 'Position details must have at most {#limit} characters.',
            }),

        user_familymember_politician: Joi.string()
            .valid('yes', 'no')
            .optional()
            .label('User Family Member Politician')
            .messages({
                'any.only': 'User Family Member Politician must be either "yes" or "no".',
            }),

        user_familymember_politician_details: Joi.string()

            .required()
            .min(4)
            .max(25)
            .allow('', null)
            .optional()
            .label('Position details')
            .messages({
                'any.required': 'Position details is required when User Family Member Politician is "yes".',
                'string.empty': 'Position details cannot be empty.',
                'string.min': 'Position details must have at least {#limit} characters.',
                'string.max': 'Position details must have at most {#limit} characters.',
            }),

    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setBtnDisabled(true);
        try {
            await checkErrors(schema, formData);
            setLoading(true);
            const formDataWithoutPhoto = { ...formData };
            const response = await backEndCallObj("/users/profile_update", formDataWithoutPhoto);

            setTimeout(async () => {
                try {
                    const response = await backEndCallObj("/users/user_profile_status");
                    setUserData(null);
                    setUserEligibility(null);
                    setErrorOccur(false);
                    fetchData();
                } catch (ex) {
                    if (ex.response && ex.response.status === 400) {
                        setLoading(false);
                        toast.error(ex.response?.data);
                    }
                }
            }, 10000);

            // Reset form data to empty values
            setFormData({
                // Define your initial form data here
            });
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response?.data);
            }
        } finally {
            setBtnDisabled(false);
        }
    };

    const fetchData = async () => {
        try {
            const response = await backEndCall("/users/user_profile");
            setUserprofileData(response);
            navigate("/userdetails");
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response?.data);
                setLoading(false);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchRegions = async () => {
            const regionsData = await regions();
            // Update the form data with regions
            setFormData({ ...formData, regions: regionsData });
        };
        fetchRegions();
    }, []);

    // Define functions to handle changes in region, province, city, and barangay
    const handleRegionChange = async (regionCode) => {
        setSelectedRegion(regionCode);
        const provincesData = await provinces(regionCode);
        setFormData({ ...formData, province: '', city: '', barangay: '' });
        setProvinceList(provincesData);
    };

    const handleProvinceChange = async (provinceCode) => {
        setSelectedProvince(provinceCode);
        const citiesData = await cities(provinceCode);
        setFormData({ ...formData, city: '', barangay: '' });
        setCityList(citiesData);
    };

    const handleCityChange = async (cityCode) => {
        setSelectedCity(cityCode);
        const barangaysData = await barangays(cityCode);
        setFormData({ ...formData, barangay: '' });
        setBarangayList(barangaysData);
    };
    const handleBarangayChange = (barangayCode) => {
        setSelectedBarangay(barangayCode);
        // Update the form data with the selected barangay
        setFormData({ ...formData, barangay: barangayCode });

    };

    // Render loading spinner while loading
    if (loading) {
        return (
            <div className="text-center mt-3">
                <div className="spinner-border spiner-border-sm" style={{ color: "blue" }} role="status">
                    <span className="sr-only"></span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="card shadow-sm">
                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit}>
                                    {/* KYC Details */}
                                    <h5 className="mb-4 fw-bold" >Update Profile</h5>
                                    <div className="row ">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="firstName" className="form-label">First Name <span className="text-danger">*</span></label>
                                            <Input_Name
                                                type={"text"}
                                                value={(formData["first_name"] === "0" ? "" : formData["first_name"])}
                                                name={"first_name"}
                                                placeholder={"Enter First Name "}
                                                id={"special_character"}
                                                SetForm={setFormData}
                                                schema={schema["first_name"]}
                                                min={4}
                                                max={20}
                                                maxLength={50}
                                                autoFocus={true}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="last Name" className="form-label">Last Name <span className="text-danger">*</span></label>
                                            <Input_Name
                                                type={"text"}
                                                value={(formData["last_name"] === "0" ? "" : formData["last_name"])}

                                                name={"last_name"}
                                                placeholder={"Enter Last Name"}
                                                id={"special_character"}
                                                SetForm={setFormData}
                                                schema={schema["last_name"]}
                                                min={4}
                                                max={20}
                                                maxLength={50}

                                            />
                                        </div>
                                    </div>

                                    <div className="row ">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="dob" className="form-label">Date of Birth <span className="text-danger">*</span></label>

                                            <Date_Input
                                                type={"date"}
                                                value={formData["dob"] === "0" ? "" : formData["dob"]}
                                                name={"dob"}
                                                SetForm={setFormData}
                                                schema={schema["dob"]}
                                                min={new Date(new Date().getFullYear() - 60, new Date().getMonth(), new Date().getDate()).toISOString().split("T")[0]}
                                                max={new Date(new Date().getFullYear() - 21, new Date().getMonth(), new Date().getDate()).toISOString().split("T")[0]}
                                                required
                                            />


                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="gender" className="form-label">Gender <span className="text-danger">*</span></label>
                                            <Select_input
                                                name="gender"
                                                SetForm={setFormData}

                                                schema={schema["gender"]}
                                                options={[
                                                    { value: "Male", label: "Male" },
                                                    { value: "Female", label: "Female" },
                                                    { value: "Transgender", label: "Transgender" }
                                                ]}
                                                value={(formData["gender"] === "0" ? "" : formData["gender"])}

                                            />
                                        </div>
                                    </div>

                                    <div className="row ">
                                        {/* TIN Number and Passport Number */}
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="tinNumber" className="form-label">TIN Number <span className="text-danger">*</span></label>
                                            < Input_docnumbers
                                                type={"text"}
                                                value={(formData["tin_number"] === "0" ? "" : formData["tin_number"])}

                                                name={"tin_number"}
                                                placeholder={"Enter TIN Number "}
                                                id={"special_character"}
                                                SetForm={setFormData}
                                                schema={schema["tin_number"]}
                                                minLength={12}
                                                maxLength={12}

                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="passportNumber" className="form-label">Passport Number <span className="text-danger">*</span></label>
                                            < Input_docnumbers
                                                type={"text"}
                                                value={(formData["passport_number"] === "0" ? "" : formData["passport_number"])}

                                                name={"passport_number"}
                                                placeholder={"Enter Passport Number "}
                                                id={"special_character"}
                                                SetForm={setFormData}
                                                schema={schema["passport_number"]}
                                                minLength={12}
                                                maxLength={12}

                                            />
                                        </div>
                                    </div>
                                    {/* Loan Type */}

                                    <div className="row">

                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="employment" className="form-label">Employment <span className="text-danger">*</span></label>
                                            <Select_input
                                                name="employment"
                                                value={(formData.employment === "0" ? "" : formData.employment)}

                                                SetForm={setFormData}
                                                schema={schema["employment"]}
                                                options={[
                                                    { value: "SalariedEmployee", label: "Salaried Employee" },
                                                    { value: "SelfEmployed", label: "Self Employed" },
                                                    { value: "Business", label: "Business" },
                                                ]}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">

                                            <label htmlFor="member_email" className="form-label">Email <span className="text-danger">*</span></label>
                                            <Input_email
                                                type="email"
                                                value={(formData["member_email"] === "0" ? "" : formData["member_email"])}
                                                name="member_email"
                                                placeholder="Enter Email"
                                                SetForm={setFormData}
                                                schema={schema["member_email"]}
                                                minLength={5}
                                                maxLength={50}
                                            />

                                        </div>
                                    </div>

                                    <div className="row ">

                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="city" className="form-label">City <span className="text-danger">*</span></label>

                                            <select
                                                value={selectedCity}
                                                onChange={(e) => handleCityChange(e.target.value)}
                                                className="form-select"
                                            >
                                                <option value="">Select City</option>
                                                {cityList.map((city) => (
                                                    <option key={city.city_code} value={city.city_code}>{city.city_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="pincode" className="form-label">Pin Code <span className="text-danger">*</span></label>
                                            <Number_Input
                                                type={"text"}
                                                value={(formData["pin_code"] === "0" ? "" : formData["pin_code"])}
                                                name={"pin_code"}
                                                placeholder={"Enter Your Pin Code"}
                                                maxLength={6}
                                                // inputMode={numeric}
                                                SetForm={setFormData}
                                                schema={schema["pin_code"]}

                                            />

                                        </div>
                                    </div>


                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="region" className="form-label">Region <span className="text-danger">*</span></label>

                                            <select
                                                value={selectedRegion}
                                                onChange={(e) => handleRegionChange(e.target.value)}
                                                className="form-select"
                                            >
                                                <option value="">Select Region</option>
                                                {regionList.map((region) => (
                                                    <option key={region.region_code} value={region.region_code}>{region.region_name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="province" className="form-label">Province<span className="text-danger">*</span></label>


                                            <select
                                                value={selectedProvince}
                                                onChange={(e) => handleProvinceChange(e.target.value)}
                                                className="form-select"
                                            >
                                                <option value="">Select Province</option>
                                                {provinceList.map((province) => (
                                                    <option key={province.province_code} value={province.province_code}>{province.province_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row">


                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="houseno" className="form-label">House No <span className="text-danger">*</span></label>

                                            <Input_address
                                                type={"text"}
                                                value={(formData["houseno"] === "0" ? "" : formData["houseno"])}

                                                name={"houseno"}
                                                placeholder={"Enter Permanent House No  "}
                                                id={"special_character"}
                                                SetForm={setFormData}
                                                schema={schema["houseno"]}
                                                maxLength={10}

                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="Barangay" className="form-label">Barangay<span className="text-danger">*</span></label>

                                            <select
                                                value={selectedBarangay}
                                                onChange={(e) => handleBarangayChange(e.target.value)}
                                                className="form-select"
                                            >
                                                <option value="">Select Barangay</option>
                                                {barangayList.map((barangay) => (
                                                    <option key={barangay.brgy_code} value={barangay.brgy_code}>{barangay.brgy_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row">


                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="user politician" className="form-label">User Politician<span className="text-danger">*</span></label>

                                            <Select_input
                                                name="user_politician"
                                                value={(formData.user_politician === "0" ? "" : formData.user_politician)}

                                                SetForm={setFormData}
                                                schema={schema["user_politician"]}
                                                options={[
                                                    { value: "yes", label: "Yes" },
                                                    { value: "no", label: "No" },

                                                ]}

                                            />

                                        </div>



                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="user familymember politician" className="form-label">User Family Member Politician<span className="text-danger">*</span></label>



                                            <Select_input
                                                name="user_familymember_politician"
                                                value={(formData.user_familymember_politician === "0" ? "" : formData.user_familymember_politician)}

                                                SetForm={setFormData}
                                                schema={schema["user_familymember_politician"]}
                                                options={[
                                                    { value: "yes", label: "Yes" },
                                                    { value: "no", label: "No" },

                                                ]}
                                            />


                                        </div>

                                    </div>




                                    <div className="row">


                                        {formData.user_politician === "yes" && (

                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="user_politician_details" className="form-label">User Politician Details<span className="text-danger">*</span></label>
                                                <Input_text
                                                    type="text"
                                                    value={formData.user_politician_details}
                                                    name="user_politician_details"
                                                    placeholder="Enter User Politician Details"
                                                    id="user_politician_details"
                                                    SetForm={setFormData}
                                                    schema={schema["user_politician_details"]}
                                                    maxLength={50}
                                                />
                                            </div>

                                        )}

                                        {formData.user_familymember_politician === "yes" && (
                                            <div className="col-md-6 mb-3">
                                                <label className="label form-label" htmlFor="user_familymember_politician_details">User Family Member Politician Details</label>
                                                <Input_text
                                                    type="text"
                                                    value={formData.user_familymember_politician_details}
                                                    name="user_familymember_politician_details"
                                                    placeholder="Enter User Family Member Politician Details"
                                                    id="user_familymember_politician_details"
                                                    SetForm={setFormData}
                                                    schema={schema["user_familymember_politician_details"]}
                                                    maxLength={50}
                                                />
                                            </div>
                                        )}
                                    </div>



                                    <button type="submit" className="btn btn-primary btn-lg" disabled={btnDisabled}>{btnDisabled ? "Updating..." : "Update"}</button>

                                </form>
                            </div>
                        </div>
                    </div >
                </div >
            </div >



        </>
    )

};

export default Updateprofile;









