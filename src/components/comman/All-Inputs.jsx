import React from "react";
import { useMovieContext } from "./Context";
import { useFunctionContext } from "./FunctionsContext";
import moment, { max } from "moment";
import { min } from "numeric";





export function Input_Name({
  type,
  name,
  id,
  placeholder,
  value,
  SetForm,
  schema,
  min,
  max,
  maxLength,
  autoFocus

}) {
  const { errors } = useMovieContext();
  const { handleChange } = useFunctionContext();
  const handleInputChange = (e) => {
    const { value } = e.target;
    const isValid = /^[a-zA-Z\s]*$/.test(value);  // Regular expression to allow only alphabetic characters and spaces
    if (!isValid) return; // If the input contains invalid characters, do not update the value
    handleChange(e, schema, SetForm);
  };

  return (
    <>
      <input
        className="form-control"
        type={type}
        id={name}
        name={name}
        min={min}
        max={max}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        autoFocus={autoFocus}
      // onChange={(e) => handleChange(e, schema, SetForm)}
      />
      <p className="error mt-2"> {errors[name]}</p>
    </>
  );
}
export function Input_docnumbers({
  type,
  name,
  id,
  placeholder,
  value,
  SetForm,
  schema,
  min,
  max,
  minLength,
  maxLength,
  autoFocus
}) {
  const { errors } = useMovieContext();


  const { handleChange } = useFunctionContext();
  const handleInputChange = (e) => {
    const { value } = e.target;
    const isValid = /^[A-Za-z0-9]*$/.test(value);
    if (isValid) {

      handleChange(e, schema, SetForm);
    }
  };
  return (
    <>
      <input
        className="form-control"
        type={type}
        id={name}
        name={name}
        minLength={minLength}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        autoFocus={autoFocus}
      />
      <p className="error mt-2"> {errors[name]}</p>
    </>
  );
}
export function Input_text({
  type,
  name,
  id,
  placeholder,
  value,
  SetForm,
  schema,
  min,
  max,
  maxLength,
  autoFocus
}) {

  const { errors } = useMovieContext();
  const { handleChange } = useFunctionContext();

  const handleInputChange = (e) => {
    const { value } = e.target;
    // const isValid = /^[a-zA-Z]*$/.test(value); // Regular expression to allow only alphabetic characters without spaces
    const isValid = /^[a-zA-Z\s]*$/.test(value);
    if (!isValid) return; // If the input contains invalid characters, do not update the value
    handleChange(e, schema, SetForm);
  };

  return (
    <>
      <input
        className="form-control"
        type={type}
        id={name}
        name={name}
        min={min}
        max={max}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        autoFocus={autoFocus}
      // onChange={(e) => handleChange(e, schema, SetForm)}
      />
      <p className="error mt-2"> {errors[name]}</p>
    </>
  );
}
export function Input_address({
  type,
  name,
  id,
  placeholder,
  value,
  SetForm,
  schema,
  min,
  max,
  maxLength,
  autoFocus
}) {
  const { errors } = useMovieContext();
  const { handleChange } = useFunctionContext();
  const handleInputChange = (e) => {
    const { value } = e.target;
    const isValid = /^[a-zA-Z0-9/ _,-]*$/.test(value); // Regular expression to allow alphanumeric characters, spaces, underscores, hyphens, and forward slashes
    if (!isValid) return; // If the input contains invalid characters, do not update the value
    handleChange(e, schema, SetForm);
  };
  return (
    <>
      <input
        className="form-control"
        type={type}
        id={name}
        name={name}
        min={min}
        max={max}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        // onChange={handleInputChange}
        autoFocus={autoFocus}
        onChange={handleInputChange}
      />
      <p className="error mt-2"> {errors[name]}</p>
    </>
  );
}


export function Input_email({
  type,
  name,
  id,
  placeholder,
  value,
  SetForm,
  schema,
  autoFocus,
  minLength,
  maxLength
}) {
  const { errors, } = useMovieContext();
  const { handleChange } = useFunctionContext()
  const handleInputChange = (e) => {
    const { value } = e.target;
    const isValid = /^[A-Za-z0-9@,.]*$/.test(value); // Regular expression to allow numbers, letters, spaces, @, and ,
    if (!isValid) return; // If the input contains invalid characters, do not update the value
    handleChange(e, schema, SetForm);
  };

  return (
    <>
      <input
        className="form-control"
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        // onChange={(e) => handleChange(e, schema, SetForm)}
        autoFocus={autoFocus}
        minLength={minLength}
        maxLength={maxLength}
      />
      <p className="error mt-2"> {errors[name]}</p>
    </>
  );
}




export function Select_input_details({ name, value, schema, SetForm, options }) {
  const { errors, setErrors } = useMovieContext();
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate against schema if schema is provided
    if (schema) {
      const validationResult = schema.validate({ [name]: value }, { abortEarly: false });

      const errorMessage = validationResult.error ? validationResult.error.details[0].message : "";

      // Update errors state
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMessage,
      }));
    }
  }

  return (
    <>
      <select name={name} value={value} onChange={handleChange} className="form-control">
        <option value="">--select--</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[name] && <p className="error mt-2">{errors[name]}</p>}
    </>
  );
}

