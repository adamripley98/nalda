// import frameworks
import React, {Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

export default function(ComponentToRender) {
  class RequireCurator extends Component {
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
      if (this.props.userId && (this.props.userType === 'curator' || this.props.userType === 'admin')) {
        return (
            <ComponentToRender {...this.props} />
        );
      }
      return (
            <Redirect to="/login"/>
      );
    }
  }

  RequireCurator.propTypes = {
    userId: PropTypes.string,
    userType: PropTypes.string,
  };

  const mapStateToProps = (state) => {
    console.log('state', state);
    return {
      userId: state.authState.userId,
      userType: state.authState.userType,
    };
  };

  return connect(mapStateToProps)(RequireCurator);
}
