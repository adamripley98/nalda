// Import frameworks
import React from 'react';
import autosize from 'autosize';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

// Import components
import ErrorMessage from '../../shared/ErrorMessage';
import Medium from '../../shared/Medium';
import Loading from '../../shared/Loading';

/**
 * Component to render the new article form
 */
class EditListingForm extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      location: "",
      image: "",
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
      amenities: {
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
      pendingSubmit: false,
      pending: true,
    };

    // Bind this to helper methods
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleChangeImage = this.handleChangeImage.bind(this);
    this.handleChangeHours = this.handleChangeHours.bind(this);
    this.handleChangeRating = this.handleChangeRating.bind(this);
    this.handleChangePrice = this.handleChangePrice.bind(this);
    this.handleChangeWebsite = this.handleChangeWebsite.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClickAmenity = this.handleClickAmenity.bind(this);
  }

  /**
   * When the component mounts
   */
  componentDidMount() {
    // Isolate the id
    const id = this.props.match.params.id;

    // Pull data from the backend
    // Pull existing data from the database
    axios.get(`/api/listings/${id}`)
      .then(res => {
        if (res.data.success) {
          // If there was no error
          this.setState({
            pending: false,
            error: "",
            ...res.data.data,
          });
        } else {
          // There was an error in the request
          this.setState({
            error: res.data.error.message,
            pending: false,
          });
        }
      })
      .catch(err => {
        this.setState({
          error: err,
          pending: false,
        });
      });
  }

  /**
   * When the component updates
   */
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
        new google.maps.places.Autocomplete(location, options);

        // Populate the location field with the existing database value
        document.getElementById('location').value = this.state.location.name;
      }

      // Handle resizing textarea
      autosize(document.querySelectorAll('textarea'));
    }
  }

  // Helper method to handle a change to the title state
  handleChangeTitle(event) {
    this.setState({
      title: event.target.value,
    });
  }

  // Helper method to handle a change to the description state
  handleChangeDescription(event) {
    this.setState({
      description: event.target.value,
    });
  }

  // Helper method to handle a change to the image state
  handleChangeImage(event) {
    this.setState({
      image: event.target.value,
    });
  }

  // Helper method to handle a change to the rating state
  handleChangeRating(event) {
    this.setState({
      rating: event.target.value,
    });
  }

  // Helper method to handle a change to the price state
  handleChangePrice(event) {
    this.setState({
      price: event.target.value,
    });
  }

  // Helper method to handle a change to the hours state
  // day parameter is monday - friday, startOrFinish denotes whether it is open or close hours being entered
  handleChangeHours(event, startOrFinish, day) {
    // Get the object for current hours before the update
    const currentHours = this.state.hours;

    // Update the passed in value
    currentHours[day][startOrFinish] = event.target.value;

    // Update the finish if the start is now later than the finish
    if (startOrFinish === "start" && (
          !currentHours[day].finish ||
          currentHours[day].finish < event.target.value
        )) {
      currentHours[day].finish = event.target.value;
    }
    this.setState({
      hours: currentHours,
    });
  }

  // Helper method to handle a change to the website state
  handleChangeWebsite(event) {
    this.setState({
      website: event.target.value,
    });
  }

  // Helper method to handle click on food truck amenity
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

  // Helper method to handle when the form is submitted
  handleSubmit(event) {
    // Denote that the request is pendingSubmit
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
          const latitude = results[0].geometry.location.lat();
          const longitude = results[0].geometry.location.lng();
          axios.post('/api/listings/new', {
            title: this.state.title,
            image: this.state.image,
            location: {
              name: location,
              lat: latitude,
              lng: longitude,
            },
            description: this.state.description,
            hours: this.state.hours,
            rating: this.state.rating,
            price: this.state.price,
            website: this.state.website,
            amenities: this.state.amenities,
          })
            .then((resp) => {
              // Display any errors
              if (!resp.data.success) {
                this.setState({
                  error: resp.data.error,
                  pendingSubmit: false,
                });
              } else {
                // Redirect to home if successful
                this.setState({
                  listingId: resp.data.data._id,
                  redirectToHome: true,
                  pendingSubmit: false,
                });
              }
            })
            .catch(err => {
              this.setState({
                error: err,
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
    }
  }

  // Helper method to check if all input is valid, returns true or false
  inputValid() {
    // Begin error checking
    if (!this.state.title) {
      this.setState({
        error: "Title must be populated.",
        pendingSubmit: false,
      });
      return false;
    } else if (!this.state.description) {
      this.setState({
        error: "Description must be populated.",
        pendingSubmit: false,
      });
      return false;
    } else if (this.state.title.length < 4 || this.state.title.length > 100) {
      this.setState({
        error: "Title must be between 4 and 100 characters long.",
        pendingSubmit: false,
      });
      return false;
    } else if (this.state.description.length < 4 || this.state.description.length > 2000) {
      this.setState({
        error: "Subtitle must be between 4 and 2000 characters long.",
        pendingSubmit: false,
      });
      return false;
    } else if (!document.getElementById("location").value) {
      this.setState({
        error: "Location must be populated.",
        pendingSubmit: false,
      });
      return false;
    }
    // Set the error to the empty string if everything is valid
    this.setState({
      error: "",
    });
    return true;
  }

  /**
   * Render the component
   * TODO: Make Hours, Rating, and Price sliders, not text input
   */
  render() {
    return (
      <div>
        { this.state.redirectToHome && <Redirect to={`/listings/${this.state.listingId}`}/> }
        <Medium>
          <div className="card thin-form no-pad">
            <form className="pad-1" onSubmit={ this.handleSubmit }>
              <h4 className="title dark-gray-text">
                Edit listing
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
                    className="form-control marg-bot-1"
                    value={ this.state.title }
                    onChange={ this.handleChangeTitle }
                  />
                  <label>
                    Image (url to an image)
                  </label>
                  <input
                    name="image"
                    type="url"
                    className="form-control marg-bot-1"
                    value={ this.state.image }
                    onChange={ this.handleChangeImage }
                  />
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
                    className="form-control marg-bot-1"
                    rows="1"
                    value={ this.state.description }
                    onChange={ this.handleChangeDescription }
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
                    onChange={ this.handleChangeWebsite }
                  />

                  <label>
                    Amenities
                  </label>
                  <div className="amenities-form marg-bot-1">
                    {/* Begin first row of amenities */}
                    <div className="row">
                      <div className="col-12 col-md-6">
                        <p className="bold">
                          No time, gotta run
                        </p>
                        <p
                          onClick={ (e) => this.handleClickAmenity(e, "foodTrucks") }
                          className={ this.state.amenities.foodTrucks && "active" }
                        >
                          Food trucks
                        </p>
                        <p
                          onClick={ (e) => this.handleClickAmenity(e, "lateNights") }
                          className={ this.state.amenities.lateNights && "active" }
                        >
                          Late nights
                        </p>
                        <p
                          onClick={ (e) => this.handleClickAmenity(e, "healthy") }
                          className={ this.state.amenities.healthy && "active" }
                        >
                          Healthy
                        </p>
                      </div>
                      <div className="col-12 col-md-6">
                        <p className="bold">
                          Hangout spots
                        </p>
                        <p
                          onClick={ (e) => this.handleClickAmenity(e, "forTheSweetTooth") }
                          className={ this.state.amenities.forTheSweetTooth && "active" }
                        >
                          For the sweet tooth
                        </p>
                        <p
                          onClick={ (e) => this.handleClickAmenity(e, "forTheStudyGrind") }
                          className={ this.state.amenities.forTheStudyGrind && "active" }
                        >
                          For the study grind
                        </p>
                        <p
                          onClick={ (e) => this.handleClickAmenity(e, "openLate") }
                          className={ this.state.amenities.openLate && "active" }
                        >
                          It’s midnight and I’m hungry
                        </p>
                      </div>
                    </div>
                    {/* Close first row of amenities */}

                    {/* Start second row of amenities */}
                    <div className="row">
                      <div className="col-12 col-md-6">
                        <p className="bold">
                          Wanna drink?
                        </p>
                        <p
                          onClick={ (e) => this.handleClickAmenity(e, "bars") }
                          className={ this.state.amenities.bars && "active" }
                        >
                          Bars
                        </p>
                        <p
                          onClick={ (e) => this.handleClickAmenity(e, "byos") }
                          className={ this.state.amenities.byos && "active" }
                        >
                          BYOs
                        </p>
                        <p
                          onClick={ (e) => this.handleClickAmenity(e, "speakeasies") }
                          className={ this.state.amenities.speakeasies && "active" }
                        >
                          Speakeasies
                        </p>
                      </div>
                      <div className="col-12 col-md-6">
                        <p className="bold">
                          Lazy weekend
                        </p>
                        <p
                          onClick={ (e) => this.handleClickAmenity(e, "parentsVisiting") }
                          className={ this.state.amenities.parentsVisiting && "active" }
                        >
                          Parents are visiting?!
                        </p>
                        <p
                          onClick={ (e) => this.handleClickAmenity(e, "gotPlasteredLastNight") }
                          className={ this.state.amenities.gotPlasteredLastNight && "active" }
                        >
                          Got plastered last night…
                        </p>
                      </div>
                    </div>
                    {/* End second row of amenities */}

                    {/* Begin third row of amenities */}
                    <div className="row">
                      <div className="col-12 col-md-6">
                        <p className="bold">
                          Special occasions
                        </p>
                        <p
                          onClick={ (e) => this.handleClickAmenity(e, "dateNight") }
                          className={ this.state.amenities.dateNight && "active" }
                        >
                          Date night
                        </p>
                        <p
                          onClick={ (e) => this.handleClickAmenity(e, "formals") }
                          className={ this.state.amenities.formals && "active" }
                        >
                          Formals
                        </p>
                        <p
                          onClick={ (e) => this.handleClickAmenity(e, "birthdays") }
                          className={ this.state.amenities.birthdays && "active" }
                        >
                          Birthdays
                        </p>
                        </div>
                        <div className="col-12 col-md-6">
                        <p className="bold">
                          Dinner with friends
                        </p>
                        <p
                          onClick={ (e) => this.handleClickAmenity(e, "treatYourself") }
                          className={ this.state.amenities.treatYourself && "active" }
                        >
                          Treat yourself
                        </p>
                        <p
                          onClick={ (e) => this.handleClickAmenity(e, "adulting") }
                          className={ this.state.amenities.adulting && "active" }
                        >
                          #adulting
                        </p>
                        <p
                          onClick={ (e) => this.handleClickAmenity(e, "feelingLazy") }
                          className={ this.state.amenities.feelingLazy && "active" }
                        >
                          Feeling lazy
                        </p>
                      </div>
                    </div>
                    {/* End third row of amenities */}

                    <p className="bold">
                      Adventure
                    </p>
                    <p
                      onClick={ (e) => this.handleClickAmenity(e, "holeInTheWall") }
                      className={ this.state.amenities.holeInTheWall && "active" }
                    >
                      Hole in the wall
                    </p>
                    <p
                      onClick={ (e) => this.handleClickAmenity(e, "showoffToYourFriends") }
                      className={ this.state.amenities.showoffToYourFriends && "active" }
                    >
                      Showoff to your friends
                    </p>
                    <p
                      onClick={ (e) => this.handleClickAmenity(e, "forTheGram") }
                      className={ this.state.amenities.forTheGram && "active" }
                    >
                      #forthegram
                    </p>
                  </div>

                  <input
                    type="submit"
                    value={ this.state.pendingSubmit ? "Updating listing..." : "Update listing" }
                    className={
                      !this.state.pendingSubmit && (
                        this.state.title &&
                        this.state.description &&
                        this.state.website &&
                        this.state.image &&
                        this.state.rating &&
                        this.state.price &&
                        document.getElementById("location") &&
                        document.getElementById("location").value
                      ) ? (
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

EditListingForm.propTypes = {
  match: PropTypes.object,
};

export default EditListingForm;
