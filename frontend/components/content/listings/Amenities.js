import React from 'react';
import PropTypes from 'prop-types';
import Blurb from '../../shared/Blurb';

// Import json
import amenityMap from '../../json/amenityMap';

// Import SVGs
import CashOnly from '../../../assets/images/cash-only.svg';
import Formal from '../../../assets/images/formal.svg';
import OutdoorSeating from '../../../assets/images/outdoor-seating.svg';
import Parking from '../../../assets/images/parking.svg';
import Reservation from '../../../assets/images/reservation.svg';
import Waiter from '../../../assets/images/waiter.svg';
import Wifi from '../../../assets/images/wifi.svg';
import Wink from '../../../assets/images/wink.svg';

// Map from keys to svgs
const svgMap = {
  outdoorSeating: <OutdoorSeating />,
  wifi: <Wifi />,
  formal: <Formal />,
  cashOnly: <CashOnly />,
  parking: <Parking />,
  reservation: <Reservation />,
  wink: <Wink />,
  waiter: <Waiter />,
};

const Amenities = ({ amenities }) => {
  if (!amenities || !(amenities instanceof Object)) {
    return (
      <Blurb message="No amenities have been marked for this listing." />
    );
  }

  const amenityKeys = Object.keys(amenities);

  if (!amenityKeys || !amenityKeys.length || !amenityKeys.some(key => amenities[key])) {
    return (
      <Blurb message="No amenities have been marked for this listing." />
    );
  }

  // Return an amenity div tag for each amenity which is true in the state
  // That is, if the curator marked that the listing has said amenity
  return (
    <div>
      {
        amenityKeys.map(key => (
          amenities[key] ? (
            <div className="amenity" key={ key }>
              { svgMap[key] }
              { amenityMap[key] || key }
            </div>
          ) : (null)
        ))
      }
    </div>
  );
};

Amenities.defaultProps = {
  amenities: {},
};

Amenities.propTypes = {
  amenities: PropTypes.object,
};

export default Amenities;
