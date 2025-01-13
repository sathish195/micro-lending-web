import React, { useState, useEffect } from "react";
import Joi from "joi-browser";
import authService from "../../services/authService";
import { toast } from "react-hot-toast";
import { publicIpv4 } from "public-ip";
import { fullBrowserVersion } from "react-device-detect";
import ReactCountdownClock from "react-countdown-clock";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const AplyloanOtp = ({ phone_number, otpkey }) => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(120);
    const [data, setData] = useState({ otp: "" });
    const [errors, setErrors] = useState({});
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [current_access_ip, setcurrent_access_ip] = useState("0.0.0.0");
    const [browserId, setBrowserId] = useState("");
    let timer;

    useEffect(() => {
        // console.log(phone_number);
        const fetchIPAddress = async () => {
            try {
                const ip = await publicIpv4();
                setcurrent_access_ip(ip);
            }
            // catch (error) {
            //     console.error("Error fetching IP address:", error);
            // }
            catch (ex) {
                if (ex.response && ex.response.status === 400) {
                    toast.error(ex.response.data);
                }
            }
            return () => clearInterval(timer);
        };
        startCountdown();
        fetchIPAddress();
    }, []);
    const schema = {
        otp: Joi.string()
            .length(6)
            .regex(/^\S(.*\S)?$/)
            .regex(/^[0-9]+$/)
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
            .label("OTP"),

    };
    // const handleChange = (e) => {
    //   const { name, value } = e.target;
    //   if (!isNaN(value)) {
    //     setData({ ...data, [name]: value });
    //   }

    //   const validationErrors = validate();
    //   setErrors(validationErrors || {});
    // };
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (!isNaN(value)) {
            setData({ ...data, [name]: value });
        }
        const { error } = Joi.object({ [name]: schema[name] }).validate({
            [name]: value,
        });

        if (error) {
            // eslint-disable-next-line no-use-before-define
            // const errors = { ...errors };
            errors[name] = error.details[0].message;
            setErrors(errors);
        } else {
            setErrors({ ...errors, [name]: null });
        }
    };

    const handleSubmit = async (e) => {
        // console.log(phone_number);

        e.preventDefault();


        const validationErrors = validate();
        // console.log("handle submit called hhhhhhhhhhhhhhhhhhhhhhh");
        setErrors(validationErrors || {});
        if (validationErrors) return;

        setBtnDisabled(true);
        const { otp } = data;
        try {
            const response = await authService.AplyloanverifyOTP(
                phone_number,
                otp,
            );

            console.log(response);
            if (response === "Incorrect OTP. Please Try Again") {
                // console.log("Incorrect OTP. Please Try Again");
            }
            toast.success("otp verified successfully");
            // console.log(response, "response otp");
            navigate("/applyloan");
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {

                // console.log(errors);
                toast.error(ex.response?.data);
            }
        } finally {
            setBtnDisabled(false);
        }
    };

    const handleResendOtp = async () => {

        setBtnDisabled(true);

        try {
            // console.log(phone_number, otpkey, "key");

            const response = await authService.resendOtp(phone_number, otpkey);

            toast.success(response.message);
            console.log(response, "resend");
            setCountdown(120)
            // startCountdown();
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                toast.error(ex.response?.data);
            }
        } finally {

            setBtnDisabled(false);
        }
    };

    const startCountdown = () => {
        timer = setInterval(() => {
            setCountdown((prevCountdown) => prevCountdown - 1);
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

    const validate = () => {
        const options = { abortEarly: false };
        const { error } = Joi.validate(data, schema, options);
        if (!error) return null;

        const newErrors = {};
        for (let item of error.details) {
            newErrors[item.path[0]] = item.message;
        }
        return newErrors;
    };

    return (
        <>
            <div className="row justify-content-center">
                <div className="col-xl-8 col-lg-12 col-md-8 col-lg-8">
                    <div className="card mb-0 shadow-none ">
                        <div className="card-body">
                            <div className="card-title text-uppercase fs-16 mt-4">
                                <p className="">
                                    A one time 6-digit code has been sent to your phone
                                    number
                                </p>
                                <span className="text-lowercase text-primary">
                                    +{phone_number}
                                </span>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4 mt-5 position-relative">
                                    <label
                                        htmlFor="otpControlInput"
                                        className="form-label text-uppercase"
                                    >
                                        Enter OTP
                                    </label>
                                    <input
                                        type="text"
                                        name="otp"
                                        placeholder="Enter OTP"
                                        value={data.otp}
                                        onChange={handleChange}
                                        inputMode="numeric"
                                        className={`form-control input-shadow ${errors.otp ? "is-invalid" : ""
                                            }`}
                                        maxLength="6"
                                        required

                                        autoFocus
                                    />
                                    {/* <div className="view-password-icon">
                                        <i className="ri-lock-password-line"></i>
                                    </div> */}
                                    {errors.otp && (
                                        <div className="invalid-feedback">{errors.otp}</div>
                                    )}
                                </div>


                                {/* <div className="fs-14">
                                    {countdown > 0 ? (
                                        <div className="d-flex align-items-center">
                                            <p className="mb-0 me-2 fs-16">OTP Expires in  </p>

                                            <ReactCountdownClock
                                                seconds={countdown}
                                                color="#107FAB"
                                                alpha={0.9}
                                                size={35}
                                                onComplete={handleResendOtp}
                                                weight={4}
                                                showMilliseconds={false}
                                            />

                                        </div>
                                    ) : (
                                        <p className=" fs-16">
                                            Didn't receive the otp?{" "}
                                            <span
                                                className="link text-primary link-OTP mt-5"
                                                onClick={handleResendOtp}
                                            >
                                                Click here
                                            </span>
                                        </p>
                                    )}
                                </div> */}
                                <div className="card-footer  mt-4">
                                    {countdown > 0 ? (
                                        <>
                                            <p className="mt-3 fs-16">
                                                Code Expires Within{" "}
                                                {getFormattedCountdown(countdown)} seconds
                                            </p>
                                        </>
                                    ) : (
                                        <p className="para-otp fs-5">
                                            Didn't receive the otp?
                                            <a
                                                className="link link-OTP mt-5"
                                                onClick={btnDisabled ? null : handleResendOtp}
                                            >
                                                <span id="resend-opt"> Click here</span>
                                            </a>
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary py-2 mb-3 mt-4"
                                    disabled={btnDisabled}
                                >
                                    {btnDisabled ? "Please Wait" : "Verify"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default AplyloanOtp;
