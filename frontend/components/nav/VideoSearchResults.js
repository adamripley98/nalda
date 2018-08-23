import React from 'react';
import PropTypes from 'prop-types';

import Preview from '../content/Preview';

const VideoSearchResults = ({ handleClick, videos }) => {
  if (!videos || !videos.length) {
    return null;
  }

  return (
    <div>
      <h4>Videos</h4>
      {
        videos.map(v => (
          <Preview
            key={`search-video-${v._id}`}
            handleClick={handleClick}
            content={v}
            contentType="video"
          />
        ))
      }
    </div>
  );
};

VideoSearchResults.defaultProps = {
  videos: [],
  handleClick: () => {},
};

VideoSearchResults.propTypes = {
  videos: PropTypes.array,
  handleClick: PropTypes.func,
};

export default VideoSearchResults;
