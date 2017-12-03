// Import framworks
import React, { Component } from 'react';

// Import components
import Thin from './shared/Thin';
import GrayWrapper from './shared/GrayWrapper';

const content = "Questions or comments about the app? Interested in joining the Nalda team? Reach out!";

class Contact extends Component {
  // Renders contact component
  render() {
    return (
      <GrayWrapper>
        <Thin>
            <p className="marg-top-1 marg-bot-0">
              {content}
            </p>
        </Thin>
      </GrayWrapper>
    );
  }
}

export default Contact;
