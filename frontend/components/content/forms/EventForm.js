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
import {processImg, getTargetSize} from '../../../helperMethods/imageUploading';

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
      imageName: "",
      imagePreview: "",
      images: [],
      price: 0,
      error: "",
      eventId: "",
      redirectToHome: "",
      website: "",
      categories: {
        nightTime: false,
        concerts: false,
        dateNights: false,
      },
      requirements: [],
      requirementsString: "",
      startDate: "",
      endDate: "",
      pending: false,
    };

    // Bind this to helper methods
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeRequirements = this.handleChangeRequirements.bind(this);
    this.handleClickCategory = this.handleClickCategory.bind(this);
    this.renderRequirements = this.renderRequirements.bind(this);
    this.inputValid = this.inputValid.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.displayImages = this.displayImages.bind(this);
    this.removeImage = this.removeImage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    new google.maps.places.Autocomplete(location, options);
  }

  // Generic helper method for input change
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
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


  /**
   * Handle change requirements
   */
  handleChangeRequirements(event) {
    // Prevent the default action
    event.preventDefault();

    // Create the tag array, removing whitespace and uppercase letters
    const requirementsString = event.target.value;
    let requirements = requirementsString.split(",").map(tag => tag.trim().toLowerCase());

    // Remove all duplicate items
    requirements = requirements.filter((value, index, self) => {
      // If the value is empty
      if (!value || value === "") {
        return false;
      }

      // Else, ensure the value does not occur earlier in the array
      return self.indexOf(value) === index;
    });

    // Update the state
    this.setState({
      requirementsString,
      requirements,
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

  // Helper method to ensure all required fields are filled in validly
  inputValid() {
    return (
      this.state.title &&
      this.state.description &&
      this.state.image &&
      this.state.website &&
      document.getElementById("location").value
    );
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

          // Create the new event in the backend
          axios.post('/api/events/new', {
            title: this.state.title,
            image: this.state.image,
            images: this.state.images,
            location: {
              name: location,
              lat: latitude,
              lng: longitude,
            },
            description: this.state.description,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            price: this.state.price,
            website: this.state.website,
            categories: this.state.categories,
            requirements: this.state.requirements,
          })
          .then(resp => {
            // Notify success
            this.props.notifyMessage("Successfully created event.");

            // Redirect to the created listing if successful
            this.setState({
              eventId: resp.data.event._id,
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
    } else {
      this.setState({
        error: 'Make sure all fields are filled in.',
        pending: false,
      });
    }
  }

  /**
   * Render additional amenities
   */
  renderRequirements() {
    if (!this.state.requirements || !this.state.requirements.length) return null;
    const requirements =  this.state.requirements.map(req => (
      <span className="category" key={req}>{req}</span>
    ));
    return (
      <div className="categories">
        {requirements}
      </div>
    );
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
                placeholder="Enter a title"
                className="form-control marg-bot-1"
                value={ this.state.title }
                onChange={ this.handleChange }
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
                  Try dropping up to 10 images here, or click to select image to upload.
                </p>
              </Dropzone>


              <label>
                Start Date/Time
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={this.state.startDate}
                onChange={this.handleChange}
                className="form-control marg-bot-1"
              />
              <label>
                End Date/Time
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={this.state.endDate}
                onChange={this.handleChange}
                className="form-control marg-bot-1"
              />

              <label>
                Location
              </label>
              <input
                name="title"
                type="text"
                placeholder="Enter a location"
                id="location"
                className="form-control marg-bot-1"
              />
              <label>
                Description
              </label>
              <textarea
                name="description"
                type="text"
                placeholder="What stands out..."
                className="form-control marg-bot-1"
                rows="4"
                value={ this.state.description }
                onChange={ this.handleChange }
              />
              <label>
                Requirements
              </label>
              <input
                className="form-control border marg-bot-1"
                placeholder="Add comma separated requirements..."
                value={this.state.requirementsString}
                onChange={this.handleChangeRequirements}
              />
              { this.renderRequirements() }
              <label>
                Price
              </label>
              <input
                name="price"
                type="number"
                className="form-control marg-bot-1"
                value={ this.state.price }
                placeholder={0}
                onChange={ this.handleChange }
              />

              <label>
                Website
              </label>
              <input
                name="website"
                type="url"
                className="form-control marg-bot-1"
                value={ this.state.website }
                placeholder="https://example.com"
                onChange={ this.handleChange }
              />

              <label>
                Categories
              </label>
              <div className="categories-form marg-bot-1">
                <p
                  onClick={ (e) => this.handleClickCategory(e, "nightTime") }
                  className={ this.state.categories.nightTime && "active" }
                >
                  Night Time
                </p>
                <p
                  onClick={ (e) => this.handleClickCategory(e, "concerts") }
                  className={ this.state.categories.concerts && "active" }
                >
                  Concerts
                </p>
                <p
                  onClick={ (e) => this.handleClickCategory(e, "dateNights") }
                  className={ this.state.categories.dateNights && "active" }
                >
                  Date Nights
                </p>
              </div>
              <input
                type="submit"
                value={ this.state.pending ? "Creating..." : "Create event" }
                className={
                  !this.state.pending && this.inputValid() ? (
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

const mapStateToProps = () => {
  return {
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
