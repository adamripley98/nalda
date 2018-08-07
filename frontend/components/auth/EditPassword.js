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
 * Component for a user to edit their password
 */
class EditPassword extends Component {
  /**
   * Constructor method
   */
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      oldPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
      pending: false,
      redirect: false,
      info: '',
    };

    // Bind this to helper methods
    this.handleChangeOldPassword = this.handleChangeOldPassword.bind(this);
    this.handleChangeNewPassword = this.handleChangeNewPassword.bind(this);
    this.handleChangeNewPasswordConfirm = this.handleChangeNewPasswordConfirm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleForgot = this.handleForgot.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    axios.get('/api/users/username')
    .then((resp) => {
      this.setState({
        username: resp.data.username,
      });
    })
    .catch(e => {
      this.setState({error: e.response.data.error || e.response.data});
    });
  }

  /**
   * Handle change to old password
   */
  handleChangeOldPassword(event) {
    this.setState({
      oldPassword: event.target.value,
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
   * Handle when someone forgot their password
   */
  handleForgot() {
    axios.post('/api/forgot', {
      username: this.state.username,
    })
    .then((resp) => {
      if (resp.data.success) {
        this.setState({
          info: 'Please check your email for a link to reset your password.',
          error: '',
        });
      } else {
        this.setState({
          error: resp.data.error,
        });
      }
    })
    .catch((err) => {
      if (err) {
        this.setState({
          error: err.message,
        });
      }
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
      oldPassword: this.state.oldPassword,
      newPassword: this.state.newPassword,
      newPasswordConfirm: this.state.newPasswordConfirm,
      userId: this.props.userId,
    };

    // Send the request
    axios.post('/api/users/password', body)
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
        { this.state.redirect && <Redirect to="/account" /> }
        <Thin>
          <form className="thin-form" onSubmit={ this.handleSubmit }>
            <h4 className="bold marg-bot-1">
              Edit password
            </h4>

            { /* Render an error if there is one */}
            <ErrorMessage error={ this.state.error } />

            {
              this.state.info ?
              <div className="alert alert-warning marg-bot-1" onClick={this.handleVerifyEmail}>
                {this.state.info}
              </div>
              : null
            }

            <label>
              Old password
            </label>
            <input
              type="password"
              className="form-control marg-bot-1"
              value={ this.state.oldPassword }
              onChange={ this.handleChangeOldPassword }
            />
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
                  this.state.oldPassword &&
                  this.state.newPassword &&
                  this.state.oldPassword !== this.state.newPassword &&
                  this.state.newPassword === this.state.newPasswordConfirm
                ) ? (
                  "btn btn-primary"
                ) : (
                  "btn btn-primary disabled"
                )
              }
            />
            <div className="marg-top-1">
              <a
                className="link-style"
                onClick={ () => this.handleForgot() }
              >
                Forgot password?
              </a>
            </div>
          </form>
        </Thin>
      </div>
    );
  }
}

EditPassword.propTypes = {
  userId: PropTypes.string,
};

// Allows us to access redux state as this.props.userId inside component
const mapStateToProps = state => {
  return {
    userId: state.authState.userId,
  };
};

// Redux config
EditPassword = connect(
    mapStateToProps,
)(EditPassword);

export default EditPassword;
