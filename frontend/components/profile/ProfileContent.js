import React from 'react';
import PropTypes from 'prop-types';

import Blurb from '../shared/Blurb';
import ArticlePreview from '../content/articles/ArticlePreview';
import Preview from '../content/Preview';

const ProfileContent = ({
  content,
  title,
}) => {
  let body;

  if (!content || !content.length) {
    body = (
      <div className="col-12 marg-bot-1">
        <Blurb message={`This author hasn\'t posted any ${title.toLowerCase()} yet!`}/>
      </div>
    );
  } else if (title === 'Articles') {
    body = content.map(a => (
      <ArticlePreview
        key={ a._id }
        _id={ a._id }
        title={ a.title }
        subtitle={ a.subtitle }
        image={ a.imagePreview ? a.imagePreview : a.image }
      />
    ));
  } else if (title === 'Listings') {
    body = content.map(listing => (
      <Preview
        _id={ listing._id }
        title={ listing.title }
        subtitle={ listing.description }
        image={ listing.imagePreview ? listing.imagePreview : listing.image }
        key={ listing._id }
        isListing
        isThin
      />
    ));
  } else if (title === 'Videos') {
    body = content.map(video => (
      <Preview
        _id={ video._id }
        title={ video.title }
        subtitle={ video.description }
        image={ `https://img.youtube.com/vi/${video.url.substring(video.url.indexOf("v=") + 2)}/maxresdefault.jpg` }
        key={ video._id }
        isVideo
        isThin
      />
    ));
  }

  return (
    <div className="row">
      <div className="col-12">
        <h5 className="dark-gray-text marg-bot-1">
          {title}
        </h5>
      </div>

      {body}
    </div>
  );
};

ProfileContent.defaultProps = {
  content: [],
};

ProfileContent.propTypes = {
  content: PropTypes.array,
  title: PropTypes.string.isRequired,
};

export default ProfileContent;
