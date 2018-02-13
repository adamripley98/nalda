// Import frameworks
import React from 'react';
import Medium from '../../shared/Medium';
import autosize from 'autosize';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Author from '../../shared/Author';
import Dropzone from 'react-dropzone';


/**
 * Component to render the new article form
 */
class ArticleForm extends React.Component {
  /**
   * Constructor method
   */
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      subtitle: "",
      image: "",
      body: [
        {
          componentType: "text",
          body: "",
        },
      ],
      error: "",
      redirectToHome: false,
      pendingSubmit: false,
    };

    // Bind this to helper methods
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeSubtitle = this.handleChangeSubtitle.bind(this);
    this.handleChangeImage = this.handleChangeImage.bind(this);
    this.handleChangeBody = this.handleChangeBody.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addNewComponent = this.addNewComponent.bind(this);
    this.inputValid = this.inputValid.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  /**
   * Handle resizing textarea
   */
  componentDidMount() {
    // Upate the title
    document.title = "Nalda | New Article";

    // Expand textareas to fit input
    autosize(document.querySelectorAll('textarea'));

    // Autocomplete the user's city
    const location = document.getElementById("location");
    const options = {
      componentRestrictions: {country: 'us'},
    };
    new google.maps.places.Autocomplete(location, options);
  }

  /**
   * When the component updates
   */
  componentDidUpdate() {
    // Resize all textarea to fit the size of their inputs
    autosize(document.querySelectorAll('textarea'));
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
   * Helper method to handle a change to the subtitle state
   */
  handleChangeSubtitle(event) {
    this.setState({
      subtitle: event.target.value,
    });
  }

  /**
   * Helper method to handle a change to the image state
   */
  handleChangeImage(event) {
    this.setState({
      image: event.target.value,
    });
  }

  /**
   * Helper method to handle a change to the body state
   */
  handleChangeBody(event, index) {
    // Manipulate the correct component object
    const bodyObj = this.state.body;
    bodyObj[index].body = event.target.value;

    // Update the state
    this.setState({
      body: bodyObj,
    });
  }

  /**
   * Helper method to add a new component to the body
   */
  addNewComponent(type) {
    // Create the new component
    const component = {
      componentType: type,
      body: "",
    };

    // Find and update the body object
    const bodyObj = this.state.body;
    bodyObj.push(component);

    // Update the state
    this.setState({
      body: bodyObj,
    });
  }

  /**
   * Helper method to make sure all input is valid
   */
  inputValid() {
    // Begin error checking
    if (!this.state.title) {
      this.setState({
        error: "Title must be populated.",
        pendingSubmit: false,
      });
      return false;
    } else if (!this.state.subtitle) {
      this.setState({
        error: "Subtitle must be populated.",
        pendingSubmit: false,
      });
      return false;
    } else if (!this.state.body) {
      this.setState({
        error: "Body must be populated.",
        pendingSubmit: false,
      });
      return false;
    } else if (this.state.title.length < 4 || this.state.title.length > 100) {
      this.setState({
        error: "Title must be between 4 and 100 characters long.",
        pendingSubmit: false,
      });
      return false;
    } else if (this.state.subtitle.length < 4 || this.state.subtitle.length > 200) {
      this.setState({
        error: "Subtitle must be between 4 and 200 characters long.",
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

    // Set the error to the empty string
    this.setState({
      error: "",
    });
    return true;
  }

  // Helper method for image uploads
  onDrop(acceptedFiles, rejectedFiles) {
    if (acceptedFiles.length) {
      const pic = acceptedFiles[0];
      console.log('dank', pic.preview);
      this.setState({
        image: pic.preview,
      });
    } else {
      this.setState({
        error: rejectedFiles[0].name + ' is not an image.',
      });
    }
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

    if (this.inputValid()) {
      // Find the longitude and latitude of the location passed in
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': location }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          // Isolate the coordinates of the location
          const latitude = results[0].geometry.location.lat();
          const longitude = results[0].geometry.location.lng();

          // Post to backend
          axios.post('/api/articles/new', {
            title: this.state.title,
            subtitle: this.state.subtitle,
            image: this.state.image,
            body: this.state.body,
            userId: this.props.userId,
            location: {
              name: location,
              lat: latitude,
              lng: longitude,
            },
          })
            .then(res => {
              if (res.data.success) {
                // If creating the article was successful
                this.setState({
                  articleId: res.data.data._id,
                  redirectToHome: true,
                });
              } else {
                this.setState({
                  error: res.data.error,
                  pendingSubmit: false,
                });
              }
            })
            .catch(err => {
              // If there was an error in making the request
              this.setState({
                error: err,
                pendingSubmit: false,
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
        { this.state.redirectToHome && <Redirect to={`/articles/${this.state.articleId}`}/> }
        <Medium>
          <div className="card thin-form no-pad">
            <div className="tabs">
              <Link className="tab active" to="/articles/new">Article</Link>
              <Link className="tab" to="/listings/new">Listing</Link>
              <Link className="tab" to="/videos/new">Video</Link>
            </div>

            {/* Render the author information */}
            <Author
              name={ this.props.name }
              _id={ this.props.userId }
              profilePicture={ this.props.profilePicture }
            />

            <form onSubmit={ this.handleSubmit } id="article-form">
              {
                this.state.error ? (
                  <div className="alert alert-danger">
                    <p className="bold marg-bot-05">
                      An error occured:
                    </p>
                    <p className="marg-bot-0">
                      { this.state.error }
                    </p>
                  </div>
                ) : (
                  ""
                )
              }
              <textarea
                rows="1"
                name="title"
                type="text"
                id="title"
                placeholder="Title"
                className="form-control marg-bot-05 special"
                value={ this.state.title }
                onChange={ this.handleChangeTitle }
              />

              <textarea
                rows="1"
                name="subtitle"
                type="text"
                id="subtitle"
                placeholder="Subtitle"
                className="form-control marg-bot-1 special"
                value={ this.state.subtitle }
                onChange={ this.handleChangeSubtitle }
              />

              {
                this.state.image && (
                  <img src={ this.state.image } alt={ this.state.title } className="img-fluid" />
                )
              }

              {
                this.state.image ? console.log('image', this.state.image) : null
              }

              <input
                name="image"
                type="text"
                placeholder="Enter a URL to an image"
                className="form-control marg-bot-1"
                value={ this.state.image }
                onChange={ this.handleChangeImage }
              />

              {/* TODO Style this */}
              <Dropzone
                onDrop={this.onDrop}
                accept="image/*"
                >
                <p>Try dropping some files here, or click to select files to upload.</p>
              </Dropzone>

              <input
                name="title"
                type="text"
                id="location"
                className="form-control marg-bot-2"
              />

              {
                this.state.body.map((component, index) => {
                  // Determine the placeholder and class names for the component
                  let placeholder = "";
                  let className = "";
                  if (component.componentType === "text") {
                    placeholder = "Tell your story...";
                    className = "special";
                  } else if (component.componentType === "image") {
                    placeholder = "Enter a URL to an image...";
                    className = "image";
                  } else if (component.componentType === "quote") {
                    placeholder = "Enter a quote...";
                    className = "special quote";
                  } else if (component.componentType === "header") {
                    placeholder = "Type some header text...";
                    className = "special header";
                  }

                  // Return the textarea associated with the component
                  return (
                    <div key={ index }>
                      {
                        (component.componentType === "image" && this.state.body[index].body) && (
                          <img
                            src={ this.state.body[index].body }
                            alt={ this.state.title }
                            className="img-fluid"
                          />
                        )
                      }
                      <div className="component">
                        <textarea
                          placeholder={ placeholder }
                          name="body"
                          type="text"
                          className={ "form-control marg-bot-1 " + className }
                          rows="1"
                          value={ this.state.body[index].body }
                          onChange={ (e) => this.handleChangeBody(e, index) }
                        />
                        {
                          (index !== 0 || this.state.body.length > 1) && (
                            <i
                              className="fa fa-trash-o"
                              aria-hidden="true"
                              onClick={() => {
                                const bodyObj = this.state.body;
                                bodyObj.splice(index, 1);
                                this.setState({
                                  body: bodyObj,
                                });
                              }}
                            />
                          )
                        }
                      </div>
                    </div>
                  );
                })
              }

              <div className="line" />

              <div className="icons marg-bot-1">
                <i
                  className="fa fa-align-justify fa-fw"
                  aria-hidden="true"
                  onClick={ () => this.addNewComponent("text") }
                />
                <i
                  className="fa fa-picture-o fa-fw"
                  aria-hidden="true"
                  onClick={ () => this.addNewComponent("image") }
                />
                <i
                  className="fa fa-quote-right fa-fw"
                  aria-hidden="true"
                  onClick={ () => this.addNewComponent("quote") }
                />
                <i
                  className="fa fa-i-cursor fa-fw"
                  aria-hidden="true"
                  onClick={ () => this.addNewComponent("header") }
                />
              </div>

              <input
                type="submit"
                value={ this.state.pendingSubmit ? "Creating article..." : "Create article" }
                className={
                  !this.state.pendingSubmit &&
                  this.state.title &&
                  this.state.subtitle &&
                  this.state.body[0].body ? (
                    "btn btn-primary full-width"
                  ) : (
                    "btn btn-primary disabled full-width"
                  )
                }
                onSubmit={(e) => this.handleSubmit(e)}
              />
            </form>
          </div>
        </Medium>
        <div className="space-2" />
      </div>
    );
  }
}

ArticleForm.propTypes = {
  userId: PropTypes.string,
  name: PropTypes.string,
  profilePicture: PropTypes.string,
};

// Necessary so we can access this.props.userId
const mapStateToProps = (state) => {
  return {
    userId: state.authState.userId,
    name: state.authState.name,
    profilePicture: state.authState.profilePicture,
  };
};

// Redux config
export default connect(
  mapStateToProps,
)(ArticleForm);
