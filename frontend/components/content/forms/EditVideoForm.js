// Import frameworks
import React from 'react';
import autosize from 'autosize';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

// Import components
import ErrorMessage from '../../shared/ErrorMessage';
import Loading from '../../shared/Loading';
import Medium from '../../shared/Medium';

/**
 * Component to render the edit video form
 * TODO Autocomplete not working
 */
class EditVideoForm extends React.Component {
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
      pending: true,
    };

    // Bind this to helper methods
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeVideo = this.handleChangeVideo.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.inputValid = this.inputValid.bind(this);
  }

  /**
   * When the component mounts
   * Pull data from the backend and populate the form fields
   */
  componentDidMount() {
    // Isolate the id
    const id = this.props.match.params.id;

    // Pull existing data from the database
    axios.get(`/api/videos/${id}`)
      .then(res => {
        if (res.data.success) {
          // If there was no error
          this.setState({
            pending: false,
            error: "",
            ...res.data.data,
            videoId: id,
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
   * When the component updates, check if it has recently finished pending. If
   * this is the case, then update the state accordingly and configure the
   * Google Maps API
   */
  componentDiDUpdate(prevProps, prevState) {
    if (prevState.pending && !this.state.pending) {
      // Autosize textareas to fit input
      autosize(document.querySelectorAll('textarea'));

      // Autocomplete the location field for the video
      const location = document.getElementById("location");
      if (location) {
        const options = {
          componentRestrictions: {country: 'us'},
        };
        new google.maps.places.Autocomplete(location, options);

        // Update the location field
        document.getElementById('location').value = this.state.location.name;
      }
    }
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
          const latitude = results[0].geometry.location.lat();
          const longitude = results[0].geometry.location.lng();
          // Post to backend creating new video
          axios.post(`/api/videos/${this.state.videoId}/edit`, {
            title: this.state.title,
            description: this.state.description,
            url: this.state.url,
            location: {
              name: location,
              lat: latitude,
              lng: longitude,
            },
          })
          .then((resp) => {
            if (!resp.data.success) {
              // Display error on frontend
              this.setState({
                error: resp.data.error,
                pendingSubmit: false,
              });
            } else {
              // Redirect to home after successful submission
              this.setState({
                redirectToHome: true,
                pendingSubmit: false,
              });
            }
          })
          .catch((err) => {
            this.setState({
              error: err,
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
        { this.state.redirectToHome && <Redirect to={`/videos/${this.state.videoId}`}/> }
        <Medium>
          <div className="card thin-form no-pad">
            <form className="pad-1" onSubmit={ this.handleSubmit }>
              <h4 className="dark-gray-text title">
                Edit video
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
                      Link to YouTube video
                    </label>
                    <input
                      name="image"
                      type="url"
                      className="form-control marg-bot-1"
                      value={ this.state.url }
                      onChange={ this.handleChangeVideo }
                    />

                    <label>
                      Description
                    </label>
                    <textarea
                      name="description"
                      type="text"
                      className="form-control marg-bot-1"
                      rows="1"
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
                      value={ this.state.pendingSubmit ? "Updating video..." : "Update video" }
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

EditVideoForm.propTypes = {
  match: PropTypes.object,
};

export default EditVideoForm;
