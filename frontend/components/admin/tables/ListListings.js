import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import Blurb from '../../shared/Blurb';

class ListListings extends Component {
  render() {
    if (this.props.listings && this.props.listings.length) {
      const listings = this.props.listings.map((listing, i) => (
        <tr key={ listing._id }>
          <th scope="row">
            {i + 1}
          </th>
          <td>
            <Link to={`/listings/${listing._id}`}>
              { listing.title }
            </Link>
          </td>
          <td>
            {
              listing._id
            }
          </td>
        </tr>
      ));

      return (
        <div>
          <h4 className="bold">
            Listings
          </h4>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Listing ID</th>
              </tr>
            </thead>
            <tbody>
              { listings }
            </tbody>
          </table>
        </div>
      );
    }
    return (
      <Blurb message="There are no listings to display." />
    );
  }
}

ListListings.propTypes = {
  listings: PropTypes.array,
};

export default ListListings;
