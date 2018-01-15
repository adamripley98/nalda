// Import framworks
import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Import actions
import { login } from '../../actions/index.js';

// Import components
import ErrorMessage from '../shared/ErrorMessage';

/**
 * Component to render the form for a user logging in
 */
class LoginModal extends Component {
    // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: '',
      pending: false,
    };

    // Bindings so 'this' refers to component
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  /**
   * When the component mounts
   */
  componentDidMount() {
    $('#loginModal').on('shown.bs.modal', () => {
      $('#emailInput').focus()
    });
  }

  /**
   * When login button clicked, will attempt to login
   * on backend (login.js)
   */
  handleLoginSubmit(event) {
    // Denote that the login is pending
    this.setState({
      pending: true,
    });

    // Binding this for inside axios request
    const username = this.state.username;
    const password = this.state.password;

    // Prevent the default form action
    event.preventDefault();
    // Find the needed variables
    const onLogin = this.props.onLogin;
    // Frontend validations
    if (!this.state.username) {
      this.setState({
        error: "Username must be populated.",
        pending: false,
      });
    } else if (!this.state.password) {
      this.setState({
        error: "Password must be populated",
        pending: false,
      });
    } else {
      // Make the login request to axios
      // If successful, will send back userId. If redux state contains userId,
      // will redirect to home
      axios.post('/api/login', {
        username,
        password,
      })
        .then((resp) => {
          // If there was an issue with logging in, display error
          if (!resp.data.success) {
            this.setState({
              error: resp.data.error,
              pending: false,
            });
          } else {
            // Collapse the modal
            $('#loginModal').modal('toggle');

            // Dispatch login event for redux state
            onLogin(
              resp.data.user._id,
              resp.data.user.userType,
              resp.data.user.name,
              resp.data.user.location.name,
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
    }
  }

  // Handle when a user types into the email
  handleChangeEmail(event) {
    this.setState({
      username: event.target.value,
    });
  }

  // Handle when a user types into the password
  handleChangePassword(event) {
    this.setState({
      password: event.target.value,
    });
  }

  // Renders actual Login component
  render() {
    return (
      <div className="modal fade" id="loginModal" tabIndex="-1" role="dialog" aria-labelledby="loginModal" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            {/* Render the form */}
            <form
              method="POST"
              onSubmit={ this.handleLoginSubmit }
            >
              <div className="modal-header">
                <h5 className="modal-title">
                  Login to continue
                </h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span className="bars" aria-hidden="true">
                    <span className="bar" />
                    <span className="bar" />
                  </span>
                </button>
              </div>

              <div className="modal-body left">
                <ErrorMessage error={ this.state.error } />

                <i className="fa fa-envelope fa-fw in-input" aria-hidden />
                <input
                  type="text"
                  id="emailInput"
                  className="form-control marg-bot-1"
                  value={ this.state.username }
                  onChange={ this.handleChangeEmail }
                  placeholder="Email"
                />

                <i className="fa fa-unlock-alt fa-fw in-input" aria-hidden />
                <input
                  type="password"
                  className="form-control marg-bot-1"
                  value={ this.state.password }
                  onChange={ this.handleChangePassword }
                  placeholder="Password"
                />
                <input
                  type="submit"
                  className={
                    !this.state.pending && this.state.password && this.state.username ? (
                      "btn btn-primary full-width"
                    ) : (
                      "btn btn-primary disabled full-width"
                    )
                  }
                  value={ this.state.pending ? "Logging in..." : "Login" }
                />
              </div>

              <div className="modal-footer">
                <p className="marg-bot-0 center gray-text">
                  Don't have an account? <Link
                    to="/register"
                    onClick={ () => $('#loginModal').modal('toggle') }
                  >
                    Register here.
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

LoginModal.propTypes = {
  userId: PropTypes.string,
  onLogin: PropTypes.func,
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
    onLogin: (userId, userType, name, location, profilePicture) => dispatch(login(userId, userType, name, location, profilePicture))
  };
};

// Redux config
LoginModal = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginModal);

export default LoginModal;
