// Import framworks
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '../shared/Button';
import Loading from '../shared/Loading';

// Import components
import ErrorMessage from '../shared/ErrorMessage';

/**
 * Component to render a user's account information
 * TODO pull user data from the backend
 */
class Account extends Component {
  /**
   * Constructor method
   */
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      profilePicture: '',
      error: '',
      pending: true,
    };
  }

  /**
   * Pull the user's information from the database then render it
   * TODO
   */
  componentDidMount() {
    return false;
  }

  /**
   * Helper function to render a user's information
   */
  renderInfo() {
    return "info";
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

        <div className="container">
          <div className="row">
            <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2">
              <h3 className="bold marg-top-1 marg-bot-1">
                Account information
              </h3>
              { this.state.error && <ErrorMessage error={ this.state.error } /> }
              { this.state.pending ? <Loading /> : this.renderInfo() }
              <Button />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Account.propTypes = {
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
Account = connect(
    mapStateToProps,
    mapDispatchToProps
)(Account);

export default Account;
