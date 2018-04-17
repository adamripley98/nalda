import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import Blurb from '../../shared/Blurb';

class ListAdmins extends Component {
  render() {
    if (this.props.admins && this.props.admins.length) {
      const admins = this.props.admins.map((admin, i) => (
        <tr key={admin.userId}>
          <th scope="row">
            {i + 1}
          </th>
          <td>
            <Link to={`/users/${admin.userId}`}>
              {admin.name}
            </Link>
          </td>
          <td>
            <a href={`mailto:${admin.username}`}>
              {admin.username}
            </a>
          </td>
        </tr>
      ));

      return (
        <div>
          <h4 className="bold">
            Admins
          </h4>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
              </tr>
            </thead>
            <tbody>
              { admins }
            </tbody>
          </table>
        </div>
      );
    }
    return (
      <Blurb message="There are no admins to show." />
    );
  }
}

ListAdmins.propTypes = {
  admins: PropTypes.array,
};

export default ListAdmins;
