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
import Author from '../../shared/Author';
import Blurb from '../../shared/Blurb';
import Tags from '../../shared/Tags';

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
import categoryMap from '../../json/categoryMap';
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
      _id: '',
      image: "",
      images: [],
      title: "",
      description: "",
      naldaFavorite: "",
      website: "",
      price: "",
      categories: {},
      amenities: {},
      additionalAmenities: [],
      location: {
        name: "",
        lat: null,
        lng: null,
      },
      reviews: [],
      error: "",
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
    this.renderAdditionalAmenities = this.renderAdditionalAmenities.bind(this);
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
    window.scrollTo(0, 0);
    // Find the id in the url
    const id = this.props.match.params.id;

    // Find the listing
    axios.get(`/api/listings/${id}`)
      .then(res => {
        if (res.data.success) {
          // Set the state
          this.setState({
            error: "",
            ...res.data.data,
            reviews: res.data.reviews,
            author: res.data.author,
            time: moment(res.data.timestamp).fromNow(),
            pending: false,
            canModify: res.data.canModify,
            listingId: id,
          });

          // If there is a location
          if (res.data.data.location.lng && res.data.data.location.lat) {
            $(document).ready(function() {
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
        if (err.response.status === 404) {
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
    .then(resp => {
      if (resp.data.success) {
        // If the request was successful
        // Collapse the modal upon success
        $('#deleteModal').modal('toggle');

        // Update the state and direct the user away
        this.setState({
          redirectToHome: true,
          deletePending: false,
        });
      } else {
        this.setState({
          deleteError: resp.data.error,
          deletePending: false,
        });
      }
    })
    .catch((err) => {
      this.setState({
        deleteError: err,
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
            ...res.data.data,
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
   * Helper method to render categories
   */
  renderCategories() {
    // If there are categories to display
    if (this.state.categories) {
      // Get all keys from the object
      const keys = Object.keys(this.state.categories);

      // If there are any keys
      if (keys.length) {
        // Return an category div tag for each category which is true in the state
        // That is, if the curator marked that the listing has said category
        return keys.map(category => (
          this.state.categories[category] ? (
            <div className="category" key={ category }>
              { categoryMap[category] ? categoryMap[category] : category }
            </div>
          ) : null
        ));
      }
      return null;
    }

    // If there are no categories
    return (null);
  }

  /**
   * Helper method to render amenities
   */
  renderAmenities() {
    // If amenities are in the state (this should always be the case)
    if (this.state.amenities) {
      const keys = Object.keys(this.state.amenities);

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
        this.state.amenities[key] ? (
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

  // Helper method to delete reviews
  deleteReview(reviewId) {
    axios.post('/api/reviews/delete', {
      reviewId,
      listingId: this.state.listingId,
    })
    .then((resp) => {
      if (resp.data.success) {
        this.updateReviews();
      } else {
        this.setState({
          error: resp.data.error,
        });
      }
    })
    .catch((err) => {
      this.setState({
        error: err,
      });
    });
  }

  /**
   * Helper method to render additional amenities
   */
  renderAdditionalAmenities() {
    // If amenities are in the state (this should always be the case)
    if (this.state.additionalAmenities && this.state.additionalAmenities.length) {
      // Return an amenity div tag for each amenity which is true in the state
      // That is, if the curator marked that the listing has said amenity
      return this.state.additionalAmenities.map(amenity => (
        <div className="amenity no-icon" key={ amenity }>
          { amenity }
        </div>
      ));
    }

    // If there are no additional amenities
    return null;
  }

  // Helper method to handle a user clicking on the info trigger
  handleClickInfoTrigger() {
    this.setState({
      infoTrigger: !this.state.infoTrigger,
    });
  }

  // Helper method to delete reviews
  deleteReview(reviewId) {
    axios.post('/api/reviews/delete', {
      reviewId,
      listingId: this.state.listingId,
    })
    .then((resp) => {
      if (resp.data.success) {
        this.updateReviews();
      } else {
        this.setState({
          error: resp.data.error,
        });
      }
    })
    .catch((err) => {
      this.setState({
        error: err,
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
            to={`/listings/${this.state._id}/edit`}
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
    // Check to see if any hour is populated
    const keys = Object.keys(this.state.hours);
    const reducer = (acc, curr) => (acc ? true : !!(curr.start && curr.finish));
    return keys.reduce(reducer, false);
  }

  // Helper method to render Hours
  renderHours() {
    // Isolate variable
    const hours = this.state.hours;
    // If hours are entered, display them
    if (this.areHours()) {
      return (
        // If a date has a start and end time, it will be displayed
        <table className="table">
          <tbody>
            {
              (hours.monday.start && hours.monday.finish) && (
                <tr>
                  <td>
                    Monday
                  </td>
                  <td>
                    {this.formatHours(hours.monday.start)} - {this.formatHours(hours.monday.finish)}
                  </td>
                </tr>
              )
            }
            {
              (hours.tuesday.start && hours.tuesday.finish) && (
                <tr>
                  <td>
                    Tuesday
                  </td>
                  <td>
                    {this.formatHours(hours.tuesday.start)} - {this.formatHours(hours.tuesday.finish)}
                  </td>
                </tr>
              )
            }
            {
              (hours.wednesday.start && hours.wednesday.finish) && (
                <tr>
                  <td>
                    Wednesday
                  </td>
                  <td>
                    {this.formatHours(hours.wednesday.start)} - {this.formatHours(hours.wednesday.finish)}
                  </td>
                </tr>
              )
            }
            {
              (hours.thursday.start && hours.thursday.finish) && (
                <tr>
                  <td>
                    Thursday
                  </td>
                  <td>
                    {this.formatHours(hours.thursday.start)} - {this.formatHours(hours.thursday.finish)}
                  </td>
                </tr>
              )
            }
            {
              (hours.friday.start && hours.friday.finish) && (
                <tr>
                  <td>
                    Friday
                  </td>
                  <td>
                    {this.formatHours(hours.friday.start)} - {this.formatHours(hours.friday.finish)}
                  </td>
                </tr>
              )
            }
            {
              (hours.saturday.start && hours.saturday.finish) && (
                <tr>
                  <td>
                    Saturday
                  </td>
                  <td>
                    {this.formatHours(hours.saturday.start)} - {this.formatHours(hours.saturday.finish)}
                  </td>
                </tr>
              )
            }
            {
              (hours.sunday.start && hours.sunday.finish) && (
                <tr>
                  <td>
                    Sunday
                  </td>
                  <td>
                    {this.formatHours(hours.sunday.start)} - {this.formatHours(hours.sunday.finish)}
                  </td>
                </tr>
              )
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
    // Return the component
    return (
      this.state.pending ? (
        <Loading />
      ) : (
        this.state.notFound ? (
          <NotFoundSection
            title="Listing not found"
            content="Uh-oh! Looks like the listing you were looking for was either removed or does not exist."
            url="/listings"
            urlText="Back to all listings"
          />
        ) : (
          <div className="listing">
            {/* Render the head */}
            <Tags title={this.state.title} description={this.state.naldaFavorite}/>

            <div className="parallax-wrapper">
              {/* <img src={ this.state.image } alt={ this.state.title } className="img-fluid" id="parallax" /> */}
              <div className="background-image img" style={{backgroundImage: `url(${this.state.image})`}} id="parallax" />
            </div>

            { this.state.redirectToHome && <Redirect to="/"/> }

            <div className="container content">
              <div className="row">
                {/* Contains details about the listing */}
                <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-0">
                  {/* Render buttons to edit or delete the listing if the user has permission */}
                  { this.renderButtons() }

                  <div className="header">
                    <h1 className="title">
                      { this.state.title }
                    </h1>
                    <Author
                      createdAt={ this.state.createdAt }
                      updatedAt={ this.state.updatedAt }
                      name={ this.state.author.name }
                      _id={ this.state.author._id }
                      profilePicture={ this.state.author.profilePicture }
                    />
                    <ErrorMessage error={this.state.error} />
                  </div>
                  <div className="categories">
                    { this.renderCategories() }
                  </div>
                  <p className="naldaFavorite">
                    <strong>
                      Nalda's favorite:
                    </strong>
                    <br />
                    { this.state.naldaFavorite }
                  </p>
                  <Carousel images={this.state.images}/>
                  {
                    this.state.hours && (
                      <div className="hidden-lg-up">
                        <div className="line" />
                        <h5 className="subtitle">
                          Hours
                        </h5>
                        { this.renderHours() }
                      </div>
                    )
                  }
                  <div className="line" />
                  <h5 className="subtitle">
                    Amenities
                  </h5>
                  { this.renderAmenities() }
                  { this.renderAdditionalAmenities() }

                  {
                    (
                      this.state.location.name &&
                      this.state.location.lat &&
                      this.state.location.lng
                    ) ? (
                      <div>
                        <div className="line" />
                        <h5 className="subtitle">
                          Location
                        </h5>
                        <p className="marg-bot-1">
                          { this.state.location.name }
                        </p>
                        <div id="map" />
                      </div>
                    ) : null
                  }

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
                    <h2>
                      { this.state.title }
                    </h2>
                    <p className="description">
                      { this.state.description }
                    </p>
                    {
                      this.state.website && (
                        <Link to={ this.state.website } className="website">
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
                    {
                      this.state.rating && (
                        <div className="price">
                          <strong>
                            Nalda's Rating:&nbsp;
                          </strong>
                          <Stars rating={ this.state.rating } />
                        </div>
                      )
                    }
                    {
                      this.state.hours && (
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
        )
      )
    );
  }
}

Listing.propTypes = {
  match: PropTypes.object,
};

export default Listing;
