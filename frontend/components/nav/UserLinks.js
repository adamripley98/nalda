import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class UserLinks extends Component {
  render() {
    return (
      <div className="user-info">
        <div className="user-img hidden-sm-down" style={{ backgroundImage: `url(${this.props.profilePicture})` }} />

        <div className="user-text">
          {
            this.props.name ? (
              <p>
                Hi,&nbsp;
                <Link to="/account">
                  {
                    this.props.name.indexOf(' ' > -1) ? this.props.name.substring(0, this.props.name.indexOf(' ')) : this.props.name
                  }
                </Link>
              </p>
            ) : (<p />)
          }
        </div>
      </div>
    );
  }
}

UserLinks.propTypes = {
  location: PropTypes.object,
  profilePicture: PropTypes.string,
  name: PropTypes.string,
};

export default UserLinks;
