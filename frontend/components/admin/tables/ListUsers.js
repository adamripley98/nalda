import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Blurb from '../../shared/Blurb';
import Loading from '../../shared/Loading';
import ErrorMessage from '../../shared/ErrorMessage';

class ListUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pending: true,
      users: [],
    };
  }

  componentDidMount() {
    axios.get('/api/users')
      .then(res => {
        if (!res.data.success) {
          this.setState({
            pending: false,
            error: res.data.error,
          });
          return;
        }
        this.setState({
          pending: false,
          users: res.data.users,
        });
      })
      .catch(err => {
        this.setState({
          pending: false,
          error: err.message,
        });
      });
  }

  render() {
    if (this.state.pending) return (<Loading />);
    if (this.state.error) return (<ErrorMessage error={this.state.error} />);
    if (this.state.users && this.state.users.length) {
      const users = this.state.users.map((user, i) => (
        <tr key={user._id}>
          <th scope="row">
            {i + 1}
          </th>
          <td>
            { user.name }
          </td>
          <td>
            <a href={`mailto:${user.username}`}>
              {user.username}
            </a>
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
