// Import frameworks
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import Preview from '../content/Preview';

/**
 * Render the recommended content on the homepage
 */
class NaldaVideo extends Component {
  render() {
    if (!this.props.content || !this.props.content.length) return null;
    return (
      <div className="container">
        <div className="inline-header-link">
          <h4 className="marg-bot-1 dark-gray-text">Nalda's Videos</h4>
          <Link to="/videos">View all</Link>
        </div>
        <div className="row">
          {
            this.props.content.map(c => (
              <Preview content={c} key={`content-${c.contentId}`} />
            ))
          }
        </div>
        <div className="space-2" />
      </div>
    );
  }
}

// Prop validations
NaldaVideo.propTypes = {
  content: PropTypes.array,
};

export default NaldaVideo;
