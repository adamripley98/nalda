// Import frameworks
import React, { Component } from 'react';
import { Link} from 'react-router-dom';
import PropTypes from 'prop-types';

// Import components
import Thin from './shared/Thin';

/**
 * Component rendered if the desired page is not found
 * Props can be passed in to customize the message. For example, if a listing
 * is not found we can denote "Listing not found" rather than "page not found",
 * and can provide a link back to "/listings" instead of to the homepage.
 */
class NotFoundSection extends Component {
  render() {
    return (
      <Thin>
        <div className="card pad-1 marg-top-1">
          <div className="not-found-compass">
            <img src="https://s3.amazonaws.com/nalda/logo_gray.svg" alt="Nalda" />
          </div>
          <h2 className="bold marg-bot-1 dark-gray-text">
            {
              this.props.title ? this.props.title : "Page not found"
            }
          </h2>
          <p className="marg-bot-1">
            {
              this.props.content ? this.props.content : "Uh-oh! Looks like this page has either been moved or doesn't exist."
            }
          </p>
          <Link to={ this.props.url ? this.props.url : "/" } className="btn btn-primary full-width">
            {
              this.props.urlText ? this.props.urlText : "Back to home"
            }
          </Link>
        </div>
      </Thin>
    );
  }
}

NotFoundSection.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  url: PropTypes.string,
  urlText: PropTypes.string,
};

export default NotFoundSection;
