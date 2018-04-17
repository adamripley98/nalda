import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Blurb from '../../shared/Blurb';
import {Link} from 'react-router-dom';

class ListCurators extends Component {
  render() {
    if (this.props.curators && this.props.curators.length) {
      const curators = this.props.curators.map((curator, i) => (
        <tr key={ curator.userId }>
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
