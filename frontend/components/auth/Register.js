// Import frameworkds
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';

// Import components
import Thin from '../shared/Thin';
import GrayWrapper from '../shared/GrayWrapper';

/**
 * Component to render the user registration form
 */
class Register extends Component {
  // Constructor method
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            verifyPassword: '',
            redirectToLogin: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangeVerifyPassword = this.handleChangeVerifyPassword.bind(this);
    }

    // Handle when the register form is submitted, posts to register.js
    handleSubmit(event) {
        const username = this.state.username;
        const password = this.state.password;
        const verifyPassword = this.state.verifyPassword;
        console.log('submitted my dood.', username, password);
        console.log('what is event', event);
        event.preventDefault();
        // TODO: use bootstrap to make alert look better
        // makes sure passwords match
        if (verifyPassword !== password) {
            alert('passwords must match!');
        } else {
            axios.post('/register', {
                username,
                password,
            })
              .then((resp) => {
                  console.log('what is data', resp.data);
                  if (resp.data) {
                      this.setState({
                          redirectToLogin: true
                      });
                  }
              })
              .catch((err) => {
                  console.log('there was an error', err);
              });
        }
    }

    // Handle when a user types into the email
    handleChangeEmail(event) {
        console.log('what is email', event.target.value);
        this.setState({
            username: event.target.value
        });
    }

    // Handle when a user types into the password
    handleChangePassword(event) {
        console.log('what is password', event.target.value);
        this.setState({
            password: event.target.value
        });
    }

    // Handle when a user types into the confirm password
    handleChangeVerifyPassword(event) {
        this.setState({
            verifyPassword: event.target.value
        });
    }

  // Function to render the actual component
    render() {
        // redirects if a register is successful
        if (this.state.redirectToLogin) {
            return (
               <Redirect to="/login"/>
            );
        }
        return (
          <GrayWrapper>
            <Thin>
              <form className="thin-form" method="POST" onSubmit={ this.handleSubmit }>
                <h2 className="marg-bot-1 bold">
                  Register
                </h2>
                <label>
                  Email
                </label>
                <input
                  type="email"
                  className="form-control marg-bot-1"
                  value={this.state.username}
                  onChange={ this.handleChangeEmail }
                  required="true"
                />
                <label>
                  Password
                </label>
                <input
                  type="password"
                  className="form-control marg-bot-1"
                  value={this.state.password}
                  onChange={ this.handleChangePassword }
                  required="true"
                />
                <label>
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control marg-bot-1"
                  value={this.state.verifyPassword}
                  onChange={ this.handleChangeVerifyPassword }
                  required="true"
                />
                <input
                  type="submit"
                  className={
                    this.state.verifyPassword.length && this.state.password.length && this.state.username.length ?
                      "btn btn-primary full-width" :
                      "btn btn-primary full-width disabled"
                  }
                  value="Register"
                />
                <p className="blue-gray-text marg-top-1 marg-bot-0">
                  Already have an account?{" "}
                  <Link to="/login">Login here.</Link>
                </p>
              </form>
            </Thin>
          </GrayWrapper>
        );
    }
}

export default Register;
