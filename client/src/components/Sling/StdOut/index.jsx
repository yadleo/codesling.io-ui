import React from 'react';

// import Loading from '../../globals/Loading';

const StdOut = ({ text }) => {
  return (
    <div>
      Result
      <br />
      {text.result}
      <br />
      <br />
      Console
      <br />
      {text.console}
    </div>
  );
};

export default StdOut;
