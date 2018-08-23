// Import frameworks
import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

/**
 * Component to render a preview for articles
 */
const ArticlePreview = ({ image, title, subtitle, contentId, handleClick }) => {
  return (
    <Link
      to={`/articles/${contentId}`}
      className="article-preview-wrapper"
      onClick={handleClick}>
      <div className="article-preview background-image" style={{backgroundImage: `url(${image})`}}>
        <div className="content">
          <h4>{title}</h4>
          <p>{subtitle}</p>
        </div>
      </div>
    </Link>
  );
};

// Prop validations
ArticlePreview.propTypes = {
  title: PropTypes.string,
  image: PropTypes.string,
  subtitle: PropTypes.string,
  contentId: PropTypes.string,
  handleClick: PropTypes.func,
};

export default ArticlePreview;
