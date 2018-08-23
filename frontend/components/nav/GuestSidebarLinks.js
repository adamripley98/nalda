import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class GuestSidebarLinks extends Component {
  render() {
    return (
      <div className="links">
        <div className="space-2" />
        <div className="row marg-bot-1">
          <div className="col-6">
            <button
              className="btn btn-primary full-width"
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
          </div>
          <div className="col-6">
            <button
              className="btn btn-blue full-width"
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
        </div>

        <div className="line" />

        <Link onClick={this.props.toggleMenu} to="/" className="link">
          Home
        </Link>
        <Link onClick={this.props.toggleMenu} to="/articles" className="link">
          Curator Articles
        </Link>
        <Link onClick={this.props.toggleMenu} to="/listings" className="link">
          Philadelphia Food
        </Link>
        <Link onClick={this.props.toggleMenu} to="/events" className="link">
          Philadelphia Events
        </Link>
        <Link onClick={this.props.toggleMenu} to="/videos" className="link">
          Videos
        </Link>
        <Link onClick={this.props.toggleMenu} to="/about" className="link">
          About Nalda
        </Link>
        <Link onClick={this.props.toggleMenu} to="/contact" className="link">
          Contact Nalda
        </Link>
      </div>
    );
  }
}

GuestSidebarLinks.propTypes = {
  toggleMenu: PropTypes.func,
  modalCallback: PropTypes.func,
};

export default GuestSidebarLinks;
