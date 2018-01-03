// import frameworks
import React, {Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
/**
 * Component to ensure that a user is logged in before seeing content
 */
class AuthCheck extends Component {

  componentDidMount() {
    var delayInMilliseconds = 5000;
    setTimeout(() => {
      this.checkAuth();
    }, delayInMilliseconds);
  }

  checkAuth() {
    if (this.props.userId) {
      return (
        <h1>hi</h1>
      );
    }
    return (
      <Redirect to="/login"/>
    );
  }

  render() {
    return (
      <h2>testing</h2>
    );
  }
}

AuthCheck.propTypes = {
  userId: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    userId: state.authState.userId,
  };
};

const mapDispatchToProps = () => {
  return {};
};

// Redux config
AuthCheck = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthCheck);

export default AuthCheck;
