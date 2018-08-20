import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const BannerItem = ({
  bannerItem: {
    contentType,
    contentId,
    contentImage,
  },
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="banner-item">
        <div className="background-image isLoading" />
      </div>
    );
  }

  return (
    <div className="banner-item">
      <Link to={`/${contentType}s/${contentId}`}>
        <div
          className="background-image"
          style={{backgroundImage: `url(${contentImage})`}}
        />
      </Link>
    </div>
  );
};

BannerItem.defaultProps = {
  bannerItem: {},
  isLoading: false,
};

BannerItem.propTypes = {
  isLoading: PropTypes.bool,
  bannerItem: PropTypes.shape({
    contentType: PropTypes.string,
    contentId: PropTypes.string,
    contentImage: PropTypes.string,
  }),
};

export default BannerItem;
