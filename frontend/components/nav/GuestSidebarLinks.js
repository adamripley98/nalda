import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class GuestSidebarLinks extends Component {
  render() {
    return (
      <div className="links">
        <Link onClick={this.toggleMenu} to="/" className="link">
          Home
        </Link>
        <Link onClick={this.toggleMenu} to="/articles" className="link">
          Articles
        </Link>
        <Link onClick={this.toggleMenu} to="/listings" className="link">
          Listings
        </Link>
        <Link onClick={this.toggleMenu} to="/videos" className="link">
          Videos
        </Link>
        <Link onClick={this.toggleMenu} to="/about" className="link">
          About
        </Link>
        <Link onClick={this.toggleMenu} to="/contact" className="link">
          Contact
        </Link>
        <button
          className="btn link line-above white"
          type="button"
          data-toggle="modal"
          data-target="#loginModal"
          onClick={ () => {
            this.props.toggleMenu();
            this.props.modalCallback(true);
          }}
        >
          Login
        </button>
        <button
          className="btn link white"
          type="button"
          data-toggle="modal"
          data-target="#loginModal"
          onClick={ () => {
            this.props.toggleMenu();
            this.props.modalCallback(false);
          }}
        >
          Register
        </button>
      </div>
    );
  }
}

GuestSidebarLinks.propTypes = {
  toggleMenu: PropTypes.func,
  modalCallback: PropTypes.func,
};

export default GuestSidebarLinks;
