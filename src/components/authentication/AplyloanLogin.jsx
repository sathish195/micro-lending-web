import React, { useEffect, useState } from "react";
import Joi from "joi-browser";
import authService from "../../services/authService";
import { toast } from "react-hot-toast";
import OTPForm from "./verify_otp";
import { publicIpv4 } from "public-ip";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AplyloanOtp from "./AplyloanOtp";


const AplyloanLogin = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({ phone_number: "" });
  const [errors, setErrors] = useState({});
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [otp, setOtp] = useState(false);
  const [tfa_Status, setTfa_Status] = useState("");
  const [current_access_ip, setcurrent_access_ip] = useState("0.0.0.0");

  // useEffect(() => {
  // const fetchIPAddress = async () => {
  //   try {
  //     const ip = await publicIpv4();
  //     setcurrent_access_ip(ip);
  //   } catch (error) {
  //     console.error("Error fetching IP address:", error);
  //   }
  // };

  // fetchIPAddress();
  // }, []);

  const schema = {
    phone_number: Joi.string()
      .trim()
      .min(10)
      .max(10)
      .regex(/[63-9]\d{9}$/)
      .options({
        language: {
          string: {
            regex: {
              base: "should not start with 1, 2, 3, 4 ,5 or 6 and should not contain special characters",
              test: "another description",
            },
          },
        },
      })

      .label("phone number"),

    // current_access_ip: Joi.string()
    //   .ip({
    //     version: ["ipv4"],
    //   })
    //   .label("Current Access IP"),
  };
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
  //   const validationErrors = ;
  //   setErrors(validationErrors || {});
  // };

  const handleSubmit = async (event) => {

    event.preventDefault();


    setBtnDisabled(true);
    try {

      const { phone_number } = data;

      const response = await authService.ApplyLoanOTP(
        63 + phone_number,
        // current_access_ip
      );
      // console.log("response -->", response);
      setOtp(true);
      setTfa_Status(response.TWO_FA_Status);
      toast.success("successfully done", response.message);
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
      <div className="container ">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 ">
            {otp ? (
              <AplyloanOtp phone_number={63 + data.phone_number} />
            ) : (
              <div className="card mb-0 shadow-none">
                <div className="card-body">
                  <di>
                    <h6>Welcome to our loan application portal! Please enter your mobile number below to begin the application process. Once you've entered your number, click on the 'Send OTP' button to receive a One Time Password (OTP) for verification. We value your privacy and security, so rest assured that your information is safe with us. Thank you for choosing our loan service!</h6>
                  </di>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3 mt-5">
                      <label htmlFor="phone_number" className="form-label">
                        Phone Number
                      </label>
                      <div className="input-group ">
                        <span className="input-group-text">+63</span>
                        <input
                          type="text"
                          className="form-control"
                          id="phone_number"
                          maxLength={10}
                          placeholder="Enter Your Phone Number"
                          value={data.phone_number}
                          name="phone_number"
                          onChange={handleChange}
                          inputMode="numeric"
                          required
                          autoFocus
                        />
                      </div>
                      {errors.phone_number && (
                        <div className="text-danger mt-1">{errors.phone_number}</div>
                      )}
                    </div>

                    <button
                      className="btn btn-primary py-2 mb-4 mt-4"
                      disabled={btnDisabled}
                    >
                      Send OTP
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div> </div></>
  );
};

export default AplyloanLogin;
