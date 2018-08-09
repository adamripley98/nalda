// Import frameworks
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Import components
import Sidebar from './Sidebar';
import Search from './Search';
import Modal from '../auth/Modal';
import UserLinks from './UserLinks';
import GuestLinks from './GuestLinks';
import Logo from './Logo';

/**
 * Renders the navbar at the top of the screen on all pages.
 */
class Nav extends Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      search: "",
      isLogin: true,
      searchActive: false,
    };

    // Bind this to helper functions
    this.searchCallback = this.searchCallback.bind(this);
    this.modalCallback = this.modalCallback.bind(this);
  }

  /**
   * Callback function to handle when the search is active or not
   */
  searchCallback(searchActive) {
    // Update the state to the state of the searchbar
    this.setState({
      searchActive,
    });
  }

  /**
   * Callback function to handle when the login modal is in login or register
   * states
   */
  modalCallback(isLogin) {
    // Update the state
    this.setState({
      isLogin: isLogin,
    });
  }

  /**
   * Render the navbar
   */
  render() {
    return (
      <nav className={ this.state.searchActive ? 'nav search-active' : 'nav' }>
        <Logo />
        <Search callback={ this.searchCallback } location={this.props.location} />

        { /* Render the user's profile information if the user is logged in */ }
        { /* If the user is not logged in, an empty div is returned */ }
        { /* NOTE the empty div preserves styling of the sidebar */ }
        {
          this.props.userId ? (
            <UserLinks
              name={this.props.name}
              profilePicture={this.props.profilePicture}
            />
          ) : (
            <GuestLinks modalCallback={this.modalCallback} />
          )
        }

        { /* Render the sidebar */ }
        { /* This includes the three-bar menu toggle which is always visible */ }
        <Sidebar modalCallback={ this.modalCallback } />

        { !this.props.userId && <Modal isLogin={ this.state.isLogin }/> }
      </nav>
    );
  }
}

Nav.propTypes = {
  userId: PropTypes.string,
  profilePicture: PropTypes.string,
  name: PropTypes.string,
  location: PropTypes.string,
};

const mapStateToProps = state => {
  return {
    userId: state.authState.userId,
    profilePicture: state.authState.profilePicture,
    name: state.authState.name,
    location: state.authState.location,
  };
};

// Redux config
Nav = connect(
  mapStateToProps,
)(Nav);

export default Nav;
