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
        const username = this.state.email;
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
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-8 offset-md-2 col-lg-6 offset-xl-3 col-xl-4 offset-xl-4">

                <form method="POST" onSubmit={(e) => this.handleSubmit(e)}>
                  <h2 className="marg-bot-1">Login</h2>
                  <label>Email:</label>
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
                        "btn btn-primary" :
                        "btn btn-secondary"
                    }
                    value="Login"
                  />

                  <p className="blue-gray-text marg-top-2 marg-bot-0">
                    Don't have an account?{" "}
                    <Link to={`/register`}>Register here.</Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        );
    }
}

// Login.propTypes = {
//     name: PropTypes.string,
// };


export default Login;
