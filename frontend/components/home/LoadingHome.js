import React from 'react';
import Banner from './Banner';
import ListingCategories from './ListingCategories';

const LoadingHome = () => (
  <div>
    <Banner isLoading />

    <div className="container">
      <ListingCategories isLoading />
    </div>
  </div>
);

export default LoadingHome;
