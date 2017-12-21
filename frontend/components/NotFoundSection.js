// Import framworks
import React, { Component } from 'react';
import { Link} from 'react-router-dom';

// Import components
import Thin from './shared/Thin';

/**
 * Component rendered if the desired page is not found
 */
class NotFoundSection extends Component {
  render() {
    return (
      <Thin>
        <div className="card pad-1 marg-top-1">
          <h2 className="bold marg-bot-1">Page not found</h2>
          <p className="marg-bot-1">
            Uh oh! Looks like this page has either been moved or doesn't exist.
          </p>
          <Link to="/" className="btn btn-primary full-width">
            Back to home
          </Link>
        </div>
      </Thin>
    );
  }
}

export default NotFoundSection;
