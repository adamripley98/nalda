import React from 'react';
import Medium from '../shared/Medium';
import GrayWrapper from '../shared/GrayWrapper';
import autosize from 'autosize';
import { Link } from 'react-router-dom';

/**
 * Component to render the new article form
 */
class ListingForm extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      image: "",
      error: "",
    };

    // Bind this to helper methods
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleChangeImage = this.handleChangeImage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Handle resizing textarea
  componentDidMount() {
    autosize(document.querySelectorAll('textarea'));
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
      subtitle: event.target.value,
    });
  }

  // Helper method to handle a change to the image state
  handleChangeImage(event) {
    this.setState({
      image: event.target.value,
    });
  }

  // Helper method to handle when the form is submitted
  handleSubmit(event) {
    // Prevent the default submit action
    event.preventDefault();

    /**
     * TODO error checking for image
     */

    // Begin error checking
    if (!this.state.title) {
      this.setState({
        error: "Title must be populated.",
      });
    } else if (!this.state.description) {
      this.setState({
        error: "Description must be populated.",
      });
    } else if (this.state.title.length < 4 || this.state.title.length > 100) {
      this.setState({
        error: "Title must be between 4 and 100 characters long.",
      });
    } else if (this.state.description.length < 4 || this.state.description.length > 2000) {
      this.setState({
        error: "Subtitle must be between 4 and 2000 characters long.",
      });
    } else {
      // Set the error to the empty string
      this.setState({
        error: "",
      });

      // Otherwise, the request is properly formulated
      /**
       * TODO SEND THE REQEUST TO MAKE A NEW ARTICLE, AND REDIRECT
       */
    }
  }

  // Render the component
  render() {
    return (
      <GrayWrapper>
        <Medium>
          <div className="card thin-form no-pad">
            <div className="tabs">
              <Link className="tab" to="/articles/new">Article</Link>
              <Link className="tab active" to="/listings/new">Listing</Link>
              <Link className="tab" to="/videos/new">Video</Link>
            </div>
            <form className="pad-1" onSubmit={ this.handleSubmit }>
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
              <input
                type="submit"
                value="Create Listing"
                className={
                  this.state.title && this.state.description ? (
                    "btn btn-primary full-width"
                  ) : (
                    "btn btn-primary disabled full-width"
                  )
                }
              />
            </form>
          </div>
        </Medium>
      </GrayWrapper>
    );
  }
}

export default ListingForm;
