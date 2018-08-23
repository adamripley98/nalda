import React from 'react';
import NotFoundSection from '../../NotFoundSection';

export default () => (
  <NotFoundSection
    title="Article not found"
    content="Uh-oh! Looks like this article you are looking for was either moved or does not exist."
    url="/articles"
    urlText="Back to all articles"
  />
);
