import React, {Component} from 'react';
import autosize from 'autosize';
import axios from 'axios';
import {connect} from 'react-redux';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';

// Import components
import NewComponent from '../NewComponent';
import ErrorMessage from '../../shared/ErrorMessage';

// Import actions
import {notifyMessage} from '../../../actions/notification';

// TODO fix on drop
// TODO refresh adding/deleting content
// TODO error on both forms

class ManageHomepage extends Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      error: '',
      bannerContentId: '',
      bannerImageToAdd: '',
      bannerImagePreview: '',
      bannerImageName: '',
      pending: true,
      banner: [],
      components: [],
    };

    // Bind this to helper methods
    this.onDrop = this.onDrop.bind(this);
    this.editHomepage = this.editHomepage.bind(this);

    // Helper methods for the banner
    this.handleChangeBannerContentId = this.handleChangeBannerContentId.bind(this);
    this.onSubmitRemoveBannerContent = this.onSubmitRemoveBannerContent.bind(this);
    this.onSubmitChangeBanner = this.onSubmitChangeBanner.bind(this);
    this.displayBanner = this.displayBanner.bind(this);

    // Helper methods for components
    this.onSubmitContent = this.onSubmitContent.bind(this);
    this.onRemoveContent = this.onRemoveContent.bind(this);
    this.onRemoveComponent = this.onRemoveComponent.bind(this);
    this.displayList = this.displayList.bind(this);
    this.updateComponents = this.updateComponents.bind(this);
  }

  componentDidMount() {
    // Scroll to the top of the screen
    window.scrollTo(0, 0);

    // Resize textarea to fit input
    autosize(document.querySelectorAll('textarea'));

    // Pull data to display on admin panel
    axios.get('/api/admin')
    .then((resp) => {
      this.setState({
        banner: resp.data.homepageContent ? resp.data.homepageContent.banner : [],
        components: resp.data.homepageContent ? resp.data.homepageContent.components : [],
        pending: false,
        to: '',
      });
    })
    .catch(error => {
      this.setState({
        error: error.response.data.error || error.response.data,
        pending: false,
      });
    });
  }

  // Handle when a user types into the email field
  handleChangeEmail(event) {
    this.setState({
      email: event.target.value,
    });
  }

  // Handle when admin types into content to add field
  handleChangeBannerContentId(event) {
    this.setState({
      bannerContentId: event.target.value,
    });
  }

  // Helper method to change which images are on the banner
  onSubmitChangeBanner(event) {
    // Prevent the default action
    event.preventDefault();

    // Pull needed information
    const bannerContentId = this.state.bannerContentId;
    const bannerImageToAdd = this.state.bannerImageToAdd;
    if (!bannerContentId) {
      this.setState({
        error: 'Enter a content Id.',
      });
    } else if (!bannerImageToAdd) {
      this.setState({
        error: 'Select an image to upload.',
      });
    } else {
      // Post to backend to add content to banner
      axios.post('/api/home/banner/add', {
        bannerContentId,
        bannerImageToAdd,
      })
      .then(resp => {
        // Notify success to the user
        this.props.notifyMessage("Successfully added banner image.");

        // Set the state
        this.setState({
          error: '',
          banner: resp.data.banner,
          bannerContentId: '',
          bannerImageToAdd: '',
          bannerImageName: '',
          bannerImagePreview: '',
        });
      })
      .catch(err => {
        this.setState({
          error: err.response.data.error || err.response.data,
          bannerContentId: '',
          bannerImageToAdd: '',
        });
      });
    }
  }

  // Helper method to remove a banner item
  onSubmitRemoveBannerContent(bannerContentId) {
    axios.post(`/api/home/banner/remove/${bannerContentId}`)
    .then(resp => {
      this.props.notifyMessage("Successfully removed banner image");
      this.setState({
        error: '',
        banner: resp.data.data,
      });
    })
    .catch(err => {
      this.setState({
        error: err.response.data.error || err.response.data,
      });
    });
  }

  // Helper method for image uploads
  onDrop(acceptedFiles, rejectedFiles) {
    // Ensure at least one valid image was uploaded
    if (acceptedFiles.length) {
      const image = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (upload) => {
        // Set images to state
        this.setState({
          bannerImageToAdd: upload.target.result,
          bannerImagePreview: image.preview,
          bannerImageName: image.name,
          error: '',
        });
      };
      // File reader set up
      reader.onabort = () => this.setState({error: "File read aborted."});
      reader.onerror = () => this.setState({error: "File read error."});
      reader.readAsDataURL(image);
    }
    if (rejectedFiles.length) {
      // Display error with wrong file type
      this.setState({
        error: rejectedFiles[0].name + ' is not an image.',
      });
    }
  }

  updateComponents(newComponents) {
    this.setState({
      components: newComponents,
      error: '',
    });
  }

  // Helper method to display banner options
  displayBanner() {
    let banner = null;
    if (this.state.banner && this.state.banner.length) {
      banner = this.state.banner.map((image, i) => {
        return (
          <li key={image.contentId}>
            <img
              src={image.contentImage}
              alt={"banner image " + i}
            />
            <div onClick={() => this.onSubmitRemoveBannerContent(image.contentId)}>
              <i className="fa fa-close" aria-hidden="true" />
            </div>
          </li>
        );
      });
    }

    return (
      <div>
        <h4>Banner</h4>
        <input
          type="text"
          placeholder="Content ID"
          className="form-control marg-bot-1 border"
          value={ this.state.bannerContentId }
          onChange={ this.handleChangeBannerContentId }
          rows="1"
        />
        {
          (this.state.bannerImageToAdd && this.state.bannerImagePreview) ? (
            <img src={this.state.bannerImagePreview} alt="Banner preview" className="img-fluid img" style={{width: "10rem"}} />
          ) : null
        }
        <Dropzone
          onDrop={(acceptedFiles, rejectedFiles) => this.onDrop(acceptedFiles, rejectedFiles)}
          accept="image/*"
          style={{ marginBottom: "1rem" }}
        >
          <p className="dropzone">
            <i className="fa fa-file-o" aria-hidden="true" />
            {
              this.state.bannerImageName ? (
                this.state.bannerImageName
              ) : ("Try dropping an image here, or click to select image to upload.")
            }
          </p>
        </Dropzone>
        <button
          onClick={e => this.onSubmitChangeBanner(e)}
          className={
            this.state.bannerContentId ? (
              "btn btn-primary cursor marg-bot-1"
            ) : (
              "btn btn-primary disabled marg-bot-1"
            )
          }
        >
          Add content to homepage banner
        </button>

        {
          (banner && banner.length) ? (
            <ul className="carousel-preview">
              {banner}
            </ul>
          ) : null
        }

        <div className="line" />
      </div>
    );
  }

  // Helper method to add content to a specific homepage component
  onSubmitContent(event, component, contentId) {
    event.preventDefault();
    if (contentId) {
      axios.post('/api/home/component/content/add', {
        component,
        contentId,
      })
      .then(resp => {
        if (resp.data.error) {
          this.setState({error: resp.data.error});
        } else {
          this.props.notifyMessage('Successfully added content.');
          this.setState({
            components: resp.data.data,
          });
        }
      })
      .catch(error => {this.setState(error);});
    } else {
      this.setState({
        error: 'Content Id must be provided.',
      });
    }
  }

  // Helper method to remove a piece of content from a component
  onRemoveContent(component, contentId) {
    if (component && contentId) {
      axios.post('/api/home/component/content/remove', {
        componentId: component._id,
        contentId,
      })
      .then(resp => {
        this.props.notifyMessage("Content removed.");
        this.setState({
          components: resp.data.components,
          error: '',
        });
      })
      .catch(error => this.setState({error: error.response.data.error || error.response.data}));
    } else {
      this.setState({error: 'Error removing content.'});
    }
  }

  // Helper method to remove a given component
  onRemoveComponent(component) {
    if (component) {
      axios.post('/api/home/component/remove', {
        componentId: component._id,
      })
      .then(resp => {
        this.props.notifyMessage("Component removed!");
        this.setState({
          error: '',
          components: resp.data.components,
        });
      })
      .catch(error => this.setState({error: error.response.data.error || error.response.data}));
    } else {
      this.setState({error: 'Error removing component.'});
    }
  }

  // Display a list of all content in a component
  displayList(component) {
    if (component.content && component.content.length) {
      const list = component.content.map((content, i) => (
        <tr key={content.contentId}>
          <th scope="row">{i + 1}</th>
          <td>{content.title}</td>
          <td>{content.contentId}</td>
          <td onClick={() => this.onRemoveContent(component, content.contentId)}>
            <i className="fa fa-close" aria-hidden="true" />
          </td>
        </tr>
      ));
      return list;
    }
    return null;
  }

  // Helper method to edit what is seen on homepage
  editHomepage() {
    let components = '';
    if (this.state.components && this.state.components.length) {
      components = this.state.components.map((component, i) => (
        <div key={component._id}>
          <ErrorMessage error={this.state.error} />
          <form onSubmit={(e) => this.onSubmitContent(e, component, document.getElementById(`contentId${i}`).value)}>
            <h4 className="bold marg-bot-1">
              {component.title}
            </h4>

            <p className="marg-bot-1">
              Enter the content Id of the {component.contentType.toLowerCase()} you would like to appear in this section of the homepage.
            </p>

            <div className="inline-field">
              <input
                type="text"
                placeholder="Content ID"
                className="form-control border"
                id={`contentId${i}`}
                rows="1"
              />
              <button
                className="btn btn-primary cursor"
              >
                Add
              </button>
            </div>
          </form>

          {
            (component.content && component.content.length) ? (
              <div>
                <div className="space-1" />
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Content ID</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {this.displayList(component)}
                  </tbody>
                </table>
              </div>
            ) : null
          }

          <div className="btn btn-sm btn-danger" onClick={() => this.onRemoveComponent(component)}>
            Remove component
          </div>

          <div className="line" />
        </div>
      ));
      return (components);
    }
    return null;
  }

  render() {
    return(
      <div>
        {this.displayBanner()}
        {this.editHomepage()}

        {/* Render a form to create a new homepage component*/}
        <NewComponent
          updateComponents={this.updateComponents}
         />
      </div>
    );
  }
}

// Prop validations
ManageHomepage.propTypes = {
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

ManageHomepage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManageHomepage);
export default ManageHomepage;
