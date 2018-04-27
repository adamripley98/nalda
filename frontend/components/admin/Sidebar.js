// Import frameworks
import React from 'react';
import {Link} from 'react-router-dom';

// Import routes
import {
  adminPath,
  adminArticlesPath,
  adminListingsPath,
  adminVideosPath,
  manageAdminsPath,
  manageHomepagePath,
  adminAdminsPath,
  adminUsersPath,
  adminCuratorsPath,
} from '../../routes';

/**
 * Sidebar for the admin panel
 */
const Sidebar = () => {
  return (
    <div className="col-12 col-md-4 col-lg-3 admin-sidebar">
      <Link to={adminPath} className="link">
        Panel Home
      </Link>
      <Link to={manageHomepagePath} className="link">
        Manage homepage
      </Link>
      <Link to={adminAdminsPath} className="link">
        View all admins
      </Link>
      <Link to={adminCuratorsPath} className="link">
        View all curators
      </Link>
      <Link to={adminUsersPath} className="link">
        View all users
      </Link>
      <Link to={manageAdminsPath} className="link">
        Manage admins
      </Link>
      <Link to={adminArticlesPath} className="link">
        Articles
      </Link>
      <Link to={adminListingsPath} className="link">
        Listings
      </Link>
      <Link to={adminVideosPath} className="link">
        Videos
      </Link>
    </div>
  );
};

// Export the component
export default Sidebar;
