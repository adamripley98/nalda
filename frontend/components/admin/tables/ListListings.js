import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Blurb from '../../shared/Blurb';
import Loading from '../../shared/Loading';
import ErrorMessage from '../../shared/ErrorMessage';

class ListListings extends Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      pending: true,
      listings: [],
      error: "",
    };
  }

  // Pull data
  componentDidMount() {
    axios.get('/api/admin/listings')
      .then(res => {
        this.setState({
          pending: false,
          listings: res.data.listings,
        });
      })
      .catch(err => this.setState({ error: 'Error pulling listings.' }));
  }

  // Render the table
  render() {
    if (this.state.pending) return (<Loading />);
    if (this.state.error) return (<ErrorMessage error={this.state.error} />);
    if (this.state.listings && this.state.listings.length) {
      const listings = this.state.listings.map((listing, i) => (
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
              {listings}
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

export default ListListings;
