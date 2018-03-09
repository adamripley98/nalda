// Import framworks
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import autosize from 'autosize';
import Dropzone from 'react-dropzone';

// Import actions
import {changeFullName} from '../../actions/index.js';
import {changeProfilePicture} from '../../actions/index.js';
import {changeUserLocation} from '../../actions/index.js';

// Import components
import ErrorMessage from '../shared/ErrorMessage';
import SuccessMessage from '../shared/SuccessMessage';
import Loading from '../shared/Loading';
import Tags from '../shared/Tags';

/**
 * Component to render a user's account information
  */
class Account extends Component {
  /**
   * Constructor method
   */
  constructor(props) {
    super(props);

    // Set the initial state
    this.state = {
      name: '',
      prevName: '',
      email: '',
      type: '',
      bio: '',
      profilePicture: '',
      profilePictureChanged: false,
      accountVerified: false,
      error: '',
      success: '',
      info: '',
      loading: true,
      pending: false,
      hasChanged: false,
      location: {},
    };

    // Bind this to helper methods
    this.handleChangeBio = this.handleChangeBio.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleVerifyEmail = this.handleVerifyEmail.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
  }

  /**
   * Pull the user's information from the database then render it
   */
  componentDidMount() {
    // Scroll to the top of the screen
    window.scrollTo(0, 0);

    // Pull the user's account data
    axios.get('/api/account', {
      params: {userId: this.props.userId}
    })
    .then(resp => {
      // If successful, will set state with user's information
      if (resp.data.success) {
        // Update the state
        this.setState({
          name: resp.data.data.name,
          email: resp.data.data.username,
          type: resp.data.data.userType,
          bio: resp.data.data.bio || '',
          profilePicture: resp.data.data.profilePicture,
          accountVerified: resp.data.data.accountVerified,
          location: resp.data.data.location || {},
          error: "",
          pending: false,
          loading: false,
        });

        // Set the location
        if (resp.data.data.location && resp.data.data.location.name) {
          document.getElementById('location').value = resp.data.data.location.name;
        }
      } else {
        this.setState({
          error: resp.data.error,
          pending: false,
          loading: false,
        });
      }
    })
    .catch(err => {
      this.setState({
        pending: false,
        loading: false,
        error: err,
      });
    });
  }

  /**
   * When the component updates
   */
  componentDidUpdate() {
    // Isolate location and add google maps autocomplete on it
    const location = document.getElementById('location');
    if (location) {
      // Autocomplete the user's city
      const options = {
        types: ['(cities)'],
        componentRestrictions: {country: 'us'},
      };
      new google.maps.places.Autocomplete(location, options);
    }

    // Autosize textareas (for example, the bio textarea)
    autosize(document.querySelectorAll('textarea'));
  }

  /**
   * Handle a user wanting to verify their email
   */
  handleVerifyEmail() {
    // Verify a user's email by sending them a verification link
    axios.get('/api/verify')
      .then((resp) => {
        if (resp.data.success) {
          this.setState({
            info: 'Please check your email for a verification link.',
          });
        } else {
          // Display error
          this.setState({
            error: resp.data.error,
          });
        }
      })
      // Display error
      .catch((err) => {
        this.setState({
          error: err,
        });
      });
  }

  /**
   * Handle a change to the name state
   */
  handleChangeName(event) {
    this.setState({
      name: event.target.value,
      hasChanged: true,
    });
  }

