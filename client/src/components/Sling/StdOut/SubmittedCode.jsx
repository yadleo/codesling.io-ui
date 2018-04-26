import React from 'react';

const SubmittedCode = ({ text, pass, player }) => {
  if (pass){
    return (<div>
      <h1>Player {player} Won!</h1>
    </div>)
  } else {
    return (
      <div>
        <h6>The Tests did not pass.</h6>
        Expected
        <br />
        {text.expected}
        <br />
        <br />
        Got
        <br />
        {text.got}
      </div>
    );
  }
};

export default SubmittedCode;
