// Import frameworks
import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * Render the recommended content on the homepage
 */
class FromTheEditors extends Component {
  render() {
    if (!this.props.content || !this.props.content.length) return null;
    return (
      <div className="container">
        <div className="inline-header-link">
          <h4>From the Editors</h4>
        </div>
        <div className="line" />
      </div>
    );
  }
}

// Prop validations
FromTheEditors.propTypes = {
  content: PropTypes.array,
};

export default FromTheEditors;
