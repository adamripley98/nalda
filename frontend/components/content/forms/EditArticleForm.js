// Import frameworks
import React from 'react';
import autosize from 'autosize';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import EXIF from 'exif-js';

// Import components
import Loading from '../../shared/Loading';
import ErrorMessage from '../../shared/ErrorMessage';
import Medium from '../../shared/Medium';
import Tags from '../../shared/Tags';

// Import actions
import {notifyMessage} from '../../../actions/notification';

// Import helper functions
import {processImg, getTargetSize} from '../../../helperMethods/imageUploading';

/**
 * Component to render the edit article form
 */
class EditArticleForm extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      subtitle: "",
      image: "",
      imageName: "",
      imagePreview: "",
      body: [
        {
          componentType: "text",
          body: "",
        },
      ],
      error: "",
      pending: true,
      redirectToHome: false,
      pendingSubmit: false,
      changeOrder: false,
    };

    // Bind this to helper methods
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeSubtitle = this.handleChangeSubtitle.bind(this);
    this.handleChangeImage = this.handleChangeImage.bind(this);
    this.handleChangeBody = this.handleChangeBody.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addNewComponent = this.addNewComponent.bind(this);
    this.inputValid = this.inputValid.bind(this);
    this.switchBodyOrder = this.switchBodyOrder.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  // Handle resizing textarea
  componentDidMount() {
    window.scrollTo(0, 0);

    // Isolate the id
    const id = this.props.match.params.id;
    // Pull existing data from the database
    axios.get(`/api/articles/${id}`)
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
            error: res.data.error,
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
   * Format new textareas accordingly
   */
  componentDidUpdate(prevProps, prevState) {
    if (prevState.pending && !this.state.pending) {
      // Autocomplete the location field for the article
      const location = document.getElementById("location");
      if (location) {
        const options = {
          componentRestrictions: {country: 'us'},
        };
        new google.maps.places.Autocomplete(location, options);
      }

      // Update the location field
      document.getElementById('location').value = this.state.location.name;

      // Toggle tooltips
      $(() => {
        $('[data-toggle="tooltip"]').tooltip();
      });
    }

    // Autosize textarea components
    // This must be done outside of the if statement because a user can add
    // more body components which must be resizeable
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

  // Helper method for image uploads
  onDrop(acceptedFiles, rejectedFiles, index) {
    if (acceptedFiles.length) {
      const pic = acceptedFiles[0];
      // If first image
      if (index === "main") {
        const reader = new FileReader();
        // Convert from blob to a proper file object that can be passed to server
        reader.onload = (upload) => {
          var img = new Image();
          img.onload = () => {
            ((file, uri) => {
              const targetSize = getTargetSize(img, 2000);
              EXIF.getData(file, () => {
                const imgToSend = processImg(uri, targetSize.height, targetSize.width, img.width, img.height, EXIF.getTag(file, 'Orientation'));
                // Set images to state
                this.setState({
                  image: imgToSend,
                  imagePreview: imgToSend,
                  imageName: pic.name,
                  error: '',
                });
              });
            })(pic, upload.target.result);
          };
          img.src = upload.target.result;
        };
        // File reader set up
        reader.onabort = () => this.setState({error: "File read aborted."});
        reader.onerror = () => this.setState({error: "File read error."});
        reader.readAsDataURL(pic);
      } else {
        const reader = new FileReader();
        // Convert from blob to a proper file object that can be passed to server
        reader.onload = (upload) => {
          var img = new Image();
          img.onload = () => {
            ((file, uri) => {
              const targetSize = getTargetSize(img, 2000);
              EXIF.getData(file, () => {
                const imgToSend = processImg(uri, targetSize.height, targetSize.width, img.width, img.height, EXIF.getTag(file, 'Orientation'));
                // Set images to state
                const bodyObj = this.state.body;
                bodyObj[index].preview = pic.preview;
                bodyObj[index].body = imgToSend;
                this.setState({
                  body: bodyObj,
                  error: '',
                });
              });
            })(pic, upload.target.result);
          };
          img.src = upload.target.result;
        };
        // File reader set up
        reader.onabort = () => this.setState({error: "File read aborted."});
        reader.onerror = () => this.setState({error: "File read error."});
        reader.readAsDataURL(pic);
      }
    } else {
      // Display error with wrong file type
      this.setState({
        error: rejectedFiles[0].name + ' is not an image.',
      });
    }
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

  // Helper method to switch body order
  switchBodyOrder(direction, index) {
    const bodyObj = this.state.body;
    const temp = bodyObj[index];
    if (direction === 'up' && bodyObj[index - 1]) {
      bodyObj[index] = bodyObj[index - 1];
      bodyObj[index - 1] = temp;
    } else if (direction === 'down' && bodyObj[index + 1]) {
      bodyObj[index] = bodyObj[index + 1];
      bodyObj[index + 1] = temp;
    }
    this.setState({
      body: bodyObj,
    });
    return null;
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
          const latitude = results[0].geometry.location.lat();
          const longitude = results[0].geometry.location.lng();
          // Post to backend
          axios.post(`/api/articles/${this.state._id}/edit`, {
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
            .then((res) => {
              // Notify success
              this.props.notifyMessage("Successfully updated article.");

              // If creating the article was successful
              this.setState({
                articleId: res.data.article._id,
                redirectToHome: true,
              });
            })
            .catch(error => {
              // If there was an error in making the request
              this.setState({
                error: error.response.data.error || error.response.data,
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
        <Tags title="Edit Article" />
        { this.state.redirectToHome && <Redirect to={`/articles/${this.state.articleId}`}/> }
        <Medium>
          <div className="card thin-form no-pad">
            <form onSubmit={ this.handleSubmit } id="article-form">
              <h4 className="dark-gray-text title marg-bot-1">
                Edit article
              </h4>
              <ErrorMessage error={ this.state.error } />

              {
                this.state.pending ? (
                  <Loading />
                ) : (
                  <div>
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
                      this.state.imagePreview && (
                        <img src={ this.state.imagePreview } alt={ this.state.title } className="img-fluid" />
                      )
                    }
                    {
                      (this.state.image && this.state.image.indexOf("naldacampus") !== -1) && (
                        <img src={ this.state.image } alt={ this.state.title } className="img-fluid" />
                      )
                    }

                    <Dropzone
                      onDrop={(acceptedFiles, rejectedFiles) => this.onDrop(acceptedFiles, rejectedFiles, "main")}
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
                      Location
                    </label>

                    <input
                      name="title"
                      type="text"
                      id="location"
                      className="form-control marg-bot-2"
                    />

                    {
                      this.state.body.map((component, index) => {
                        // Determine the placeholder for the component
                        let placeholder = "";
                        let className = "";
                        if (component.componentType === "text") {
                          placeholder = "Enter text...";
                          className = "special";
                        } else if (component.componentType === "image") {
                          placeholder = "Enter URL to an image...";
                          className = "image";
                        } else if (component.componentType === "quote") {
                          placeholder = "Enter quote...";
                          className = "special quote";
                        } else if (component.componentType === "header") {
                          placeholder = "Type some header text...";
                          className = "special header";
                        }

                        // Return the textarea associated with the component
                        return (
                          <div key={ index }>
                            {
                              (component.componentType === "image" && this.state.body[index].preview) && (
                                <img
                                  src={ this.state.body[index].preview }
                                  alt={ this.state.title }
                                  className="img-fluid"
                                />
                              )
                            }
                            {
                              (component.componentType === "image" && this.state.body[index].body && this.state.body[index].body.indexOf("nalda") !== -1) && (
                                <img
                                  src={ this.state.body[index].body }
                                  alt={ this.state.title }
                                  className="img-fluid"
                                />
                              )
                            }
                            {
                              component.componentType === "image" && (
                                <Dropzone
                                  onDrop={(acceptedFiles, rejectedFiles) => this.onDrop(acceptedFiles, rejectedFiles, index)}
                                  accept="image/*"
                                  style={{ marginBottom: "1rem" }}
                                >
                                  <p className="dropzone">
                                    <i className="fa fa-file-o" aria-hidden="true" />
                                    {
                                      this.state.body[index].body ? (
                                        "Click here to change the image."
                                      ) : (
                                        "Try dropping an image here, or click to select image to upload."
                                      )
                                    }

                                    {
                                      (index !== 0 || this.state.body.length > 1) && (
                                        <i
                                          className="fa fa-trash-o"
                                          aria-hidden="true"
                                          onClick={() => {
                                            const bodyObj = this.state.body.slice();
                                            bodyObj.splice(index, 1);
                                            this.setState({
                                              body: bodyObj,
                                            });
                                          }}
                                        />
                                      )
                                    }
                                  </p>
                                </Dropzone>
                              )
                            }
                            {
                              component.componentType !== "image" && (
                                <div className="component">
                                  {
                                    (this.state.changeOrder && this.state.body[index - 1]) && (
                                      <i
                                        className="fa fa-arrow-up"
                                        aria-hidden="true"
                                        onClick={() => this.switchBodyOrder('up', index)}
                                      />
                                    )
                                  }
                                  {
                                    (this.state.changeOrder && this.state.body[index + 1]) && (
                                      <i
                                        className="fa fa-arrow-down"
                                        aria-hidden="true"
                                        onClick={() => this.switchBodyOrder('down', index)}
                                      />
                                    )
                                  }
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
                              )
                            }
                          </div>
                        );
                      })
                    }

                    <div className="line" />

                    <div className="icons marg-bot-1">
                      <i
                        className="fa fa-align-justify"
                        aria-hidden="true"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="New paragraph"
                        onClick={ () => this.addNewComponent("text") }
                      />
                      <i
                        className="fa fa-picture-o"
                        aria-hidden="true"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Insert image"
                        onClick={ () => this.addNewComponent("image") }
                      />
                      <i
                        className="fa fa-quote-right"
                        aria-hidden="true"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Insert block quote"
                        onClick={ () => this.addNewComponent("quote") }
                      />
                      <i
                        className="fa fa-i-cursor"
                        aria-hidden="true"
                        aria-hidden="true"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Insert header text"
                        onClick={ () => this.addNewComponent("header") }
                      />
                    </div>
                    <input
                      type="button"
                      value={ this.state.changeOrder ? "Done changing order" : "Change section order" }
                      className="btn btn-primary"
                      onClick={() => this.setState({changeOrder: !this.state.changeOrder})}
                    />
                    <div className="line" />

                    <input
                      type="submit"
                      value={ this.state.pendingSubmit ? "Updating article..." : "Update article" }
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

EditArticleForm.propTypes = {
  userId: PropTypes.string,
  match: PropTypes.object,
  notifyMessage: PropTypes.func,
};

// Necessary so we can access this.props.userId
const mapStateToProps = (state) => {
  return {
    userId: state.authState.userId,
  };
};

// Necessary to notify
const mapDispatchToProps = dispatch => {
  return {
    notifyMessage: (message) => dispatch(notifyMessage(message)),
  };
};

// Redux config
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditArticleForm);
