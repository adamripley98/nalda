import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { logout } from '../../actions/index';
import { notifyMessage } from '../../actions/notification';

class UserSidebarLinks extends Component {
  constructor(props) {
    super(props);

    this.handleLogoutSubmit = this.handleLogoutSubmit.bind(this);
    this.isAdmin = this.isAdmin.bind(this);
    this.isCurator = this.isCurator.bind(this);
  }

  isAdmin() {
    return this.props.userType === 'admin';
  }

  isCurator() {
    return this.props.userType === 'curator';
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
          this.props.toggleMenu();

          // Dispatch the action
          this.props.onLogout();
          this.props.notifyMessage('Successfully logged out.');
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

  render() {
    return (
      <div className="links">
        <Link onClick={this.props.toggleMenu} to="/" className="link">
          Home
        </Link>
        <Link onClick={this.props.toggleMenu} to="/articles" className="link">
          Articles
        </Link>
        <Link onClick={this.props.toggleMenu} to="/listings" className="link">
          Listings
        </Link>
        <Link onClick={this.props.toggleMenu} to="/videos" className="link">
          Videos
        </Link>
        <Link onClick={this.props.toggleMenu} to="/account" className="link line-above">
          Edit account
        </Link>

        {/* Link to the user's profile page */}
        {
          (this.isAdmin() || this.isCurator()) && (
            <Link onClick={this.props.toggleMenu} to={`/users/${this.props.userId}`} className="link">
              Profile
            </Link>
          )
        }
        { /* Render create link only if admin or curator */ }
        {
          (this.isAdmin() || this.isCurator()) && (
            <Link onClick={this.props.toggleMenu} to="/articles/new" className="link">
              Create
            </Link>
          )
        }

        { /* Render admin panel only if admin */ }
        {
          (this.isAdmin()) && (
            <Link onClick={this.props.toggleMenu} to="/admin" className="link">
              Admin
            </Link>
          )
        }

        <a onClick={ this.handleLogoutSubmit } className="link cursor line-above">
          Logout
        </a>
      </div>
    );
  }
}

UserSidebarLinks.propTypes = {
  toggleMenu: PropTypes.func,
  userType: PropTypes.string,
  userId: PropTypes.string,
  onLogout: PropTypes.func,
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
UserSidebarLinks = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserSidebarLinks);

export default UserSidebarLinks;
