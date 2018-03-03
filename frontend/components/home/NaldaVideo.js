// Import frameworks
import React, {Component} from 'React';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Render the recommended content on the homepage
 */
class Recommended extends Component {
  render() {
    if (!this.props.content || !this.props.content.length) return null;
    return (
      <div className="container">
        <div className="inline-header-link">
          <h4>Nalda's Videos</h4>
          <Link to="/videos">View all</Link>
        </div>
        <div className="line" />
      </div>
    );
  }
}

// Prop validations
Recommended.propTypes = {
  content: PropTypes.array,
};

export default Recommended;
