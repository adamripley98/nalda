import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/index.js';

/**
 * Render the sidebar component of the navbar
 */
class Sidebar extends Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      redirectToLogin: false,
      active: false,
    };

    // Bindings so 'this' refers to component
    this.handleLogoutSubmit = this.handleLogoutSubmit.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  /**
   * Handle when a user clicks the toggle menu button
   * This hides or shows the sidebar
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
      <div>
        {/* Redirect to the login page when the user signs out */}
        { this.state.redirectToLogin && (<Redirect to="/login"/>) }

        {/* Render the clickable menu bars */}
        <div className="menu">
          <div className="bars" onClick={ this.toggleMenu }>
            <div className="bar" />
            <div className="bar" />
            <div className="bar" />
          </div>
        </div>

        {/* Render the sidebar itself which is hidden by default */}
        <div id="sidebar">
          <div
            className="shade"
            onClick={ this.toggleMenu }
            style={{ display: !this.state.active && "none" }}
          />
          <div id="side-menu" style={{ right: this.state.active ? "0vw" : "-100vw" }}>
            {
              this.props.userId ? (
                <div className="links">
                  {/* If the user is logged in */}
                  <Link to="/" className="link">
                    Home
                  </Link>
                  <Link to="/articles" className="link">
                    Articles
                  </Link>
                  <Link to="/listings" className="link">
                    Listings
                  </Link>
                  <Link to="/videos" className="link">
                    Videos
                  </Link>
                  <Link to="/account" className="link">
                    Account
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
                  <a onClick={ this.handleLogoutSubmit } className="link cursor line-above">
                    Logout
                  </a>
                </div>
              ) : (
                <div className="links">
                  {/* If the user is not logged in */}
                  <Link to="/" className="link">
                    Home
                  </Link>
                  <Link to="/articles" className="link">
                    Articles
                  </Link>
                  <Link to="/listings" className="link">
                    Listings
                  </Link>
                  <Link to="/videos" className="link">
                    Videos
                  </Link>
                  <Link to="/about" className="link">
                    About
                  </Link>
                  <Link to="/contact" className="link">
                    Contact
                  </Link>
                  <Link to="/register" className="link line-above">
                    Register
                  </Link>
                  <Link to="/login" className="link">
                    Login
                  </Link>
                </div>
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

Sidebar.propTypes = {
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
Sidebar = connect(
    mapStateToProps,
    mapDispatchToProps
)(Sidebar);

export default Sidebar;
