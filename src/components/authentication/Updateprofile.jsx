
import React, { useEffect, useRef, useState } from "react";
import Joi, { required } from "joi";
import { backEndCall, backEndCallObj } from "../../services/mainServiceFile";
import { Link, useNavigate } from "react-router-dom";
import Compress from 'react-image-file-resizer';
import { Input_text, Select_input, Date_Input, Number_Input, File_Input, Input_Name, Input_docnumbers, Input_address, Input_email, Select_input_details } from './../comman/All-Inputs';
import { useMovieContext } from "../comman/Context";
import { useFunctionContext } from "../comman/FunctionsContext";
import { toast } from "react-hot-toast";
import { regions, provinces, cities, barangays } from 'select-philippines-address';


const Updateprofile = () => {
  const { userprofileData, setUserprofileData, usereligibility, setUserEligibility, userData, setUserData } = useMovieContext();
  const [showUserPoliticianDetails, setShowUserPoliticianDetails] = useState(false);
  const [loading, setLoading] = useState(false)
  const [regionData, setRegion] = useState([]);
  const [provinceData, setProvince] = useState([]);
  const [cityData, setCity] = useState([]);
  const [barangayData, setBarangay] = useState([]);

  const [regionAddr, setRegionAddr] = useState("");
  const [provinceAddr, setProvinceAddr] = useState("");
  const [cityAddr, setCityAddr] = useState("");
  const [barangayAddr, setBarangayAddr] = useState("");

  const navigate = useNavigate()
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
  const [btnDisabled, setBtnDisabled] = useState(false);
  const { errors, setErrors, setErrorOccur, } = useMovieContext()
  const { checkErrors } = useFunctionContext()

  const fileInputRef = useRef(null);
  const [updateddata, setUpdateddata] = useState(false);

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
      }).required().label("Email").min(5).max(50),

    houseno: Joi.string()
      .min(3)
      .max(50)
      .label("House No")
      .required()
      .pattern(new RegExp("^[a-zA-Z0-9/ _,-]+$"))
      .message("House No must contain only alphabets."),


    region: Joi.string()
      .min(3)
      .max(50)
      .required()
      .pattern(/^[A-Za-z -,-.()]+$/)
      .message("Region must contain  only alphabets.")
      .label("Region"),

    province: Joi.string()
      .min(3)
      .max(50)
      .required()
      .label("Province")
      .pattern(/^[A-Za-z -,-.()]+$/)
      .message("Province must contain only alphabets."),
    // houseno: Joi.string().required().label("houseno").regex(/^[a-zA-Z0-9]/),
    city: Joi.string()
      .min(3)
      .max(50)
      .required()
      .label("City")
      // .regex(/^[A-Za-z ()]+$/)
      // .pattern(/^[A-Za-z0-9 -,-.()]+$/)
      .pattern(/^[A-Za-z0-9 ,.\-()]+$/)
      .message('City must contain only alphabets.'),

    barangay: Joi.string()
      .min(3)
      .max(50)
      .label("Barangay")
      .required()
      .pattern(/^[A-Za-z0-9 -,-.()]+$/)
      .message("Barangay must contain only alphabets."),





    user_politician: Joi.string()
      .valid('yes', 'no')
      .required()
      .label('User Politician')
      .messages({
        'any.only': 'User Politician must be either "yes" or "no".',
      }),

    user_politician_details: Joi.string()
      .when("user_politician", {
        is: "yes",
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .max(25)
      .min(3)
      .messages({
        "string.base": "User Politician Details must be a string.",
        "string.min":
          "User Politician Details must be at least 2 characters long.",
        "string.max":
          "User Politician Details must be at most 20 characters long.",
        "string.pattern.base":
          "User Politician Details must contain only alphabets.",
        "any.required":
          'User Politician Details is required when User Politician is “yes”.',
      }),


    user_familymember_politician: Joi.string()
      .valid('yes', 'no')
      .required()
      .label('User Family Member Politician')
      .messages({
        'any.only': 'User Family Member Politician must be either "yes" or "no".',
      }),


    user_familymember_politician_details: Joi.string()


      .when("user_familymember_politician", {
        is: "yes",
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .max(25)
      .min(3)
      .label('user familymember politician details')
      .messages({
        "string.base": "user familymember politician details must be a string.",
        "string.min":
          "user familymember politician details must be at least 2 characters long.",
        "string.max":
          "user familymember politician details  must be at most 20 characters long.",
        "string.pattern.base":
          "user familymember politician details  must contain only alphabets.",
        "any.required":
          'user familymember politician details is required when User Politician is “yes”.',
      }),

  }







  const handleSubmit = async (e) => {

    e.preventDefault();
    setBtnDisabled(true);

    try {
      const formDataWithoutPhoto = {
        ...formData,
        city: cityAddr,
        barangay: barangayAddr,
        province: provinceAddr,
        region: regionAddr
      };

      // console.log(formDataWithoutPhoto, "navya");


      await checkErrors(schema, formDataWithoutPhoto);

      setLoading(true)
      // console.log("entet");



      const response = await backEndCallObj("/users/profile_update", formDataWithoutPhoto);
      setUserData(null)
      setUserEligibility(null)
      setErrorOccur(false);

      fetchData()





      // Reset form data to empty values
      setFormData({
        first_name: "",
        last_name: "",
        dob: "",
        gender: "",

        tin_number: "",
        passport_number: "",
        employment: "",


        city: "",
        pin_code: "",



        member_email: "",

        region: "",
        province: "",

        houseno: "",
        barangay: "",
        user_politician: "",
        user_familymember_politician: "",
        user_politician_details: "",
        user_familymember_politician_details: ""
      });


    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        // console.log(ex.response?.data);
        toast.error(ex.response?.data);
        setLoading(false);
      }
    } finally {
      // setLoading(false);
      setBtnDisabled(false);


    }
  };


  const fetchData = async () => {

    try {


      // setLoading(true);
      const response = await backEndCall("/users/user_profile");

      setUserprofileData(response);
      navigate("/userdetails");

    }

    catch (ex) {
      if (ex.response && ex.response.status === 400) {

        toast.error(ex.response?.data);
        setLoading(false)
      }
    }
    finally {
      setLoading(false);
    }
  };

  const today = new Date();
  const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());

  const maxDate = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());




  const capitalize = (string) => {

    return string?.charAt(0).toUpperCase() + string?.slice(1);


  }


  const region = () => {
    regions().then((response) => {
      setRegion(response);
    });
  };

  const onChangeRegion = (e) => {
    // console.log("region_selected_options", e.target.selectedOptions[0].text);
    // console.log("region_value", e.target.value);
    setRegionAddr(e.target.selectedOptions[0].text);
    provinces(e.target.value).then((response) => {
      setProvince(response);
      setCity([]);
      setBarangay([]);
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      region: ""
    }));
  };


  const onChangeProbince = async (e) => {
    // console.log("province_selected_options", e.target.selectedOptions[0].text);
    // console.log("province_value", e.target.value);
    setProvinceAddr(e.target.selectedOptions[0].text);
    cities(e.target.value).then((response) => {
      setCity(response);
    });

    // Clear previous errors for province
    setErrors((prevErrors) => ({
      ...prevErrors,
      province: ""
    }));
  };




  const onChangeCity = (e) => {
    // console.log("city_selected_options", e.target.selectedOptions[0].text);
    // console.log("city_value", e.target.value);
    setCityAddr(e.target.selectedOptions[0].text);

    // Assuming barangays is an asynchronous function that fetches barangays based on city value
    barangays(e.target.value).then((response) => {
      setBarangay(response);
    });

    // Clear previous errors for region (assuming 'region' is a typo and you meant to clear 'city' instead)
    setErrors((prevErrors) => ({
      ...prevErrors,
      city: ""
    }));
  };

  const onCHangeBarangay = (e) => {
    // console.log("barangay_selected_options", e.target.selectedOptions[0].text);
    // console.log("barangay_value", e.target.value);
    setBarangayAddr(e.target.selectedOptions[0].text);

    // Assuming you want to clear errors related to 'barangay' here
    setErrors((prevErrors) => ({
      ...prevErrors,
      barangay: ""
    }));
  };

  useEffect(() => {
    region();
  }, []);

  useEffect(() => {
    // Clean up errors when component unmounts
    return () => {
      setErrors({});
    };
  }, []);
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

                      <select onChange={onChangeRegion} onSelect={region}>
                        <option value="">--select--</option>
                        {regionData &&
                          regionData.length > 0 &&
                          regionData.map((item) => (
                            <option key={item.region_code} value={item.region_code}>
                              {item.region_name}
                            </option>
                          ))}
                      </select>
                      {errors.region && <p className="error mt-2">{errors.region}</p>}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="province" className="form-label">Province<span className="text-danger">*</span></label>


                      <select onChange={onChangeProbince}>
                        <option value="">--select--</option>
                        {provinceData &&
                          provinceData.length > 0 &&
                          provinceData.map((item) => (
                            <option key={item.province_code} value={item.province_code}>
                              {item.province_name}
                            </option>
                          ))}
                      </select>
                      {errors.province && <p className="error mt-2">{errors.province}</p>}
                    </div>
                  </div>
                  <div className="row">


                    <div className="col-md-6 mb-3">
                      <label htmlFor="city" className="form-label">City <span className="text-danger">*</span></label>

                      <select onChange={onChangeCity}>
                        <option value="">--select--</option>
                        {cityData &&
                          cityData.length > 0 &&
                          cityData.map((item) => (
                            <option key={item.city_code} value={item.city_code}>
                              {item.city_name}
                            </option>
                          ))}
                      </select>
                      {errors.city && <p className="error mt-2">{errors.city}</p>}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="Barangay" className="form-label">Barangay<span className="text-danger">*</span></label>

                      <select onChange={onCHangeBarangay}>

                        <option value="">--select--</option>
                        {barangayData &&
                          barangayData.length > 0 &&
                          barangayData.map((item) => (
                            <option key={item.brgy_code} value={item.brgy_code}>
                              {item.brgy_name}
                            </option>
                          ))}
                      </select>
                      {errors.barangay && <p className="error mt-2">{errors.barangay}</p>}
                    </div>
                  </div>

                  <div className="row">


                    <div className="col-md-6 mb-3">
                      <label htmlFor="user politician" className="form-label">User Politician<span className="text-danger">*</span></label>

                      <Select_input
                        name="user_politician"
                        value={(formData.user_politician === "0" ? "" : formData.user_politician)}

                        SetForm={setFormData}
                        schema={(schema.user_politician)}
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
                        schema={(schema.user_familymember_politician)}

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
                          value={(formData.user_politician_details)}
                          name="user_politician_details"
                          placeholder="Enter User Politician Details"
                          id="user_politician_details"
                          SetForm={setFormData}
                          // schema={schema["user_politician_details"]}
                          schema={(schema.user_politician.user_politician_details)}
                          maxLength={25} />
                      </div>

                    )}

                    {formData.user_familymember_politician === "yes" && (
                      <div className="col-md-6 mb-3">
                        <label className="label form-label" htmlFor="user_familymember_politician_details">User Family Member Politician Details</label>
                        <Input_text
                          type="text"
                          value={(formData.user_familymember_politician_details)}
                          name="user_familymember_politician_details"
                          placeholder="Enter User Family Member Politician Details"
                          id="user_familymember_politician_details"
                          SetForm={setFormData}
                          // schema={schema["user_familymember_politician_details"]}
                          schema={(schema.user_familymember_politician.user_familymember_politician_details)}
                          maxLength={25}
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



























