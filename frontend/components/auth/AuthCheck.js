// import frameworks
import React, {Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
/**
 * Component to ensure that a user is logged in before seeing content
 */
class AuthCheck extends Component {
  // constructor(props) {
  //   super(props);
  //   console.log('proppppp', this.props.userId);
  //   this.state = {
  //     userLoggedIn: !!this.props.userId
  //   };
  // }
  componentWillMount() {
    this.state = {
      userLoggedIn: !!this.props.userId
    };
  }
  render() {
    console.log('userLoggedin', this.props.userId);
    // Renders component if user is logged in, returns to /login if not.
    if (this.state.userLoggedIn) {
      // Component is returned with all properties it originally had
      return <h1>hi</h1>;
    }
    return (
      <Redirect to="/login"/>
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
