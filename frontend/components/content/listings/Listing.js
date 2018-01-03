// Import frameworks
import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import moment from 'moment';
import uuid from 'uuid-v4';
import Review from './Review';
import ReviewForm from './ReviewForm';
import Loading from '../../shared/Loading';
import NotFoundSection from '../../NotFoundSection';
import { Link } from 'react-router-dom';

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
      img: "",
      title: "",
      description: "",
      website: "",
      price: "",
      amenities: {},
      location: {},
      user: {
        name: "Adam Ripley",
        profilePicture: "https://scontent-lga3-1.xx.fbcdn.net/v/t31.0-8/19800933_1555674071163224_6756529645784213707_o.jpg?oh=d3ce5cc19160312229b760b7448d3c67&oe=5A8FEE3B",
      },
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
      pending: true,
      infoTrigger: false,
    };

    // Bind this to helper methods
    this.renderAmenities = this.renderAmenities.bind(this);
    this.renderReviewsSection = this.renderReviewsSection.bind(this);
    this.renderReview = this.renderReviews.bind(this);
    this.handleClickInfoTrigger = this.handleClickInfoTrigger.bind(this);
  }

  // Pull the listing data from the database
  componentDidMount() {
    // Find the id in the url
    const id = this.props.match.params.id;

    // Find the listing
    axios.get(`/api/listings/${id}`)
      .then(res => {
        if (res.data.success) {
          this.setState({
            error: "",
            ...res.data.data,
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
    // If amenities are in the state (this should always be the case)
    if (this.state.amenities && Object.keys(this.state.amenities).length) {
      // Get all keys from the amenities object
      const keys = Object.keys(this.state.amenities);

      // Map from amenities to properly formatted text
      const map = {
        foodTrucks: "Food truck",
        lateNights: "Late nights",
        healthy: "Healthy",
        forTheSweetTooth: "For the sweet tooth",
        forTheStudyGrind: "For the study grind",
        openLate: "It's midnight and I'm hungry",
        parentsVisiting: "Parents visiting!!??",
        gotPlasteredLastNight: "Got plastered last night",
        bars: "Bars",
        byos: "BYO",
        speakeasies: "Speakeasies",
        dateNight: "Date night",
        formals: "Formals",
        birthdays: "Birthdays",
        treatYourself: "Treat yourself",
        adulting: "#adulting",
        feelingLazy: "Feeling lazy",
        holeInTheWall: "Hole in the wall",
        showoffToYourFriends: "Show off to your friends",
        forTheGram: "#forTheGram",
      };

      // Return an amenity div tag for each amenity which is true in the state
      // That is, if the curator marked that the listing has said amenity
      return keys.map(amenity => (
        this.state.amenities[amenity] ? (
          <div className="amenity" key={ amenity }>
            { map[amenity] }
          </div>
        ) : null
      ));
    }

    // If there are no amentities return nothing
    return (
      <div className="card pad-1 marg-bot-1">
        No amenities have been marked for this listing.
      </div>
    );
  }

  // Helper method to handle a user clicking on the info trigger
  handleClickInfoTrigger() {
    this.setState({
      infoTrigger: !this.state.infoTrigger,
    });
  }

  // Helper method to render the entire reviews section
  renderReviewsSection() {
    // Count the number of reviews
    const count = this.state.reviews.length;
    console.log('state', this.state);

    // Compute the average rating for all reviews
    let average = 0.0;
    this.state.reviews.forEach(review => {
      average += review.rating;
    });
    average = average / count;

    // Return the section
    return (
      <div>
        <h5 className="subtitle">
          Reviews
        </h5>
        <p>
          There { count === 1 ? ("is 1 review") : (`are ${count} reviews`) } on this listing with an average rating of { average } out of 5.0 stars.
        </p>
        <ReviewForm />
        { this.renderReviews() }
      </div>
    );
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
    // Return the component
    return (
      this.state.pending ? (
        <Loading />
      ) : (
        this.state.error ? (
          <NotFoundSection
            title="Listing not found"
            content="Uh-oh! Looks like the listing you were looking for was either removed or does not exist."
            url="/listings"
            urlText="Back to all listings"
          />
        ) : (
          <div className="listing">
            <div
              className="background-image preview background-fixed"
              style={{ backgroundImage: `url(${this.state.image})` }}
            />
            <div className="container content">
              <div className="row">
                {/* Contains details about the listing */}
                <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-0">
                  <div className="header">
                    <h1 className="title">
                      { this.state.title }
                    </h1>
                  </div>
                  <p className="description">
                    { this.state.description }
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
                  { this.renderReviewsSection() }
                </div>

                {/* Contains overview aboute the listing */}
                <div
                  id="listing-preview"
                  className={
                    this.state.infoTrigger ? (
                      "col-12 col-lg-4 listing-preview active"
                    ) : (
                      "col-12 col-lg-4 listing-preview"
                    )
                  }
                  style={{
                    bottom: this.state.infoTrigger ? (- document.getElementById('listing-preview').offsetHeight + 64) : 0
                  }}
                >
                  <div className="card">
                    <i
                      className={
                        this.state.infoTrigger ? (
                          "fa fa-chevron-down hidden-lg-up fa-lg info-trigger active"
                        ) : (
                          "fa fa-chevron-down hidden-lg-up fa-lg info-trigger"
                        )
                      }
                      aria-hidden="true"
                      onClick={ this.handleClickInfoTrigger }
                    />
                    <h2>
                      { this.state.title }
                    </h2>
                    {
                      this.state.website && (
                        <Link to={ this.state.website }>
                          <i className="fa fa-globe" aria-hidden="true" />
                          &nbsp;
                          {
                            this.state.website.length > 18 ? (
                              this.state.website.substring(0, 18) + "..."
                            ) : (
                              this.state.website
                            )
                          }
                        </Link>
                      )
                    }
                    {
                      this.state.price && (
                        <p className="price">
                          <strong>
                            Price:&nbsp;
                          </strong>
                          { this.state.price }
                        </p>
                      )
                    }
                    <p className="description">
                      { this.state.description }
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-2" />
          </div>
        )
      )
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
