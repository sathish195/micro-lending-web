import React from 'react';

const Input = ({ name, type, id, placeholder, className, maxLength, pattern, autoFocus, value, onChange }) => {
    return (
        <input
            type={type}
            id={id}
            name={name}
            placeholder={placeholder}
            className={className}
            maxLength={maxLength}
            pattern={pattern}
            autoFocus={autoFocus}
            value={value}
            onChange={onChange}
        />
    );
};

export default Input;
