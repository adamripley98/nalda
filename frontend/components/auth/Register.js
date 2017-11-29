// Import frameworkds
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {connect} from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

// Import components
import Thin from '../shared/Thin';
import GrayWrapper from '../shared/GrayWrapper';
import {saveRegisterUsername, saveRegisterPassword, saveRegisterVerPassword, register} from '../../actions/index.js';


/**
* Component to render the user registration form
*/
const handleRegisterSubmit = (username, password, verPassword, onRegister) => {
    // TODO: use bootstrap to make alert look better
    if (verPassword !== password) {
        alert('passwords must match!');
    } else {
        axios.post('/register', {
            username,
            password,
            verPassword,
        })
        .then((resp) => {
            console.log('register success! ', resp);
            onRegister();
        })
        .catch((err) =>{
            console.log("registration error: ", err);
        });
    }
};

let Register = ({username, password, verPassword, updateUsername, updatePassword, updateVerPassword, onRegister}) => {
    return (
      <GrayWrapper>
        <Thin>
          <form className="thin-form" method="POST" onSubmit={ (e) => {
              e.preventDefault();
              handleRegisterSubmit(username, password, verPassword, onRegister);
          }}>
            <h2 className="marg-bot-1 bold">
              Register
            </h2>
            <label>
              Email
            </label>
            <input
              type="email"
              className="form-control marg-bot-1"
              value={username}
              onChange={ (e) => updateUsername(e.target.value) }
              required="true"
            />
            <label>
              Password
            </label>
            <input
              type="password"
              className="form-control marg-bot-1"
              value={password}
              onChange={ (e) => updatePassword(e.target.value) }
              required="true"
            />
            <label>
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control marg-bot-1"
              value={verPassword}
              onChange={ (e) => updateVerPassword(e.target.value) }
              required="true"
            />
            <input
              type="submit"
              className={
                verPassword && password && username ?
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
};

Register.propTypes = {
    username: PropTypes.string,
    password: PropTypes.string,
    verPassword: PropTypes.string,
    updateUsername: PropTypes.func,
    updatePassword: PropTypes.func,
    updateVerPassword: PropTypes.func,
    onRegister: PropTypes.func
};

const mapStateToProps = state => {
    return {
        username: state.registerState.username,
        password: state.registerState.password,
        verPassword: state.registerState.verPassword,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateUsername: (username) => dispatch(saveRegisterUsername(username)),
        updatePassword: (password) => dispatch(saveRegisterPassword(password)),
        updateVerPassword: (password) => dispatch(saveRegisterVerPassword(password)),
        onRegister: () => dispatch(register()),
    };
};

Register = connect(
    mapStateToProps,
    mapDispatchToProps
)(Register);

export default Register;
