import React from 'react';

export const Error = ({ message }) => {
  return (
    <div className="error-message">
      <h2>{message}</h2>
    </div>
  );
}

export default Error;
