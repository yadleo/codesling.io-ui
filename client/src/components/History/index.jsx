import React, { Component } from 'react';
import axios from 'axios';

import { HistoryList } from './HistoryList.jsx';
import Logo from '../globals/Logo/';
class History extends Component {
  state = { 
    history: []
  }

  async componentDidMount() {
    const id = localStorage.getItem('id');
    const { data } = await axios.get(`http://localhost:3396/api/history/fetchAllHistory/${id}`);
    this.setState({ history: data });
  }
  
  render() {
    return (
      <div>
        <Logo className='landing-page-logo'/>
        <h1 align='center'>History for {localStorage.getItem('username')}</h1>
        <table align='center' width='40%'>
          <tbody>
            <tr>
              <th>Challenger</th>
              <th>Clout</th>
              <th>Win/Loss</th>
            </tr>
            <HistoryList history={this.state.history}/>
          </tbody>
        </table>
      </div>
    );
  }
}

export default History;
