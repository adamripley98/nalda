import React, { Component } from 'react';
import PropTypes from 'prop-types';

class GuestLinks extends Component {
  render() {
    return (
      <div className="user-info">
        <div className="sign-in-links">
          <a
            data-toggle="modal"
            data-target="#loginModal"
            onClick={ () => this.props.modalCallback(true) }
          >
            Login
          </a>
          <a
            data-toggle="modal"
            data-target="#loginModal"
            onClick={ () => this.props.modalCallback(false) }
          >
            Register
          </a>
        </div>
      </div>
    );
  }
}

GuestLinks.propTypes = {
  modalCallback: PropTypes.func,
};

export default GuestLinks;
