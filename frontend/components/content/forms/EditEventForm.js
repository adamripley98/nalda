/* global google */
// Import frameworks
import React from 'react';
import autosize from 'autosize';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import uuid from 'uuid-v4';
import async from 'async';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import EXIF from 'exif-js';

// Import components
import ErrorMessage from '../../shared/ErrorMessage';
import Medium from '../../shared/Medium';
import Tags from '../../shared/Tags';
import Loading from '../../shared/Loading';

// Import helper functions
import {processImg, getTargetSize} from '../../../helperMethods/imageUploading';

// Import actions
import {notifyMessage} from '../../../actions/notification';

class EditEventForm extends React.Component {
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
        nightYouWontRemember: false,
        classyEvening: false,
        haveToStudyTomorrow: false,
        somethingABitDifferent: false,
        soCultured: false,
        activeLifestyle: false,
        adulting: false,
        spring: false,
        summer: false,
        fall: false,
        winter: false,
        noMoneyNoProblem: false,
      },
      requirements: [],
      requirementsString: "",
      startDate: "",
      endDate: "",
      pending: true,
      pendingSubmit: false,
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

    // Isolate the id
    const id = this.props.match.params.id;

    // Pull existing data from the database
    axios.get(`/api/events/${id}`)
      .then(res => {
        const requirements = res.data.event.requirements;
        let requirementsString = "";
        if (requirements && requirements.length) {
          requirementsString = requirements.join(", ");
        }
        // If there was no error
        this.setState({
          pending: false,
          error: '',
          ...res.data.event,
          requirementsString,
          eventId: id,
        });
      })
      .catch(err => {
        this.setState({
          error: err.response.data.error || err.response.data,
          pending: false,
        });
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.pending && !this.state.pending) {
      // Autocomplete the user's city
      const location = document.getElementById("location");
      if (location) {
        // If there is a location field
        // Autocomplete leveraging the Google Maps API
        const options = {
          componentRestrictions: { country: 'us' },
        };
        const place = new google.maps.places.Autocomplete(location, options);

        // Populate the location field with the existing database value
        document.getElementById('location').value = this.state.location ? this.state.location.name : null;
      }

      // Handle resizing textarea
      autosize(document.querySelectorAll('textarea'));
    }
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
    if (this.state.images && this.state.images.length) {
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
    }

    // Else
    return null;
  }

  // Helper method to ensure all required fields are filled in validly
  inputValid() {
    return (this.state.title && this.state.description &&
      this.state.image && this.state.website);
  }

  /**
   * Helper method to handle when the form is submitted
   */
  handleSubmit(event) {
    // Denote that the request is pending
    this.setState({
      pendingSubmit: true,
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
          axios.post(`/api/events/${this.state.eventId}/edit`, {
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
              this.props.notifyMessage("Successfully updated event.");

              // Redirect to the created listing if successful
              this.setState({
                eventId: resp.data.event._id,
                redirectToHome: true,
                pendingSubmit: false,
              });
            })
            .catch(err => {
              this.setState({
                error: err.response.data.error || err.response.data,
                pendingSubmit: false,
              });
            });
        } else {
          this.setState({
            error: "Invalid location passed in.",
            pendingSubmit: false,
          });
        }
      });
    } else {
      this.setState({
        error: 'Make sure all fields are filled in.',
        pendingSubmit: false,
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
        <Tags title="Edit Event" />
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
              <h4 className="title dark-gray-text">
                Edit event
              </h4>
              <ErrorMessage error={ this.state.error } />

              {
                this.state.pending ? (
                  <Loading />
                ) : (
                  <div>
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
                        onClick={ (e) => this.handleClickCategory(e, "nightYouWontRemember") }
                        className={ this.state.categories.nightYouWontRemember && "active" }
                      >
                        Night you won't remember
                      </p>
                      <p
                        onClick={ (e) => this.handleClickCategory(e, "classyEvening") }
                        className={ this.state.categories.classyEvening && "active" }
                      >
                        Classy Evening
                      </p>
                      <p
                        onClick={ (e) => this.handleClickCategory(e, "haveToStudyTomorrow") }
                        className={ this.state.categories.haveToStudyTomorrow && "active" }
                      >
                        Have to Study Tomorrow
                      </p>
                      <p
                        onClick={ (e) => this.handleClickCategory(e, "somethingABitDifferent") }
                        className={ this.state.categories.somethingABitDifferent && "active" }
                      >
                        Something a Bit Different
                      </p>
                      <p
                        onClick={ (e) => this.handleClickCategory(e, "soCultured") }
                        className={ this.state.categories.soCultured && "active" }
                      >
                        So Cultured
                      </p>
                      <p
                        onClick={ (e) => this.handleClickCategory(e, "activeLifestyle") }
                        className={ this.state.categories.activeLifestyle && "active" }
                      >
                        Active Lifestyle
                      </p>
                      <p
                        onClick={ (e) => this.handleClickCategory(e, "adulting") }
                        className={ this.state.categories.adulting && "active" }
                      >
                        #Adulting
                      </p>
                      <p
                        onClick={ (e) => this.handleClickCategory(e, "spring") }
                        className={ this.state.categories.spring && "active" }
                      >
                        Spring
                      </p>
                      <p
                        onClick={ (e) => this.handleClickCategory(e, "summer") }
                        className={ this.state.categories.summer && "active" }
                      >
                        Summer
                      </p>
                      <p
                        onClick={ (e) => this.handleClickCategory(e, "fall") }
                        className={ this.state.categories.fall && "active" }
                      >
                        Fall
                      </p>
                      <p
                        onClick={ (e) => this.handleClickCategory(e, "winter") }
                        className={ this.state.categories.winter && "active" }
                      >
                        Winter
                      </p>
                      <p
                        onClick={ (e) => this.handleClickCategory(e, "noMoneyNoProblem") }
                        className={ this.state.categories.noMoneyNoProblem && "active" }
                      >
                        No Money No Problem
                      </p>
                    </div>
                    <input
                      type="submit"
                      value={ this.state.pendingSubmit ? "Updating..." : "Update event" }
                      className={
                        !this.state.pendingSubmit && this.inputValid() ? (
                          "btn btn-primary full-width"
                        ) : (
                          "btn btn-primary disabled full-width"
                        )
                      }
                    />
                  </div>
                )
              }
            </form>
          </div>
        </Medium>
        <div className="space-2" />
      </div>
    );
  }
}

// Prop validations
EditEventForm.propTypes = {
  notifyMessage: PropTypes.func,
  match: PropTypes.object,
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

EditEventForm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditEventForm);
export default EditEventForm;
