import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Renders an error message to the user
 */
const ArticlePreview = ({ _id, title, subtitle, image }) => (
  <div className="col-6 col-lg-3" key={ _id } >
    <Link to={ `/articles/${_id}` } >
      <div className="article-preview">
        <div
          className="background-image"
          style={{ backgroundImage: `url(${image})`}}
        />
        <h2 className="title">
          { title }
        </h2>
        <h6 className="subtitle">
          { subtitle }
        </h6>
      </div>
    </Link>
  </div>
);

// Props validations
ArticlePreview.propTypes = {
  _id: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  image: PropTypes.string,
};

export default ArticlePreview;
