// import frameworks
import React, {Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
/**
 * Component to ensure that a user is logged in before seeing content
 */
export default function(ComponentToRender) {
  class RequireLogin extends Component {
    componentWillMount() {
      if (!this.props.userId) {
        return (
          <Redirect to="/login"/>
        );
      }
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.userId) {
        return (
          <Redirect to="/login"/>
        );
      }
    }

    render() {
      // Renders component if user is logged in, returns to /login if not.
      if (this.props.userId) {
        // Component is returned with all properties it originally had
        return (
            <ComponentToRender {...this.props} />
        );
      }
      return (
            <Redirect to="/login"/>
      );
    }
  }

  RequireLogin.propTypes = {
    userId: PropTypes.string,
  };

  const mapStateToProps = (state) => {
    console.log('state', state);
    return {
      userId: state.authState.userId,
    };
  };

  return connect(mapStateToProps)(RequireLogin);
}
