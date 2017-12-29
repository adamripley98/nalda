// import frameworks
import React, {Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

/**
 * Component to ensure that an admin is logged in before creating new content or changing user privileges
 */
export default function(ComponentToRender) {
  class RequireAdmin extends Component {
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
      if (this.props.userId && this.props.userType === 'admin') {
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

  RequireAdmin.propTypes = {
    userId: PropTypes.string,
    userType: PropTypes.string,
  };

  const mapStateToProps = (state) => {
    return {
      userId: state.authState.userId,
      userType: state.authState.userType,
    };
  };

  return connect(mapStateToProps)(RequireAdmin);
}
