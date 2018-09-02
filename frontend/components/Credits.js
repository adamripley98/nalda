// Import frameworks
import React from 'react';

// Import components
import Tags from './shared/Tags';

// Component to render site credits
const Credits = () => {
  // Update the title
  window.scrollTo(0, 0);

  // Return the credits
  return (
    <div className="container">
      <Tags title="Credits" description="Enumerating site credits." keywords="site,credits,nalda,developers" />
      <h4 className="dark-gray-text title marg-top-1 marg-bot-1">
        Site credits
      </h4>
      <p>
        Website developed by &nbsp;
        <a href="https://www.cameroncabo.com">
          Cameron Cabo
        </a> and &nbsp;
        <a href="http://www.adamripley.com">
          Adam Ripley
        </a>
        &nbsp; for Nalda through &nbsp;
        <a href="https://www.riplo.io">
          Riplo Ventures
        </a>.
      </p>
    </div>
  );
};

// Export the component
export default Credits;
