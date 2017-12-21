// Import frameworkds
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {connect} from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

// Import components
import Thin from '../shared/Thin';
import {register} from '../../actions/index.js';

class Register extends Component {
    // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      verPassword: '',
      error: '',
      redirectToHome: false,
    };
    // Bindings so 'this' refers to component
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangeVerifyPassword = this.handleChangeVerifyPassword.bind(this);
  }

  // Handle when the register form is submitted
  handleRegisterSubmit(event) {
    const username = this.state.username;
    const password = this.state.password;
    const verPassword = this.state.verPassword;
    const onRegister = this.props.onRegister;
    event.preventDefault();
    // Post to register, will check on backend in mongo for issues
    axios.post('/register', {
      username,
      password,
      verPassword,
    })
      .then((resp) => {
        console.log('register respisne', resp.data);
        // If issue with register, error message will display
        if (!resp.data._id) {
          this.setState({
            error: resp.data,
          });
        } else {
          // If successful, redirect to home page and dispatch a register event
          this.setState({
            redirectToHome: true,
          });
          onRegister(resp.data._id);
        }
      })
      .catch((err) => {
        console.log('there was an error', err);
      });
  }

  // Handle when a user types into the email
  handleChangeEmail(event) {
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
      verPassword: event.target.value
    });
  }

  // Function to render the actual component
  render() {
    return (
      <Thin>
        { this.state.redirectToHome && <Redirect to="/"/> }
        <form className="thin-form" method="POST" onSubmit={ (e) => this.handleRegisterSubmit(e) }>
          {
            this.state.error ? (
              <div className="alert alert-danger">
                <p className="bold marg-bot-05">
                  An error occured:
                </p>
                <p className="marg-bot-0">
                  { this.state.error }
                </p>
              </div>
            ) : (
              ""
            )
          }
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
            value={this.state.verPassword}
            onChange={ this.handleChangeVerifyPassword }
            required="true"
          />
          <input
            type="submit"
            className={
              this.state.verPassword.length && this.state.password.length && this.state.username.length ? (
                "btn btn-primary full-width"
              ) : (
                "btn btn-primary full-width disabled"
              )
            }
            value="Register"
          />
          <p className="blue-gray-text marg-top-1 marg-bot-0">
            Already have an account?&nbsp; <Link to="/login">Login here.</Link>
          </p>
        </form>
      </Thin>
    );
  }
}

Register.propTypes = {
  onRegister: PropTypes.func
};

// Currently no props, possibly will add userId if needed
const mapStateToProps = state => {
  return {
    userId: state.authState.userId,
  };
};

// When we call onRegister now, it will dispatch register event
const mapDispatchToProps = dispatch => {
  return {
    onRegister: (userId) => dispatch(register(userId)),
  };
};

// Redux config
Register = connect(
    mapStateToProps,
    mapDispatchToProps
)(Register);

export default Register;
