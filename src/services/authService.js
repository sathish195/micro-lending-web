import { Navigate } from "react-router-dom";
import helpers from "./crypto";
import httpService from "./httpService";
import http from "./httpService";
import { jwtDecode } from "jwt-decode";

const tokenKey = "token";

http.setJwt(getJwt());
const apiEndpoint = process.env.REACT_APP_API_URL;


export async function sendOTP(phone_number, current_access_ip) {
http.setJwt(getJwt());

  try {
    const loginData = { phone_number, current_access_ip };

    const encryptedData = helpers.encryptobj(loginData);
    const response = await http.post(apiEndpoint + "/users/login", {
      enc: encryptedData,
    });
    const decryptdata = helpers.decryptobj(response.data);
    return decryptdata;
  } catch (error) {
    throw error;
  }
}
export async function ApplyLoanOTP(phone_number, current_access_ip) {
  http.setJwt(getJwt());
  
    try {
      const loginData = { phone_number, current_access_ip };
  
      const encryptedData = helpers.encryptobj(loginData);
      const response = await http.post(apiEndpoint + "/user/loan_otp", {
        enc: encryptedData,
      });
      const decryptdata = helpers.decryptobj(response.data);
      return decryptdata;
    } catch (error) {
      throw error;
    }
  }

export function getJwt() {
  return localStorage.getItem(tokenKey);
  
}

export function logout() {
  localStorage.clear();
  window.location = "/landing";
  localStorage.setItem('navigateLogin', true);
 
}


export async function verifyOTP(
  phone_number,
  otp,
  current_access_ip,
  two_fa_code
) {
http.setJwt(getJwt());

  try {
    const otpData = { phone_number, otp, current_access_ip, two_fa_code };

    const encryptedData = helpers.encryptobj(otpData);
    const encryptedDat = helpers.decryptobj(encryptedData);

    const response = await http.post(apiEndpoint + "/users/otpVerify", {
      enc: encryptedData,
    });

    if (response.data) {
      localStorage.setItem(tokenKey, response.data);

      return response.data;
    }
    return null;
  } catch (error) {
    throw error;
  }
}
export async function AplyloanverifyOTP(
  phone_number,
  otp,
 
) {
http.setJwt(getJwt());

  try {
    const otpData = { phone_number, otp};

    const encryptedData = helpers.encryptobj(otpData);
    // const encryptedDat = helpers.decryptobj(encryptedData);

    const response = await http.post(apiEndpoint + "/user/veriy_loan_otp", {
      enc: encryptedData,
    });

   
      return response.data;
    }
   
 catch (error) {
    throw error;
  }
}











export async function resendOtp(phone_number, key) {
http.setJwt(getJwt());

  try {
    const resendOtpData = { phone_number, key };
    const encryptedData = helpers.encryptobj(resendOtpData);
    const response = await http.post(apiEndpoint + "/users/resend_otp", {
      enc: encryptedData,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
export function IsAdmin() {
http.setJwt(getJwt());

  try {
    const jwt = localStorage.getItem(tokenKey);
   
    const decryptedToken = helpers.decryptobj(jwt);
    // console.log(jwtDecode(decryptedToken) ,"token")
    const jwtDeco=jwtDecode(decryptedToken).isAdmin;
  
    return jwtDeco
    
  } catch (ex) {
    return null;
  }
}

export function kycStatus() {
  http.setJwt(getJwt());
  
    try {
      const jwt = localStorage.getItem(tokenKey);
     
      const decryptedToken = helpers.decryptobj(jwt);
      // console.log(jwtDecode(decryptedToken) ,"tokennnnnnnn")
      const jwtDeco=jwtDecode(decryptedToken).kyc_status;
    // console.log(jwtDecode(decryptedToken).kyc_status,"kysc status")
    // console.log(jwtDeco,"ejfksdhfkj")
      return jwtDeco
     

    } catch (ex) {
      return null;
    }
  }
  

// export function Admin_type() {
//   http.setJwt(getJwt());
//   console.log("hhhhh")
    
//     try {
//       const jwt = localStorage.getItem(tokenKey);
     
//       const decryptedToken = helpers.decryptobj(jwt);
//       const jwtDeco=jwtDecode(decryptedToken).isAdmin;
//       console.log(jwtDeco,"jwt");
//       return jwtDeco
      
//     } catch (ex) {
//       return null;
//     }
//   }
export function getCurrentUser() {
http.setJwt(getJwt());

  try {
    const token = localStorage.getItem(tokenKey);

    if (token) {
      const decryptedToken = helpers.decryptobj(token);

      const decodedToken = jwtDecode(decryptedToken);
      if (decodedToken.exp >= Date.now() / 1000) {

        return decodedToken;
      } else {
        logout();
      }
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

export async function tfa(phone_number) {
http.setJwt(getJwt());

  try {
    const tfaData = { phone_number };
    const encryptedData = helpers.encryptobj("0");
    const encryptedDat = helpers.encryptobj(encryptedData);
    const jwtToken = localStorage.getItem("token");
    httpService.setJwt(jwtToken);
    const response = await http.post(apiEndpoint + "/users/enble_2fa", {
      enc: encryptedData,
    });
    const decrptdata = helpers.decryptobj(response.data);


    
    return decrptdata;

    // return null;
  } catch (error) {
    throw error;
  }
}



// eslint-disable-next-line import/no-anonymous-default-export
export default {
  sendOTP,
  getJwt,
  verifyOTP,
  resendOtp,
  getCurrentUser,
  tfa,
  logout,
  IsAdmin,
  kycStatus,
  ApplyLoanOTP,
  AplyloanverifyOTP
  
};
// export default authService;
