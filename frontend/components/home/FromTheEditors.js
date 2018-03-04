// Import frameworks
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

// Import components
import ArticlePreview from '../content/articles/ArticlePreview';

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
          <Link to="/articles">View all</Link>
        </div>
        <div className="row">
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
