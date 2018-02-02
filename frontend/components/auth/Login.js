// Import framworks
import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Import actions
import {login} from '../../actions/index.js';

// Import components
import Thin from '../shared/Thin';
import ErrorMessage from '../shared/ErrorMessage';

/**
 * Component to render the form for a user logging in
 */
class Login extends Component {
    // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: '',
      pending: false,
    };

    // Bindings so 'this' refers to component
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  // When login button clicked, will attempt to login on backend (login.js)
  handleLoginSubmit(event) {
    // Denote that the login is pending
    this.setState({
      pending: true,
    });

    // Binding this for inside axios request
    const username = this.state.username;
    const password = this.state.password;

    // Prevent the default form action
    event.preventDefault();
    // Find the needed variables
    const onLogin = this.props.onLogin;
    // Frontend validations
    if (!this.state.username) {
      this.setState({
        error: "Username must be populated.",
        pending: false,
      });
    } else if (!this.state.password) {
      this.setState({
        error: "Password must be populated",
        pending: false,
      });
    } else {
      // Make the login request to axios
      // If successful, will send back userId. If redux state contains userId,
      // will redirect to home
      axios.post('/api/login', {
        username,
        password,
      })
        .then((resp) => {
          // If there was an issue with logging in, display error
          if (!resp.data.success) {
            this.setState({
              error: resp.data.error,
              pending: false,
            });
          } else {
            // Dispatch login event for redux state
            onLogin(
              resp.data.user._id,
              resp.data.user.userType,
              resp.data.user.name,
              resp.data.user.location.name,
              resp.data.user.profilePicture,
            );
          }
        })
        .catch(err => {
          this.setState({
            error: err,
            pending: false,
          });
        });
    }
  }

    // Handle when a user types into the email
  handleChangeEmail(event) {
    this.setState({
      username: event.target.value,
    });
  }

  // Handle when a user types into the password
  handleChangePassword(event) {
    this.setState({
      password: event.target.value,
    });
  }

  // Renders actual Login component
  render() {
    // If user is logged in or if user successfully logs in, redirects to home
    return (
      <div>
        {(this.props.userId) && <Redirect to="/"/>}
        <div className="space-2" />
        <Thin>
          <form className="big" method="POST" onSubmit={ this.handleLoginSubmit }>
            <h2 className="marg-bot-1 bold">
              Login to continue
            </h2>

            <ErrorMessage error={ this.state.error } />

            <input
              placeholder="Email"
              type="text"
              className="form-control marg-bot-1 border"
              value={ this.state.username }
              onChange={ this.handleChangeEmail }
            />

            <input
              placeholder="Password"
              type="password"
              className="form-control marg-bot-1 border"
              value={ this.state.password }
              onChange={ this.handleChangePassword }
            />
            <input
              type="submit"
              className={
                !this.state.pending && this.state.password && this.state.username ? (
                  "btn btn-primary full-width border"
                ) : (
                  "btn btn-primary disabled full-width border"
                )
              }
              value={ this.state.pending ? "Logging in..." : "Login" }
            />
          </form>
          Already have an account? <Link to="/register">Register here.</Link>
        </Thin>
      </div>
    );
  }
}

Login.propTypes = {
  userId: PropTypes.string,
  onLogin: PropTypes.func,
};

// Allows us to access redux state as this.props.userId inside component
const mapStateToProps = state => {
  return {
    userId: state.authState.userId,
  };
};

// Allows us to dispatch a login event by calling this.props.onLogin
const mapDispatchToProps = dispatch => {
  return {
    onLogin: (userId, userType, name, location, profilePicture) => dispatch(login(userId, userType, name, location, profilePicture))
  };
};

// Redux config
Login = connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);

export default Login;
