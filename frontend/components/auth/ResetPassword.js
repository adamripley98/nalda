// Import framworks
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

// Import components
import ErrorMessage from '../shared/ErrorMessage';
import Thin from '../shared/Thin';

/**
 * Component for a user to reset their password
 * TODO don't pass user ID
 * TODO better frontend password checks (at least for length)
 */
class ResetPassword extends Component {
  /**
   * Constructor method
   */
  constructor(props) {
    super(props);
    this.state = {
      newPassword: '',
      newPasswordConfirm: '',
      pending: false,
      redirect: false,
      success: false,
      error: '',
    };

    // Bind this to helper methods
    this.handleChangeNewPassword = this.handleChangeNewPassword.bind(this);
    this.handleChangeNewPasswordConfirm = this.handleChangeNewPasswordConfirm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    // Find the token in the url
    const token = this.props.match.params.token;
    // Call backend to make sure token is valid/not expired
    axios.get(`/api/reset/${token}`)
    .then((resp) => {
      if (!resp.data.success) {
        this.setState({
          error: resp.data.error,
        });
      }
    })
    .catch((err) => {
      this.setState({
        error: err,
      });
    });
  }

  /**
   * Handle change to new password
   */
  handleChangeNewPassword(event) {
    this.setState({
      newPassword: event.target.value,
    });
  }

  /**
   * Handle change to new password confirm
   */
  handleChangeNewPasswordConfirm(event) {
    this.setState({
      newPasswordConfirm: event.target.value,
    });
  }

  /**
   * Handle submitting the form
   */
  handleSubmit(event) {
    // Prevent the default submit action
    event.preventDefault();

    // Update the state to pending
    this.setState({
      pending: true,
      error: "",
    });

    // Create the body object
    const body = {
      newPassword: this.state.newPassword,
      newPasswordConfirm: this.state.newPasswordConfirm,
      userId: this.props.userId,
    };

    // Isolate token
    const token = this.props.match.params.token;

    // Send the request
    axios.post(`/api/reset/${token}`, body)
      .then(res => {
        // If successful
        if (res.data.success) {
          this.setState({
            pending: false,
            error: "",
            redirect: true,
          });
        } else {
          // Otherwise display errors
          this.setState({
            pending: false,
            error: res.data.error,
          });
        }
      })
      .catch(err => {
        this.setState({
          pending: false,
          error: err,
        });
      });
  }

  /**
   * Render the component
   */
  render() {
    return (
      <div>
        { this.state.redirect && <Redirect to="/login" /> }
        <Thin>
          <form className="thin-form" onSubmit={ this.handleSubmit }>
            <h4 className="bold marg-bot-1">
              Reset password
            </h4>

            { /* Render an error if there is one */}
            <ErrorMessage error={ this.state.error } />
            {
              this.state.success ? (
                <div className="alert alert-success marg-bot-1">
                  { this.state.success }
                </div>
              ) : null
            }
            <label>
              New password
            </label>
            <input
              type="password"
              className="form-control marg-bot-1"
              value={ this.state.newPassword }
              onChange={ this.handleChangeNewPassword }
            />
            <label>
              Confirm new password
            </label>
            <input
              type="password"
              className="form-control marg-bot-1"
              value={ this.state.newPasswordConfirm }
              onChange={ this.handleChangeNewPasswordConfirm }
            />
            <input
              type="submit"
              value={ this.state.pending ? "Updating password..." : "Update password" }
              className={
                (this.state.pending) || (
                  this.state.newPassword &&
                  this.state.newPassword === this.state.newPasswordConfirm
                ) ? (
                  "btn btn-primary"
                ) : (
                  "btn btn-primary disabled"
                )
              }
            />
            <div className="marg-top-1">
              <Link to="/login">
                Remember your password?
              </Link>
            </div>
          </form>
        </Thin>
      </div>
    );
  }
}

ResetPassword.propTypes = {
  userId: PropTypes.string,
  match: PropTypes.object,
};

// Allows us to access redux state as this.props.userId inside component
const mapStateToProps = state => {
  return {
    userId: state.authState.userId,
  };
};

// Redux config
ResetPassword = connect(
    mapStateToProps,
)(ResetPassword);

export default ResetPassword;
