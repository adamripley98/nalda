import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Location extends Component {
  componentDidMount() {
    // If there is a location
    if (this.props.location && this.props.location.lng && this.props.location.lat) {
      $(document).ready(() => {
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 17,
          center: this.props.location,
        });
        var marker = new google.maps.Marker({
          position: this.props.location,
          map: map
        });
      });
    }
  }

  render() {
    if (!this.props.location) return null;

    const {
      name,
      lat,
      lng,
    } = this.props.location;

    if (!name || !lat || !lng) return null;

    return (
      <div>
        <div className="line" />
        <h5 className="subtitle">
          Location
        </h5>
        <p className="marg-bot-1">
          {name}
        </p>
        <div id="map" />
      </div>
    );
  }
}

Location.defaultProps = {
  location: {
    name: undefined,
    lat: undefined,
    lng: undefined,
  },
};

Location.propTypes = {
  location: PropTypes.shape({
    name: PropTypes.string,
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
};

export default Location;
