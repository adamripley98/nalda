// Import frameworks
import React, { Component } from 'react';

/**
 * Component for Admin only, allows them to add and remove other admins and content curators
 */
class Admin extends Component {
  // Render the component
  render() {
    return (
      <div>
        <h4>
          Admin panel
        </h4>
        Welcome to the admin panel; through this portion of the application you can keep track of your user base, recommended content, and created content.
      </div>
    );
  }
}

export default Admin;
