// Import frameworks
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Sidebar for the admin panel
 */
const Sidebar = ({ cb }) => {
  return (
    <div className="col-12 col-md-4 col-lg-3 admin-sidebar">
      <div className="link" onClick={() => cb("admins")}>View all admins</div>
      <div className="link" onClick={() => cb("curators")}>View all curators</div>
      <div className="link" onClick={() => cb("users")}>View all users</div>
      <div className="link" onClick={() => cb("manage-admins")}>Manage admins</div>
    </div>
  );
};

// Prop validations
Sidebar.propTypes = {
  cb: PropTypes.func,
};

export default Sidebar;
