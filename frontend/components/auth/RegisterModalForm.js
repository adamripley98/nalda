/* global google, $ */
// Import frameworks
import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Import actions
import { register } from '../../actions/index.js';
import { notifyMessage } from '../../actions/notification';

// Import components
import ErrorMessage from '../shared/ErrorMessage';

/**
 * Render the register form for the modal
 */
class RegisterModalForm extends Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      verPassword: '',
      error: '',
      pending: false,
    };

    // Bindings so 'this' refers to component
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
    this.handleChangeFirstName = this.handleChangeFirstName.bind(this);
    this.handleChangeLastName = this.handleChangeLastName.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangeVerifyPassword = this.handleChangeVerifyPassword.bind(this);
  }

  /**
   * When the component mounts
   */
  componentDidMount() {
    // Autocomplete the user's city
    const location = document.getElementById("location");
    const options = {
      types: ['(cities)'],
      componentRestrictions: {country: 'us'},
    };
    const place = new google.maps.places.Autocomplete(location, options);
  }

  /**
   * Handle when the register form is submitted
   */
  handleRegisterSubmit(event) {
    // Prevent the default submit action
    event.preventDefault();

    // Denote that the registration request is pending
    this.setState({
      pending: true,
    });

    // Isolate form fields
    const name = this.state.firstName + " " + this.state.lastName;
    const email = this.state.email;
    const location = document.getElementById('location').value;
    const password = this.state.password;
    const verPassword = this.state.verPassword;
    const onRegister = this.props.onRegister;

    // Error checking
    if (!name) {
      this.setState({
        error: "Name must be populated.",
        pending: false,
      });
    } else if (!name.indexOf(" ")) {
      this.setState({
        error: "Please enter full name.",
        pending: false,
      });
    } else if (!email) {
      this.setState({
        error: "Email must be populated.",
        pending: false,
      });
    } else if (!password) {
      this.setState({
        error: "Password must be populated.",
        pending: false,
      });
    } else if (!verPassword) {
      this.setState({
        error: "Confirm password must be populated.",
        pending: false,
      });
    } else if (password !== verPassword) {
      this.setState({
        error: "Password and confirm password must match.",
        pending: false,
      });
    } else if (Object.keys(location).length === 0) {
      this.setState({
        error: "Location must be populated.",
        pending: false,
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
                  pending: false,
                });
              } else {
                // Collapse the modal
                $('#loginModal').modal('toggle');

                // Denote success to the user
                this.props.notifyMessage("Successfully created account.");

                // Dispatch a register event
                onRegister(
                  resp.data.user._id,
                  resp.data.user.userType,
                  name,
                  location,
                  resp.data.user.profilePicture,
                );
              }
            })
            .catch(err => {
              this.setState({
                error: err,
                pending: false,
              });
            });
        } else {
          this.setState({
            error: "Invalid location",
            pending: false,
          });
        }
      });
    }
  }

  /**
   * Handle when a user types into the first name
   */
  handleChangeFirstName(event) {
    this.setState({
      firstName: event.target.value,
    });
  }

  /**
   * Handle when a user types into the last name
   */
  handleChangeLastName(event) {
    this.setState({
      lastName: event.target.value,
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

  // Renders actual Login component
  render() {
    return (
      <form
        method="POST"
        onSubmit={ this.handleRegisterSubmit }
      >
        <div className="modal-body left">
          <ErrorMessage error={ this.state.error } />

          <input
            type="text"
            id="emailInput"
            className="form-control marg-bot-1"
            value={ this.state.email }
            onChange={ this.handleChangeEmail }
            placeholder="Email"
          />
          <i className="fa fa-envelope fa-fw in-input" aria-hidden />

          <div className="row">
            <div className="col-6">
              <input
                type="text"
                className="form-control marg-bot-1"
                value={ this.state.firstName }
                onChange={ this.handleChangeFirstName }
                placeholder="First name"
              />
            </div>
            <div className="col-6">
              <input
                type="text"
                className="form-control marg-bot-1"
                value={ this.state.lastName }
                onChange={ this.handleChangeLastName }
                placeholder="Last name"
              />
            </div>
          </div>

          <input
            type="text"
            id="location"
            className="form-control marg-bot-1"
            required="true"
          />
          <i className="fa fa-location-arrow fa-fw in-input" aria-hidden />

          <input
            type="password"
            className="form-control marg-bot-1"
            value={ this.state.password }
            onChange={ this.handleChangePassword }
            placeholder="Password"
          />
          <i className="fa fa-unlock-alt fa-fw in-input" aria-hidden />

          <input
            type="password"
            placeholder="Confirm password"
            className="form-control marg-bot-1"
            value={this.state.verPassword}
            onChange={ this.handleChangeVerifyPassword }
          />
          <i className="fa fa-unlock-alt fa-fw in-input" aria-hidden />

          <input
            type="submit"
            className={
              (
                !this.state.pending &&
                this.state.firstName &&
                this.state.lastName &&
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
            value={ this.state.pending ? "Registering..." : "Register" }
          />

          {/* Render other options */}
          <div className="gray-text center text-segment">
            <div className="line-through" />
            <p>
              Or continue with
            </p>
            <div className="line-through" />
          </div>
          <div className="row">
            <div className="col-12 col-sm-6 marg-bot-1">
              <a
                className="btn full-width btn-sm facebook"
                href="/api/auth/facebook"
              >
                <i className="fa fa-facebook" aria-hidden="true" /> &nbsp; Facebook
              </a>
            </div>
            <div className="col-12 col-sm-6 marg-bot-1">
              <a
                className="btn full-width btn-sm google"
                href="/api/auth/google"
              >
                <i className="fa fa-google" aria-hidden="true" /> &nbsp; Google
              </a>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

RegisterModalForm.propTypes = {
  userId: PropTypes.string,
  onRegister: PropTypes.func,
  notifyMessage: PropTypes.func,
};

// Allows us to access redux state as this.props.userId inside component
const mapStateToProps = state => {
  return {
    userId: state.authState.userId,
  };
};

// Allows us to dispatch a login event by calling this.props.onLogin
const mapDispatchToProps = dispatch => {
  return {
    onRegister: (userId, userType, name, location, profilePicture) => dispatch(register(userId, userType, name, location, profilePicture)),
    notifyMessage: (message) => dispatch(notifyMessage(message)),
  };
};

// Redux config
RegisterModalForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterModalForm);

export default RegisterModalForm;
