// Import frameworks
import React from 'react';

// Import components
import Tags from './shared/Tags';

/**
 * Component to render Nalda's terms of use
 */
const Terms = () => {
  // Set the title
  window.scrollTo(0, 0);

  // Return the terms
  return (
    <div className="container">
      <Tags title="Terms of Use" description="Nalda's terms of use." keywords="nalda,terms,use" />
      <h4 className="dark-gray-text title marg-top-1 marg-bot-1">
        Terms of use
      </h4>
      <p>
        Nalda reserves all rights to its application and user data.
      </p>
    </div>
  );
};

// Export the component
export default Terms;
