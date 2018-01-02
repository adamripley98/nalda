// Import frameworks
import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import moment from 'moment';
import uuid from 'uuid-v4';
import Review from './Review';
import ReviewForm from './ReviewForm';

/**
 * Component to render a listing
 */
 // TODO: Remove dummy data for amenities, location, reviews
class Listing extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state with dummy data
    this.state = {
      // img: "https://a0.muscache.com/im/pictures/109411642/6fbeaa28_original.jpg?aki_policy=xx_large",
      type: "RESTAURANT",
      // amenities: [
      //   "Pets allowed",
      //   "Family/kid friendly",
      //   "Wifi",
      // ],
      // location: {
      //   lat: 59.95,
      //   lng: 30.33,
      // },
      // user: {
      //   name: "Adam Ripley",
      //   profilePicture: "https://scontent-lga3-1.xx.fbcdn.net/v/t31.0-8/19800933_1555674071163224_6756529645784213707_o.jpg?oh=d3ce5cc19160312229b760b7448d3c67&oe=5A8FEE3B",
      // },
      reviews: [
        {
          name: "Cameron Cabo",
          rating: 0.5,
          title: "This is the title of my review",
          content: "This is the content of my review. I hope you like reading it.",
          createdAt: 1513816681804,
        },
        {
          name: "Adam Ripley",
          rating: 5.0,
          title: "This is a second review",
          content: "This is the content of my review. I hope you like reading it.",
          createdAt: 1513816699243,
        }
      ],
      error: "",
      user: {
        name: "Adam Ripley",
        _id: "81493243t90",
        profilePicture: "https://scontent-lga3-1.xx.fbcdn.net/v/t31.0-8/19800933_1555674071163224_6756529645784213707_o.jpg?oh=d3ce5cc19160312229b760b7448d3c67&oe=5A8FEE3B",
      },
      listing: {},
      pending: true,
    };

    // Bind this to helper methods
    this.renderAmenities = this.renderAmenities.bind(this);
  }

  // Pull the listing data from the database
  componentDidMount() {
    // Find the id in the url
    const id = this.props.match.params.id;

    // Find the listing
    axios.get(`/api/listings/${id}`)
      .then(res => {
        console.log('res data', res.data);
        if (res.data.success) {
          this.setState({
            error: "",
            listing: res.data.data,
            time: moment(res.data.timestamp).fromNow(),
            pending: false,
          });
        } else {
          // If there was an error with the request
          this.setState({
            error: res.data.error,
            pending: false,
          });
        }
      })
      .catch(err => {
        // If there was an error making the request
        this.setState({
          error: err,
          pending: false,
        });
      });
  }

  // Helper method to render amenities
  renderAmenities() {
    if (this.state.amenities) {
      return this.state.amenities.map(amenity => (
        <div className="amenity" key={ uuid() }>
          { amenity }
        </div>
      ));
    }

    // If there are no amentities return nothing
    return null;
  }

  // Helper method to render reviews
  renderReviews() {
    // Check if there are reviews to return
    if (this.state.reviews) {
      return this.state.reviews.map(review => (
        <Review
          title={ review.title }
          content={ review.content }
          key={ uuid() }
          createdAt={ review.createdAt }
          rating={ review.rating }
          name={ review.name }
        />
      ));
    }

    // If there are no reviews
    return (
      <div className="card marg-bot-1">
        No one has reviewed this listing yet! You could be the first.
      </div>
    );
  }

  // Render the component
  render() {
    // Count the number of reviews
    const count = this.state.reviews.length;
    console.log('state', this.state);
    // Compute the average rating for all reviews
    let average = 0.0;
    this.state.reviews.forEach(review => {
      average += review.rating;
    });
    average = average / count;

    // Return the component
    return (
      <div className="listing">
        <div className="background-image preview background-fixed" style={{ backgroundImage: `url(${this.state.listing.image})` }}/>
        <div className="container content">
          <div className="row">
            <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2">
              <div className="header">
                <h1 className="title">
                  { this.state.listing.title }
                </h1>
              </div>
              <p className="description">
                { this.state.listing.description }
              </p>
              <div className="line" />
              <h5 className="subtitle">
                Amenities
              </h5>
              { this.renderAmenities() }
              <div className="line" />
              <h5 className="subtitle">
                Location
              </h5>
              <div className="line" />
              <h5 className="subtitle">
                Reviews
              </h5>
              <p>
                There { count === 1 ? ("is 1 review") : (`are ${count} reviews`) } on this listing with an average rating of { average } out of 5.0 stars.
              </p>
              <ReviewForm />
              { this.renderReviews() }
            </div>
          </div>
        </div>
        <div className="space-2" />
      </div>
    );
  }
}

Listing.propTypes = {
  match: PropTypes.object,
};

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = () => {
  return {};
};

// Redux config
Listing = connect(
    mapStateToProps,
    mapDispatchToProps
)(Listing);

export default Listing;
