/* global google */

// Import frameworks
import React from 'react';
import autosize from 'autosize';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import uuid from 'uuid-v4';
import async from 'async';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import EXIF from 'exif-js';

// Import components
import ErrorMessage from '../../shared/ErrorMessage';
import Medium from '../../shared/Medium';
import Tags from '../../shared/Tags';

// Import helper functions
import { processImg, getTargetSize } from '../../../helperMethods/imageUploading';

// Import actions
import { notifyMessage } from '../../../actions/notification';

// Import SVGs
import CashOnly from '../../../assets/images/cash-only.svg';
import Formal from '../../../assets/images/formal.svg';
import OutdoorSeating from '../../../assets/images/outdoor-seating.svg';
import Parking from '../../../assets/images/parking.svg';
import Reservation from '../../../assets/images/reservation.svg';
import Waiter from '../../../assets/images/waiter.svg';
import Wifi from '../../../assets/images/wifi.svg';
import Wink from '../../../assets/images/wink.svg';

class ListingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      naldaFavorite: "",
      location: "",
      image: "",
      images: [],
      imagePreview: "",
      rating: 0.0,
      price: "$",
      hours: {
        monday: {
          start: '',
          finish: '',
        },
        tuesday: {
          start: '',
          finish: '',
        },
        wednesday: {
          start: '',
          finish: '',
        },
        thursday: {
          start: '',
          finish: '',
        },
        friday: {
          start: '',
          finish: '',
        },
        saturday: {
          start: '',
          finish: '',
        },
        sunday: {
          start: '',
          finish: '',
        },
      },
      error: "",
      listingId: "",
      redirectToHome: "",
      website: "",
      categories: {
        foodTrucks: false,
        lateNights: false,
        healthy: false,
        forTheSweetTooth: false,
        forTheStudyGrind: false,
        openLate: false,
        parentsVisiting: false,
        gotPlasteredLastNight: false,
        bars: false,
        byos: false,
        speakeasies: false,
        dateNight: false,
        formals: false,
        birthdays: false,
        treatYourself: false,
        adulting: false,
        feelingLazy: false,
        holeInTheWall: false,
        showoffToYourFriends: false,
        forTheGram: false,
      },
      amenities: {
        outdoorSeating: false,
        formal: false,
        cashOnly: false,
        parking: false,
        reservation: false,
        wifi: false,
        waiter: false,
        wink: false,
      },
      additionalAmenities: [],
      additionalAmenitiesString: "",
      pending: false,
    };

    // Bind this to helper methods
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleChangeNaldaFavorite = this.handleChangeNaldaFavorite.bind(this);
    this.handleChangeImage = this.handleChangeImage.bind(this);
    this.handleChangeHours = this.handleChangeHours.bind(this);
    this.handleChangeRating = this.handleChangeRating.bind(this);
    this.handleChangePrice = this.handleChangePrice.bind(this);
    this.handleChangeWebsite = this.handleChangeWebsite.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClickCategory = this.handleClickCategory.bind(this);
    this.handleClickAmenity = this.handleClickAmenity.bind(this);
    this.displayImages = this.displayImages.bind(this);
    this.removeImage = this.removeImage.bind(this);
    this.handleChangeAdditionalAmenities = this.handleChangeAdditionalAmenities.bind(this);
    this.renderAdditionalAmenities = this.renderAdditionalAmenities.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    // Handle resizing textarea
    autosize(document.querySelectorAll('textarea'));

    // Autocomplete the user's city
    const location = document.getElementById("location");
    const options = {
      componentRestrictions: {country: 'us'},
    };
    const marker = new google.maps.places.Autocomplete(location, options);
  }

  handleChangeTitle(event) {
    this.setState({
      title: event.target.value,
    });
  }

  handleChangeDescription(event) {
    this.setState({
      description: event.target.value,
    });
  }

  handleChangeNaldaFavorite(event) {
    this.setState({
      naldaFavorite: event.target.value,
    });
  }

  handleChangeImage(event) {
    this.setState({
      image: event.target.value,
    });
  }

  handleChangeRating(event) {
    this.setState({
      rating: event.target.value,
    });
  }

  handleChangePrice(event) {
    this.setState({
      price: event.target.value,
    });
  }

  /**
   * Helper method to handle a change to the hours state.
   * Day parameter is saturday to sunday
   * startOrFinish denotes whether it is open or close hours being entered
   */
  handleChangeHours(event, startOrFinish, day) {
    // Get the object for current hours before the update
    const currentHours = this.state.hours;

    // Update the passed in value
    currentHours[day][startOrFinish] = event.target.value;

    // Update the finish if the start is now later than the finish
    if (startOrFinish === 'start' && (
      !currentHours[day].finish ||
      currentHours[day].finish < event.target.value
    )) {
      currentHours[day].finish = event.target.value;
    }

    this.setState({
      hours: currentHours,
    });
  }

  // Handle change additional amenities
  handleChangeAdditionalAmenities(event) {
    // Prevent the default action
    event.preventDefault();

    // Create the tag array, removing whitespace and uppercase letters
    const additionalAmenitiesString = event.target.value;
    let additionalAmenities = additionalAmenitiesString.split(',').map(tag => tag.trim().toLowerCase());

    // Remove all duplicate items
    additionalAmenities = additionalAmenities.filter((value, index, self) => {
      // If the value is empty
      if (!value || value === "") {
        return false;
      }

      // Else, ensure the value does not occur earlier in the array
      return self.indexOf(value) === index;
    });

    // Update the state
    this.setState({
      additionalAmenitiesString,
      additionalAmenities,
    });
  }

  /**
   * Helper method to handle a change to the website state
   */
  handleChangeWebsite(event) {
    this.setState({
      website: event.target.value,
    });
  }

  /**
   * Helper method to handle a change tto the amenities
   */
  handleClickAmenity(event, name) {
    // Copy over the existing state
    const newAmenityState = {
      ...this.state.amenities,
    };

    // Update the state for the passed in field
    newAmenityState[name] = !this.state.amenities[name];

    // Update the component state
    this.setState({
      amenities: newAmenityState,
    });
  }

  /**
   * Helper method to handle click on food truck category
   */
  handleClickCategory(event, name) {
    // Copy over the existing state
    const newCategoryState = {
      ...this.state.categories,
    };

    // Update the state for the passed in field
    newCategoryState[name] = !this.state.categories[name];

    // Update the component state
    this.setState({
      categories: newCategoryState,
    });
  }

  // Helper method to remove an image
  removeImage(index) {
    const images = this.state.images.slice();
    images.splice(index, 1);
    this.setState({
      images,
    });
  }

  // Helper method to display images
  displayImages() {
    const images = this.state.images.map((image, i) => {
      return (
        <li key={uuid()}>
          <img
            src={image}
            alt={"carousel image " + i}
          />
          <div onClick={() => this.removeImage(this.state.images.indexOf(image))}>
            <i className="fa fa-close" aria-hidden="true" />
          </div>
        </li>
      );
    });

    // If there are images to show
    if (images && images.length) {
      return (
        <ul className="carousel-preview">
          {images}
        </ul>
      );
    }

    // Else
    return null;
  }

  // Helper method for image uploads
  onDrop(acceptedFiles, rejectedFiles, hero) {
    // Ensure at leat one valid image was uploaded
    if (acceptedFiles.length) {
      if (hero === "hero") {
        const image = acceptedFiles[0];
        const reader = new FileReader();
        // Convert from blob to a proper file object that can be passed to server
        reader.onload = (upload) => {
          var img = new Image();
          img.onload = () => {
            ((file, uri) => {
              const targetSize = getTargetSize(img, 1200);
              EXIF.getData(file, () => {
                const imgToSend = processImg(uri, targetSize.height, targetSize.width, img.width, img.height, EXIF.getTag(file, 'Orientation'));
                // Set images to state
                this.setState({
                  image: imgToSend,
                  imagePreview: imgToSend,
                  imageName: image.name,
                  error: '',
                });
              });
            })(image, upload.target.result);
          };
          img.src = upload.target.result;
        };
        // File reader set up
        reader.onabort = () => this.setState({error: "File read aborted."});
        reader.onerror = () => this.setState({error: "File read error."});
        reader.readAsDataURL(image);
      } else {
        // Ensure no more than 6 were uploaded
        if (acceptedFiles.length + this.state.images.length > 10) {
          this.setState({
            error: 'You may only upload 10 images.',
          });
          // Shorten acceptedFiles to 10
          acceptedFiles.splice(10 - this.state.images.length);
        }

        // Make a copy of the images in state
        const images = this.state.images.slice();

        // Loop through and convert images
        async.eachSeries(acceptedFiles, (pic, cb) => {
          const reader = new FileReader();
          // Convert from blob to a proper file object that can be passed to server
          reader.onload = (upload) => {
            var img = new Image();
            img.onload = () => {
              ((file, uri) => {
                const targetSize = getTargetSize(img, 750);
                EXIF.getData(file, () => {
                  const imgToSend = processImg(uri, targetSize.height, targetSize.width, img.width, img.height, EXIF.getTag(file, 'Orientation'));
                  images.push(imgToSend);
                  this.setState(images);
                });
              })(pic, upload.target.result);
            };
            img.src = upload.target.result;
            cb();
          };
          // File reader set up
          reader.onabort = () => {
            this.setState({error: "File read aborted."});
            cb();
          };

          reader.onerror = () => {
            this.setState({error: "File read error."});
            cb();
          };

          reader.readAsDataURL(pic);
        }, asyncErr => {
          if (asyncErr) {
            this.setState({
              error: "Async error with image upload.",
            });
            return;
          }
          // Set images to state
          this.setState({
            images,
          });
        });
      }
    }
    if (rejectedFiles.length) {
      // Display error with wrong file type
      this.setState({
        error: rejectedFiles[0].name + ' is not an image.',
      });
    }
  }

  /**
   * Helper method to handle when the form is submitted
   */
  handleSubmit(event) {
    // Denote that the request is pending
    this.setState({
      pending: true,
    });

    // Prevent the default submit action
    event.preventDefault();

    // Find the Location
    const location = document.getElementById("location").value;

    // If request is properly formulated, send request to make a new listing (routes.js)
    if (this.inputValid()) {
      // Find the longitude and latitude of the location passed in
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': location }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          // Isolate the coordinates of the passed in location
          const latitude = results[0].geometry.location.lat();
          const longitude = results[0].geometry.location.lng();

          // Create the new listing in the backend
          axios.post('/api/listings/new', {
            title: this.state.title,
            image: this.state.image,
            images: this.state.images,
            location: {
              name: location,
              lat: latitude,
              lng: longitude,
            },
            description: this.state.description,
            naldaFavorite: this.state.naldaFavorite,
            hours: this.state.hours,
            rating: this.state.rating,
            price: this.state.price,
            website: this.state.website,
            categories: this.state.categories,
            amenities: this.state.amenities,
            additionalAmenities: this.state.additionalAmenities,
          })
            .then(resp => {
              // Notify success
              this.props.notifyMessage("Successfully created listing.");

              // Redirect to the created listing if successful
              this.setState({
                listingId: resp.data.listing._id,
                redirectToHome: true,
                pending: false,
              });
            })
            .catch(err => {
              this.setState({
                error: err.response.data.error || err.response.data,
                pending: false,
              });
            });
        } else {
          this.setState({
            error: "Invalid location passed in.",
            pending: false,
          });
        }
      });
    }
  }

  /**
   * Helper method to check if all input is valid, returns true or false
   * Frontend validations
   */
  inputValid() {
    // Begin error checking
    if (!this.state.title) {
      this.setState({
        error: "Title must be populated.",
        pending: false,
      });
      return false;
    } else if (!this.state.description) {
      this.setState({
        error: "Description must be populated.",
        pending: false,
      });
      return false;
    } else if (!this.state.naldaFavorite) {
      this.setState({
        error: "Nalda's Favorite Section must be populated.",
        pending: false,
      });
      return false;
    } else if (this.state.title.length < 2 || this.state.title.length > 100) {
      this.setState({
        error: "Title must be between 2 and 100 characters long.",
        pending: false,
      });
      return false;
    } else if (this.state.description.length < 4 || this.state.description.length > 2000) {
      this.setState({
        error: "Descriptions must be between 4 and 2000 characters long.",
        pending: false,
      });
      return false;
    } else if (this.state.naldaFavorite.length < 4 || this.state.naldaFavorite.length > 2000) {
      this.setState({
        error: "Nalda's Favorite Section must be between 4 and 2000 characters long.",
        pending: false,
      });
      return false;
    } else if (!this.state.images.length) {
      this.setState({
        error: "At least 1 image must be provided.",
      });
    } else if (!document.getElementById("location").value) {
      this.setState({
        error: "Location must be populated.",
        pending: false,
      });
      return false;
    }

    // Set the error to the empty string if everything is valid
    this.setState({
      error: '',
    });

    return true;
  }

  /**
   * Render additional amenities
   */
  renderAdditionalAmenities() {
    if (!this.state.additionalAmenities || !this.state.additionalAmenities.length) return null;
    const amenities =  this.state.additionalAmenities.map(amenity => (
      <span className="category" key={amenity}>{amenity}</span>
    ));
    return (
      <div className="categories">
        {amenities}
      </div>
    );
  }

  /**
   * Render the component
   */
  render() {
    return (
      <div>
        <Tags title="New Listing" />
        { this.state.redirectToHome && <Redirect to={`/listings/${this.state.listingId}`}/> }
        <Medium>
          <div className="card thin-form no-pad">
            <div className="tabs">
              <Link className="tab" to="/articles/new">Article</Link>
              <Link className="tab active" to="/listings/new">Listing</Link>
              <Link className="tab" to="/events/new">Event</Link>
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
ListingForm.propTypes = {
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

ListingForm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListingForm);
export default ListingForm;
