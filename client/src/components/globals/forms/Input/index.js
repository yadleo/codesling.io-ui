import React from 'react';

import './Input.css';

const Input = ({
  type,
  name,
  onChange,
  placeholder,
  value,
}) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};

export default Input;
