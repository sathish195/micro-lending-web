
import React, { useEffect, useState } from "react";
import Joi from "joi";
import { backEndCallObj } from "../../services/mainServiceFile";
import { Modal, Button } from "react-bootstrap";
import { Input_text, Select_input, Number_Input, Input_email } from './../comman/All-Inputs';
import { useMovieContext } from "../comman/Context";
import { useFunctionContext } from "../comman/FunctionsContext";
import { toast } from "react-hot-toast";
import authservice from '../../services/authService';
import { Form } from "react-router-dom";

const AddAdmin = ({ show, onHide }) => {
  const { AddAdminData, setAddadminData, errors, setLoading, setErrorOccur, setErrors } = useMovieContext();
  const { checkErrors } = useFunctionContext();
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    member_email: "",
    admin_type: "",
    phone_number: "",
  });

  const schema = {
    full_name: Joi.string().required().label("Name").min(2).max(50),
    admin_type: Joi.string().required().label("Admin Type"),
    member_email: Joi.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      .options({
        messages: {
          "string.pattern.base": "Please enter a valid email address. (e.g., example@example.com)",
        },
      }).required().label("Email Id"),
    phone_number: Joi.string().trim().min(10).max(10).length(10)
      .pattern(/^[6-9][0-9]*$/)
      .label("Phone Number")
      .messages({
        "string.pattern.base": "should not start with 1, 2, 3, 4, 5, or 6 and should not contain special characters",
      })
  };

  const AddAdminlist = async () => {
    const response = await backEndCallObj("/admin/admins_list");
    setAddadminData(response);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnDisabled(true);
    try {
      await checkErrors(schema, formData);
      setLoading(true);

      // const { phone_number } = formData;
      // const prefixedPhoneNumber = `63${phone_number}`;
      const phonenumber = "63" + formData.phone_number
      const admin = formData.full_name + " admin "


      const response = await backEndCallObj("/admin/create_admin", {
        full_name: admin,
        member_email: formData.member_email,
        admin_type: formData.admin_type,
        phone_number: phonenumber,



        // ...formData,

        // phone_number: prefixedPhoneNumber,
      }
      );


      AddAdminlist();
      toast.success(response.message, "Admin added successfully");
      onHide();
      setLoading(false);
      setErrorOccur(false);
      setFormData({
        full_name: "",
        member_email: "",
        admin_type: "",
        phone_number: "",
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error(ex.response.data);
      }
    } finally {
      setLoading(false);
      setBtnDisabled(false);
    }
  };

  const handleClose = () => {
    onHide();
    setFormData({
      full_name: "",
      member_email: "",
      admin_type: "",
      phone_number: "",
    });
  };
  // const style = { paddingleft: 0, "20px" }

  if (authservice.getCurrentUser().admin_type !== "1") {
    window.history.back();
  }
  useEffect(() => {
    // Clean up errors when component unmounts
    return () => {
      setErrors({});
    };
  }, []);
  // console.log(formData)
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Admin</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="addAdmin_form">
          <div className="mb-3">
            <label htmlFor="Name" className="form-label">Name</label>
            <Input_text
              type="text"
              value={formData["full_name"]}
              name="full_name"
              placeholder="Enter name here"
              SetForm={setFormData}
              schema={schema["full_name"]}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="member_email" className="form-label">Email</label>
            <Input_email
              type="email"
              value={formData["member_email"]}
              name="member_email"
              placeholder="Enter email here"
              SetForm={setFormData}
              schema={schema["member_email"]}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phone_number" className="form-label ">Phone Number</label>
            <div className="position-relative applyloan">
              <span className="apply_loan p-2 positon_absolute font-bold me-2">+63</span>
              <Number_Input

                type="number"
                value={formData["phone_number"]}
                name="phone_number"
                placeholder="Enter phone number here"
                SetForm={setFormData}
                schema={schema["phone_number"]}
                maxLength={10}
                className="phone_number-input-number"
                padding="20px"
              // style={padding}

              />

            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="admin_type" className="form-label">Admin Type</label>
            <Select_input
              name="admin_type"
              className="formform-control"
              SetForm={setFormData}
              value={formData["admin_type"]}
              schema={schema["admin_type"]}
              options={[
                { value: "2", label: "2" },
                { value: "3", label: "3" },
              ]}
            />
          </div>
          <Button variant="primary" type="submit" disabled={btnDisabled}>Submit</Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddAdmin;
