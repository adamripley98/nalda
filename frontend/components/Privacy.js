// Import frameworks
import React from 'react';

/**
 * Component to render Nalda's privacy policy
 */
const Privacy = () => {
  // Update the title
  document.title = "Nalda | Privacy Policy";

  // Return the privacy policy
  return (
    <div className="container">
      <h4 className="dark-gray-text title marg-top-1 marg-bot-1">
        Privacy policy
      </h4>
      <p>
        Nalda reserves all rights to its application and user data.
      </p>
    </div>
  );
};

// Export the component
export default Privacy;
