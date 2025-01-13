
import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import Kyc_url from './../admin/kyc_url';
import TransactionHistory from './../authentication/forgot_password';

const Sidebar = () => {
  const Navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const bodyRef = useRef(document.body);

  const sidemenuCloseClick = () => {
    bodyRef.current.classList.remove("menu-close");
  };

  const handleLogout = () => {
    // console.log("Button clicked!");
    authService.logout();
    Navigate("/login");
  };

  return (
    <>
      <div
        className="sidebar-close"
        onClick={sidemenuCloseClick}
      >
        <aside id="sidebar" className="sidebar-menu">
          <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
            <Link
              to="/dashboard"
              className="d-flex align-items-center mb-2 mb-lg-0 link-body-emphasis text-decoration-none"
            >
              <img
                src="assets/images/dark-logo.png"
                className="main-logo"
                alt="logo"
              />
              <img
                src="assets/images/sidenav-logo.png"
                className="sidenav-toggle-logo"
                alt="logo"
              />
              {/* <h4 className='mb-0 text-white'>Micro Lending</h4> */}
            </Link>
          </div>
          <ul className="sidebar-nav">
            <li
              className="nav-item"

            >
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="22"
                  viewBox="0 -960 960 960"
                  width="24"
                >
                  <path d="M200-160v-366L88-440l-48-64 440-336 160 122v-82h120v174l160 122-48 64-112-86v366H520v-240h-80v240H200Zm80-80h80v-240h240v240h80v-347L480-739 280-587v347Zm120-319h160q0-32-24-52.5T480-632q-32 0-56 20.5T400-559Zm-40 319v-240h240v240-240H360v240Z" />
                </svg>
                <span>Dashboard</span>
              </NavLink>
            </li>

            {!authService.IsAdmin() && (

              <li className="nav-item">
                <NavLink to="/userdetails" className="nav-link">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-120q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-480q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q82 0 155.5 35T760-706v-94h80v240H600v-80h110q-41-56-101-88t-129-32q-117 0-198.5 81.5T200-480q0 117 81.5 198.5T480-200q105 0 183.5-68T756-440h82q-15 137-117.5 228.5T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z" /></svg>
                  <span>Update Profile</span>
                </NavLink>
              </li>

            )}











            {/* {!authService.IsAdmin() && (
              <li
                className="nav-item"

              >
                <NavLink to="/userprofile" className="nav-link">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="22"
                    viewBox="0 -960 960 960"
                    width="24"
                  >
                    <path d="M80-160v-112q0-33 17-62t47-44q51-26 115-44t141-18q30 0 58.5 3t55.5 9l-70 70q-11-2-21.5-2H400q-71 0-127.5 17T180-306q-9 5-14.5 14t-5.5 20v32h250l80 80H80Zm542 16L484-282l56-56 82 82 202-202 56 56-258 258ZM400-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm10 240Zm-10-320q33 0 56.5-23.5T480-640q0-33-23.5-56.5T400-720q-33 0-56.5 23.5T320-640q0 33 23.5 56.5T400-560Zm0-80Z" />
                  </svg>
                  <span>User Profile</span>
                </NavLink>
              </li>

            )} */}

            {!authService.IsAdmin() && (
              <li
                className="nav-item"

              >

                <NavLink to="/loaneligibilitydetails" className="nav-link">

                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M760-400v-260L560-800 360-660v60h-80v-100l280-200 280 200v300h-80ZM560-800Zm20 160h40v-40h-40v40Zm-80 0h40v-40h-40v40Zm80 80h40v-40h-40v40Zm-80 0h40v-40h-40v40ZM280-220l278 76 238-74q-5-9-14.5-15.5T760-240H558q-27 0-43-2t-33-8l-93-31 22-78 81 27q17 5 40 8t68 4q0-11-6.5-21T578-354l-234-86h-64v220ZM40-80v-440h304q7 0 14 1.5t13 3.5l235 87q33 12 53.5 42t20.5 66h80q50 0 85 33t35 87v40L560-60l-280-78v58H40Zm80-80h80v-280h-80v280Z" /></svg>
                  <span>Apply Loan</span>
                </NavLink>
              </li>

            )}
            {authService.IsAdmin() && (
              <li
                className="nav-item"

              >
                <NavLink to="/userlist" className="nav-link">

                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" /></svg>


                  <span>Users List</span>
                </NavLink>
              </li>
            )}



            {authService.IsAdmin() && (
              <li
                className="nav-item"

              >
                <NavLink to="/adminlist" className="nav-link">

                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M680-280q25 0 42.5-17.5T740-340q0-25-17.5-42.5T680-400q-25 0-42.5 17.5T620-340q0 25 17.5 42.5T680-280Zm0 120q31 0 57-14.5t42-38.5q-22-13-47-20t-52-7q-27 0-52 7t-47 20q16 24 42 38.5t57 14.5ZM480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v227q-19-8-39-14.5t-41-9.5v-147l-240-90-240 90v188q0 47 12.5 94t35 89.5Q310-290 342-254t71 60q11 32 29 61t41 52q-1 0-1.5.5t-1.5.5Zm200 0q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80ZM480-494Z" /></svg>
                  <span>Admin List</span>
                </NavLink>
              </li>
            )}

            {authService.IsAdmin() && (
              <li
                className="nav-item"

              >
                <NavLink to="/admincontrols" className="nav-link">

                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M750-640h40v-160h-40v160Zm-100 0h40v-160h-40v160ZM480-480ZM80-280q50 0 85 35t35 85H80v-120Zm0-160q117 0 198.5 81.5T360-160h-80q0-83-58.5-141.5T80-360v-80Zm0-160q91 0 171 34.5T391-471q60 60 94.5 140T520-160h-80q0-75-28.5-140.5t-77-114q-48.5-48.5-114-77T80-520v-80Zm720 440H600q0-20-1.5-40t-4.5-40h206v-212q22-7 42-16.5t38-22.5v251q0 33-23.5 56.5T800-160ZM80-680v-40q0-33 23.5-56.5T160-800h292q-6 19-9 39t-3 41H160v46q-20-3-40-4.5T80-680Zm640 160q-83 0-141.5-58.5T520-720q0-83 58.5-141.5T720-920q83 0 141.5 58.5T920-720q0 83-58.5 141.5T720-520Z" /></svg>
                  <span>Admin Controls</span>
                </NavLink>
              </li>

            )}
            {authService.IsAdmin() && (
              <li
                className="nav-item"

              >
                <NavLink to="/loaneligibility" className="nav-link">

                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M760-400v-260L560-800 360-660v60h-80v-100l280-200 280 200v300h-80ZM560-800Zm20 160h40v-40h-40v40Zm-80 0h40v-40h-40v40Zm80 80h40v-40h-40v40Zm-80 0h40v-40h-40v40ZM280-220l278 76 238-74q-5-9-14.5-15.5T760-240H558q-27 0-43-2t-33-8l-93-31 22-78 81 27q17 5 40 8t68 4q0-11-6.5-21T578-354l-234-86h-64v220ZM40-80v-440h304q7 0 14 1.5t13 3.5l235 87q33 12 53.5 42t20.5 66h80q50 0 85 33t35 87v40L560-60l-280-78v58H40Zm80-80h80v-280h-80v280Z" /></svg>
                  <span>Loan Eligibility</span>
                </NavLink>
              </li>

            )}
            {authService.IsAdmin() && (
              <li
                className="nav-item"

              >
                <NavLink to="/verifyloan" className="nav-link">

                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M160-640h640v-80H160v80Zm-80-80q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v240H160v240h164v80H160q-33 0-56.5-23.5T80-240v-480ZM598-80 428-250l56-56 114 112 226-226 56 58L598-80ZM160-720v480-180 113-413Z" /></svg>
                  <span>Verify Loan</span>
                </NavLink>
              </li>

            )}
            {!authService.IsAdmin() && (
              <li
                className="nav-item"

              >
                <NavLink
                  to="/Loanstatus"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="22"
                    viewBox="0 -960 960 960"
                    width="24"
                  >
                    <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
                  </svg>
                  <span>Loan Status</span>
                </NavLink>
              </li>)}
            {/* {authService.IsAdmin() && ( */}
            <li
              className="nav-item"

            >
              <NavLink to="/transection_history" className="nav-link">

                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-40.5-61T516-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 48.5T486-314q-33 0-58.5-20.5T390-396l-66 26q14 48 43.5 77.5T444-252v52Zm36 120q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
                <span> Transaction History</span>
              </NavLink>
            </li>
            {/* )} */}
            {/* {!authService.IsAdmin() && (
              <li
                className="nav-item"

              >

                <NavLink to="/admintrasections" className="nav-link">

                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-40.5-61T516-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 48.5T486-314q-33 0-58.5-20.5T390-396l-66 26q14 48 43.5 77.5T444-252v52Zm36 120q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
                  <span>Transaction History</span>
                </NavLink>
              </li>)} */}
            <li
              className="nav-item"

            >
              <NavLink to="/emihistory" className="nav-link">

                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-40.5-61T516-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 48.5T486-314q-33 0-58.5-20.5T390-396l-66 26q14 48 43.5 77.5T444-252v52Zm36 120q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
                <span> EMI History</span>
              </NavLink>
            </li>
            {/* {authService.IsAdmin() &&
              <li className="nav-item">
                <NavLink to="/Kyc_url" className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }>

                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M12 2L2 21h20L12 2zm0 5l5.5 9h-11L12 7z" />
                  </svg>
                  <span>Generate Kyc Url</span>
                </NavLink>
              </li>
            } */}



            <li
              className="nav-item"

            >
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                {/* <i className="ri-user-3-line"></i> */}
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" /></svg>
                <span> Settings</span>
              </NavLink>
            </li>


            <li
              className="nav-item"

            >
              {!authService.getCurrentUser() && (
                <NavLink to="/login" className="nav-link ">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="22"
                    viewBox="0 -960 960 960"
                    width="24"
                  >
                    <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z" />
                  </svg>
                  <span>Login</span>
                </NavLink>
              )}
            </li>
            <li
              className="nav-item"

            >
              {authService.getCurrentUser() && (
                <NavLink to="/landing" className="nav-link " onClick={handleLogout}>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="22"
                    viewBox="0 -960 960 960"
                    width="24"
                  >
                    <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z" />
                  </svg>
                  <span>Logout</span>
                </NavLink>
              )}
            </li>

          </ul>
        </aside>
      </div>
    </>
  );
};

export default Sidebar;