  /**
   * Handle click to edit profile picture
   */
  handleProfilePictureClick() {
    if (this.state.editProfilePicture) {
      // Isolate variables
      const changeProfilePic = this.props.changeProfilePic;
      const userId = this.props.userId;
      const profilePicture = this.state.profilePicture;
      const profilePictureChanged = this.state.profilePictureChanged;

      // Error checking
      if (!profilePicture) {
        this.setState({
          error: 'Profile picture cannot be empty',
        });
      } else if (profilePictureChanged) {
        // Post to backend to change profile picture
        axios.post('/api/users/profilePicture', {
          userId,
          profilePicture,
        })
        .then((resp) => {
          if (!resp.data.success) {
            this.setState({
              error: resp.data.error,
            });
          } else {
            // Dispatch redux action to change profile picture
            this.setState({
              error: '',
              profilePictureChanged: false,
            });
            changeProfilePic(profilePicture);
          }
        })
        .catch((err) => {
          this.setState({
            error: err,
          });
        });
      }
    }
    // Update the state
    this.setState({
      editProfilePicture: !this.state.editProfilePicture,
    });
  }

  // Helper method that is fired when a profile picture is added
  onDrop(acceptedFiles, rejectedFiles) {
    if (acceptedFiles && acceptedFiles.length) {
      // Read only the first file passed in
      const profilePicture = acceptedFiles[0];

      const reader = new FileReader();
      // Convert from blob to a proper file object that can be passed to server
      reader.onload = (upload) => {
        this.setState({
          profilePicture: upload.target.result,
          error: '',
          profilePictureName: profilePicture.name,
          profilePictureChanged: true,
        });
      };
      // File reader set up
      reader.onabort = () => this.setState({error: "File read aborted."});
      reader.onerror = () => this.setState({error: "File read error."});
      reader.readAsDataURL(profilePicture);
    } else {
      this.setState({
        error: rejectedFiles[0].name + ' is not an image.',
      });
    }
  }

  /**
   * Handle a change to the bio state
   */
  handleChangeBio(event) {
    this.setState({
      bio: event.target.value,
      hasChanged: true,
    });
  }

