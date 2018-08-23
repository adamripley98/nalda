import React from 'react';
import NotFoundSection from '../../NotFoundSection';

export default () => (
  <NotFoundSection
    title="Listing not found"
    content="Uh-oh! Looks like the listing you were looking for was either removed or does not exist."
    url="/listings"
    urlText="Back to all listings"
  />
);
