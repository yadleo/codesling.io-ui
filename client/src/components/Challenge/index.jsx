import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';

import AddChallenge from './AddChallenge/index.jsx';
import Button from '../globals/Button/';
import Logo from '../globals/Logo';
import './Challenge.css';

class Challenge extends Component {
  state = {
    challenges: [],
    allChallenges: [],
    myChallenges: []
  }
  
  componentDidMount() {
    this.fetchAllChallenges();
  }

  fetchAllChallenges = async () => {
    const id = localStorage.getItem('id');
    
    const { data } = await axios.get(`http://localhost:3396/api/challenges`);
    const myChallenges = await axios.get(`http://localhost:3396/api/usersChallenges/${id}`);
    
    this.setState({ 
      challenges: myChallenges.data,
      allChallenges: data,
      myChallenges: myChallenges.data
    });
  }

  handleAddChallengeClick() {
    this.props.history.push('/addChallenge');
  }

  handleToggleChallenges(e, value) {
    this.setState({
      challenges: this.state[value]
    })
  }

  render() {
    return (
      <div>
        <div className="landing-page-container"><Logo className="landing-page-logo"/></div>
        <table align="center">
          <tbody>
            <tr>
              <th>
                <Button
                  backgroundColor='red'
                  color='white'
                  text='My Challenges'
                  id='myChallenges'
                  onClick={(e) => this.handleToggleChallenges(e, 'myChallenges')}
                  />
              </th>
              <th>
                <Button
                  backgroundColor='red'
                  color='white'
                  text='All Challenges'
                  onClick={(e) => this.handleToggleChallenges(e, 'allChallenges')}
                  />
              </th>
            </tr>
          </tbody>
        </table>
        <br/>
        {this.state.challenges.map( (challenge, key) => {
          return (
            <div key={key}>
              <li>Title: {challenge.title}</li>
              <li>content: {challenge.content} </li>
              <li>difficulty: {challenge.difficulty} </li>
            </div>
          )
        })}
        <br/>
        <div style={{'textAlign':'center'}}>
          <Button
            backgroundColor='red'
            color='white'
            text='Add Challenges'
            onClick={() => this.handleAddChallengeClick()}
            />
        </div>
      </div>
    );
  }
}

export default Challenge;

{/* <Switch>
  <Route path='/addChallenge' component={AddChallenge} />
</ Switch>    */}