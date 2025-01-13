
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { backEndCall, backEndCallObj } from "../../services/mainServiceFile";
import { useMovieContext } from "./Context";
import toast from "react-hot-toast";
import Joi from 'joi';
import { useFunctionContext } from "./FunctionsContext";
import Updateprofile from "../authentication/Updateprofile";

const Header = () => {
  const navigate = useNavigate();
  const { userprofileData, setUserprofileData, setbkcall } = useMovieContext();
  const { checkErrors } = useFunctionContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    photo: "",
  });

  // Define validation schema
  const schema = {
    photo: Joi.any().required().label("Photo"),
  };

  const handleProfilePhotoSelection = () => {
    fileInputRef.current.click(); // Trigger file input click
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        // console.log("Base64:", base64String);
        setFormData({ ...formData, photo: base64String }); // Update formData with base64 photo
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (formData.photo) {
      handleSubmit();
    }
  }, [formData.photo]);

  const handleSubmit = async () => {
    try {
      // console.log(formData, "photo");
      await checkErrors(schema, formData);
      // console.log(formData, "jdjdphoto");
      const response = await backEndCallObj("/users/files_upload", formData);

      setFormData({ photo: "" });

      // Update user's profile data with the new photo
      setUserprofileData({ ...userprofileData, photo: formData.photo });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error(ex.response?.data);
      }
    }
  };

  const headerToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.classList.toggle('menu-close');
  };

  const fetchData = async () => {
    try {
      // if (!userprofileData || userprofileData.length >= 0) {
      // setbkcall(true);
      const response = await backEndCall("/users/user_profile");
      setUserprofileData(response);
      // setbkcall(false);
      // console.log(response, "profile");
      // }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error(ex.response.data);
      }
    }
  };

  useEffect(() => {

    fetchData();

  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate("/landing");
  };

  function capitalizeFirstLetter(string) {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="header">
      <nav className="navbar col-lg-12 col-12 p-0 d-block">
        <div className="navbar-menu-wrapper d-flex justify-content-between align-items-center">
          <div className="d-inline-flex align-items-center">
            <button className="navbar-toggler align-self-center" onClick={headerToggleMenu} type="button" data-toggle="minimize">
              <label className="hamburger">
                <input type="checkbox" onClick={headerToggleMenu} />
                <svg viewBox="0 0 32 32">
                  <path className="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
                  <path className="line" d="M7 16 27 16"></path>
                </svg>
              </label>
            </button>
            <div className="d-none d-sm-block">
              <div className="input-group border rounded-2 ms-4 flex-nowrap header-search">
                <span className="input-group-text bg-transparent border-0 cursor-pointer" id="header-search-btn"><i className="ri-search-line"></i></span>
                <form className="col-12 col-lg-auto flex-fill" role="search">
                  <input
                    type="search"
                    className="form-control border-0 ps-0"
                    placeholder="Search..."
                    aria-label="Search"
                  />
                </form>
              </div>
            </div>
          </div>
          <form style={{ display: "none" }}>
            <input
              type="file"
              ref={fileInputRef}
              className="form-control"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handleFileInputChange}
            />
          </form>
          <ul className="nav mb-md-0 header-right">
            <li className="dropdown text-end header-dropdown">
              <Link
                to=""
                className="d-block link-body-emphasis text-decoration-none"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                data-bs-auto-close="outside"
                style={{ marginTop: "-25px" }}
              >
                <span className="fw-semibold me-2 text-capitalize"></span>
                <span className="user-details border rounded-circle d-flex justify-content-center align-items-center">
                  {userprofileData?.photo ? (
                    <img src={userprofileData?.photo} alt="User Photo" className="rounded-circle shadow" />
                  ) : (
                    <i className="ri-user-3-fill"></i>
                  )}
                  {/* <i
                    className="ri-edit-line edit-icon position-absolute top-0 end-0  small-rounded-icon"
                    onClick={handleProfilePhotoSelection}
                  ></i> */}
                  <i
                    className="ri-edit-line edit-icon position-absolute small-rounded-icon"
                    style={{ bottom: '0', right: '0' }}
                    onClick={handleProfilePhotoSelection}
                  ></i>
                </span>
              </Link>
              <ul className="dropdown-menu text-small">
                <li>
                  <Link className="dropdown-item" to="/Settings">
                    <i className="ri-settings-3-fill fs-15 me-1"></i> Settings
                  </Link>
                </li>
                {!authService.IsAdmin() &&
                  <li>
                    <Link className="dropdown-item" to="/userdetails">
                      <i className="ri-user-fill fs-15 me-1"></i> Profile
                    </Link>
                  </li>
                }
                <li onClick={handleLogout}>
                  <Link className="dropdown-item" to="">
                    <i className="ri-logout-circle-r-fill fs-15 me-1"></i> Sign out
                  </Link>
                </li>
              </ul>
            </li>
            <li className="d-lg-none">
              {authService.getCurrentUser && authService.IsAdmin() ? (
                <p className="text-center text-wrapper mt-3">Admin</p>
              ) : (
                <p className="text-center text-wrapper mt-3">User</p>
              )}
            </li>
            <li className="d-none d-lg-block">
              {!authService.IsAdmin() &&
                <p className="text-center text-wrapper mt-3">
                  {userprofileData?.full_name !== "0"
                    ? capitalizeFirstLetter(userprofileData?.full_name)
                    : "user"}
                </p>
              }
              {authService.getCurrentUser && authService.IsAdmin() && (
                <div className="text-center mt-3">
                  admin
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav >
    </div >
  );
};

export default Header;
