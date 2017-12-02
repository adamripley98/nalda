import React, { Component } from 'react';
import axios from 'axios';
import { Link} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import { logout } from '../../actions/index.js';

/**
 * Renders the navbar at the top of the screen on all pages.
 *
 * TODO make this stateful depending on if the user is logged in or not.
 * Currently, it assumes that the user is not logged in.
 */
class Nav extends Component {

  constructor(props) {
    super(props);
    // Bindings so 'this' refers to component
    this.handleLogoutSubmit = this.handleLogoutSubmit.bind(this);
  }

  // When logout button clicked, will attempt to logout on backend (logout.js)
  handleLogoutSubmit(event) {
    const onLogout = this.props.onLogout;
    event.preventDefault();
    axios.post('/logout')
        // if successful, will send back userId. If redux state contains userId, will redirect to home
        .then((resp) => {
          console.log('what is resp', resp.data, resp.data._id);
          console.log('props before', this.props);
          onLogout();
          console.log('props after', this.props);
        })
        .catch((err) => {
          console.log('there was an error', err);
        });
  }
  render() {
    return (
      <nav className="navbar navbar-toggleable-md navbar-light">
        <button className="navbar-toggler navbar-toggler-right collapsed" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="icon-bar top-bar" />
          <span className="icon-bar middle-bar" />
          <span className="icon-bar bottom-bar" />
        </button>
        <Link to="/" className="navbar-brand">Nalda</Link>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/register" className="nav-link">Register</Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link">Login</Link>
            </li>
            <li className="nav-item">
              <div onClick={(e) => this.handleLogoutSubmit(e)} className="nav-link">Logout</div>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

Nav.propTypes = {
  userId: PropTypes.string,
  onLogout: PropTypes.func,
};

// Allows us to access redux state as this.props.userId inside component
const mapStateToProps = state => {
  return {
    userId: state.loginState.userId,
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
