// Import framworks
import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

// Import components
import Thin from '../shared/Thin';
import GrayWrapper from '../shared/GrayWrapper';
import {saveLoginUsername, saveLoginPassword, login} from '../../actions/index.js';

const handleLoginSubmit = (username, password, onLogin) => {
    axios.post('/login', {
        username,
        password,
    })
    .then((resp) => {
        onLogin(resp.data.userId);
    });
};

let Login = ({username, updateUsername, password, updatePassword, onLogin}) => {
    return (
      <GrayWrapper>
        <Thin>
          <form className="thin-form" method="POST" onSubmit={(e) => {
              e.preventDefault();
              handleLoginSubmit(username, password, onLogin);
          }}>
            <h2 className="marg-bot-1 bold">
              Login
            </h2>
            <label>
              Email
            </label>
            <input
              type="email"
              className="form-control marg-bot-1"
              value={ username }
              onChange={ (e) => updateUsername(e.target.value) }
              required="true"
            />
            <label>
              Password
            </label>
            <input
              type="password"
              className="form-control marg-bot-1"
              value={ password }
              onChange={ (e) => updatePassword(e.target.value) }
              required="true"
            />
            <input
              type="submit"
              className={
                password && username ?
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
};

Login.propTypes = {
    username: PropTypes.string,
    password: PropTypes.string,
    updateUsername: PropTypes.func,
    updatePassword: PropTypes.func,
    onLogin: PropTypes.func,
};

const mapStateToProps = state => {
    return {
        username: state.loginState.loginUsername,
        password: state.loginState.loginPassword,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateUsername: (username) => dispatch(saveLoginUsername(username)),
        updatePassword: (password) => dispatch(saveLoginPassword(password)),
        onLogin: (userId) => dispatch(login(userId))
    };
};

Login = connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);

export default Login;
