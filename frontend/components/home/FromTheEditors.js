// Import frameworks
import React, {Component} from 'react';
import PropTypes from 'prop-types';

// Import components
import ArticlePreview from '../content/articles/ArticlePreview';

/**
 * Render the recommended content on the homepage
 */
class FromTheEditors extends Component {
  render() {
    if (!this.props.content || !this.props.content.length) return null;
    return (
      <div className="home-section">
        <h2 className="home-section-title">
          From the Editors
        </h2>
        <p className="home-section-subtitle">
          Try some of these Nalda's favorites and make it your own.
        </p>
        <div>
          {
            this.props.content.map(c => (
              <ArticlePreview
                title={c.title}
                subtitle={c.subtitle}
                image={c.image}
                contentId={c.contentId}
                key={`content-${c.contentId}`}
              />
            ))
          }
        </div>
      </div>
    );
  }
}

// Prop validations
FromTheEditors.propTypes = {
  content: PropTypes.array,
};

export default FromTheEditors;
