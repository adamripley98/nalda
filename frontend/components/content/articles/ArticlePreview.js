// Import frameworks
import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

/**
 * Component to render a preview for articles
 */
const ArticlePreview = ({ image, title, subtitle, contentId }) => {
  return (
    <div className="col-6 col-xl-4">
      <Link to={`/articles/${contentId}`}>
        <div className="article-preview background-image" style={{backgroundImage: `url(${image})`}}>
          <div className="content">
            <div className="shade">
              <h4>{title}</h4>
              <p>{subtitle}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
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
