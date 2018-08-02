import React, {Component} from 'react';
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
    axios.get('/api/admin/users')
      .then(res => {
        this.setState({
          pending: false,
          users: res.data.users,
        });
      })
      .catch(error => {
        this.setState({
          pending: false,
          error,
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

export default ListUsers;
