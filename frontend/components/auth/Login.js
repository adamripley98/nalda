import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link} from 'react-router-dom';


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
        const e = this.state.email;
        const p = this.state.password;
        console.log('submitted my dood.');
        console.log('what is event', event);
        event.preventDefault();
        axios.post('http://localhost:3000/login', {
            e,
            p,
        })
          .then((resp) => {
              console.log('what is data', resp.data);
          });
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
        <form method="POST" onSubmit={(e) => this.handleSubmit(e)}>
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
            <Link to={`/register`}>Register here.</Link>
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
