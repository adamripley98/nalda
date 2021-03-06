import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import ArticlePreview from '../content/articles/ArticlePreview';
import Preview from '../content/Preview';

class ShowComponent extends Component {
  constructor(props) {
    super(props);
    this.renderContent = this.renderContent.bind(this);
  }

  renderContent() {
    const contentType = this.props.component.contentType;

    if (contentType === 'Articles' || contentType === 'article') {
      return (
        <div>
          {
            this.props.component.content.map(c => (
              <ArticlePreview
                title={c.title}
                subtitle={c.subtitle}
                image={c.imagePreview ? c.imagePreview : c.image}
                contentId={c.contentId}
                key={`content-${c.contentId}`}
              />
            ))
          }
        </div>
      );
    }

    if (this.props.showAll) {
      return (
        this.props.component.content.map((c, index) => (
          <Preview
            content={c}
            contentType={contentType}
            key={`${this.props.component.title}-${c.contentId}-${index}`}
          />
        ))
      );
    }

    // If we show a number depending on the screen size
    // This is used, for example, on the homepage
    return (
      this.props.component.content.map((c, index) => (
        <Preview
          content={c}
          contentType={contentType}
          key={`${this.props.component.title}-${c.contentId}-${index}`}
          index={index}
          isVideo={(contentType || c.contentType) === 'Videos'}
        />
      ))
    );
  }

  render() {
    if (!this.props.component) return null;
    return (
      <div className="home-section">
        {
          (this.props.showLink) ? (
            <Link
              className="view-all-link"
              to={`/components/${this.props.component._id}`}
            >
              View all
            </Link>
          ) : null
        }

        <h2 className="home-section-title">
          {this.props.component.title}
        </h2>
        <p className="home-section-subtitle">
          {this.props.component.subtitle}
        </p>

        {this.renderContent()}
      </div>
    );
  }
}

ShowComponent.defaultProps = {
  showAll: false,
  showLink: false,
};

ShowComponent.propTypes = {
  component: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    contentType: PropTypes.string,
    _id: PropTypes.string,
    content: PropTypes.array,
  }).isRequired,
  showAll: PropTypes.bool,
  showLink: PropTypes.bool,
};

export default ShowComponent;
