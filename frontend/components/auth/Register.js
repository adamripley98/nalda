// Import frameworkds
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {connect} from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

// Import components
import Thin from '../shared/Thin';
import GrayWrapper from '../shared/GrayWrapper';
import {register} from '../../actions/index.js';


/**
* Component to render the user registration form
*/
// const handleRegisterSubmit = (username, password, verPassword, onRegister) => {
//     // TODO: use bootstrap to make alert look better
//     if (verPassword !== password) {
//         alert('passwords must match!');
//     } else {
//         axios.post('/register', {
//             username,
//             password,
//             verPassword,
//         })
//         .then((resp) => {
//             console.log('register success! ', resp);
//             onRegister();
//         })
//         .catch((err) =>{
//             console.log("registration error: ", err);
//         });
//     }
// };
//
// let Register = ({username, password, verPassword, updateUsername, updatePassword, updateVerPassword, onRegister}) => {
//     return (
//       <GrayWrapper>
//         <Thin>
//           <form className="thin-form" method="POST" onSubmit={ (e) => {
//               e.preventDefault();
//               handleRegisterSubmit(username, password, verPassword, onRegister);
//           }}>
//             <h2 className="marg-bot-1 bold">
//               Register
//             </h2>
//             <label>
//               Email
//             </label>
//             <input
//               type="email"
//               className="form-control marg-bot-1"
//               value={username}
//               onChange={ (e) => updateUsername(e.target.value) }
//               required="true"
//             />
//             <label>
//               Password
//             </label>
//             <input
//               type="password"
//               className="form-control marg-bot-1"
//               value={password}
//               onChange={ (e) => updatePassword(e.target.value) }
//               required="true"
//             />
//             <label>
//               Confirm Password
//             </label>
//             <input
//               type="password"
//               className="form-control marg-bot-1"
//               value={verPassword}
//               onChange={ (e) => updateVerPassword(e.target.value) }
//               required="true"
//             />
//             <input
//               type="submit"
//               className={
//                 verPassword && password && username ?
//                   "btn btn-primary full-width" :
//                   "btn btn-primary full-width disabled"
//               }
//               value="Register"
//             />
//             <p className="blue-gray-text marg-top-1 marg-bot-0">
//               Already have an account?{" "}
//               <Link to="/login">Login here.</Link>
//             </p>
//           </form>
//         </Thin>
//       </GrayWrapper>
//     );
// };

class Register extends Component {
  // Constructor method
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            verPassword: '',
        };
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
        // TODO: use bootstrap to make alert look better
        // TODO: decide if authentication errors should be handled on frontend/backend/both
        // TODO: needs to alert if user already exists
        if (verPassword !== password) {
            alert('passwords must match!');
        } else {
            axios.post('/register', {
                username,
                password,
            })
              .then((resp) => {
                  console.log('what is data', resp.data);
                  onRegister();
              })
              .catch((err) => {
                  console.log('there was an error', err);
              });
        }
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
          <GrayWrapper>
            <Thin>
              <form className="thin-form" method="POST" onSubmit={ (e) => this.handleRegisterSubmit(e) }>
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
                    this.state.verPassword.length && this.state.password.length && this.state.username.length ?
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

Register.propTypes = {
    onRegister: PropTypes.func
};

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onRegister: () => dispatch(register()),
    };
};

Register = connect(
    mapStateToProps,
    mapDispatchToProps
)(Register);

export default Register;
