import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Blurb from '../../shared/Blurb';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Loading from '../../shared/Loading';
import ErrorMessage from '../../shared/ErrorMessage';

class ListCurators extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pending: true,
      curators: [],
    };
  }

  componentDidMount() {
    axios.get('/api/curators')
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
          curators: res.data.curators,
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
    if (this.state.curators && this.state.curators.length) {
      const curators = this.state.curators.map((curator, i) => (
        <tr key={curator._id}>
          <th scope="row">
            {i + 1}
          </th>
          <td>
            <Link to={`/users/${curator.userId}`}>
              {curator.name}
            </Link>
          </td>
          <td>
            <a href={`mailto:${curator.username}`}>{ curator.username }</a>
          </td>
        </tr>
      ));

      return (
        <div>
          <h4 className="bold">
            Curators
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
              { curators }
            </tbody>
          </table>
        </div>
      );
    }
    return (
      <Blurb message="There are no curators to display." />
    );
  }
}

ListCurators.propTypes = {
  curators: PropTypes.array,
};

export default ListCurators;
