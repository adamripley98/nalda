// import frameworks
import React, {Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

// import components
import Login from './Login';


export default function(ComponentToRender) {
  class Authenticate extends Component {
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
      console.log('userid inside require auth', this.props.userId);
      if (this.props.userId) {
        return (
            <ComponentToRender {...this.props} />
        );
      }
      return (
            <Redirect to="/login"/>
      );
    }
  }

  Authenticate.propTypes = {
    userId: PropTypes.string,
  };

  const mapStateToProps = (state) => {
    console.log('state', state);
    return {
      userId: state.authState.userId
    };
  };

  return connect(mapStateToProps)(Authenticate);
}
