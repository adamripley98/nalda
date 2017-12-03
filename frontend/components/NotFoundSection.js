// Import framworks
import React, { Component } from 'react';
import { Link} from 'react-router-dom';

// Import components
import Thin from './shared/Thin';
import GrayWrapper from './shared/GrayWrapper';

class NotFoundSection extends Component {
    // If route is invalid
  render() {
    return (
      <GrayWrapper>
        <Thin>
            <p className="marg-top-1 marg-bot-0">
              Uh oh! Looks like this page has either been moved or doesn't exist. <Link to="/">Go back to home.</Link>
            </p>
        </Thin>
      </GrayWrapper>
    );
  }
}

export default NotFoundSection;
