// Import frameworks
import React from 'react';
import axios from 'axios';

// Import components
import Loading from '../../shared/Loading';
import ErrorMessage from '../../shared/ErrorMessage';
import Button from '../../shared/Button';
import Preview from '../Preview';

/**
 * Component for the listings of the application
 * TODO filter by amenities
 * TODO filter by open now
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
      currentSort: "date",
      isAscending: false,
    };

    // Bind this to helper methods
    this.sortByRating = this.sortByRating.bind(this);
    this.sortByTitle = this.sortByTitle.bind(this);
    this.sortByPrice = this.sortByPrice.bind(this);
  }

  /**
   * Load listings from Mongo once the component mounts
   */
  componentDidMount() {
    // Update the title
    document.title = "Nalda | Listings";
    
    // Pull data
    axios.get('/api/listings')
      .then((resp) => {
        if (resp.data.success) {
          // If there was no error
          this.setState({
            listings: resp.data.data,
            pending: false,
            error: "",
          });
        } else {
          // If there was an error with the request itself
          this.setState({
            pending: false,
            error: resp.data.error,
          });
        }
      })
      .catch(err => {
        // If there was an error with making the request
        this.setState({
          pending: false,
          error: err,
        });
      });
  }

  /**
   * Helper method to sort listings by title
   */
  sortByTitle() {
    // Define variable
    const sortedListings = Object.assign([], this.state.listings);

    // Sort based on the state of the application
    if (this.state.currentSort === "title") {
      // If already sorted ascending, reverse to show descending
      sortedListings.reverse();

      // Set the state
      this.setState({
        listings: sortedListings,
        isAscending: !this.state.isAscending,
      });
    } else {
      // Sort listings based off title
      sortedListings.sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        } else if (a.title > b.title) {
          return 1;
        }

        // Names must be equal
        return 0;
      });

      // Set the state
      this.setState({
        listings: sortedListings,
        isAscending: false,
        currentSort: "title",
      });
    }
  }

  // Helper method to sort listings by rating
  sortByRating() {
    // Define variable
    const sortedListings = Object.assign([], this.state.listings);

    // Sort based on the state of the application
    if (this.state.currentSort === "rating") {
      // If already sorted ascending, reverse to show descending
      sortedListings.reverse();

      // Set the state
      this.setState({
        listings: sortedListings,
        isAscending: !this.state.isAscending,
      });
    } else {
      // Sort articles based off rating
      sortedListings.sort((a, b) => {
        return a.rating - b.rating;
      });

      // Set the state
      this.setState({
        listings: sortedListings,
        isAscending: false,
        currentSort: "rating",
      });
    }
  }

  // Helper method to sort listings by price
  sortByPrice() {
    // Define variable
    const sortedListings = Object.assign([], this.state.listings);

    // Sort based on the state of the application
    if (this.state.currentSort === "price") {
      // If already sorted ascending, reverse to show descending
      sortedListings.reverse();

      // Set the state
      this.setState({
        listings: sortedListings,
        isAscending: !this.state.isAscending,
      });
    } else {
      // Sort articles based off price
      sortedListings.sort((a, b) => {
        return a.price.length - b.price.length;
      });

      // Set the state
      this.setState({
        listings: sortedListings,
        isAscending: false,
        currentSort: "price",
      });
    }
  }

  /**
   * Method renders each individual listing
   */
  renderListings() {
    // If listings were pulled from the database
    if (this.state.listings && this.state.listings.length) {
      return this.state.listings.map(listing => (
        <Preview
          _id={ listing._id }
          title={ listing.title }
          subtitle={ listing.description }
          image={ listing.image }
          key={ listing._id }
          isListing
        />
      ));
    }

    // If no listings were found
    return (
      <div className="col-12">
        <div className="card pad-1 marg-bot-1 border">
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
        <h3 className="title section-title">
          Listings
        </h3>
        {
          (this.state.listings && this.state.listings.length > 1) ? (
            <div className="sort-options">
              <div
                className={ this.state.currentSort === "title" ? "sort-option active" : "sort-option" }
                onClick={this.sortByTitle}
              >
                Sort by title { this.state.currentSort === "title" ? (
                  this.state.isAscending ? (
                    <i className="fa fa-chevron-up" aria-hidden />
                  ) : (
                    <i className="fa fa-chevron-up rotated" aria-hidden />
                  )
                ) : null }
              </div>
              <div
                className={ this.state.currentSort === "price" ? "sort-option active" : "sort-option" }
                onClick={this.sortByPrice}
              >
                Sort by price { this.state.currentSort === "price" ? (
                  this.state.isAscending ? (
                    <i className="fa fa-chevron-up" aria-hidden />
                  ) : (
                    <i className="fa fa-chevron-up rotated" aria-hidden />
                  )
                ) : null }
              </div>
              <div
                className={ this.state.currentSort === "rating" ? "sort-option active" : "sort-option" }
                onClick={this.sortByRating}
              >
                Sort by rating { this.state.currentSort === "rating" ? (
                  this.state.isAscending ? (
                    <i className="fa fa-chevron-up" aria-hidden />
                  ) : (
                    <i className="fa fa-chevron-up rotated" aria-hidden />
                  )
                ) : null }
              </div>
            </div>
          ) : null
        }

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