export function Select_input({ name, value, schema, SetForm, options }) {
  // console.log(name, options)
  // console.log("value in select -->", value)
  const { errors, genresData } = useMovieContext();
  const { handleChange } = useFunctionContext();


  return (
    <>
      <select
        onChange={(e) => handleChange(e, schema, SetForm)}
        name={name}
        value={value}
      >
        <option value="">--select--</option>
        {options &&
          options.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
      </select>
      <p className="error mt-2"> {errors[name]}</p>
    </>
  );
}

export function Password_Input({
  type,
  name,
  placeholder,
  value,
  SetForm,
  schema,
  autoFocus
}) {
  const { errors } = useMovieContext();
  const { handleChange } = useFunctionContext();


  return (
    <>
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => handleChange(e, schema, SetForm)}
      />
      <p className="error mt-2"> {errors[name]}</p>
    </>
  );
}

export function Date_Input({

  type,
  name,
  value,
  SetForm,
  schema,
  min,
  max,
  autoFocus,
  maxDate,
  minDate
}) {
  const { errors } = useMovieContext();
  const { handleChange } = useFunctionContext();

  return (
    <>
      <input
        className="form-control"
        type={type}
        name={name}
        value={value}
        min={min}
        max={max}
        minDate={minDate}
        maxDate={maxDate}
        autoFocus={autoFocus}


        onChange={(e) => handleChange(e, schema, SetForm)}
      />
      <p className="error mt-2"> {errors[name]}</p>
    </>
  );
}

export function Number_Input({
  type,
  name,
  value,
  SetForm,
  schema,
  maxLength,
  inputMode,
  autoFocus,
  placeholder,

}) {
  const { errors } = useMovieContext();
  const { handleChange } = useFunctionContext();

  const handleNumberChange = (e) => {
    // Remove non-numeric characters from the input value
    const newValue = e.target.value.replace(/\D/g, "");

    // Call the handleChange function with the sanitized value
    handleChange({ target: { name, value: newValue } }, schema, SetForm);
  };

  return (
    <>
      <input
        className="form-control input-shado "
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        inputMode={inputMode}
        onChange={handleNumberChange}
        autoFocus={autoFocus}

      />
      <div>
        <p className="error mt-2">{errors[name]}</p>
      </div>
    </>
  );
}
export function Amount_Input({
  type,
  name,
  value,
  SetForm,
  schema,
  maxLength,
  inputMode,
  autoFocus,
  placeholder,

}) {
  const { errors } = useMovieContext();
  const { handleChange } = useFunctionContext();

  const handleNumberChange = (e) => {
    // Remove non-numeric characters from the input value
    // const newValue = e.target.value.replace(/^[1-9.] );
    const newValue = e.target.value.replace(/[^0-9.]/g, '');

    // Call the handleChange function with the sanitized value
    handleChange({ target: { name, value: newValue } }, schema, SetForm);
  };

  return (
    <>
      <input
        className="form-control input-shado "
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        inputMode={inputMode}
        onChange={handleNumberChange}
        autoFocus={autoFocus}

      />
      <div>
        <p className="error mt-2">{errors[name]}</p>
      </div>
    </>
  );
}
export function SearchInput({
  type,
  name,
  value,
  SetForm,
  schema,
  autoFocus,
  placeholder,
  maxLength
}) {
  const { errors } = useMovieContext();
  const { handleChange } = useFunctionContext();

  // const handleInputChange = (e) => {
  //   const { value } = e.target;

  //     handleChange(e, schema, SetForm);
  // };
  const handleInputChange = (e) => {
    const { value } = e.target;
    const isValid = /^[A-Za-z0-9]*$/.test(value);
    if (isValid) {

      handleChange(e, schema, SetForm);
    }
  };
  const showError = errors[name] && errors[name].length < 12;

  return (
    <>
      <input
        className="form-control input-shado"
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        autoFocus={autoFocus}
        maxLength={maxLength}
      />
      <div>
        <p className="error">{errors[name]}</p>
      </div>
    </>
  );
}


export function File_Input({
  type,
  name,
  placeholder,
  value,
  formData,
  newSetForm,
  schema,
  deleting,
  property,
  autoFocus
}) {
  const { errors } = useMovieContext();
  const { handleChange } = useFunctionContext();
  return (
    <>
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleChange(e, schema, newSetForm)}
        autoFocus={autoFocus}
      />
      <p className="error mt-2"> {errors[name]}</p>
      <span className="delete_image" onClick={() => deleting(property)}>
        <i className="ri-delete-bin-5-line"></i>
      </span>
      <div className="position-relative">
        <img src={formData?.photo} className="document_image mt-1 rounded-2" />
      </div>
    </>
  );
}


export function Radio_input({
  name,
  options,
  value,
  SetForm,
  schema
}) {
  const { errors } = useMovieContext();
  const { handleChange } = useFunctionContext();

  const handleRadioChange = (e) => {
    const { value } = e.target;
    handleChange(e, schema, SetForm);
  };

  return (
    <>
      {options.map((option, index) => (
        <div key={index} className="form-check">
          <input
            className="form-check-input"
            type="radio"
            id={`${name}_${option.value}`}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={handleRadioChange}
          />
          <label className="form-check-label" htmlFor={`${name}_${option.value}`}>
            {option.label}
          </label>
        </div>
      ))}
      <p className="error mt-2"> {errors[name]}</p>
    </>
  );
}