// Import frameworks
import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import uuid from 'uuid-v4';
import { Link, Redirect } from 'react-router-dom';
import moment from 'moment';

// Import components
import Review from './Review';
import ReviewForm from './ReviewForm';
import Loading from '../../shared/Loading';
import Button from '../../shared/Button';
import ListingNotFound from './ListingNotFound';
import Stars from './Stars';
import Carousel from './Carousel';
import ErrorMessage from '../../shared/ErrorMessage';
import Blurb from '../../shared/Blurb';
import Tags from '../../shared/Tags';
import Location from '../Location';
import Amenities from './Amenities';
import AdditionalAmenities from './AdditionalAmenities';
import ListingHeader from './ListingHeader';
import Hours from './Hours';
import ParallaxImage from '../ParallaxImage';

/**
 * Component to render a listing
 */
class Listing extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state with dummy data
    this.state = {
      error: '',
      listing: {},
      pending: true,
      infoTrigger: false,
      canModify: false,
      redirectToHome: false,
      deleteError: "",
      deletePending: false,
      author: {
        name: "",
        _id: "",
        profilePicture: "",
      },
      listingId: '',
    };

    // Bind this to helper methods
    this.renderReviewsSection = this.renderReviewsSection.bind(this);
    this.renderReviews = this.renderReviews.bind(this);
    this.handleClickInfoTrigger = this.handleClickInfoTrigger.bind(this);
    this.updateReviews = this.updateReviews.bind(this);
    this.deleteListing = this.deleteListing.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
    this.deleteReview = this.deleteReview.bind(this);
    this.init = this.init.bind(this);
  }

  // Pull the listing data from the database
  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.init();
    }
  }

  init() {
    // Scroll to the top of the screen
    window.scrollTo(0, 0);

    this.setState({
      pending: true,
    });

    // Find the id in the url
    const id = this.props.match.params.id;

    // Find the listing
    axios.get(`/api/listings/${id}`)
      .then(res => {
        // Set the state
        this.setState({
          error: '',
          listing: res.data.listing,
          reviews: res.data.reviews,
          author: res.data.author,
          time: moment(res.data.timestamp).fromNow(),
          pending: false,
          canModify: res.data.canModify,
          listingId: id,
        });
      })
      .catch(err => {
        if (err && err.response && err.response.status === 404) {
          // If the listing was not found
          this.setState({
            notFound: true,
            pending: false,
          });
        } else {
          // If there was an error making the request
          this.setState({
            error: err,
            pending: false,
          });
        }
      });
  }

  // Helper method to delete specific listing
  deleteListing() {
    // Set the state
    this.setState({
      deletePending: true,
    });

    // Find the id in the url
    const id = this.props.match.params.id;

    // Post to backend
    axios.delete(`/api/listings/${id}`)
      .then(() => {
        // Collapse the modal upon success
        $('#deleteModal').modal('toggle');

        // Update the state and direct the user away
        this.setState({
          redirectToHome: true,
          deletePending: false,
        });
      })
      .catch((err) => {
        this.setState({
          deleteError: err.response.data.error || err.response.data,
          deletePending: false,
        });
      });
  }

  // Helper method which will be called by child component (ReviewForm) to update state
  updateReviews() {
    // Find the listing
    axios.get(`/api/listings/${this.state._id}`)
      .then(res => {
        // Update state with new review
        this.setState({
          error: "",
          listing: res.data.listing,
          reviews: res.data.reviews,
          time: moment(res.data.timestamp).fromNow(),
          pending: false,
        });
      })
      .catch(err => {
        // If there was an error making the request
        this.setState({
          error: err,
          pending: false,
        });
      });
  }

  // Helper method to handle a user clicking on the info trigger
  handleClickInfoTrigger() {
    this.setState({
      infoTrigger: !this.state.infoTrigger,
    });
  }

  // Helper method to handle a user clicking on the info trigger
  handleClickInfoTrigger() {
    this.setState({
      infoTrigger: !this.state.infoTrigger,
    });
  }

  // Helper method to delete reviews
  deleteReview(reviewId) {
    axios.delete('/api/reviews', {
      data: {
        reviewId,
        listingId: this.state.listingId,
      }
    })
      .then(() => {
        this.updateReviews();
      })
      .catch(err => {
        this.setState({
          error: err.response.data.error || err.response.data,
        });
      });
  }

  // Helper method to render the entire reviews section
  renderReviewsSection() {
    // Count the number of reviews
    const count = this.state.reviews.length;

    // Compute the average rating for all reviews
    let average = 0.0;
    this.state.reviews.forEach(review => {
      average += review.rating;
    });
    if (count !== 0) {
      average = average / count;
    }

    // Isolate listingId to pass to ReviewForm
    const _id = this.props.match.params.id;

    // Return the section
    return (
      <div>
        <h5 className="subtitle">
          Reviews
        </h5>
        { /* Give some details about the reviews left on this listing */ }
        <p>
          There { count === 1 ? ("is 1 review") : (`are ${count} reviews`) } on this listing
          {
            (count === 0) ? (".") : (` with an average rating of ${ average.toFixed(1) } out of 5.0 stars.`)
          }
        </p>
        <ReviewForm
          listingId={_id}
          updateReviews={this.updateReviews}
        />
        { this.renderReviews() }
      </div>
    );
  }

  // Helper method to render reviews
  renderReviews() {
    // Check if there are reviews to return
    if (this.state.reviews && this.state.reviews.length) {
      // Reverse reviews so they appear newest to oldest
      const reviews = this.state.reviews.slice(0).reverse();

      // Map each review to be its own component
      return reviews.map(review => (
        <Review
          title={ review.title }
          content={ review.content }
          key={ uuid() }
          reviewId = {review._id}
          createdAt={ review.createdAt }
          rating={ review.rating }
          name={ review.author.name }
          profilePicture = { review.author.profilePicture }
          canChange = {review.canChange }
          deleteReview = {this.deleteReview}
        />
      ));
    }

    // If there are no reviews
    return (
      <Blurb message="No one has reviewed this listing yet! You could be the first." />
    );
  }

  // Helper method to render buttons to edit and delete the listing
  renderButtons() {
    // If the user is authorized to edit the listing
    if (this.state.canModify) {
      return (
        <div className="buttons right marg-bot-1">
          <Link
            className="btn btn-primary btn-sm"
            to={`/listings/${this.state.listingId}/edit`}
          >
            Edit
          </Link>
          <button
            className="btn btn-danger btn-sm"
            type="button"
            data-toggle="modal"
            data-target="#deleteModal"
          >
            Delete
          </button>

          {/* Render the modal to confirm deleting the listing */}
          <div className="modal fade" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="deleteModal" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Delete listing
                  </h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body left">
                  <ErrorMessage error={ this.state.deleteError } />
                  Permanently delete listing? This cannot be un-done.
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                  <button
                    type="button"
                    className={ this.state.deletePending ? "btn btn-danger disabled" : "btn btn-danger" }
                    onClick={ this.deleteListing }
                  >
                    { this.state.deletePending ? "Deleting listing..." : "Delete listing" }
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Else, return nothing
    return null;
  }

  // Render the component
  render() {
    if (this.state.pending) {
      return (<Loading />);
    }

    if (this.state.notFound) return (<ListingNotFound />);

    // Return the component
    return (
      <div className="listing">
        {/* Render the head */}
        <Tags title={this.state.title} description={this.state.description} />

        <ParallaxImage image={this.state.listing.image} />

        { this.state.redirectToHome && <Redirect to="/"/> }

        <div className="container content">
          <div className="row">
            <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-0">
              { this.renderButtons() }

              <ListingHeader
                listing={this.state.listing}
                error={(this.state.error && this.state.error.message) ? this.state.error.message : this.state.error }
                author={this.state.author}
              />

              <Carousel images={this.state.listing.images}/>

              <div className="hidden-lg-up">
                <div className="line" />
                <h5 className="subtitle">
                  Hours
                </h5>
                <Hours hours={this.state.listing.hours} />
              </div>

              <div className="line" />

              <h5 className="subtitle">
                Amenities
              </h5>

              <Amenities amenities={this.state.listing.amenities} />

              <AdditionalAmenities amenities={this.state.listing.AdditionalAmenities} />

              <Location location={this.state.listing && this.state.listing.location  ? this.state.listing.location : {}} />

              <div className="line" />
              { this.renderReviewsSection() }

              { /* Render a back to home button */ }
              <div className="space-1" />
              <Button />
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
                top: this.state.infoTrigger ? (window.innerHeight - document.getElementById('listing-preview').offsetHeight) : (window.innerHeight - 64)
              }}
            >
              <div className="card">
                <i
                  className={
                    this.state.infoTrigger ? (
                      "fa fa-chevron-down hidden-lg-up fa-lg info-trigger"
                    ) : (
                      "fa fa-chevron-down hidden-lg-up fa-lg info-trigger active"
                    )
                  }
                  aria-hidden="true"
                  onClick={ this.handleClickInfoTrigger }
                />
                <h2 className="title">
                  { this.state.listing.title }
                </h2>
                <p className="description">
                  { this.state.listing.description }
                </p>
                {
                  this.state.listing.website && (
                    <a
                      href={ this.state.listing.website }
                      className="website"
                      target="_blank">
                      <i className="fa fa-globe" aria-hidden="true" />
                      &nbsp;
                      Visit website
                    </a>
                  )
                }
                {
                  this.state.listing.price && (
                    <p className="price">
                      <strong>
                        Price:&nbsp;
                      </strong>
                      { this.state.listing.price }
                    </p>
                  )
                }
                {
                  this.state.listing.rating && (
                    <div className="price">
                      <strong>
                        Nalda's Rating:&nbsp;
                      </strong>
                      <Stars rating={ this.state.listing.rating } />
                    </div>
                  )
                }
                {
                  this.state.listing.hours && (
                    <div className="price hidden-md-down">
                      <p>
                        <strong>
                          Hours:&nbsp;
                        </strong>
                      </p>
                      <Hours hours={this.state.listing.hours} />
                    </div>
                  )
                }
              </div>
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

export default Listing;
