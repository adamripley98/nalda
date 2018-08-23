import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const formatDate = (date) => {
  const dateFormatted = date.replace('T', ' ');
  const m = moment(dateFormatted);
  return m.format('MMM Do YYYY, h:mm a');
};

const TimeRange = ({ startDate, endDate }) => {
  if (!startDate || !endDate) return null;

  try {
    return (
      <p className="timerange">
        {formatDate(startDate)} - {formatDate(endDate)}
      </p>
    );
  } catch(err) {
    return null;
  }
};

TimeRange.defaultProps = {
  startDate: undefined,
  endDate: undefined,
};

TimeRange.propTypes = {
  startDate: PropTypes.string,
  endDate: PropTypes.string,
};

export default TimeRange;
