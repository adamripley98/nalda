import React from 'react';
import PropTypes from 'prop-types';

import Preview from '../content/Preview';

const ListingSearchResults = ({ handleClick, listings }) => {
  if (!listings || !listings.length) {
    return null;
  }

  return (
    <div>
      <h4>Listings</h4>
      {
        listings.map(l => (
          <Preview
            handleClick={handleClick}
            content={l}
            contentType="listing"
            key={`search-listing-${l._id}`} />
        ))
      }
    </div>
  );
};

ListingSearchResults.defaultProps = {
  listings: [],
  handleClick: () => {},
};

ListingSearchResults.propTypes = {
  listings: PropTypes.array,
  handleClick: PropTypes.func,
};

export default ListingSearchResults;
