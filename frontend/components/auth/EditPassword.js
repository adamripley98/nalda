// Import framworks
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

// Import components
import ErrorMessage from '../shared/ErrorMessage';
import Button from '../shared/Button';

/**
 * Component for a user to edit their password
 * TODO forgot password reset
 */
class EditPassword extends Component {
  /**
   * Constructor method
   */
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
      pending: false,
      redirect: false,
    };

    // Bind this to helper methods
    this.handleChangeOldPassword = this.handleChangeOldPassword.bind(this);
    this.handleChangeNewPassword = this.handleChangeNewPassword.bind(this);
    this.handleChangeNewPasswordConfirm = this.handleChangeNewPasswordConfirm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
   * Handle change to new password confirm
   */
  handleChangeNewPasswordConfirm(event) {
    this.setState({
      newPasswordConfirm: event.target.value,
    });
  }

  /**
   * Handle submitting the form
   * TODO
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
    };

    // Send the request
    axios.post('/api/users/password', body)
      .then(res => {
        if (res.data.success) {
          this.setState({
            pending: false,
            error: "",
            redirect: true,
          });
        } else {
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
    // If user is logged in or if user successfully logs in, redirects to home
    return (
      <div>
        { /* Redirect the user to home if they are not logged in */ }
        { !this.props.userId && <Redirect to="/login" /> }
        { this.state.redirect && <Redirect to="/account" /> }

        <div className="container">
          <div className="row">
            <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2">
              <form className="thin-form" onSubmit={ this.handleSubmit }>
                <h4 className="bold marg-bot-1">
                  Edit password
                </h4>

                { /* Render an error if there is one */}
                { this.state.error && <ErrorMessage error={ this.state.error } /> }

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
                  <Link to="/todo">
                    Forgot your password?
                  </Link>
                </div>
              </form>

              <div className="marg-top-1">
                <Button />
              </div>
            </div>
          </div>
        </div>
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

// Allows us to dispatch a login event by calling this.props.onLogin
const mapDispatchToProps = () => {
  return {};
};

// Redux config
EditPassword = connect(
    mapStateToProps,
    mapDispatchToProps
)(EditPassword);

export default EditPassword;