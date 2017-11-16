import React, { Component } from 'react';
import PropTypes from 'prop-types';


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
    }

    handleSubmit(event) {
        console.log('submitted my dood.');
        console.log('what is event', event);
        event.preventDefault();
    }

    handleChangeEmail(event) {
        console.log('what is email', event.target.value);
        this.setState({
            email: event.target.value
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
          <div className="fade-in white pad-2 shade-1 round-1">
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <h2 className="marg-bot-1">Login</h2>
          <label>Email</label>
          <input
            type="email"
            className="form-control marg-bot-1"
            value={this.state.email}
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
          <input
            type="submit"
            className={
              this.state.password.length && this.state.email.length ?
                "btn white shade-3 hover cursor white-text purple bold" :
                "disabled btn white shade-3 hover cursor white-text purple bold"
            }
            value="Login"
          />

          <p className="blue-gray-text marg-top-2 marg-bot-0">
            Don't have an account?{" "}
            <a href="./register" className="purple-text">
              Register here.
            </a>
          </p>
        </form>
      </div>
        );
    }
}

// Login.propTypes = {
//     name: PropTypes.string,
// };


export default Login;
