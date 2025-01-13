

import authService from "../../services/authService";
import { backEndCallObj } from "../../services/mainServiceFile";
import Joi from "joi-browser";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import { fullBrowserVersion } from "react-device-detect";

import { Modal, Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";



const QRCode = ({ qr, secret }) => {
  const [data, setData] = useState({ otp: "", two_fa_code: "" });
  const [errors, setErrors] = useState({});
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [phone_number, setphone_number] = useState("");
  const [tfaStatus, setTfaStatus] = useState("");
  const [sendOtp, setSendOtp] = useState("");
  const [inputVisible, setInputVisible] = useState(true);
  const [countdown, setCountdown] = useState(120);
  const [sendotpdisable, setSendOtpDisable] = useState(false);
  const [ipAddress, setIpAddress] = useState("0.0.0.0");
  const [browserId, setBrowserId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [resendBtnDisabled, setResendBtnDisabled] = useState(false);

  const navigate = useNavigate();
  let timer;
  useEffect(() => {
    const fetchUserData = async () => {
      var bid = fullBrowserVersion;
      setBrowserId(bid);

      const response = await authService.getCurrentUser();

      setphone_number(response?.phone_number);
      setTfaStatus(response?.TWO_FA_Status);

      if (response.TWO_FA_Status === "Enable") {

        setSendOtp(true);
        setInputVisible(false);


      }
    };

    fetchUserData();

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {

      } catch (error) {
        console.error("Error fetching IP address:", error);
      }
    };

    fetchIpAddress();
  }, []);

  const handleSendOtp = async () => {
    setSendOtpDisable(true);

    const response = await authService.getCurrentUser();

    setphone_number(response.phone_number);
    setTfaStatus(response.TWO_FA_Status);

    // localStorage.clear();


    try {
      const response = await backEndCallObj("/users/resend_otp", {
        phone_number: phone_number,
        key: "tfa",
      });
      startCountdown();

      setInputVisible(true);

      toast.success(response.message,);
      setSendOtp(false);
      // setCountdown(120);
      // setSendOtp(false);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error(ex.response?.data)
      }
    } finally {
      setSendOtpDisable(false);
    }
  };



  const handleResendOtp = async () => {
    setResendBtnDisabled(true);
    setBtnDisabled(true);
    try {
      // console.log(phone_number, otpkey, "key");

      const response = await authService.resendOtp(phone_number, "tfa");

      setCountdown(120);
      startCountdown()
      // toast.success(response.message, "Otp successfull",);
      // console.log(response, "resend");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error(ex.response?.data);
      }
    } finally {
      setResendBtnDisabled(false);
      setBtnDisabled(false);
    }
  };

  // const startCountdown = () => {
  //   timer = setInterval(() => {
  //     setCountdown((prevCountdown) => prevCountdown - 1);
  //   }, 1000);
  // };

  const startCountdown = () => {
    setCountdown(120)
    timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 0) {
          clearInterval(timer); // Clear the interval when countdown reaches 0
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };
  const getFormattedCountdown = (countdown) => {
    if (countdown > 0) {
      const minutes = Math.floor(countdown / 60);
      const seconds = countdown % 60;
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
        2,
        "0"
      )}`;
    }
  };
  const doSubmit = async () => {
    setBtnDisabled(true);

    try {
      const route =
        tfaStatus !== "Enable" ? "/users/verify_2fa" : "/users/disable_2fa";
      const obj =
        tfaStatus !== "Enable"
          ? { two_fa_code: data.two_fa_code }
          : { two_fa_code: data.two_fa_code, otp: data.otp, key: "tfa" };

      const response = await backEndCallObj(route, obj);
      localStorage.removeItem("token");
      setShowModal(true);

      // toast.success(response.message,);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error(ex.response?.data)


      }
    } finally {
      setBtnDisabled(false);
    }
  };

  const handlelogout = () => {

    navigate("/login");
  };

  const schema = {
    otp:
      tfaStatus === "Enable"
        ? Joi.string()
          .length(6)
          .regex(/^\S(.*\S)?$/)
          .regex(/^[0-9]+$/)
          .options({
            language: {
              string: {
                regex: {
                  base: "Should Contain Only Numbers ",
                  test: "another description",
                },
              },
            },
          })
          .required()
          .label("OTP")
        : Joi.string().allow(""),
    two_fa_code: Joi.string()
      .regex(/^[0-9]+$/)
      .length(6)
      .options({
        language: {
          string: {
            regex: {
              base: "should contain 6 digits",
              test: "another description",
            },
          },
        },
      })
      .required()
      .label("2FA Code"),
  };

  const validate = () => {
    const { error } = Joi.validate(data, schema, { abortEarly: false });
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validate();
    setErrors(errors || {});
    if (errors) return;

    doSubmit();
  };

  // const handleChange = ({ currentTarget: input }) => {
  //   const newData = { ...data };
  //   newData[input.name] = input.value;
  //   setData(newData);

  //   const errorMessage = validateProperty(input);
  //   setErrors({ ...errors, [input.name]: errorMessage });
  // };
  const handleChange = ({ currentTarget: input }) => {
    if (input.name === "otp" || input.name === "two_fa_code") {
      const value = input.value.replace(/\D/g, ""); // Remove non-numeric characters
      setData({ ...data, [input.name]: value });
    } else {
      setData({ ...data, [input.name]: input.value });
    }

    const errorMessage = validateProperty(input);
    setErrors({ ...errors, [input.name]: errorMessage });
  };


  const validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schemaProp = { [name]: schema[name] };
    const { error } = Joi.validate(obj, schemaProp);
    return error ? error.details[0].message : null;
  };
  // console.log(qr, "navaneetha")
  return (
    <div className="col-lg-6 col-12">
      <div className="card shadow-none mt-0">
        <div className="card-body">
          <div className="card-title">CHANGE TWO FACTOR AUTHENTICATION</div>
          <hr />
          <ul className="list-unstyled">
            {tfaStatus !== "Enable" && (
              <>
                <li className="mb-1">
                  Install or open a third-party authenticator app like Google
                  Authenticator, Authy, etc.
                </li>
                <li className="mb-1">
                  Scan QR code below with the authenticator
                </li>
                <li className="mb-1">
                  Enter the 6-digit code you see in the authenticator
                </li>
              </>
            )}
          </ul>

          {sendOtp && (
            <>
              <h4 className="fs-16 text-capitalize">
                Click below button to send OTP
              </h4>
              <button
                className="btn btn-primary "
                onClick={handleSendOtp}
                disabled={sendotpdisable}
              >
                Send OTP
              </button>
            </>
          )}

          <div className="mb-4">
            {tfaStatus !== "Enable" && (

              <img src={qr} alt="QR Code" className="qrClass" />
            )}
          </div>

          {!sendOtp && inputVisible && (
            <>
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">

                  {tfaStatus === "Enable" && (
                    <div className="form-group">

                      <div className="position-relative has-icon-right mb-3">
                        <label
                          htmlFor="otpControlInput"
                          className="form-label text-uppercase"
                        >
                          Enter OTP
                        </label>
                        <input
                          type="text"
                          name="otp"
                          id="otp"
                          value={data.otp}
                          onChange={handleChange}
                          placeholder="Enter OTP"
                          className="form-control input-shadow"
                          maxLength="6"
                          inputMode="numeric"
                          autoFocus
                        />
                        <div className="form-control-position">
                          <i className="icon-lock"></i>
                        </div>
                      </div>
                      {errors.otp && (
                        <div className="text-danger mt-1 errorsClass">
                          {errors.otp}
                        </div>
                      )}

                    </div>
                  )}
                  <div className="position-relative has-icon-right">
                    <label className="OPT-label mt-0 mb-3 fw-semibold">
                      ENTER 2FA
                    </label>
                    <input
                      type="text"
                      name="two_fa_code"
                      id="two_fa_code"
                      value={data.two_fa_code}
                      onChange={handleChange}
                      placeholder="Enter 2FA code"
                      className="form-control input-shadow"
                      maxLength="6"
                      inputMode="numeric"

                    />
                    <div className="form-control-position">
                      <i className="icon-lock"></i>
                    </div>
                  </div>
                  {errors.two_fa_code && (
                    <div className="text-danger mt-1 errorsClass">
                      {errors.two_fa_code}
                    </div>
                  )}
                </div>


                <button
                  type="submit"
                  className="btn btn-primary mt-3 mb-3"
                  disabled={btnDisabled}
                >
                  Submit
                </button>

              </form>
              {(tfaStatus === "Enable" &&




                // <div className="card-footer  mt-4">
                //   {countdown > 0 ? (
                //     <>
                //       {/* <p className="mt-3 fs-16">
                //         Code Expires Within{" "}
                //         {getFormattedCountdown(countdown)} seconds
                //       </p> */}
                //       <p>
                //         <span className="flex-shrink-0">OTP Expires in</span>
                //         <div className="circular-progress mx-2 flex-shrink-0" style={{ background: `conic-gradient(rgb(75, 73, 172) ${(countdown) * (360 / 120)}deg, #d0d0d2 0deg)` }}>
                //           <div className="inner-circle"></div>
                //           <p className="percentage mb-0 fw-semibold">{countdown}</p>
                //         </div>
                //         <span>Seconds</span>

                //       </p>
                //     </>
                //   ) : (
                //     <p className="para-otp fs-5">
                //       Didn't receive the otp?
                //       <a
                //         className="link link-OTP mt-5"
                //         onClick={handleResendOtp}
                //       >
                //         <span id="resend-opt"> Click here</span>
                //       </a>
                //     </p>
                //   )}
                // </div>

                <div className="card-footer  mt-4">
                  {/* {countdown > 0 ? (
                  <>
                    <p className="mt-3 fs-16">
                      OTP Expires Within {" "}
                      <span>{(countdogetFormattedCountdownwn)}</span> Seconds
                    </p>
                  </>
                ) : (
                  <p className="para-otp fs-5 cursor-pointer">
                    Didn't receive the otp?
                    <a
                      className="link link-OTP mt-5"
                      onClick={btnDisabled ? null : handleResendOtp}
                      disabled={btnDisabled}
                    >
                      <span id="resend-opt cursor-pointer "> Click here</span>
                    </a>
                  </p>
                )} */}

                  {countdown > 0 ? (
                    <div className="fs-14">
                      <div className="d-flex align-items-center">
                        {/* <p className="mb-0 me-2 fs-16">OTP Expires in </p> */}
                        {/* Using Countdown component here */}

                        <span className="flex-shrink-0">OTP Expires in</span>
                        <div className="circular-progress mx-2 flex-shrink-0" style={{ background: `conic-gradient(rgb(75, 73, 172) ${(countdown) * (360 / 120)}deg, #d0d0d2 0deg)` }}>
                          <div className="inner-circle"></div>
                          <p className="percentage mb-0 fw-semibold">{countdown}</p>
                        </div>
                        <span>Seconds</span>



                      </div>
                    </div>
                  ) : (
                    <p className="fs-16">
                      Didn't receive the otp?{" "}
                      <span
                        className="link text-primary link-OTP mt-5"
                        onClick={handleResendOtp}
                        disabled={btnDisabled}
                      >
                        Click here
                      </span>
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Modal
        show={showModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <p className="text-capitalize">
            Two-factor authentication status changed successfully. Please logout
            and login again.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-primary"
            onClick={handlelogout}
            disabled={btnDisabled}
          >
            Logout
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default QRCode;
