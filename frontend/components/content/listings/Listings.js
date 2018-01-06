// Import frameworks
import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loading from '../../shared/Loading';
import ErrorMessage from '../../shared/ErrorMessage';
import Button from '../../shared/Button';

/**
 * Component for the homepage of the application
 */
class Listings extends React.Component {
  /**
   * Constructor method
   */
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      listings: [],
      pending: true,
      error: "",
      titleSortedAscending: false,
      ratingSortedAscending: false,
      priceSortedAscending: false,
    };

    // Bind this to helper methods
    this.sortByRating = this.sortByRating.bind(this);
    this.sortByTitle = this.sortByTitle.bind(this);
    this.sortByPrice = this.sortByPrice.bind(this);
    this.sortByAmenity = this.sortByAmenity.bind(this);
  }

  /**
   * Load listings from Mongo once the component mounts
   */
  componentDidMount() {
    axios.get('/api/listings')
      .then((resp) => {
        if (resp.data.success) {
          this.setState({
            listings: resp.data.data,
            pending: false,
            error: "",
          });
        } else {
          this.setState({
            pending: false,
            error: resp.data.error,
          });
        }
      })
      .catch(err => {
        this.setState({
          pending: false,
          error: err,
        });
      });
  }

  // Helper method to sort listings by title
  sortByTitle() {
    // Define variable
    const sortedListings = Object.assign([], this.state.listings);

    if (!this.state.titleSortedAscending) {
      // Sort articles based off title
      sortedListings.sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        // names must be equal
        return 0;
      });
    } else {
      // If already sorted ascending, reverse to show descending
      sortedListings.reverse();
    }

    // Display sorted articles
    this.setState({
      listings: sortedListings,
      // Toggle
      titleSortedAscending: !this.state.titleSortedAscending,
      // No longer sorted by these features
      ratingSortedAscending: false,
      priceSortedAscending: false,
    });
  }

  // Helper method to sort listings by rating
  sortByRating() {
    // Define variable
    const sortedListings = Object.assign([], this.state.listings);

    if (!this.state.ratingSortedAscending) {
      // Sort articles based off rating
      sortedListings.sort((a, b) => {
        return a.rating - b.rating;
      });
    } else {
      // If already sorted ascending, reverse to show descending
      sortedListings.reverse();
    }

    // Display sorted articles
    this.setState({
      listings: sortedListings,
      // Toggle
      ratingSortedAscending: !this.state.ratingSortedAscending,
      // No longer sorted by these features
      titleSortedAscending: false,
      priceSortedAscending: false,
    });
  }

  // Helper method to sort listings by price
  sortByPrice() {
    // Define variable
    const sortedListings = Object.assign([], this.state.listings);

    if (!this.state.priceSortedAscending) {
      // Sort articles based off price
      sortedListings.sort((a, b) => {
        return a.price.length - b.price.length;
      });
    } else {
      // If already sorted ascending, reverse to show descending
      sortedListings.reverse();
    }

    // Display sorted articles
    this.setState({
      listings: sortedListings,
      // Toggle
      priceSortedAscending: !this.state.priceSortedAscending,
      // No longer sorted by these features
      titleSortedAscending: false,
      ratingSortedAscending: false,
    });
  }

  // Helper method to sort by amenity
  // TODO: Implement. Make popup menu with all the different options
  sortByAmenity() {

  }

  /**
   * Method renders each individual listing
   */
  renderListings() {
    // If listings were pulled from the database
    if (this.state.listings && this.state.listings.length) {
      return this.state.listings.map((listing) => (
        <div className="col-6 col-lg-4 col-xl-3" key={ listing._id } >
          <Link to={ `/listings/${listing._id}` } >
            <div className="article-preview">
              <img className="img-fluid" alt={listing.title} src={listing.image} />
              <h2 className="title">
                {listing.title}
              </h2>
              <h6 className="subtitle">
                {listing.description}
              </h6>
            </div>
          </Link>
        </div>
      ));
    }

    // If no listings were found
    return (
      <div className="col-12">
        <div className="card pad-1 marg-bot-1">
          No listings were found. Check back soon for more content!
        </div>
      </div>
    );
  }

  /**
   * Function to render the component
   */
  render() {
    return (
      <div className="container home">
        <div className="space-1"/>
        <h3 className="title">
          Listings
        </h3>
        <div onClick={this.sortByTitle}>Sort by title</div>
        <div onClick={this.sortByPrice}>Sort by price</div>
        <div onClick={this.sortByRating}>Sort by rating</div>
        <div onClick={this.sortByAmenity}>Sort by amenity</div>
        <div className="row">
          {
            this.state.pending ? (
              <Loading />
            ) : (
              this.state.error ? (
                <ErrorMessage error={ this.state.error } />
              ) : (
                this.renderListings()
              )
            )
          }
          {
            !this.state.pending && (
              <div className="col-12 marg-top-1">
                <Button />
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default Listings;
