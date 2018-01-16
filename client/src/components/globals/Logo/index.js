import React from 'react';

import codeslingLogo from './codesling-logo.svg';

const Logo = ({
  className
}) => {
  return (
    <img 
      alt="Codesling.io Logo"
      className={`logo ${className ? className : ''}`}
      src={codeslingLogo}
    />
  );
};

export default Logo;
