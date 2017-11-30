// Import framworks
import React, { Component } from 'react';
import axios from 'axios';
import { Link} from 'react-router-dom';
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
        };
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
    }

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
          .then((resp) => {
              console.log('what is resp', resp.data, resp.data._id);
              console.log('props before', this.props);
              onLogin(resp.data._id);
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

    render() {
        return (
          <GrayWrapper>
            <Thin>
              <form className="thin-form" method="POST" onSubmit={(e) => this.handleLoginSubmit(e)}>
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

const mapStateToProps = state => {
    return {
        userId: state.loginState.userId,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLogin: (userId) => dispatch(login(userId))
    };
};

Login = connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);

export default Login;
