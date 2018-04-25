import React, { Component } from 'react';
import axios from 'axios';

import Input from '../globals/forms/Input';
import Button from '../globals/Button/';

import './Auth.css';

export default class Signup extends Component {
  constructor() {
    super();

    this.state = {
      email: '',
      password: '',
      username: '',
      errorMessage: undefined,
    }
  }

  submitAuthData = async (e) => {
    e.preventDefault();
    const { email, password, username } = this.state;
    const body = {
      email,
      password,
      username
    }
    this.setState({
      errorMessage: undefined,
    });
    try {
      const data = await axios.post(`http://localhost:3396/api/auth/signup`, body);
      data ? this.props.history.push('/login') : this.props.history.push('/auth');
    } catch (err) {
      if(body.username.length < 3 || body.password.length < 3){
        this.setState({
          errorMessage: 'Username or Password needs to be longer than 3 characters',
        });
      } else if (body.email.indexOf('@') === -1) {
        this.setState({
          errorMessage: 'Invalid Email',
        });
      } else {
        this.setState({
          errorMessage: 'Invalid Input',
        });
      }
      // throw new Error(err);

    }
  }

  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  }

  render() {
    return (
      <div className="login-form-container">
        <form className="auth-form">
          <Input
            name='email'
            type='email'
            placeholder={'enter email'}
            onChange={this.handleInputChange}
            />
          <Input 
            name='username'
            type='username'
            placeholder={'enter your username'}
            onChange={this.handleInputChange}
            />
          <Input 
            name='password'
            type='password'
            placeholder={'enter your password'}
            onChange={this.handleInputChange}
            />
          {this.state.errorMessage ? 
            (<div><h6>{this.state.errorMessage}</h6></div>)
            :
            (<div />)
          }
          <Button
            backgroundColor="red"
            color="white"
            text="Sign Up"
            onClick={(e) => this.submitAuthData(e)}
            />
        </form>
      </div>
    )
  }
}
