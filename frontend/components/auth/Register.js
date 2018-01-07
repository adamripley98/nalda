// Import frameworkds
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {connect} from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

// Import components
import Thin from '../shared/Thin';
import ErrorMessage from '../shared/ErrorMessage';

// Import actions
import { register } from '../../actions/index.js';

/**
 * Component to render a form for registration
 * TODO add profile picture field to users
 * TODO google is not defined error?
 */
class Register extends Component {
  /**
   * Constructor method
   */
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      email: '',
      name: '',
      location: '',
      password: '',
      verPassword: '',
      error: '',
    };

    // Bindings so 'this' refers to component
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangeVerifyPassword = this.handleChangeVerifyPassword.bind(this);
  }

  /**
   * WHen the component mounts
   */
  componentDidMount() {
    // Autocomplete the user's city
    const location = document.getElementById("location");
    const options = {
      types: ['(cities)'],
      componentRestrictions: {country: 'us'},
    };
    new google.maps.places.Autocomplete(location, options);
  }

  /**
   * Handle when the register form is submitted
   * TODO profile picture
   */
  handleRegisterSubmit(event) {
    // Prevent the default submit action
    event.preventDefault();

    // Isolate form fields
    const name = this.state.name;
    const email = this.state.email;
    const location = document.getElementById('location').value;
    const password = this.state.password;
    const verPassword = this.state.verPassword;
    const onRegister = this.props.onRegister;

    if (!name) {
      this.setState({
        error: "Name must be populated.",
      });
    } else if (!email) {
      this.setState({
        error: "Email must be populated.",
      });
    } else if (!password) {
      this.setState({
        error: "Password must be populated.",
      });
    } else if (!verPassword) {
      this.setState({
        error: "Confirm password must be populated.",
      });
    } else if (password !== verPassword) {
      this.setState({
        error: "Password and confirm password must match.",
      });
    } else if (!location) {
      this.setState({
        error: "Location must be populated.",
      });
    } else {
      // Find the longitude and latitude of the location passed in
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': location }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          const latitude = results[0].geometry.location.lat();
          const longitude = results[0].geometry.location.lng();

          // Fields are all populated
          // Remove any existing error
          this.setState({
            error: "",
          });

          // Post to register, will check on backend in mongo for issues
          axios.post('/api/register', {
            name,
            username: email,
            location: {
              name: location,
              lat: latitude,
              lng: longitude,
            },
            password,
            verPassword,
          })
            .then((resp) => {
              // If issue with register, error message will display
              if (!resp.data.success) {
                this.setState({
                  error: resp.data.error,
                });
              } else {
                // If successful, redirect to home page
                this.setState({
                  redirectToHome: true,
                });

                // Dispatch a register event
                onRegister(
                  resp.data.user._id,
                  resp.data.user.userType,
                  name,
                  location
                );
              }
            })
            .catch(err => {
              this.setState({
                error: err,
              });
            });
        } else {
          this.setState({
            error: "Invalid location",
          });
        }
      });
    }
  }

  /**
   * Handle when a user types into the name
   */
  handleChangeName(event) {
    this.setState({
      name: event.target.value,
    });
  }

  /**
   * Handle when a user types into the email
   */
  handleChangeEmail(event) {
    this.setState({
      email: event.target.value,
    });
  }

  /**
   * Handle when a user types into the password
   */
  handleChangePassword(event) {
    this.setState({
      password: event.target.value
    });
  }

  /**
   * Handle when a user types into the confirm password
   */
  handleChangeVerifyPassword(event) {
    this.setState({
      verPassword: event.target.value
    });
  }

  /**
   * Function to render the actual component
   */
  render() {
    return (
      <div>
        {(this.props.userId) && <Redirect to="/"/>}
        <Thin>
          <form className="thin-form" method="POST" onSubmit={ (e) => this.handleRegisterSubmit(e) }>
            <h2 className="marg-bot-1 bold">
              Register
            </h2>
            <ErrorMessage error={ this.state.error } />
            <label>
              Name
            </label>
            <input
              type="text"
              className="form-control marg-bot-1"
              value={this.state.name}
              onChange={ this.handleChangeName }
              required="true"
            />
            <label>
              Email
            </label>
            <input
              type="text"
              className="form-control marg-bot-1"
              value={this.state.email}
              onChange={ this.handleChangeEmail }
              required="true"
            />
            <label>
              Location
            </label>
            <input
              type="text"
              id="location"
              className="form-control marg-bot-1"
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
                (
                  this.state.name &&
                  this.state.verPassword &&
                  this.state.password &&
                  this.state.email &&
                  document.getElementById('location').value &&
                  this.state.password === this.state.verPassword
                ) ? (
                  "btn btn-primary full-width"
                ) : (
                  "btn btn-primary full-width disabled"
                )
              }
              value="Register"
            />
            <p className="blue-gray-text marg-top-1 marg-bot-0">
              Already have an account?&nbsp; <Link to="/login">Login here.</Link>
            </p>
          </form>
        </Thin>
      </div>
    );
  }
}

Register.propTypes = {
  onRegister: PropTypes.func,
  userId: PropTypes.string,
};

// Currently no props, possibly will add userId if needed
const mapStateToProps = state => {
  return {
    userId: state.authState.userId,
  };
};

// When we call onRegister now, it will dispatch register event
const mapDispatchToProps = dispatch => {
  return {
    onRegister: (userId, userType, name, location) => dispatch(register(userId, userType, name, location)),
  };
};

// Redux config
Register = connect(
    mapStateToProps,
    mapDispatchToProps
)(Register);

export default Register;
