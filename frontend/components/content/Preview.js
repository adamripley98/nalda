import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';

/**
 * Renders an error message to the user
 */
class Preview extends Component {
  constructor(props) {
    super(props);

    // Bind this to helper methods
    this.getType = this.getType.bind(this);
    this.getSubtitle = this.getSubtitle.bind(this);
  }

  getSubtitle() {
    // Update the subtitle to a shortened version if need be
    if (this.props.subtitle.length > 100) return this.props.subtitle.substring(0, 100) + "...";
    return this.props.subtitle;
  }

  getType() {
    // Find the type of the content
    if (this.props.isArticle || this.props.contentType === "article") {
      return "articles";
    } else if (this.props.isListing || this.props.contentType === "listing") {
      return "listings";
    } else if (this.props.isVideo || this.props.contentType === "video") {
      return "videos";
    }
    return "";
  }

  render() {
    // If an object was passed in, recursively render the preview
    if (this.props.content) {
      let image = "";
      if (this.props.content.contentType === "video") {
        const videoId = this.props.content.url.substring(this.props.content.url.indexOf("v=") + 2);
        image = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      } else {
        image = this.props.content.image;
      }

      return (
        <Preview
          _id={ this.props.content.contentId }
          key={ this.props.content.contentId }
          title={ this.props.content.title }
          subtitle={
            this.props.content.subtitle ? (
              this.props.content.subtitle
            ) : (
              this.props.content.description
            )
          }
          image={image}
          contentType={ this.props.content.contentType }
        />
      );
    }

    // Return the content preview
    return (
      <div className={this.props.isThin ? "col-12 col-md-6" : "col-6 col-xl-3"} key={this.props._id}>
        <Link to={ `/${this.getType()}/${this.props._id}` }>
          <div className="content-preview">
            <div
              className="background-image"
              style={{ backgroundImage: `url(${this.props.image})`}}
            >
              { (this.props.isVideo || this.props.contentType === "video") && (
                <div className="image-wrapper">
                  <img
                    alt="Play video"
                    src="https://s3.amazonaws.com/nalda/play.svg"
                    className="img-fluid"
                  />
                </div>
              )}
            </div>

            <h2 className="title">
              { this.props.title }
            </h2>

            <h6 className="subtitle">
              { this.getSubtitle() }
            </h6>

            {
              this.props.timestamp && (
                <p className="gray-text marg-bot-0 marg-top-05 right italic">
                  { moment(new Date(Number(this.props.timestamp))).fromNow(true) }
                </p>
              )
            }
          </div>
        </Link>
      </div>
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
};

export default Preview;
