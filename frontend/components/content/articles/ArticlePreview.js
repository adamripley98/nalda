// Import frameworks
import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

/**
 * Component to render a preview for articles
 */
const ArticlePreview = ({ image, title, subtitle, contentId }) => {
  return (
    <Link to={`/articles/${contentId}`} className="article-preview-wrapper">
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
};

export default ArticlePreview;
