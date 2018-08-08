// Import frameworks
import React from 'react';
import autosize from 'autosize';
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
      imagePreview: "",
      images: "",
      price: 0,
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
      requirementsString: "",
      date: "",
      pending: false,
    };

    // Bind this to helper methods
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeRequirements = this.handleChangeRequirements.bind(this);
    this.handleClickCategory = this.handleClickCategory.bind(this);
    this.renderRequirements = this.renderRequirements.bind(this);
    this.inputValid = this.inputValid.bind(this);
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

  // Helper method to ensure all required fields are filled in validly
  inputValid() {
    return (this.state.title && this.state.description && this.state.requirements.length &&
      this.state.image && this.state.price && document.getElementById("location").value);
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
                  className={ this.state.categories.foodTrucks && "active" }
                >
                  Night Time
                </p>
                <p
                  onClick={ (e) => this.handleClickCategory(e, "concerts") }
                  className={ this.state.categories.lateNights && "active" }
                >
                  Concerts
                </p>
                <p
                  onClick={ (e) => this.handleClickCategory(e, "dateNights") }
                  className={ this.state.categories.healthy && "active" }
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
