import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import Blurb from '../../shared/Blurb';
import Loading from '../../shared/Loading';

class ListAdmins extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pending: true,
      admins: [],
    };
  }

  componentDidMount() {
    // TODO
  }

  render() {
    if (this.state.pending) return (<Loading />);
    if (this.state.admins && this.state.admins.length) {
      const admins = this.state.admins.map((admin, i) => (
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
