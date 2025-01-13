
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import authService from '../../services/authService';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const isAdmin = authService.IsAdmin();
    const currentUser = authService.getCurrentUser();

    return (
        <>
            {/* Large device footer */}
            <div className='footer default-footer mt-auto py-3  text-center fixed-bottom z-0'>
                <span className="fs-14">
                    Copyright © <span className="year">{currentYear}</span>{" "}
                    <Link to='' className='text-primary'>Micro lending</Link> All rights reserved
                </span>
            </div>

            {/* Small device footer */}
            <div className="footer  mt-auto mx-0 py-3 d-sm-none fixed-bottom z-0 ">
                {/* <div className="container px-3"> */}
                <div className="mobile-navigation ">
                    <ul className="d-flex mb-0 ps-0 align-items-center justify-content-around">
                        {/* <li className='me-2'> */}
                        <NavItem to="/dashboard" icon={DashboardIcon} label="Dashboard" />
                        {/* </li> */}
                        {!isAdmin && (
                            <>
                                {/* <li className='me-2'> */}
                                <NavItem to="/userdetails" icon={UserDetailsIcon} label="Update Profile" />
                                {/* </li> */}
                                {/* <li className='me-2'> */}
                                <NavItem to="/loaneligibilitydetails" icon={ApplyLoanIcon} label="Apply Loan" />
                                {/* </li> */}
                                {/* <li className='me-2'> */}
                                <NavItem to="/Loanstatus" icon={LoanStatusIcon} label="Loan Status" />
                                {/* </li> */}
                            </>
                        )}

                        {isAdmin && (
                            <>

                                <NavItem to="/userlist" icon={UsersListIcon} label="Users List" />

                                <NavItem to="/adminlist" icon={AdminListIcon} label="Admin List" />
                                {/* <NavItem to="/admincontrols" icon={AdminControlsIcon} label="Admin Controls" /> */}
                                {/* <NavItem to="/loaneligibility" icon={LoanEligibilityIcon} label="Loan Eligibility" /> */}

                                <NavItem to="/verifyloan" icon={VerifyLoanIcon} label="Verify Loan" />
                            </>
                        )}
                    </ul>
                </div>
                {/* </div > */}
            </div>        </>
    );
};

const NavItem = ({ to, icon: Icon, label, ...rest }) => (
    <li className="nav-item">
        <NavLink to={to} className="nav-link" {...rest}>
            <Icon />
            <span>{label}</span>
        </NavLink>
    </li>
);

const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="24">
        <path d="M200-160v-366L88-440l-48-64 440-336 160 122v-82h120v174l160 122-48 64-112-86v366H520v-240h-80v240H200Zm80-80h80v-240h240v240h80v-347L480-739 280-587v347Zm120-319h160q0-32-24-52.5T480-632q-32 0-56 20.5T400-559Zm-40 319v-240h240v240-240H360v240Z" />
    </svg>
);

const UserDetailsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
        <path d="M480-120q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-480q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q82 0 155.5 35T760-706v-94h80v240H600v-80h110q-41-56-101-88t-129-32q-117 0-198.5 81.5T200-480q0 117 81.5 198.5T480-200q105 0 183.5-68T756-440h82q-15 137-117.5 228.5T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z" />
    </svg>
);

const ApplyLoanIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
        <path d="M760-400v-260L560-800 360-660v60h-80v-100l280-200 280 200v300h-80ZM560-800Zm20 160h40v-40h-40v40Zm-80 0h40v-40h-40v40Zm80 80h40v-40h-40v40Zm-80 0h40v-40h-40v40ZM280-220l278 76 238-74q-5-9-14.5-15.5T760-240H558q-27 0-43-2t-33-8l-93-31 22-78 81 27q17 5 40 8t68 4q0-11-6.5-21T578-354l-234-86h-64v220ZM40-80v-440h304q7 0 14 1.5t13 3.5l235 87q33 12 53.5 42t20.5 66h80q50 0 85 33t35 87v40L560-60l-280-78v58H40Zm80-80h80v-280h-80v280Z" />
    </svg>
);

const LoanStatusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="24">
        <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
    </svg>
);

const UsersListIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
        <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-720Zm0 640q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-117 0-198.5 81.5T200-480q0 117 81.5 198.5T480-160Z" />
    </svg>
);

const AdminListIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M680-280q25 0 42.5-17.5T740-340q0-25-17.5-42.5T680-400q-25 0-42.5 17.5T620-340q0 25 17.5 42.5T680-280Zm0 120q31 0 57-14.5t42-38.5q-22-13-47-20t-52-7q-27 0-52 7t-47 20q16 24 42 38.5t57 14.5ZM480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v227q-19-8-39-14.5t-41-9.5v-147l-240-90-240 90v188q0 47 12.5 94t35 89.5Q310-290 342-254t71 60q11 32 29 61t41 52q-1 0-1.5.5t-1.5.5Zm200 0q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80ZM480-494Z" /></svg>

);

// const AdminControlsIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
//         <path d="M200-120v-640h120v640H200Zm220 0v-640h120v640H420Zm220 0v-640h120v640H640Z" />
//     </svg>
// );

// const LoanEligibilityIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="24">
//         <path d="M120-160v-80h720v80H120Zm180-120v-80h360v80H300Zm-180-120v-80h720v80H120Zm180-120v-80h360v80H300Zm-180-120v-80h720v80H120Zm0-200v-80h720v80H120Z" />
//     </svg>
// );

const VerifyLoanIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M160-640h640v-80H160v80Zm-80-80q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v240H160v240h164v80H160q-33 0-56.5-23.5T80-240v-480ZM598-80 428-250l56-56 114 112 226-226 56 58L598-80ZM160-720v480-180 113-413Z" /></svg>

);






export default Footer;
