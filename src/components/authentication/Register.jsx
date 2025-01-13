import React, { useState } from "react";
import Joi from "joi-browser";
import { Link } from "react-router-dom";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    age: "",
    gender: "",
    tin_number: "",
    passport_number: "",
    password: "",
    purpose_of_loan: "",
    employment: "",
    permanentAddress: "",
    currentAddress: "",
    income_proof: "",
    photo: ""
  });

  const [errors, setErrors] = useState({});

  const schema = {
    name: Joi.string().required().label("Name"),
    dob: Joi.string().required().label("Date of Birth"),
    age: Joi.number().required().label("Age"),
    gender: Joi.string().required().label("Gender"),
    tin_number: Joi.string().required().label("TIN Number"),
    passport_number: Joi.string().required().label("Passport Number"),
    password: Joi.string().required().label("Password"),
    purpose_of_loan: Joi.string().required().label("Purpose of Loan"),
    employment: Joi.string().required().label("Employment"),
    permanentAddress: Joi.string().required().label("Permanent Address"),
    currentAddress: Joi.string().required().label("Current Address"),
    income_proof: Joi.required().label("Income Proof Document"),
    photo: Joi.required().label("Photo")
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    // Submit the form data
    // console.log("Form submitted:", formData);
  };

  const validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(formData, schema, options);

    if (!error) return null;

    const newErrors = {};
    for (let item of error.details) {
      newErrors[item.path[0]] = item.message;
    }
    return newErrors;
  };

  return (
    <div className="authentication-page login-form">
      <div className="p-4">
        <div className="container bg-white rounded-3">
          <div className="row">
            <div className="col-xl-5 col-lg-5 col-md-5 pe-0">
              <div className="card mb-0 shadow-none register-image">
                <Link to="/" className="text-decoration-none mt-3">
                  <img
                    src="assets/images/light-logo.png"
                    className="login-logo"
                    alt="logo"
                  />
                </Link>
              </div>
            </div>
            <div className="col-xl-7 col-lg-7 col-md-7 px-0">
              <div className="card mb-0 shadow-none">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    {/* Form inputs */}
                    {/* Name */}
                    <div className="row mt-5">
                      <div className="col-12 col-xl-6 col-lg-6 col-md-6 col-sm-6">
                        <div className="mb-3">
                          <label htmlFor="nameControlInput" className="form-label">Name</label>
                          <input type="text" className="form-control" id="nameControlInput" placeholder="Enter username here" name="name" value={formData.name} onChange={handleChange} />
                          {errors.name && (<div className="error">{errors.name}</div>)}
                        </div>
                      </div>
                      {/* Date of Birth */}
                      <div className="col-12 col-xl-6 col-lg-6 col-md-6 col-sm-6 ps-xl-0">
                        <div className="mb-3">
                          <label htmlFor="dateofbirthlInput" className="form-label">Date of Birth:</label>
                          <input type="date" className="form-control" id="dateofbirthlInput" placeholder="Enter email here" name="dob" value={formData.dob} onChange={handleChange} />
                          {errors.dob && (<div className="error">{errors.dob}</div>)}
                        </div>
                      </div>
                    </div>
                    {/* Age and Gender */}
                    <div className="row">
                      <div className="col-12 col-xl-6 col-lg-6 col-md-6 col-sm-6">
                        <div className="mb-3">
                          <label htmlFor="passwordControlInput" className="form-label">Age</label>
                          <input type="number" className="form-control" id="passwordControlInput" name="age" value={formData.age} onChange={handleChange} />
                          {errors.age && (<div className="error">{errors.age}</div>)}
                        </div>
                      </div>
                      <div className="col-12 col-xl-6 col-lg-6 col-md-6 col-sm-6 ps-xl-0">
                        <div className="mb-3">
                          <label htmlFor="genderControlInput" className="form-label">Gender</label>
                          <select name="gender" value={formData.gender} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Transgender">Transgender</option>
                          </select>
                          {errors.gender && (<div className="error">{errors.gender}</div>)}
                        </div>
                      </div>
                    </div>
                    {/* TIN Number and Passport Number */}
                    <div className="row">
                      <div className="col-12 col-xl-6 col-lg-6 col-md-6 col-sm-6">
                        <div className="mb-3">
                          <label htmlFor="TIN NumberControlInput" className="form-label">TIN Number:</label>
                          <input type="text" className="form-control" id="TIN NumberControlInput" placeholder="Enter TIN number here" name="tin_number" value={formData.tin_number} onChange={handleChange} />
                          {errors.tin_number && (<div className="error">{errors.tin_number}</div>)}
                        </div>
                      </div>
                      <div className="col-12 col-xl-6 col-lg-6 col-md-6 col-sm-6 ps-xl-0">
                        <div className="mb-3">
                          <label htmlFor="passportNumberControlInput" className="form-label">Passport Number:</label>
                          <input type="text" className="form-control" id="passportNumberControlInput" placeholder="Enter passport number here" name="passport_number" value={formData.passport_number} onChange={handleChange} />
                          {errors.passport_number && (<div className="error">{errors.passport_number}</div>)}
                        </div>
                      </div>
                    </div>
                    {/* Password */}
                    <div className="mb-3">
                      <label htmlFor="passwordControlInput" className="form-label">Password</label>
                      <input type="password" className="form-control" id="passwordControlInput" placeholder="Enter password here" name="password" value={formData.password} onChange={handleChange} />
                      {errors.password && (<div className="error">{errors.password}</div>)}
                    </div>
                    {/* Purpose of Loan */}
                    <div className="mb-3">
                      <label htmlFor="purposeOfLoanControlInput" className="form-label">Purpose of Loan</label>
                      <select name="purpose_of_loan" value={formData.purpose_of_loan} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Personal">Personal</option>
                        <option value="Business">Business</option>
                      </select>
                      {errors.purpose_of_loan && (<div className="error">{errors.purpose_of_loan}</div>)}
                    </div>
                    {/* Employment */}
                    <div className="mb-3">
                      <label htmlFor="employmentControlInput" className="form-label">Employment</label>
                      <select name="employment" value={formData.employment} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="SalariedEmployee">Salaried Employee</option>
                        <option value="Business">Business</option>
                        <option value="employment">Employment</option>
                      </select>
                      {errors.employment && (<div className="error">{errors.employment}</div>)}
                    </div>
                    {/* Permanent Address */}
                    <div className="mb-3">
                      <label htmlFor="permanentAddressControlInput" className="form-label">Permanent Address</label>
                      <input type="text" className="form-control" id="permanentAddressControlInput" placeholder="Enter permanent address here" name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} />
                      {errors.permanentAddress && (<div className="error">{errors.permanentAddress}</div>)}
                    </div>
                    {/* Current Address */}
                    <div className="mb-3">
                      <label htmlFor="currentAddressControlInput" className="form-label">Current Address</label>
                      <input type="text" className="form-control" id="currentAddressControlInput" placeholder="Enter current address here" name="currentAddress" value={formData.currentAddress} onChange={handleChange} />
                      {errors.currentAddress && (<div className="error">{errors.currentAddress}</div>)}
                    </div>
                    {/* Income Proof Document */}
                    <div className="mb-3">
                      <label htmlFor="incomeProofControlInput" className="form-label">Income Proof Document:</label>
                      <input type="file" className="form-control" id="incomeProofControlInput" name="income_proof" onChange={handleChange} />
                      {errors.income_proof && (<div className="error">{errors.income_proof}</div>)}
                    </div>
                    {/* Photo */}
                    <div className="mb-3">
                      <label htmlFor="photoControlInput" className="form-label">Photo:</label>
                      <input type="file" className="form-control" id="photoControlInput" name="photo" onChange={handleChange} />
                      {errors.photo && (<div className="error">{errors.photo}</div>)}
                    </div>
                    {/* Submit Button */}
                    <button type="submit" className="btn btn-lg btn-primary mt-4">Register</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
