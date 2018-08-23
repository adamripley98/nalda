import React from 'react';
import PropTypes from 'prop-types';

import ArticlePreview from '../content/articles/ArticlePreview';

const ArticleSearchResults = ({ handleClick, articles }) => {
  if (!articles || !articles.length) {
    return null;
  }

  return (
    <div>
      <h4>Articles</h4>
      {
        articles.map(a => (
          <ArticlePreview
            handleClick={handleClick}
            key={`search-article-${a._id}`}
            title={a.title}
            image={a.imagePreview || a.image}
            subtitle={a.subtitle}
            contentId={a._id || a.contentId}
          />
        ))
      }
    </div>
  );
};

ArticleSearchResults.defaultProps = {
  articles: [],
  handleClick: () => {}, // Do nothing
};

ArticleSearchResults.propTypes = {
  articles: PropTypes.array,
  handleClick: PropTypes.func,
};

export default ArticleSearchResults;
