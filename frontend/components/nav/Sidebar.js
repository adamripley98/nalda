// Import frameworks
import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Import components
import ErrorMessage from '../shared/ErrorMessage';

// Import actions
import { logout } from '../../actions/index';
import { notifyMessage } from '../../actions/notification';

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
      error: '',
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

    axios.post('/api/logout')
      // If successful, will dispatch logout event which will clear user from redux state
      .then((resp) => {
        if (resp.data.success) {
          // Close side menu
          this.toggleMenu();
          // Dispatch the action
          this.props.onLogout();
          this.props.notifyMessage("Successfully logged out.");

          // Set the state to redirect to login
          this.setState({
            redirectToLogin: true,
          });
        } else {
          this.setState({
            error: resp.data.error,
          });
        }
      })
      .catch((err) => {
        this.setState({
          error: err,
        });
      });
  }

  /**
   * Render the navbar
   */
  render() {
    return (
      <div className="sidebar-wrapper">
        {/* Redirect to the login page when the user signs out */}
        { this.state.redirectToLogin && (<Redirect to="/login"/>) }

        {/* Display any errors */}
        <ErrorMessage error={this.state.error} />

        {/* Render the clickable menu bars */}
        <div className="menu">
          <div className={ this.state.active ? "bars active" : "bars" } onClick={ this.toggleMenu }>
            <div className="bar" id="first" />
            <div className="bar" id="second" />
            <div className="bar" id="third" />
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
                  <Link onClick={this.toggleMenu} to="/account" className="link line-above">
                    Edit account
                  </Link>

                  {/* Link to the user's profile page */}
                  {
                    (this.props.userType === 'admin' || this.props.userType === 'curator') && (
                      <Link onClick={this.toggleMenu} to={`/users/${this.props.userId}`} className="link">
                        Profile
                      </Link>
                    )
                  }
                  { /* Render create link only if admin or curator */ }
                  {
                    (this.props.userType === 'admin' || this.props.userType === 'curator') && (
                      <Link onClick={this.toggleMenu} to="/articles/new" className="link">
                        Create
                      </Link>
                    )
                  }

                  { /* Render admin panel only if admin */ }
                  {
                    (this.props.userType === 'admin') && (
                      <Link onClick={this.toggleMenu} to="/admin" className="link">
                        Admin
                      </Link>
                    )
                  }

                  <a onClick={ this.handleLogoutSubmit } className="link cursor line-above">
                    Logout
                  </a>
                </div>
              ) : (
                <div className="links">
                  {/* If the user is not logged in */}
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
                      this.toggleMenu();
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
                      this.toggleMenu();
                      this.props.modalCallback(false);
                    }}
                  >
                    Register
                  </button>
                </div>
              )
            }
            <div className="sidebar-logo">
              <img src="https://s3.amazonaws.com/nalda/logo_gray.svg" alt="Nalda" />
            </div>
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
  modalCallback: PropTypes.func,
  notifyMessage: PropTypes.func,
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
    onLogout: () => dispatch(logout()),
    notifyMessage: (message) => dispatch(notifyMessage(message)),
  };
};

// Redux config
Sidebar = connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);

export default Sidebar;