  /**
   * Handle saving a user's profile information
   */
  handleSaveChanges(event) {
    // Prevent the default submit action
    event.preventDefault();

    // Denote that the application is pending
    this.setState({ pending: true, hasChanged: false });

    // Frontend error checking
    let error = "";
    if (!this.state.name) {
      error = "You must enter a name.";
    }
    if (error) {
      this.setState({ error, pending: false, });
    } else {
      // Check if the entered location is unique from the previous one
      const location = document.getElementById('location').value;

      // Find the longitude and latitude of the location passed in
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': location }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          const latitude = results[0].geometry.location.lat();
          const longitude = results[0].geometry.location.lng();

          // Save the updated location
          const newLocation = {
            name: location,
            lat: latitude,
            lng: longitude,
          };

          // Send the request to update the user
          // TODO make sure this works
          axios.post("/api/users/edit", {
            location: newLocation,
            name: this.state.name,
            bio: this.state.bio,
            profilePicture: this.state.profilePicture,
          })
            .then(res => {
              if (!res.data.success) {
                this.setState({
                  pending: false,
                  error: res.data.error,
                });
              } else {
                this.props.changeName(this.state.name);
                this.props.changeLocation(newLocation.name);
                this.props.changeProfilePic(this.state.profilePicture);
                this.setState({
                  pending: false,
                  success: "Successfully updated account information.",
                });
              }
            })
            .catch(err => {
              this.setState({
                pending: false,
                error: err,
              });
            });
        } else {
          this.setState({
            error: "There was an error with the Google Maps API. Check the form and try again.",
            pending: false,
          });
        }
      });
    }
  }

  /**
   * Helper function to render a user's information
   */
  renderInfo() {
    return (
      <form className="account" onSubmit={this.handleSaveChanges}>
        <label className="bold">
          Name
        </label>
        <input
          className="form-control border marg-bot-1"
          id="name"
          ref={(input) => { this.nameInput = input; }}
          value={ this.state.name }
          placeholder="Enter your name here"
          onChange={ this.handleChangeName }
        />

        <label className="bold">
           Profile Picture
        </label>
        <div
          className="profile-picture background-image"
          style={{backgroundImage: `url(${this.props.profilePicture})`}}
        />

        <Dropzone
          onDrop={this.onDrop}
          accept="image/*"
          style={{ display: !this.state.editProfilePicture && "none" }}>
          <p className="dropzone">
            <i className="fa fa-file-o" aria-hidden="true" />
            {
              this.state.profilePictureName ? (
                this.state.profilePictureName
              ) : (
                "Try dropping some files here, or click to select files to upload."
              )
            }
          </p>
        </Dropzone>

        <label className="bold">
          Email
        </label>
        <br />
        <p className="marg-bot-1">
          { this.state.email }
        </p>

        <label className="bold">
          Type
        </label>
        <div className="tags">
          <span className="tag marg-bot-05">
            { this.state.type }
          </span>
        </div>
        <div className="gray marg-bot-1">
          A user can either be an admin, curator, or general user. Only Nalda administrators can change your account type.
        </div>

        <label className="bold">
          Bio
        </label>
        <textarea
          className="form-control border marg-bot-1"
          id="bio"
          ref={(input) => { this.bioInput = input; }}
          value={ this.state.bio }
          placeholder="Enter a bio"
          onChange={ this.handleChangeBio }
        />

        <label>
          Location
        </label>
        <input
          className="form-control border marg-bot-1"
          id="location"
          type="text"
          ref={(input) => { this.locationInput = input; }}
        />

        <label>
          Password
        </label>
        <br />
        <p className="marg-bot-05">
          ●●●●●●●
        </p>
        <Link to="/password">
          Change your password <i className="fa fa-pencil" aria-hidden="true" />
        </Link>
        <div className="space-2" />

        <div className="save-changes">
          <Link to="/" className="btn btn-secondary">
            Cancel
          </Link>
          <button className={(this.state.hasChanged && this.state.name) ? "btn btn-primary" : "btn btn-primary disabled"} type="submit" value="submit">
            { this.state.pending ? "Saving changes..." : "Save changes" }
          </button>
        </div>
      </form>
    );
  }

  /**
   * Render the component
   */
  render() {
    // If user is logged in or if user successfully logs in, redirects to home
    return (
      <div>
        <Tags title="Account" description="Edit and view your account information." keywords="edit,account,nalda,information,profile,email,security" />

        <div className="container">
          <div className="row">
            <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
              <h4 className="bold marg-top-2 marg-bot-1 dark-gray-text">
                Account information
              </h4>
              <ErrorMessage error={ this.state.error } />
              <SuccessMessage message={ this.state.success } error={ this.state.error } />
              {
                (!this.state.loading && !this.state.accountVerified) ? (
                  <div className="alert alert-warning marg-bot-1">
                    {this.state.info ? this.state.info : (
                      <span>
                        Please verify your account by clicking <span className="cursor underline" onClick={this.handleVerifyEmail}>here.</span>
                      </span>
                    )}
                  </div>
                ) : null
              }
              { this.state.loading ? <Loading /> : this.renderInfo() }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// Prop validations
Account.propTypes = {
  userId: PropTypes.string,
  changeName: PropTypes.func,
  changeProfilePic: PropTypes.func,
  profilePicture: PropTypes.string,
  location: PropTypes.string,
  changeLocation: PropTypes.func,
};

// Allows us to access redux state as this.props.userId inside component
const mapStateToProps = (state) => {
  return {
    userId: state.authState.userId,
    profilePicture: state.authState.profilePicture,
    location: state.authState.location,
  };
};

// Allows us to dispatch a changeName event by calling this.props.changeFullName
// NOTE this is necessary for redux state to render on nav bar
const mapDispatchToProps = (dispatch) => {
  return {
    changeName: (name) => dispatch(changeFullName(name)),
    changeProfilePic: (profilePicture) => dispatch(changeProfilePicture(profilePicture)),
    changeLocation: (location) => dispatch(changeUserLocation(location))
  };
};

// Redux config
Account = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Account);

export default Account;
