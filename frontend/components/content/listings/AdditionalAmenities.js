import React from 'react';
import PropTypes from 'prop-types';

const AdditionalAmenities = ({ amenities }) => {
  // If amenities are in the state (this should always be the case)
  if (amenities && amenities.length) {
    // Return an amenity div tag for each amenity which is true in the state
    // That is, if the curator marked that the listing has said amenity
    return amenities.map(amenity => (
      <div className="amenity no-icon" key={ amenity }>
        { amenity }
      </div>
    ));
  }

  // If there are no additional amenities
  return null;
};

AdditionalAmenities.defaultProps = {
  amenities: [],
};

AdditionalAmenities.propTypes = {
  amenities: PropTypes.array,
};

export default AdditionalAmenities;
