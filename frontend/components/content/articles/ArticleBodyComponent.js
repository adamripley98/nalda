import React from 'react';
import PropTypes from 'prop-types';

const ArticleBodyComponent = ({
  component: {
    componentType,
    body,
  },
  index,
}) => {
  if (componentType === "text") {
    return (
      <p key={ index } className="p-formatted">
        {body}
      </p>
    );
  } else if (componentType === "image") {
    return (
      <img
        key={index}
        src= {body}
        alt={`article-component-${index}`}
        className="img-fluid"
      />
    );
  } else if (componentType === "quote") {
    return (
      <p key={ index } className="quote">
        { body }
      </p>
    );
  } else if (componentType === "header") {
    return (
      <h3 key={ index } className="header">
        { body }
      </h3>
    );
  }

  // If there was not a component type match
  return null;
};

ArticleBodyComponent.propTypes = {
  index: PropTypes.number.isRequired,
  component: PropTypes.shape({
    componentType: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
  }).isRequired,
};

export default ArticleBodyComponent;
