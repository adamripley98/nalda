import React from 'react';
import Medium from '../../shared/Medium';
import autosize from 'autosize';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

// Import components
import ErrorMessage from '../../shared/ErrorMessage';
import Tags from '../../shared/Tags';

// Import actions
import {notifyMessage} from '../../../actions/notification';

/**
 * Component to render the new video form
 */
class VideoForm extends React.Component {
  /**
   * Constructor method
   */
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      url: "",
      description: "",
      error: "",
      videoId: "",
      redirectToHome: false,
      pendingSubmit: false,
    };

    // Bind this to helper methods
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeVideo = this.handleChangeVideo.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.inputValid = this.inputValid.bind(this);
  }

  /**
   * Handle resizing textarea
   */
  componentDidMount() {
    window.scrollTo(0, 0);

    // Resize textarea to fit input
    autosize(document.querySelectorAll('textarea'));

    // Autocomplete the user's city
    const location = document.getElementById("location");
    const options = {
      componentRestrictions: {country: 'us'},
    };
    new google.maps.places.Autocomplete(location, options);
  }

  /**
   * Helper method to handle a change to the title state
   */
  handleChangeTitle(event) {
    this.setState({
      title: event.target.value,
    });
  }

  /**
   * Helper method to handle a change to the video state
   */
  handleChangeVideo(event) {
    this.setState({
      url: event.target.value,
    });
  }

  /**
   * Helper method to handle a change to the description state
   */
  handleChangeDescription(event) {
    this.setState({
      description: event.target.value,
    });
  }

  /**
   * Helper method to check if input is valid
   */
  inputValid() {
    // Begin error checking
    if (!this.state.title) {
      this.setState({
        error: "Title must be populated.",
        pendingSubmit: false,
      });
      return false;
    } else if (!this.state.url) {
      this.setState({
        error: "Video url must be populated",
        pendingSubmit: false,
      });
      return false;
    } else if (this.state.title.length < 4 || this.state.title.length > 100) {
      this.setState({
        error: "Title must be between 4 and 100 characters long.",
        pendingSubmit: false,
      });
      return false;
    } else if (this.state.description.length < 4) {
      this.setState({
        error: "Description must be at least 4 characters long",
        pendingSubmit: false,
      });
      return false;
    } else if (this.state.description.length > 10000) {
      this.setState({
        error: "Description must be less than 10000 characters long.",
        pendingSubmit: false,
      });
      return false;
    } else if (!this.state.url.startsWith("https://www.youtube.com/watch?v=")) {
      this.setState({
        error: "Video URL must be properly formatted. That is, it must begin with \"https://www.youtube.com/watch?v=\" followed by the video ID.",
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
    // Otherwise, the request is properly formulated
    this.setState({
      error: "",
    });
    return true;
  }

  /**
   * Helper method to handle when the form is submitted
   */
  handleSubmit(event) {
    // Prevent the default submit action
    event.preventDefault();

    // Denote that the submit is pending
    this.setState({
      pendingSubmit: true,
    });

    // Find the Location
    const location = document.getElementById("location").value;

    // Check to make sure input is valid
    if (this.inputValid()) {
      // Find the longitude and latitude of the location passed in
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': location }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          // Find the coordinates of the location
          const latitude = results[0].geometry.location.lat();
          const longitude = results[0].geometry.location.lng();

          // Post to backend creating new video
          axios.post('/api/videos/new', {
            title: this.state.title,
            description: this.state.description,
            url: this.state.url,
            location: {
              name: location,
              lat: latitude,
              lng: longitude,
            },
          })
            .then(resp => {
              // Notify success
              this.props.notifyMessage("Successfully created video");

              // Redirect to home after successful submission
              this.setState({
                videoId: resp.data.video._id,
                redirectToHome: true,
                pendingSubmit: false,
              });
            })
            .catch(err => {
              // If there was an error during the request
              this.setState({
                error: err.response.data.error || err.response.data,
              });
            });
        }
      });
    }
  }

  /**
   * Render the component
   */
  render() {
    return (
      <div>
        <Tags title="New Video" />

        {/* Redirect to the video if it has been created */}
        { this.state.redirectToHome && <Redirect to={`/videos/${this.state.videoId}`}/> }

        {/* Else, render the form to create a video */}
        <Medium>
          <div className="card thin-form no-pad">
            <div className="tabs">
              <Link className="tab" to="/articles/new">Article</Link>
              <Link className="tab" to="/listings/new">Listing</Link>
              <Link className="tab active" to="/videos/new">Video</Link>
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
                Link to YouTube video
              </label>
              <input
                name="image"
                type="url"
                className="form-control marg-bot-1"
                value={ this.state.video }
                onChange={ this.handleChangeVideo }
              />

              <label>
                Description
              </label>
              <textarea
                name="description"
                type="text"
                className="form-control marg-bot-1"
                rows="4"
                value={ this.state.description }
                onChange={ this.handleChangeDescription }
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

              <input
                type="submit"
                value={ this.state.pendingSubmit ? "Creating video..." : "Create video" }
                className={
                  !this.state.pendingSubmit &&
                  this.state.title &&
                  this.state.url &&
                  this.state.description ? (
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
VideoForm.propTypes = {
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

VideoForm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(VideoForm);
export default VideoForm;
