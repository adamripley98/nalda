import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Sidebar from './Sidebar';
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
      search: "",
      active: false,
    };

    // Bindings so 'this' refers to component
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
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
   * Render the navbar
   */
  render() {
    return (
      <nav className="nav">
        {/* Render the logo which links to the home page */}
        <Link to="/" className="logo">Nalda</Link>

        { /* Render the search bar on the left of the navbar */ }
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

        { /* Render the sidebar */ }
        <Sidebar />
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
    userId: state.authState.userId,
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
