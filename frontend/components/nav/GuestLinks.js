import React, { Component } from 'react';
import PropTypes from 'prop-types';

class GuestLinks extends Component {
  render() {
    return (
      <div className="user-info">
        <div className="sign-in-links">
          <button
            className="btn login"
            type="button"
            data-toggle="modal"
            data-target="#loginModal"
            onClick={ () => this.props.modalCallback(true) }
          >
            Login
          </button>
          <button
            className="btn register"
            type="button"
            data-toggle="modal"
            data-target="#loginModal"
            onClick={ () => this.props.modalCallback(false) }
          >
            Register
          </button>
        </div>
      </div>
    );
  }
}

GuestLinks.propTypes = {
  modalCallback: PropTypes.func,
};

export default GuestLinks;
