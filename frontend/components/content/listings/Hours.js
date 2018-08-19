import React from 'react';
import PropTypes from 'prop-types';

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
                {this.formatHours(hours.monday.start)} - {this.formatHours(hours.monday.finish)}
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
                {this.formatHours(hours.tuesday.start)} - {this.formatHours(hours.tuesday.finish)}
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
                {this.formatHours(hours.wednesday.start)} - {this.formatHours(hours.wednesday.finish)}
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
                {this.formatHours(hours.thursday.start)} - {this.formatHours(hours.thursday.finish)}
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
                {this.formatHours(hours.friday.start)} - {this.formatHours(hours.friday.finish)}
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
                {this.formatHours(hours.saturday.start)} - {this.formatHours(hours.saturday.finish)}
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
                {this.formatHours(hours.sunday.start)} - {this.formatHours(hours.sunday.finish)}
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
