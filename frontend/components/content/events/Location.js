import React from 'react';
import PropTypes from 'prop-types';

const Location = ({
  location: {
    name,
    lat,
    lng,
  },
}) => {
  if (!name || !lat || !lng) return (<div />);

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
};

Location.defaultProps = {
  location: {
    name: '',
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
