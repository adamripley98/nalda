// Import frameworks
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Import components
import Stars from './listings/Stars';
import categoryMap from '../json/categoryMap';


/**
 * Renders an error message to the user
 */
class Preview extends Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Bind this to helper method
    this.getType = this.getType.bind(this);
    this.getSubtitle = this.getSubtitle.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.isVideo = this.isVideo.bind(this);
    this.getClassName = this.getClassName.bind(this);
  }

  // Return the subtitle of the content
  // This is dependent on the content type and the length of the subtitle
  getSubtitle() {
    if (this.props.isListing || this.props.contentType === "listing") return null;

    // Update the subtitle to a shortened version if need be
    let subtitle = this.props.subtitle;
    if (this.props.subtitle.length > 100) subtitle = this.props.subtitle.substring(0, 100) + "...";
    return (
      <h6 className="subtitle">
        { subtitle }
      </h6>
    );
  }

  isVideo() {
    return (this.props.isVideo || this.props.contentType === "video");
  }

  // Get the type of the content as based on the props
  getType() {
    // Find the type of the content
    if (this.props.isArticle || this.props.contentType === 'article') {
      return 'articles';
    } else if (this.props.isVideo || this.props.contentType === 'video') {
      return 'videos';
    }

    // If none of the types match
    return 'listings';
  }

  getClassName() {
    let className;

    if (this.props.index) className = `content-preview-wrapper grid-item-${this.props.index}`;
    else className = 'content-preview-wrapper';

    if (this.isVideo()) className += ' video';

    return className;
  }

  // Get the location of the content if a location was passed to the component
  getLocation() {
    // If there is no location, return null
    if (!this.props.location) return null;

    // Else, if there is a location return it but make sure it is not too long
    let location = this.props.location;
    if (location.length > 32) location = location.substring(0, 32).trim() + '...';
    return (
      <p className="location">
        {location}
      </p>
    );
  }

  // Get the categories of the content if there are any
  getCategories() {
    // If there are no categories, return null
    if (!this.props.categories) return null;
    const keys = Object.keys(this.props.categories);

    // If there are categories to return
    return (
      <div className="categories">
        {keys.map(key => (
          this.props.categories[key] ? <span className="category" key={key}>{categoryMap[key]}</span> : null
        ))}
      </div>
    );
  }

  // Render the component
  render() {
    // If an object was passed in, recursively render the preview
    if (this.props.content) {
      // Find the image for the content depending on its type
      let image = "";

      let contentType = this.props.contentType;

      console.log('\n\nCONTENT TYPE\n\n\n', contentType);

      if (contentType === 'Videos') contentType = 'video';
      else if (contentType === 'Listings') contentType = 'listing';
      else if (contentType === 'Articles') contentType = 'article';

      console.log('\n\nCONTENT TYPE\n\n\n', contentType);

      if (contentType === 'video' || contentType === 'Videos') {
        const videoId = this.props.content.url.substring(this.props.content.url.indexOf("v=") + 2);
        image = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      } else {
        image = this.props.content.imagePreview ? this.props.content.imagePreview : this.props.content.image;
      }

      // Render a preview with the specific props
      return (
        <Preview
          _id={this.props.content.contentId ? this.props.content.contentId : this.props.content._id}
          key={this.props.content.contentId}
          title={this.props.content.title}
          categories={this.props.content.categories}
          location={this.props.content.location ? this.props.content.location.name : ''}
          subtitle={this.props.content.subtitle || this.props.content.description}
          rating={this.props.content.rating}
          image={image}
          index={this.props.index}
          contentType={contentType}
        />
      );
    }

    // Return the content preview
    return (
      <Link
        to={ `/${this.getType()}/${this.props._id}` }
        className={this.getClassName()}>
        <div className="content-preview">
          <div
            className="background-image"
            style={{ backgroundImage: `url(${this.props.image})`}}
          >
            { this.isVideo() && (
              <div className="image-wrapper">
                <img
                  alt="Play video"
                  src="https://s3.amazonaws.com/nalda/play.svg"
                  className="img-fluid"
                />
              </div>
            )}
          </div>

          {this.getLocation()}
          <h2 className="title">{this.props.title}</h2>
          {this.getCategories()}
          {this.props.rating && <Stars rating={this.props.rating} />}
          {this.getSubtitle()}
        </div>
      </Link>
    );
  }
}

// Props validations
Preview.propTypes = {
  _id: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  image: PropTypes.string,
  isListing: PropTypes.bool,
  isVideo: PropTypes.bool,
  isArticle: PropTypes.bool,
  isThin: PropTypes.bool,
  timestamp: PropTypes.number,
  content: PropTypes.object,
  contentType: PropTypes.string,
  rating: PropTypes.number,
  location: PropTypes.string,
  categories: PropTypes.object,
  index: PropTypes.number,
};

export default Preview;
