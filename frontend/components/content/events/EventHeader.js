import React from 'react';
import PropTypes from 'prop-types';

import Author from '../../shared/Author';
import ErrorMessage from '../../shared/ErrorMessage';
import Categories from '../Categories';
import Requirements from './Requirements';

const EventHeader = ({
  event: {
    title,
    createdAt,
    updatedAt,
    categories,
    requirements,
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

    <Requirements requirements={requirements} />
  </div>
);

EventHeader.defaultProps = {
  error: '',
};

EventHeader.propTypes = {
  error: PropTypes.string,
  event: PropTypes.shape({
    title: PropTypes.string,
    createdAt: PropTypes.number,
    updatedAt: PropTypes.number,
    requirements: PropTypes.array,
    categories: PropTypes.object,
  }).isRequired,
  author: PropTypes.shape({
    name: PropTypes.string,
    _id: PropTypes.string,
    profilePicture: PropTypes.string,
  }).isRequired,
};

export default EventHeader;
