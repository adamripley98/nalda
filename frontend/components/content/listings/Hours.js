import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// Helper method to convert from military to normal time
const formatHours = (hour) => (
  moment(hour, 'HH:mm').format('h:mm a')
);

const formatDay = (day) => (
  `${formatHours(day.start)} - ${formatHours(day.finish)}`
);

const Hours = ({ hours }) => {
  // Helper method to check if there are hours
  const areHours = () => {
    // Check to see if any hour is populated
    const keys = Object.keys(hours);

    const reducer = (acc, curr) => {
      if (acc) return true;
      const dayObj = hours[curr];
      return !!(dayObj.start && dayObj.finish);
    };

    return keys.reduce(reducer, false);
  };

  if (!areHours()) {
    return (
      <div>
        <p className="gray-text">
          Hours are not published for this listing.
        </p>
      </div>
    );
  }

  return (
    // If a date has a start and end time, it will be displayed
    <table className="table">
      <tbody>
        {
          (hours.monday.start && hours.monday.finish) ? (
            <tr>
              <td>
                Monday
              </td>
              <td>
                {formatDay(hours.monday)}
              </td>
            </tr>
          ) : null
        }
        {
          (hours.tuesday.start && hours.tuesday.finish) ? (
            <tr>
              <td>
                Tuesday
              </td>
              <td>
                {formatDay(hours.tuesday)}
              </td>
            </tr>
          ) : null
        }
        {
          (hours.wednesday.start && hours.wednesday.finish) ? (
            <tr>
              <td>
                Wednesday
              </td>
              <td>
                {formatDay(hours.wednesday)}
              </td>
            </tr>
          ) : null
        }
        {
          (hours.thursday.start && hours.thursday.finish) ? (
            <tr>
              <td>
                Thursday
              </td>
              <td>
                {formatDay(hours.thursday)}
              </td>
            </tr>
          ) : null
        }
        {
          (hours.friday.start && hours.friday.finish) ? (
            <tr>
              <td>
                Friday
              </td>
              <td>
                {formatDay(hours.friday)}
              </td>
            </tr>
          ) : null
        }
        {
          (hours.saturday.start && hours.saturday.finish) ? (
            <tr>
              <td>
                Saturday
              </td>
              <td>
                {formatDay(hours.saturday)}
              </td>
            </tr>
          ) : null
        }
        {
          (hours.sunday.start && hours.sunday.finish) ? (
            <tr>
              <td>
                Sunday
              </td>
              <td>
                {formatDay(hours.sunday)}
              </td>
            </tr>
          ) : null
        }
      </tbody>
    </table>
  );
};

Hours.propTypes = {
  hours: PropTypes.object.isRequired,
};

export default Hours;
