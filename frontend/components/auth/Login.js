import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Thin from '../shared/Thin';
import GrayWrapper from '../shared/GrayWrapper';

class Login extends Component {
  // Constructor methods
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      username: '',
      password: '',
    };

    // Bind this to helper methods
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  handleSubmit(event) {
    const username = this.state.username;
    const password = this.state.password;
    console.log('submitted my dood.', username, password);
    console.log('what is event', event);
    event.preventDefault();
    axios.post('/login', {
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

  render() {
    return (
      <GrayWrapper>
        <Thin>
          <form className="thin-form" method="POST" onSubmit={(e) => this.handleSubmit(e)}>
            <h2 className="marg-bot-1 bold">
              Login
            </h2>
            <label>
              Email
            </label>
            <input
              type="email"
              className="form-control marg-bot-1"
              value={this.state.username}
              onChange={(e) => this.handleChangeEmail(e)}
              required="true"
            />

            <label>
              Password
            </label>
            <input
              type="password"
              className="form-control marg-bot-1"
              value={this.state.password}
              onChange={(e) => this.handleChangePassword(e)}
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
              Don't have an account?{" "}
              <Link to="/register">Register here.</Link>
            </p>
          </form>
        </Thin>
      </GrayWrapper>
    );
  }
}

// Login.propTypes = {
//     name: PropTypes.string,
// };


export default Login;
