import React from 'react';

export const HistoryList = ({ history, challengerNames }) => {
  let outcome;
  
  return (
    history.map((hist, key) => {
      outcome = hist.outcome === 0 ? 'Loss' : 'Win';
      console.dir(hist)
      return (
        <tr key={key}>
          <td align='center'>{hist.challenger_name}</td>
          <td align='center'>{hist.clout}</td>
          <td align='center'>{outcome}</td>
        </tr>
      )}
    )
  )
};
