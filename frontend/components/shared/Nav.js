import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/index.js';

/**
 * Renders the navbar at the top of the screen on all pages.
 * TODO search functionality
 */
class Nav extends Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      redirectToLogin: false,
      search: "",
      active: false,
    };

    // Bindings so 'this' refers to component
    this.handleLogoutSubmit = this.handleLogoutSubmit.bind(this);
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  /**
   * Handle when a user searches for something
   */
  handleChangeSearch(event) {
    this.setState({
      search: event.target.value,
    });
  }

  /**
   * Handle when a user clicks the toggle menu button
   */
  toggleMenu() {
    this.setState({
      active: !this.state.active,
    });
  }

  /**
   * When logout button clicked, will attempt to logout on backend (logout.js)
   */
  handleLogoutSubmit(event) {
    // Prevent the default action
    event.preventDefault();

    const onLogout = this.props.onLogout;
    axios.post('/logout')
      // If successful, will dispatch logout event which will clear user from redux state
      .then(() => {
        // Dispatch the action
        onLogout();

        // Set the state to redirect to login
        this.setState({
          redirectToLogin: true,
        });
      })
      .catch((err) => {
        /**
         * TODO handle this better
         */
        console.log('There was an error', err);
      });
  }

  /**
   * Render the navbar
   */
  render() {
    return (
      <nav className="nav">
        { this.state.redirectToLogin && (<Redirect to="/login"/>) }
        <Link to="/" className="logo">Nalda</Link>
          { /* Render left-aligned part of the navbar */ }
          { /* TODO */ }
          <div className="search">
            <i className="fa fa-search" aria-hidden="true" />
            <input
              className="form-control"
              id="search"
              value={ this.state.seach }
              onChange={ this.handleChangeSearch }
              placeholder="Search for activities, places, or curators."
            />
          </div>

          { /* Render right-aligned part of the navbar */ }
          {this.props.userId ? (
            <div className="links right">
              <Link to="/" className="link">
                Home
              </Link>
              <Link to="/about" className="link">
                About
              </Link>
              <Link to="/contact" className="link">
                Contact
              </Link>
              { /* render create link only if admin or curator */ }
              { this.props.userType === 'admin' || this.props.userType === 'curator' ? (
                <Link to="/articles/new" className="link">
                  Create
                </Link>
              ) : (
                console.log('general user logged in')
              )}
              { /* render admin panel only if admin */ }
              { this.props.userType === 'admin' ? (
                <Link to="admin" className="link">
                  Admin
                </Link>
              ) : (
                console.log('admin not logged in')
              )}
              <a onClick={ this.handleLogoutSubmit } className="link cursor">
                Logout
              </a>
            </div>
          ) : (
            <div className="links right">
              <Link to="/" className="link">
                Home
              </Link>
              <Link to="/about" className="link">
                About
              </Link>
              <Link to="/contact" className="link">
                Contact
              </Link>
              <Link to="/register" className="link">
                Register
              </Link>
              <Link to="/login" className="link">
                Login
              </Link>
          </div>
        )}
        <div className="menu">
          <div className="bars" onClick={ this.toggleMenu }>
            <div className="bar" />
            <div className="bar" />
            <div className="bar" />
          </div>
        </div>

        <div id="sidebar" style={{ display: !this.state.active && "none" }}>
          <div className="shade" onClick={ this.toggleMenu } />
          <div className="side-menu">
            <div className="header">
              STUFF
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

Nav.propTypes = {
  userId: PropTypes.string,
  userType: PropTypes.string,
  onLogout: PropTypes.func,
};

// Allows us to access redux state as this.props.userId inside component
const mapStateToProps = state => {
  return {
    userId: state.authState.userId,
    userType: state.authState.userType,
  };
};

// Allows us to dispatch a logout event by calling this.props.onLogout
const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(logout())
  };
};

// Redux config
Nav = connect(
    mapStateToProps,
    mapDispatchToProps
)(Nav);

export default Nav;
