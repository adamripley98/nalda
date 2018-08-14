import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Menu extends Component {
  render() {
    return (
      <div className="menu" onClick={this.props.handleClick}>
        <div className={ this.props.active ? "bars active" : "bars" } onClick={ this.props.toggleMenu }>
          <div className="bar" id="first" />
          <div className="bar" id="second" />
          <div className="bar" id="third" />
        </div>
      </div>
    );
  }
}

Menu.propTypes = {
  active: PropTypes.bool,
  handleClick: PropTypes.func,
  toggleMenu: PropTypes.func,
};

export default Menu;
