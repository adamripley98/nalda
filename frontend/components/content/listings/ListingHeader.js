import React from 'react';
import PropTypes from 'prop-types';

import Author from '../../shared/Author';
import ErrorMessage from '../../shared/ErrorMessage';
import Categories from '../Categories';

const ListingHeader = ({
  listing: {
    title,
    createdAt,
    updatedAt,
    naldaFavorite,
    categories,
  },
  author: {
    name,
    _id,
    profilePicture,
  },
  error,
}) => (
  <div className="header">
    <h1 className="title">
      {title}
    </h1>

    <Author
      createdAt={createdAt}
      updatedAt={updatedAt}
      name={name}
      _id={_id}
      profilePicture={profilePicture}
    />

    <ErrorMessage error={error} />

    <Categories categories={categories} />

    <p className="nalda-favorite">
      <strong>
        Nalda's favorite:
      </strong>
      <br />
      {naldaFavorite}
    </p>
  </div>
);

ListingHeader.defaultProps = {
  error: '',
};

ListingHeader.propTypes = {
  error: PropTypes.string,
  listing: PropTypes.shape({
    title: PropTypes.string,
    createdAt: PropTypes.number,
    updatedAt: PropTypes.number,
    naldaFavorite: PropTypes.string,
    categories: PropTypes.object,
  }).isRequired,
  author: PropTypes.shape({
    name: PropTypes.string,
    _id: PropTypes.string,
    profilePicture: PropTypes.string,
  }).isRequired,
};

export default ListingHeader;
