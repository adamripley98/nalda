// Import framworks
import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect} from 'react-router-dom';

// Import components
import Thin from '../shared/Thin';
import GrayWrapper from '../shared/GrayWrapper';

/**
 * Component to render the user login form
 */
class Login extends Component {
    // Constructor method
    constructor(props) {
        super(props);
        this.state = {
            redirectToHome: false,
            username: '',
            password: '',
        };
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
              if (resp.data) {
                  console.log('should redirect to home');
                  this.setState({
                      redirectToHome: true,
                  });
              } else {
                  console.log('shouldnt redirect');
              }
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
        if (this.state.redirectToHome) {
            return (
               <Redirect to="/home"/>
            );
        }
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

export default Login;
