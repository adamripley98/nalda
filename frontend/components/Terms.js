// Import frameworks
import React from 'react';

/**
 * Component to render Nalda's terms of use
 */
const Terms = () => {
  // Set the title
  document.title = "Nalda | Terms of Use";

  // Return the terms
  return (
    <div className="container">
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
