// Import framworks
import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

// Import components
import Thin from '../shared/Thin';
import GrayWrapper from '../shared/GrayWrapper';
import {login} from '../../actions/index.js';

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
    const username = this.state.username;
    const password = this.state.password;
    const onLogin = this.props.onLogin;
    console.log('submitted my dood.', username, password);
    console.log('what is event', event);
    event.preventDefault();
    axios.post('/login', {
      username,
      password,
    })
        // If successful, will send back userId. If redux state contains userId, will redirect to home
        .then((resp) => {
          console.log('what is resp', resp.data, resp.data._id);
          console.log('props before', this.props);
          if (!resp.data._id) {
            this.setState({
              error: resp.data,
            });
          } else {
            onLogin(resp.data._id);
            this.setState({
              redirectToHome: true,
            });
          }
          console.log('props after', this.props);
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
    this.setState({
      password: event.target.value
    });
  }

    // Renders actual Login component
  render() {
    // If user is logged in or if user successfully logs in, redirects to home
    return (
      <GrayWrapper>
        {(this.props.userId || this.state.redirectToHome) && <Redirect to="/"/>}
        <Thin>
          <form className="thin-form" method="POST" onSubmit={(e) => this.handleLoginSubmit(e)}>
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
              Login
            </h2>
            <label>
              Email
            </label>
            <input
              type="email"
              className="form-control marg-bot-1"
              value={ this.state.username }
              onChange={ this.handleChangeEmail }
              required="true"
            />

            <label>
              Password
            </label>
            <input
              type="password"
              className="form-control marg-bot-1"
              value={ this.state.password }
              onChange={ this.handleChangePassword }
              required="true"
            />
            <input
              type="submit"
              // Ensures not empty
              className={
                this.state.password && this.state.username ?
                  "btn btn-primary full-width" :
                  "btn btn-primary disabled full-width"
              }
              value="Login"
            />

            <p className="marg-top-1 marg-bot-0">
              Don't have an account? <Link to="/register">Register here.</Link>
            </p>
          </form>
        </Thin>
      </GrayWrapper>
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
    onLogin: (userId) => dispatch(login(userId))
  };
};

// Redux config
Login = connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);

export default Login;
