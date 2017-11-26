import React from 'react';
import GrayWrapper from './shared/GrayWrapper';

/**
 * Component for the homepage of the application
 */
class Home extends React.Component {
  // Function to render the component
  render() {
    return (
      <GrayWrapper>
        <div>
          <h1 className="marg-bot-0">
            Hello there! This is home component
          </h1>
        </div>
      </GrayWrapper>
    );
  }
}

export default Home;
