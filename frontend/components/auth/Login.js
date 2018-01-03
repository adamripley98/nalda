// Import framworks
import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
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
      redirectToHome: false,
      error: "",
    };
    // Bindings so 'this' refers to component
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  // When login button clicked, will attempt to login on backend (login.js)
  handleLoginSubmit(event) {
    // Prevent the default form action
    event.preventDefault();
    // Find the needed variables
    const onLogin = this.props.onLogin;
    // Frontend validations
    if (!this.state.username) {
      this.setState({
        error: "Username must be populated.",
      });
    } else if (!this.state.password) {
      this.setState({
        error: "Password must be populated",
      });
    } else {
      // Make the login request to axios
      // If successful, will send back userId. If redux state contains userId,
      // will redirect to home
      axios.post('/api/login', {
        username: this.state.username,
        password: this.state.password,
      })
        .then((resp) => {
          // If there was an issue with logging in, display error
          if (!resp.data.success) {
            this.setState({
              error: resp.data.error,
            });
          } else {
            // Dispatch login event for redux state
            onLogin(resp.data.user._id, resp.data.user.userType, resp.data.user.name);
            // Set state so that it redirects to home page
            this.setState({
              redirectToHome: true,
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
        {(this.props.userId || this.state.redirectToHome) && <Redirect to="/"/>}
        <Thin>
          <form className="thin-form" method="POST" onSubmit={ this.handleLoginSubmit }>
            <h2 className="marg-bot-1 bold">
              Login
            </h2>

            <ErrorMessage error={ this.state.error } />

            <label>
              Email
            </label>
            <input
              type="text"
              className="form-control marg-bot-1"
              value={ this.state.username }
              onChange={ this.handleChangeEmail }
            />

            <label>
              Password
            </label>
            <input
              type="password"
              className="form-control marg-bot-1"
              value={ this.state.password }
              onChange={ this.handleChangePassword }
            />
            <input
              type="submit"
              className={
                this.state.password && this.state.username ? (
                  "btn btn-primary full-width"
                ) : (
                  "btn btn-primary disabled full-width"
                )
              }
              value="Login"
            />

            <p className="marg-top-1 marg-bot-0">
              Don't have an account? <Link to="/register">Register here.</Link>
            </p>
          </form>
        </Thin>
      </div>
    );
  }
}

Login.propTypes = {
  userId: PropTypes.string,
  userType: PropTypes.string,
  name: PropTypes.string,
  onLogin: PropTypes.func,
};

// Allows us to access redux state as this.props.userId inside component
const mapStateToProps = state => {
  return {
    userId: state.authState.userId,
    userType: state.authState.userType,
    name: state.authState.name,
  };
};

// Allows us to dispatch a login event by calling this.props.onLogin
const mapDispatchToProps = dispatch => {
  return {
    onLogin: (userId, userType, name) => dispatch(login(userId, userType, name))
  };
};

// Redux config
Login = connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);

export default Login;
