import React, { Component } from "react";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import "./App.css";
import AppLayout from "./Layout";
import LoginForm from "./components/authentication/Login";
import VerifyOtp from "./components/authentication/verify_otp";

import Dashboard from "./components/dashbord/Dashbord";
import Settings from "./components/admin/Settings";

import { Toaster } from "react-hot-toast";
import Updateprofile from "./components/authentication/Updateprofile";
import ProtectedRoute from "./ProtectedRoute";
import Userdetails from "./components/authentication/Userdetails";
import UsersList from "./components/admin/UsersList";
import AddAdmin from "./components/admin/Addadmin";
import AdminList from "./components/admin/AdminList";
import AddminControlls from "./components/admin/AddminControlls";
import Loaneligibility from "./components/admin/Loaneligibility";
import Landing from "./components/landingpage/Landing";
import ApplyLoan from "./components/authentication/ApplyLoan";
import AplyloanLogin from "./components/authentication/AplyloanLogin";
import LoaneligibilityDetails from "./components/authentication/LoaneligibilityDetails";
import Transection_history from "./components/authentication/Transection_history";

import Recenttransections from "./components/authentication/Resenttransections";

import AplyloanOtp from "./components/authentication/AplyloanOtp";
import LoanStatus from "./components/authentication/LoanStatus";
import VerifyLoan from "./components/admin/VerifyLoan";
import EmiDetails from "./components/authentication/EmiDetails";
import Userinfo from "./components/admin/Userinfo";
import EmiHistory from "./components/authentication/EmiHistory";
import LoanDetails from "./components/authentication/LoanDetails";
import Tab1 from "./components/admin/Tab1";
import Tab2 from "./components/admin/Tab2";
import Tab3 from "./components/admin/Tab3";
import Userdashbord from "./components/dashbord/Userdashbord";
import Admindashbord from "./components/dashbord/Admindashbord";
import KycRoot from "./components/authentication/KycRoot";
import Kyc_satus from "./components/authentication/Kyc_satus";
import Kyc_url from "./components/admin/kyc_url";
import BankDetails from "./components/authentication/BankDetails";
import WithdrawalPage from "./components/authentication/WithdrawalPage";
import WithdrawOtp from "./components/authentication/WithdrawOtp";
import AdminTransection from "./components/admin/AdminTransections";
import EmiPayOtp from "./components/authentication/EmiPayOtp";

const protect = (component) => <ProtectedRoute>{component}</ProtectedRoute>;
class App extends Component {
  render() {
    return (
      <div className="container-scroller">
        <BrowserRouter>
          <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
          <Routes>
            <Route path="/" element={protect(<AppLayout />)}>

              <Route index element={<Dashboard />} />

              <Route path="/dashboard" exact element={<Dashboard />}></Route>
              <Route path="/settings" element={<Settings />}></Route>
              <Route path="/emihistory" element={<EmiHistory />}></Route>
              <Route path="/transection_history" element={<Transection_history />}></Route>
              <Route path="/recenttransactionHistory" element={<Recenttransections></Recenttransections>}></Route>



              <Route path="/Userdashbord" element={<Userdashbord />}></Route>
              <Route path="/updateprofile" element={<Updateprofile />}></Route>
              <Route path="/userdetails" element={<Userdetails />}></Route>
              <Route path="/loaneligibilitydetails" element={<LoaneligibilityDetails />}></Route>

              <Route path="/loanstatus" element={<LoanStatus />}></Route>

              <Route path="/userprofile" element={<Userdetails />}></Route>




              <Route path="/kyc" element={<KycRoot></KycRoot>}></Route>
              <Route path="/applyloan" element={<ApplyLoan />}></Route>

              <Route path="/emidetails" element={<EmiDetails />}></Route>




              <Route path="/banklist" element={<BankDetails />}></Route>
              <Route path="/withdrawal" element={<WithdrawalPage />}> </Route>
              <Route path="/withdrawOtp" element={<WithdrawOtp />} />
              <Route path="/emipayotp" element={<EmiPayOtp />} />
              <Route path="/kycstatus" element={<Kyc_satus />}></Route>



              <Route path="/Admindashbord" element={<Admindashbord></Admindashbord>}></Route>

              <Route path="/Kyc_url" element={<Kyc_url />}></Route>
              <Route path="/userlist" element={<UsersList />}></Route>

              <Route path="/adminlist" element={<AdminList />}></Route>
              <Route path="/admincontrols" element={<AddminControlls />}></Route>
              <Route path="/loaneligibility" element={<Loaneligibility />}></Route>






              <Route path="/userinfo" element={<Userinfo />}></Route>

              <Route path="/verifyloan" element={<VerifyLoan />}></Route>

              <Route path="/tab1" element={<Tab1></Tab1>}></Route>

              <Route path="/tab2" element={<Tab2></Tab2>}></Route>
              <Route path="/tab3" element={<Tab3></Tab3>}></Route>



            </Route>

            <Route path="/landing" element={<Landing></Landing>}></Route>
            <Route path="/login" element={<LoginForm></LoginForm>}></Route>

            <Route path="/verifyotp" element={<VerifyOtp></VerifyOtp>}></Route>

            <Route
              path="*"
              element={
                <div className="text-center">
                  <h3 className="mt-5 text-default-color">
                    Page was not Found...😫
                  </h3>
                </div>
              }
            />
          </Routes>
        </BrowserRouter>

        {/* */}
      </div>
    );
  }
}

export default App;
