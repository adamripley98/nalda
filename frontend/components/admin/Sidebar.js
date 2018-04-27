// Import frameworks
import React, {Component} from 'react';
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
class Sidebar extends Component {
  renderLink(path, text) {
    return (
      <Link to={path} className="link">
        {text}
      </Link>
    );
  }

  render() {
    return (
      <div className="col-12 col-md-4 col-lg-3 admin-sidebar">
        {this.renderLink(adminPath, 'Panel home')}
        {this.renderLink(manageHomepagePath, 'Manage homepage')}
        {this.renderLink(manageAdminsPath, 'Manage admins')}
        {this.renderLink(adminAdminsPath, 'View all admins')}
        {this.renderLink(adminCuratorsPath, 'View all curators')}
        {this.renderLink(adminUsersPath, 'View all users')}
        {this.renderLink(adminArticlesPath, 'Articles')}
        {this.renderLink(adminListingsPath, 'Listings')}
        {this.renderLink(adminVideosPath, 'Videos')}
      </div>
    );
  }
}

// Export the component
export default Sidebar;
