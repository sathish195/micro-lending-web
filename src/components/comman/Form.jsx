// import React, { useState } from 'react';
// import Joi from 'joi-browser';
// import Input from './Input'; // Assuming Input component is available

// const Form = ({ schema, doSubmit, children }) => {
//     const [data, setData] = useState({});
//     const [errors, setErrors] = useState({});

//     const validate = () => {
//         const options = { abortEarly: false };
//         const { error } = Joi.validate(data, schema, options);
//         if (!error) return null;
//         const validationErrors = {};
//         for (let item of error.details) {
//             validationErrors[item.path[0]] = item.message;
//         }
//         return validationErrors;
//     };

//     const validateProperty = ({ name, value }) => {
//         const obj = { [name]: value };
//         const propertySchema = { [name]: schema[name] };
//         const { error } = Joi.validate(obj, propertySchema);
//         return error ? error.details[0].message : null;
//     };

//     const handleChange = ({ currentTarget: input }) => {
//         const errorMessage = validateProperty(input);
//         const newErrors = { ...errors };
//         if (errorMessage) newErrors[input.name] = errorMessage;
//         else delete newErrors[input.name];
//         setErrors(newErrors);

//         const newData = { ...data };
//         newData[input.name] = input.value;
//         setData(newData);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const validationErrors = validate();
//         setErrors(validationErrors || {});
//         if (validationErrors) return;
//         doSubmit(data);
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             {React.Children.map(children, (child) => {
//                 if (child.type === 'input') {
//                     return React.cloneElement(child, {
//                         value: data[child.props.name],
//                         onChange: handleChange,
//                         error: errors[child.props.name],
//                     });
//                 }
//                 return child;
//             })}
//         </form>
//     );
// };

// export default Form;



import React, { useState } from "react";
import Joi from "joi-browser";
import Input from "./input";

const Form = ({ schema, doSubmit }) => {
    const [data, setData] = useState({});
    const [errors, setErrors] = useState({});

    const validate = () => {
        const options = {
            abortEarly: false,
        };
        const { error } = Joi.validate(data, schema, options);
        if (!error) return null;
        const validationErrors = {};
        error.details.forEach((item) => {
            validationErrors[item.path[0]] = item.message;
        });
        return validationErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors || {});
        if (validationErrors) return;
        doSubmit();
    };

    const handleChange = ({ currentTarget: input }, pattern) => {
        const newErrors = { ...errors };
        const errorMessage = validateProperty(input);
        if (errorMessage) newErrors[input.name] = errorMessage;
        else delete newErrors[input.name];

        const newData = { ...data };
        if (pattern) {
            newData[input.name] = input.value
                ? pattern.test(input.value)
                    ? input.value
                    : input.value.slice(0, -1)
                : input.value;
        } else {
            newData[input.name] = input.value;
        }
        setData(newData);
        setErrors(newErrors);
    };

    const validateProperty = ({ name, value }) => {
        if (
            name === "email" ||
            name === "successUrl" ||
            name === "notifyUrl" ||
            name === "search"
        ) {
            value = value.trim();
        }
        const obj = { [name]: value };
        const validationSchema = { [name]: schema[name] };
        const { error } = Joi.validate(obj, validationSchema);
        return error ? error.details[0].message : null;
    };

    const renderInput = (name, type, id, placeholder, className, maxLength, pattern, autoFocus) => {
        return (
            <Input
                value={data[name]}
                onChange={(e) => handleChange(e, pattern)}
                type={type}
                id={id}
                name={name}
                placeholder={placeholder}
                className={className}
                maxLength={maxLength}
                autoFocus={autoFocus}
            />
        );
    };

    return {
        data,
        errors,
        handleChange,
        handleSubmit,
        renderInput,
    };
};

export default Form;
