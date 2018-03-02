// Import framworks
import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Import actions
import {login} from '../../actions/index.js';

// Import components
import Thin from '../shared/Thin';
import Tags from '../shared/Tags';
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
      success: '',
    };

    // Bindings so 'this' refers to component
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handlePasswordReset = this.handlePasswordReset.bind(this);
  }

  /**
   * When the component mounts
   */
  componentDidMount() {
    window.scrollTo(0, 0);
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
              resp.data.user.location ? resp.data.user.location.name : null,
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

  /**
   * Handle when a user wants to reset password
   */
  handlePasswordReset() {
    axios.post('/api/forgot', {
      username: this.state.username,
    })
    .then((resp) => {
      if (resp.data.success) {
        this.setState({
          success: 'Please check your email for a link to reset your password.',
          error: '',
        });
      } else {
        this.setState({
          error: resp.data.error,
        });
      }
    })
    .catch((err) => {
      if (err) {
        this.setState({
          error: err.message,
        });
      }
    });
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
        <Tags title="Login" description="Login to Nalda" keywords="Nalda,Login,login,penn" />
        {(this.props.userId) && <Redirect to="/"/>}
        <div className="space-2" />
        <Thin>
          <div>
            <form className="big" method="POST" onSubmit={ this.handleLoginSubmit }>
              <h2 className="marg-bot-1 bold">
                Login to continue
              </h2>

              <ErrorMessage error={ this.state.error } />
              {
                this.state.success ? (
                  <div className="alert alert-success marg-bot-1">
                    { this.state.success }
                  </div>
                ) : null
              }
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

            {/* Render other options */}
            <div className="gray-text center text-segment">
              <div className="line-through" />
              <p>
                Or continue with
              </p>
              <div className="line-through" />
            </div>
            <div className="row">
              <div className="col-12 col-sm-6 marg-bot-1">
                <a
                  className="btn full-width btn-sm facebook"
                  href="/api/auth/facebook"
                >
                  <i className="fa fa-facebook" aria-hidden="true" /> &nbsp; Facebook
                </a>
              </div>
              <div className="col-12 col-sm-6 marg-bot-1">
                <a
                  className="btn full-width btn-sm google"
                  href="/api/auth/google"
                >
                  <i className="fa fa-google" aria-hidden="true" /> &nbsp; Google
                </a>
              </div>
              <p className="marg-bot-0 center gray-text">
                Forgot password? <a
                  className="link-style"
                  onClick={ () => this.handlePasswordReset() }
                >
                  Reset here.
                </a>
              </p>
            </div>
          </div>
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
