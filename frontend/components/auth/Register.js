import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';


class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            verifyPassword: '',
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangeVerifyPassword = this.handleChangeVerifyPassword.bind(this);
    }

    handleSubmit(event) {
        const username = this.state.username;
        const password = this.state.password;
        const verifyPassword = this.state.verifyPassword;
        console.log('submitted my dood.', username, password);
        console.log('what is event', event);
        event.preventDefault();
        // TODO: use bootstrap to make alert look better
        if (verifyPassword !== password) {
            alert('passwords must match!');
        } else {
            axios.post('/register', {
                username,
                password,
            })
              .then((resp) => {
                  console.log('what is data', resp.data);
              })
              .catch((err) => {
                  console.log('there was an error', err);
              });
        }
    }

    handleChangeEmail(event) {
        console.log('what is email', event.target.value);
        this.setState({
            username: event.target.value
        });
    }

    handleChangePassword(event) {
        console.log('what is password', event.target.value);
        this.setState({
            password: event.target.value
        });
    }

    handleChangeVerifyPassword(event) {
        this.setState({
            verifyPassword: event.target.value
        });
    }

    render() {
        return (
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-8 offset-md-2 col-lg-6 offset-xl-3 col-xl-4 offset-xl-4">

                <form method="POST" onSubmit={(e) => this.handleSubmit(e)}>
                  <h2 className="marg-bot-1">Register</h2>
                  <label>Email:</label>
                  <input
                    type="email"
                    className="form-control marg-bot-1"
                    value={this.state.username}
                    onChange={(e) => this.handleChangeEmail(e)}
                    required="true"
                  />

                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control marg-bot-1"
                    value={this.state.password}
                    onChange={(e) => this.handleChangePassword(e)}
                    required="true"
                  />
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    className="form-control marg-bot-1"
                    value={this.state.verifyPassword}
                    onChange={(e) => this.handleChangeVerifyPassword(e)}
                    required="true"
                  />
                  <input
                    type="submit"
                    className={
                      this.state.verifyPassword.length && this.state.password.length && this.state.username.length ?
                        "btn btn-primary" :
                        "btn btn-secondary"
                    }
                    value="Register"
                  />
                  <p className="blue-gray-text marg-top-2 marg-bot-0">
                    Already have an account?{" "}
                    <Link to={`/login`}>Login here.</Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        );
    }
}

export default Register;
