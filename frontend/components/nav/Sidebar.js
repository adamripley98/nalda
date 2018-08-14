import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import UserSidebarLinks from './UserSidebarLinks';
import GuestSidebarLinks from './GuestSidebarLinks';
import ErrorMessage from '../shared/ErrorMessage';
import Menu from './Menu';

/**
 * Render the sidebar component of the navbar
 */
class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      error: '',
    };

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
   * Render the navbar
   */
  render() {
    return (
      <div className="sidebar-wrapper">
        <ErrorMessage error={this.state.error} />

        <Menu active={this.state.active} handleClick={this.toggleMenu} />

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
                <UserSidebarLinks toggleMenu={this.toggleMenu} />
              ) : (
                <GuestSidebarLinks modalCallback={this.props.modalCallback} toggleMenu={this.toggleMenu} />
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
  modalCallback: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    userId: state.authState.userId,
  };
};

Sidebar = connect(
  mapStateToProps,
)(Sidebar);

export default Sidebar;
