import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="text-white" id="footer">
      <div className="row mx-sm-5 mx-2 footer-border pt-5 d-flex justify-content-between">
        <div className="col-md-3 col-sm-6 col-12">
          <Link className="footer-logo">
            <img src="assets/images/dark-logo.png" alt="Logo" />
          </Link>
          <h6 className="fw-semibold mb-0 mt-4 mb-1 main-info">About Micro</h6>
          <ul className="list-group ">
            <li className="list-group-item">
              <Link>Home</Link>
            </li>
            <li className="list-group-item">
              <Link>How it works</Link>
            </li>
            <li className="list-group-item">
              <Link>About us</Link>
            </li>
            <li className="list-group-item">
              <Link>Team</Link>
            </li>
            <li className="list-group-item">
              <Link>Careers</Link>
            </li>
          </ul>
        </div>
        <div className="col-md-3 col-sm-6 col-12">
          <h6 className="fw-semibold mb-0 mt-3 mb-1 main-info">Popular Loans</h6>
          <ul className="list-group ">
            <li className="list-group-item">
              <Link>Personal Loan</Link>
            </li>
            <li className="list-group-item">
              <Link>Credit Cards</Link>
            </li>
            <li className="list-group-item">
              <Link>Home Loan</Link>
            </li>
            <li className="list-group-item">
              <Link>Education Loan</Link>
            </li>
            <li className="list-group-item">
              <Link>Fixed Deposite</Link>
            </li>
          </ul>
        </div>
        <div className="col-md-3 col-sm-6 col-12 mt-4 mt-md-0">
          <h6 className="fw-semibold mb-0 mt-3 mb-1 main-info">Legal</h6>
          <ul className="list-group">
            <li className="list-group-item">
              <Link>Terms of use</Link>
            </li>
            <li className="list-group-item">
              <Link>Privacy policy</Link>
            </li>
            <li className="list-group-item">
              <Link>Raise a complaint</Link>
            </li>
            <li className="list-group-item">
              <Link>RBI Disclaimer</Link>
            </li>
            <li className="list-group-item">
              <Link>Crypto</Link>
            </li>
            <li className="list-group-item">
              <Link>Portfolio Performance</Link>
            </li>
          </ul>
        </div>
        <div className="col-md-3 col-sm-6 col-12 mt-4 mt-md-0">
          <form>
            <h6 className="fw-semibold mb-0 mt-3 mb-3 main-info">Subscribe Now</h6>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                id="textInputForm"
                placeholder="Enter username here"
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                id="emailInputForm"
                placeholder="Enter username here"
              />
            </div>
            <button className="btn btn-primary">Submit</button>
            <div className="fs-12 text-muted mt-3">Stay up to date with the latest news and offers from Micro lending</div>
          </form>
          <h6 className="fw-semibold mb-0 mt-3 mb-3 main-info">Follow us on</h6>
          <div className="d-flex btn-list">
            <Link className="btn btn-sm btn-primary-light btn-icon">
              <i className="ri-facebook-line fw-bold align-middle"></i>
            </Link>

            <Link className="btn btn-sm btn-info-light btn-icon">
              <i className="ri-twitter-x-line fw-bold fw-bold align-middle"></i>
            </Link>

            <Link className="btn btn-sm btn-warning-light btn-icon">
              <i className="ri-instagram-line fw-bold fw-bold align-middle"></i>
            </Link>

            <Link className="btn btn-sm btn-danger-light btn-icon">
              <i className="ri-youtube-line fw-bold fw-bold align-middle"></i>
            </Link>
          </div>
        </div>
        <hr className="mb-0 mt-4"/>
        <div className="py-4">
            <p className="text-white-75 mb-0 fs-14 d-inline-flex align-items-center"><span className="text-uppercase fs-20 fw-bold">Micro</span> <span className="ms-2">Copyright © 2024 Micro lending company All rights reserved </span></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
