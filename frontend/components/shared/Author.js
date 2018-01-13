// Import frameworks
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Timestamp
import Timestamp from './Timestamp';

/**
 * Component to render a timestamp with created at and updated at fields
 */
const Author = ({ createdAt, updatedAt, name, _id, profilePicture }) => (
  <div className="author">
    <div className="author-img" style={{ backgroundImage: `url(${profilePicture})` }}/>
    <div className="text">
      <Link className="name" to={`/users/${_id}`}>
        { name }
      </Link>
      <Timestamp
        createdAt={ createdAt }
        updatedAt={ updatedAt }
      />
    </div>
  </div>
);

Author.propTypes = {
  _id: PropTypes.string,
  name: PropTypes.string,
  profilePicture: PropTypes.string,
  createdAt: PropTypes.number,
  updatedAt: PropTypes.number,
};

export default Author;
