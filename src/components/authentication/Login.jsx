import React, { useEffect, useState } from "react";
import Joi from "joi-browser";
import authService from "../../services/authService";
import { toast } from "react-hot-toast";
import OTPForm from "./verify_otp";
import { publicIpv4 } from "public-ip";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({ phone_number: "" });
  const [errors, setErrors] = useState({});
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [otp, setOtp] = useState(false);
  const [tfa_Status, setTfa_Status] = useState("");
  const [current_access_ip, setcurrent_access_ip] = useState("0.0.0.0");

  useEffect(() => {
    if (authService.getCurrentUser()) {
      navigate("/dashboard")
    }
    const fetchIPAddress = async () => {
      try {
        const ip = await publicIpv4();
        setcurrent_access_ip(ip);
      } catch (error) {

      }
    };

    fetchIPAddress();
  }, []);

  const schema = {
    phone_number: Joi.string()
      .trim()

      .min(10)
      .max(10)
      .regex(/[63-9]\d{9}$/)
      .label("phone number")
      // .messages({
      //   "any.required": "Mobile number is required",
      //   "string.pattern.base": "Mobile number must start with 63 and the next digit must be 7, 8, or 9, and it should not contain special characters",
      // })
      .options({
        language: {
          string: {
            regex: {
              base: "should not start with 0 ,1, 2, 3, 4 ,5 or 6 and should not contain special characters",
              test: "another description",
            },

          },
        },

      })
    ,


    current_access_ip: Joi.string()
      .ip({
        version: ["ipv4"],
      })
      .label("Current Access IP"),
  };
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setData({ ...data, [name]: value });
  //   validateField(name, value);
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Only allow numeric input
    if (/^\d+$/.test(value) || value === "") {
      setData({ ...data, [name]: value });
      validateField(name, value);
    }
  };
  const validateField = (name, value) => {
    const { error } = Joi.object({ [name]: schema[name] }).validate({
      [name]: value,
    });

    if (error) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error.details[0].message }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    }
  };

  const validateForm = () => {
    const { phone_number } = data;
    const validationErrors = Joi.object({
      phone_number: schema.phone_number,
    }).validate({ phone_number }).error;

    if (validationErrors) {
      setErrors((prevErrors) => ({ ...prevErrors, phone_number: validationErrors.details[0].message }));
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;

    setBtnDisabled(true);
    try {
      const { phone_number } = data;
      const response = await authService.sendOTP(
        63 + phone_number,
        current_access_ip
      );

      setOtp(true);
      setTfa_Status(response.TWO_FA_Status);
      toast.success(response.message);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error(ex.response.data);
      }
    } finally {
      setBtnDisabled(false);
    }
  };

  return (
    <>
      <div className="authentication-page login-form">
        {otp ? (
          <OTPForm
            phone_number={63 + data.phone_number}
            Tfa_Status={tfa_Status}
            otpkey="login"
          />
        ) : (
          <div className="p-4">
            <div className="container bg-white rounded-3">
              <div className="row">
                <div className="col-xl-6 col-lg-6 col-md-6">
                  <div className="card mb-0 shadow-none login-image">
                    <Link to="/" className="text-decoration-none mt-3">
                      <img
                        src="assets/images/light-logo.png"
                        className="login-logo"
                        alt="logo"
                      />
                    </Link>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 my-auto">
                  <div className="card mb-0 shadow-none">
                    <div className="card-body">

                      <div>
                        <h4 className="fw-bold mb-1">Welcome to Micro!</h4>
                        <span className="fs-12 text-muted">
                          Sign in your account here
                        </span>
                      </div>
                      <form onSubmit={handleSubmit}>
                        <div className="mb-3 mt-5">
                          <label
                            htmlFor="phone_number"
                            id=" Phone number"
                            className="form-label"
                          >
                            Phone Number
                          </label>
                          <div className="d-flex gap-2">
                            <div className="input-group">
                              <span className="d-flex align-items-center input-group-text font-weight-bold">
                                +63
                              </span>
                              {/* <span className="apply_loan p-2 positon_absolute font-bold me-3">
                                +63
                              </span> */}
                              <input
                                type="text"
                                className="form-control input-shadow"
                                id="phone_number"
                                maxLength={10}
                                placeholder="Enter Your Phone Number"
                                value={data.phone_number}
                                name="phone_number"
                                onChange={handleChange}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                autoFocus
                              />
                            </div>
                          </div>
                          {errors.phone_number && (
                            <div className="text-danger mt-1 errorsClass">
                              {errors.phone_number}
                            </div>
                          )}
                        </div>

                        <button
                          className="btn btn-primary btn-lg   py-2 mb-4  mt-4"
                          disabled={btnDisabled} style={{ height: "38px" }}
                        >
                          Login
                        </button>

                        <div className="mt-4">
                          <span className="text-end text-muted fs-13 me-2">
                            Create account with{" "}
                          </span>
                          <span className="social-icons">
                            <Link>
                              <i className="ri-facebook-fill btn-facebook"></i>
                            </Link>
                            <Link>
                              <i className="ri-linkedin-fill btn-linkedin"></i>
                            </Link>
                            <Link>
                              <i className="ri-google-fill btn-google"></i>
                            </Link>
                          </span>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LoginForm;
