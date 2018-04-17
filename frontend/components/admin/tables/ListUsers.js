import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Blurb from '../../shared/Blurb';

class ListUsers extends Component {
  render() {
    if (this.props.users && this.props.users.length) {
      const users = this.props.users.map((user, i) => (
        <tr key={ user.userId }>
          <th scope="row">
            {i + 1}
          </th>
          <td>
            { user.name }
          </td>
          <td>
            <a href={`mailto:${user.username}`}>{ user.username }</a>
          </td>
        </tr>
      ));

      return (
        <div>
          <h4 className="bold">
            Users
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
              { users }
            </tbody>
          </table>
        </div>
      );
    }
    return (
      <Blurb message="There are no users to display." />
    );
  }
}

ListUsers.propTypes = {
  users: PropTypes.array,
};

export default ListUsers;
