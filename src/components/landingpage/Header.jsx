import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg px-0 px-lg-3 ${isSticky ? "isSticky" : ""}`}
        aria-label="Offcanvas navbar large"
      >
        <div className="container-fluid justify-content-lg-between py-2 px-3 px-lg-5 py-lg-0">
          <Link className="navbar-brand logo" to="/">
            <img src="assets/images/light-logo.png" alt="logo" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar2"
            aria-controls="offcanvasNavbar2"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="offcanvas offcanvas-end"
            tabIndex="-1"
            id="offcanvasNavbar2"
            aria-labelledby="offcanvasNavbar2Label"
          >
            <div className="offcanvas-header">
              <Link className="navbar-brand logo" to="/">
                <img src="assets/images/light-logo.png" alt="logo" />
              </Link>
              <button
                type="button"
                className="btn-close btn-close-dark"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <NavItem link="#home" text="Home" isActive={true} />
                <NavItem link="#Solutions" text="Solutions" />
                <NavItem link="#Resources" text="Resources" />
                <NavItem link="#Clients" text="Clients" />
                <NavItem link="#About" text="About" />
              </ul>
              <div className="mt-3 mt-lg-0">
                <button className="btn rounded-1 btn-lg btn-primary" onClick={() => navigate("/login")}>Login</button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

const NavItem = ({ link, text, isActive }) => {
  return (
    <li className={`nav-item ${isActive ? "active" : ""}`}>
      <a className="nav-link" href={link}>
        {text}
      </a>
    </li>
  );
};

export default Header;
