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
        <div className="space-2" />
        <div className="profile-info">
          <div className="profile-picture" style={{ backgroundImage: `url(${this.props.profilePicture})`}} />
          <div className="profile-content">
            <h4>Hi, {this.props.name}.</h4>
            <p>{this.props.location}</p>
            <Link onClick={this.props.toggleMenu} to="/account">
              Edit Profile
            </Link>
            <a onClick={ this.handleLogoutSubmit } className="link-style">
              Sign Out
            </a>
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
              Create Content
            </Link>
          )
        }

        { /* Render admin panel only if admin */ }
        {
          (this.isAdmin()) && (
            <Link onClick={this.props.toggleMenu} to="/admin" className="link">
              Admin Panel
            </Link>
          )
        }
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
  location: PropTypes.string,
  name: PropTypes.string,
  profilePicture: PropTypes.string,
};

// Allows us to access redux state as this.props.userId inside component
const mapStateToProps = state => {
  return {
    userId: state.authState.userId,
    userType: state.authState.userType,
    location: state.authState.location,
    name: state.authState.name,
    profilePicture: state.authState.profilePicture,
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
