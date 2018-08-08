// Import frameworks
import React from 'react';
// import autosize from 'autosize';
import { Link, Redirect } from 'react-router-dom';
// import axios from 'axios';
import Dropzone from 'react-dropzone';
// import uuid from 'uuid-v4';
// import async from 'async';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
// import EXIF from 'exif-js';

// Import components
import ErrorMessage from '../../shared/ErrorMessage';
import Medium from '../../shared/Medium';
import Tags from '../../shared/Tags';

// Import helper functions
// import {processImg, getTargetSize} from '../../../helperMethods/imageUploading';

// Import actions
import {notifyMessage} from '../../../actions/notification';

/**
 * Component to render the new listing form
 */
class EventForm extends React.Component {
  /**
   * Constructor method
   */
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      location: "",
      image: "",
      images: [],
      imagePreview: "",
      price: "$",
      error: "",
      listingId: "",
      redirectToHome: "",
      website: "",
      categories: {
        nightTime: false,
        concerts: false,
        dateNights: false,
      },
      requirements: [],
      date: "",
      pending: false,
    };
  }

  /**
   * Render the component
   */
  render() {
    return (
      <div>
        <Tags title="New Event" />
        { this.state.redirectToHome && <Redirect to={`/events/${this.state.eventId}`}/> }
        <Medium>
          <div className="card thin-form no-pad">
            <div className="tabs">
              <Link className="tab" to="/articles/new">Article</Link>
              <Link className="tab" to="/listings/new">Listing</Link>
              <Link className="tab active" to="/events/new">Event</Link>
              <Link className="tab" to="/videos/new">Video</Link>
            </div>
            <form className="pad-1" onSubmit={ this.handleSubmit }>
              <ErrorMessage error={ this.state.error } />
              <label>
                Title
              </label>
              <input
                name="title"
                type="text"
                className="form-control marg-bot-1"
                value={ this.state.title }
                onChange={ this.handleChangeTitle }
              />
              <label>
                Hero Image
              </label>

              {
                this.state.imagePreview && (
                  <img src={ this.state.imagePreview } alt={ this.state.title } className="img-fluid img" />
                )
              }

              <Dropzone
                onDrop={(acceptedFiles, rejectedFiles) => this.onDrop(acceptedFiles, rejectedFiles, "hero")}
                accept="image/*"
                style={{ marginBottom: "1rem" }}
                >
                <p className="dropzone">
                  <i className="fa fa-file-o" aria-hidden="true" />
                  {
                    this.state.imageName ? (
                      this.state.imageName
                    ) : (
                      "Try dropping an image here, or click to select image to upload."
                    )
                  }
                </p>
              </Dropzone>

              <label>
                Carousel Images
              </label>
              {this.displayImages()}
              <Dropzone
                onDrop={(acceptedFiles, rejectedFiles) => this.onDrop(acceptedFiles, rejectedFiles)}
                accept="image/*"
                style={{ marginBottom: "1rem" }}
                >
                <p className="dropzone">
                  <i className="fa fa-file-o" aria-hidden="true" />
                  Try dropping an image here, or click to select image to upload.
                </p>
              </Dropzone>
              <label>
                Location
              </label>
              <input
                name="title"
                type="text"
                id="location"
                className="form-control marg-bot-1"
              />
              <label>
                Description
              </label>
              <textarea
                name="body"
                type="text"
                placeholder="What stands out..."
                className="form-control marg-bot-1"
                rows="4"
                value={ this.state.description }
                onChange={ this.handleChangeDescription }
              />
              <label>
                Nalda's Favorite
              </label>
              <textarea
                name="body"
                type="text"
                placeholder="The best dish here..."
                className="form-control marg-bot-1"
                rows="4"
                value={ this.state.naldaFavorite }
                onChange={ this.handleChangeNaldaFavorite }
              />
              <label>
                Hours
              </label>
              <div className="time-select">
                <p>
                  Monday
                </p>
                <input
                  type="time"
                  onChange={(e) => { this.handleChangeHours(e, "start", "monday");}}
                  className="form-control"
                />
                <input
                  type="time"
                  onChange={(e) => { this.handleChangeHours(e, "finish", "monday");}}
                  className="form-control"
                />
              </div>
              <div className="time-select">
                <p>
                  Tuesday
                </p>
                <input
                type="time"
                onChange={(e) => { this.handleChangeHours(e, "start", "tuesday");}}
                className="form-control"
              />
                <input
                type="time"
                onChange={(e) => { this.handleChangeHours(e, "finish", "tuesday");}}
                className="form-control"
              />
              </div>
              <div className="time-select">
                <p>
                  Wednesday
                </p>
                <input
                  type="time"
                  onChange={(e) => { this.handleChangeHours(e, "start", "wednesday");}}
                  className="form-control"
                />
                <input
                  type="time"
                  onChange={(e) => { this.handleChangeHours(e, "finish", "wednesday");}}
                  className="form-control"
                />
              </div>
              <div className="time-select">
                <p>
                  Thursday
                </p>
                <input
                  type="time"
                  onChange={(e) => { this.handleChangeHours(e, "start", "thursday");}}
                  className="form-control"
                />
                <input
                  type="time"
                  onChange={(e) => { this.handleChangeHours(e, "finish", "thursday");}}
                  className="form-control"
                />
              </div>
              <div className="time-select">
                <p>
                  Friday
                </p>
                <input
                  type="time"
                  onChange={(e) => { this.handleChangeHours(e, "start", "friday");}}
                  className="form-control"
                />
                <input
                  type="time"
                  onChange={(e) => { this.handleChangeHours(e, "finish", "friday");}}
                  className="form-control"
                />
              </div>
              <div className="time-select">
                <p>
                  Saturday
                </p>
                <input
                  type="time"
                  onChange={(e) => { this.handleChangeHours(e, "start", "saturday");}}
                  className="form-control"
                />
                <input
                  type="time"
                  onChange={(e) => { this.handleChangeHours(e, "finish", "saturday");}}
                  className="form-control"
                />
              </div>
              <div className="time-select marg-bot-1">
                <p>
                  Sunday
                </p>
                <input
                  type="time"
                  onChange={(e) => { this.handleChangeHours(e, "start", "sunday");}}
                  className="form-control"
                />
                <input
                  type="time"
                  onChange={(e) => { this.handleChangeHours(e, "finish", "sunday");}}
                  className="form-control"
                />
              </div>
              <div className="row">
                <div className="col-12 col-md-6">
                  <label>
                    Rating
                  </label>
                  <select
                    className="form-control marg-bot-1"
                    value={ this.state.rating }
                    onChange={ this.handleChangeRating }
                  >
                    <option>0.0</option>
                    <option>0.5</option>
                    <option>1.0</option>
                    <option>1.5</option>
                    <option>2.0</option>
                    <option>2.5</option>
                    <option>3.0</option>
                    <option>3.5</option>
                    <option>4.0</option>
                    <option>4.5</option>
                    <option>5.0</option>
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label>
                    Price
                  </label>
                  <select
                    className="form-control marg-bot-1"
                    id="exampleFormControlSelect1"
                    value={ this.state.price }
                    onChange={ this.handleChangePrice }
                  >
                    <option>$</option>
                    <option>$$</option>
                    <option>$$$</option>
                    <option>$$$$</option>
                  </select>
                </div>
              </div>

              <label>
                Website
              </label>
              <input
                name="image"
                type="url"
                className="form-control marg-bot-1"
                value={ this.state.website }
                placeholder="https://example.com"
                onChange={ this.handleChangeWebsite }
              />

              <label>
                Categories
              </label>
              <div className="categories-form marg-bot-1">
                {/* Begin first row of categories */}
                <div className="row">
                  <div className="col-12 col-md-6">
                    <p className="bold">
                      No time, gotta run
                    </p>
                    <p
                      onClick={ (e) => this.handleClickCategory(e, "foodTrucks") }
                      className={ this.state.categories.foodTrucks && "active" }
                    >
                      Food trucks
                    </p>
                    <p
                      onClick={ (e) => this.handleClickCategory(e, "lateNights") }
                      className={ this.state.categories.lateNights && "active" }
                    >
                      Late nights
                    </p>
                    <p
                      onClick={ (e) => this.handleClickCategory(e, "healthy") }
                      className={ this.state.categories.healthy && "active" }
                    >
                      Healthy
                    </p>
                  </div>
                  <div className="col-12 col-md-6">
                    <p className="bold">
                      Hangout spots
                    </p>
                    <p
                      onClick={ (e) => this.handleClickCategory(e, "forTheSweetTooth") }
                      className={ this.state.categories.forTheSweetTooth && "active" }
                    >
                      For the sweet tooth
                    </p>
                    <p
                      onClick={ (e) => this.handleClickCategory(e, "forTheStudyGrind") }
                      className={ this.state.categories.forTheStudyGrind && "active" }
                    >
                      For the study grind
                    </p>
                    <p
                      onClick={ (e) => this.handleClickCategory(e, "openLate") }
                      className={ this.state.categories.openLate && "active" }
                    >
                      It’s midnight and I’m hungry
                    </p>
                  </div>
                </div>
                {/* Close first row of categories */}

                {/* Start second row of categories */}
                <div className="row">
                  <div className="col-12 col-md-6">
                    <p className="bold">
                      Wanna drink?
                    </p>
                    <p
                      onClick={ (e) => this.handleClickCategory(e, "bars") }
                      className={ this.state.categories.bars && "active" }
                    >
                      Bars
                    </p>
                    <p
                      onClick={ (e) => this.handleClickCategory(e, "byos") }
                      className={ this.state.categories.byos && "active" }
                    >
                      BYOs
                    </p>
                    <p
                      onClick={ (e) => this.handleClickCategory(e, "speakeasies") }
                      className={ this.state.categories.speakeasies && "active" }
                    >
                      Speakeasies
                    </p>
                  </div>
                  <div className="col-12 col-md-6">
                    <p className="bold">
                      Lazy weekend
                    </p>
                    <p
                      onClick={ (e) => this.handleClickCategory(e, "parentsVisiting") }
                      className={ this.state.categories.parentsVisiting && "active" }
                    >
                      Parents are visiting?!
                    </p>
                    <p
                      onClick={ (e) => this.handleClickCategory(e, "gotPlasteredLastNight") }
                      className={ this.state.categories.gotPlasteredLastNight && "active" }
                    >
                      Got plastered last night…
                    </p>
                  </div>
                </div>
                {/* End second row of categories */}

                {/* Begin third row of categories */}
                <div className="row">
                  <div className="col-12 col-md-6">
                    <p className="bold">
                      Special occasions
                    </p>
                    <p
                      onClick={ (e) => this.handleClickCategory(e, "dateNight") }
                      className={ this.state.categories.dateNight && "active" }
                    >
                      Date night
                    </p>
                    <p
                      onClick={ (e) => this.handleClickCategory(e, "formals") }
                      className={ this.state.categories.formals && "active" }
                    >
                      Formals
                    </p>
                    <p
                      onClick={ (e) => this.handleClickCategory(e, "birthdays") }
                      className={ this.state.categories.birthdays && "active" }
                    >
                      Birthdays
                    </p>
                    </div>
                    <div className="col-12 col-md-6">
                    <p className="bold">
                      Dinner with friends
                    </p>
                    <p
                      onClick={ (e) => this.handleClickCategory(e, "treatYourself") }
                      className={ this.state.categories.treatYourself && "active" }
                    >
                      Treat yourself
                    </p>
                    <p
                      onClick={ (e) => this.handleClickCategory(e, "adulting") }
                      className={ this.state.categories.adulting && "active" }
                    >
                      #adulting
                    </p>
                    <p
                      onClick={ (e) => this.handleClickCategory(e, "feelingLazy") }
                      className={ this.state.categories.feelingLazy && "active" }
                    >
                      Feeling lazy
                    </p>
                  </div>
                </div>
                {/* End third row of categories */}

                <p className="bold">
                  Adventure
                </p>
                <p
                  onClick={ (e) => this.handleClickCategory(e, "holeInTheWall") }
                  className={ this.state.categories.holeInTheWall && "active" }
                >
                  Hole in the wall
                </p>
                <p
                  onClick={ (e) => this.handleClickCategory(e, "showoffToYourFriends") }
                  className={ this.state.categories.showoffToYourFriends && "active" }
                >
                  Showoff to your friends
                </p>
                <p
                  onClick={ (e) => this.handleClickCategory(e, "forTheGram") }
                  className={ this.state.categories.forTheGram && "active" }
                >
                  #forthegram
                </p>
              </div>

              <label className="marg-bot-1">
                Amenities
              </label>
              <div className="categories-form marg-bot-1">
                {/* Begin first row of categories */}
                <div className="row">
                  <div className="col-12 col-md-6">
                    <p
                      onClick={ (e) => this.handleClickAmenity(e, "cashOnly") }
                      className={ this.state.amenities.cashOnly && "active" }
                    >
                      <CashOnly />
                      Cash only
                    </p>
                    <p
                      onClick={ (e) => this.handleClickAmenity(e, "formal") }
                      className={ this.state.amenities.formal && "active" }
                    >
                      <Formal />
                      Formal
                    </p>
                    <p
                      onClick={ (e) => this.handleClickAmenity(e, "outdoorSeating") }
                      className={ this.state.amenities.outdoorSeating && "active" }
                    >
                      <OutdoorSeating />
                      Outdoor seating
                    </p>
                    <p
                      onClick={ (e) => this.handleClickAmenity(e, "wink") }
                      className={ this.state.amenities.wink && "active" }
                    >
                      <Wink />
                      Wink
                    </p>
                  </div>
                  <div className="col-12 col-md-6 marg-bot-1">
                    <p
                      onClick={ (e) => this.handleClickAmenity(e, "parking") }
                      className={ this.state.amenities.parking && "active" }
                    >
                      <Parking />
                      Parking
                    </p>
                    <p
                      onClick={ (e) => this.handleClickAmenity(e, "reservation") }
                      className={ this.state.amenities.reservation && "active" }
                    >
                      <Reservation />
                      Reservation
                    </p>
                    <p
                      onClick={ (e) => this.handleClickAmenity(e, "wifi") }
                      className={ this.state.amenities.wifi && "active" }
                    >
                      <Wifi />
                      Wifi
                    </p>
                    <p
                      onClick={ (e) => this.handleClickAmenity(e, "waiter") }
                      className={ this.state.amenities.waiter && "active" }
                    >
                      <Waiter />
                      Waiter
                    </p>
                  </div>
                  <div className="col-12">
                    <input
                      className="form-control border marg-bot-1"
                      placeholder="Add comma separated additional amenities..."
                      value={this.state.additionalAmenitiesString}
                      onChange={this.handleChangeAdditionalAmenities}
                    />
                    { this.renderAdditionalAmenities() }
                  </div>
                </div>
              </div>

              <input
                type="submit"
                value={ this.state.pending ? "Creating listing..." : "Create listing" }
                className={
                  !this.state.pending && (
                    this.state.title &&
                    this.state.description &&
                    this.state.naldaFavorite &&
                    this.state.image &&
                    this.state.price &&
                    document.getElementById("location").value
                  ) ? (
                    "btn btn-primary full-width"
                  ) : (
                    "btn btn-primary disabled full-width"
                  )
                }
              />
            </form>
          </div>
        </Medium>
        <div className="space-2" />
      </div>
    );
  }
}

// Prop validations
EventForm.propTypes = {
  notifyMessage: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    userId: state.authState.userId,
  };
};

// Redux
const mapDispatchToProps = dispatch => {
  return {
    notifyMessage: (message) => dispatch(notifyMessage(message)),
  };
};

EventForm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EventForm);
export default EventForm;
