// Import frameworks
import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import moment from 'moment';
import uuid from 'uuid-v4';
import { Link, Redirect} from 'react-router-dom';

// Import components
import Review from './Review';
import ReviewForm from './ReviewForm';
import Loading from '../../shared/Loading';
import Button from '../../shared/Button';
import NotFoundSection from '../../NotFoundSection';
import Stars from './Stars';
import Carousel from './Carousel';
import ErrorMessage from '../../shared/ErrorMessage';
import Blurb from '../../shared/Blurb';
import Tags from '../../shared/Tags';
import Location from './Location';
import AdditionalAmenities from './AdditionalAmenities';
import ListingHeader from './ListingHeader';

// Import SVGs
import CashOnly from '../../../assets/images/cash-only.svg';
import Formal from '../../../assets/images/formal.svg';
import OutdoorSeating from '../../../assets/images/outdoor-seating.svg';
import Parking from '../../../assets/images/parking.svg';
import Reservation from '../../../assets/images/reservation.svg';
import Waiter from '../../../assets/images/waiter.svg';
import Wifi from '../../../assets/images/wifi.svg';
import Wink from '../../../assets/images/wink.svg';

// Import json
import amenityMap from '../../json/amenityMap';

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
    this.renderAmenities = this.renderAmenities.bind(this);
    this.renderReviewsSection = this.renderReviewsSection.bind(this);
    this.renderReviews = this.renderReviews.bind(this);
    this.handleClickInfoTrigger = this.handleClickInfoTrigger.bind(this);
    this.updateReviews = this.updateReviews.bind(this);
    this.deleteListing = this.deleteListing.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
    this.areHours = this.areHours.bind(this);
    this.deleteReview = this.deleteReview.bind(this);
  }

  // Pull the listing data from the database
  componentDidMount() {
    // Scroll to the top of the screen
    window.scrollTo(0, 0);

    // Find the id in the url
    const id = this.props.match.params.id;

    // Find the listing
    axios.get(`/api/listings/${id}`)
      .then(res => {
        if (res.data.success) {
          // Set the state
          this.setState({
            error: '',
            listing: res.data.data,
            reviews: res.data.reviews,
            author: res.data.author,
            time: moment(res.data.timestamp).fromNow(),
            pending: false,
            canModify: res.data.canModify,
            listingId: id,
          });

          // If there is a location
          if (res.data.data.location.lng && res.data.data.location.lat) {
            $(document).ready(() => {
              var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 17,
                center: res.data.data.location,
              });
              var marker = new google.maps.Marker({
                position: res.data.data.location,
                map: map
              });
            });
          }
        } else {
          // If there was an error with the request
          this.setState({
            error: res.data.error,
            pending: false,
          });
        }
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

    // Style parallax scrolling
    $(document).ready(() => {
      $(window).scroll(() => {
        const pos = - $(window).scrollTop() / 4;
        $('#parallax').css("transform", `translateY(${pos}px)`);
      });
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
        if (res.data.success) {
          // Update state with new review
          this.setState({
            error: "",
            listing: res.data.data,
            reviews: res.data.reviews,
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

  /**
   * Helper method to render amenities
   */
  renderAmenities() {
    const amenities = this.state.listing.amenities;

    // If amenities are in the state (this should always be the case)
    if (amenities) {
      const keys = Object.keys(amenities);

      // Map from keys to svgs
      const svgMap = {
        outdoorSeating: <OutdoorSeating />,
        wifi: <Wifi />,
        formal: <Formal />,
        cashOnly: <CashOnly />,
        parking: <Parking />,
        reservation: <Reservation />,
        wink: <Wink />,
        waiter: <Waiter />,
      };

      // Return an amenity div tag for each amenity which is true in the state
      // That is, if the curator marked that the listing has said amenity
      return keys.map(key => (
        amenities[key] ? (
          <div className="amenity" key={ key }>
            { svgMap[key] }
            { amenityMap[key] }
          </div>
        ) : null
      ));
    }

    // If there are no amentities
    return (
      <Blurb message="No amenities have been marked for this listing." />
    );
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

  // Helper method to convert from military to normal time
  formatHours(hour) {
    return moment(hour, 'HH:mm').format('h:mm a');
  }

  // Helper method to check if there are hours
  areHours() {
    // Isolate variable
    const hours = this.state.listing.hours;

    // Check to see if any hour is populated
    const keys = Object.keys(hours);

    const reducer = (acc, curr) => {
      if (acc) return true;
      const dayObj = hours[curr];
      return !!(dayObj.start && dayObj.finish);
    };

    return keys.reduce(reducer, false);
  }

  // Helper method to render Hours
  renderHours() {
    // Isolate variable
    const hours = this.state.listing.hours;

    // If hours are entered, display them
    if (this.areHours()) {
      return (
        // If a date has a start and end time, it will be displayed
        <table className="table">
          <tbody>
            {
              (hours.monday.start && hours.monday.finish) ? (
                <tr>
                  <td>
                    Monday
                  </td>
                  <td>
                    {this.formatHours(hours.monday.start)} - {this.formatHours(hours.monday.finish)}
                  </td>
                </tr>
              ) : null
            }
            {
              (hours.tuesday.start && hours.tuesday.finish) ? (
                <tr>
                  <td>
                    Tuesday
                  </td>
                  <td>
                    {this.formatHours(hours.tuesday.start)} - {this.formatHours(hours.tuesday.finish)}
                  </td>
                </tr>
              ) : null
            }
            {
              (hours.wednesday.start && hours.wednesday.finish) ? (
                <tr>
                  <td>
                    Wednesday
                  </td>
                  <td>
                    {this.formatHours(hours.wednesday.start)} - {this.formatHours(hours.wednesday.finish)}
                  </td>
                </tr>
              ) : null
            }
            {
              (hours.thursday.start && hours.thursday.finish) ? (
                <tr>
                  <td>
                    Thursday
                  </td>
                  <td>
                    {this.formatHours(hours.thursday.start)} - {this.formatHours(hours.thursday.finish)}
                  </td>
                </tr>
              ) : null
            }
            {
              (hours.friday.start && hours.friday.finish) ? (
                <tr>
                  <td>
                    Friday
                  </td>
                  <td>
                    {this.formatHours(hours.friday.start)} - {this.formatHours(hours.friday.finish)}
                  </td>
                </tr>
              ) : null
            }
            {
              (hours.saturday.start && hours.saturday.finish) ? (
                <tr>
                  <td>
                    Saturday
                  </td>
                  <td>
                    {this.formatHours(hours.saturday.start)} - {this.formatHours(hours.saturday.finish)}
                  </td>
                </tr>
              ) : null
            }
            {
              (hours.sunday.start && hours.sunday.finish) ? (
                <tr>
                  <td>
                    Sunday
                  </td>
                  <td>
                    {this.formatHours(hours.sunday.start)} - {this.formatHours(hours.sunday.finish)}
                  </td>
                </tr>
              ) : null
            }
          </tbody>
        </table>
      );
    }

    // If there are no hours
    return (
      <div>
        <p className="gray-text">
          Hours are not published for this listing.
        </p>
      </div>
    );
  }

  // Render the component
  render() {
    if (this.state.pending) {
      return (<Loading />);
    }

    if (this.state.notFound) {
      return (
        <NotFoundSection
          title="Listing not found"
          content="Uh-oh! Looks like the listing you were looking for was either removed or does not exist."
          url="/listings"
          urlText="Back to all listings"
        />
      );
    }

    // Return the component
    return (
      <div className="listing">
        {/* Render the head */}
        <Tags title={this.state.title} description={this.state.description} />

        <div className="parallax-wrapper">
          <div className="background-image img" style={{backgroundImage: `url(${this.state.listing.image})`}} id="parallax" />
        </div>

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
                { this.renderHours() }
              </div>

              <div className="line" />

              <h5 className="subtitle">
                Amenities
              </h5>

              { this.renderAmenities() }

              <AdditionalAmenities amenities={this.state.listing.AdditionalAmenities} />

              <Location location={this.state.listing.location || {}} />

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
                      { this.renderHours() }
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
