// Import frameworks
import React, {Component} from 'react';
import PropTypes from 'prop-types';

// Import components
import Preview from '../content/Preview';

/**
 * Render the recommended content on the homepage
 */
class Recommended extends Component {
  render() {
    if (!this.props.content || !this.props.content.length) return null;
    return (
      <div className="home-section">
        <h2 className="home-section-title">
          Recommended for you
        </h2>
        <p className="home-section-subtitle">
          Try some of these Nalda's favorites and make it your own.
        </p>
        <div>
          {
            this.props.content.map(c => (
              <Preview content={c} key={`content-${c.contentId}`} />
            ))
          }
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
