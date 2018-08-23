import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../shared/Button';
import ArticleBodyComponent from './ArticleBodyComponent';

const ArticleBody = ({ body }) => {
  if (!body || !body.length) return null;

  return (
    <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2">
      {
        body.map((component, index) => (
          <ArticleBodyComponent
            component={component}
            index={index}
            key={index}
          />
        ))
      }
      <div className="space-1" />

      <Button />
    </div>
  );
};

ArticleBody.defaultProps = {
  body: [],
};

ArticleBody.propTypes = {
  body: PropTypes.array,
};

export default ArticleBody;
