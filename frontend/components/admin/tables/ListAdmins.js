import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import Blurb from '../../shared/Blurb';
import Loading from '../../shared/Loading';
import ErrorMessage from '../../shared/ErrorMessage';

class ListAdmins extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pending: true,
      admins: [],
    };
  }

  componentDidMount() {
    axios.get('/api/admin/admins')
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
          admins: res.data.admins,
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
    if (this.state.admins && this.state.admins.length) {
      const admins = this.state.admins.map((admin, i) => (
        <tr key={admin._id}>
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

export default ListAdmins;
