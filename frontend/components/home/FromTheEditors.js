// Import frameworks
import React, {Component} from 'react';
import PropTypes from 'prop-types';

// Import components
import Preview from '../content/Preview';

/**
 * Render the recommended content on the homepage
 */
class FromTheEditors extends Component {
  render() {
    if (!this.props.content || !this.props.content.length) return null;
    return (
      <div className="container">
        <div className="inline-header-link">
          <h4 className="marg-bot-1 dark-gray-text">From the Editors</h4>
        </div>
        <div className="row">
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
FromTheEditors.propTypes = {
  content: PropTypes.array,
};

export default FromTheEditors;
