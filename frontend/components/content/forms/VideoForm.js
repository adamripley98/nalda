import React from 'react';
import Medium from '../../shared/Medium';
import autosize from 'autosize';
import { Link } from 'react-router-dom';

/**
 * Component to render the new article form
 */
class ArticleForm extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      video: "",
      description: "",
      error: "",
    };

    // Bind this to helper methods
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeVideo = this.handleChangeVideo.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
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

  // Helper method to handle a change to the video state
  handleChangeVideo(event) {
    this.setState({
      image: event.target.value,
    });
  }

  // Helper method to handle a change to the description state
  handleChangeDescription(event) {
    this.setState({
      description: event.target.value,
    });
  }

  // Helper method to handle when the form is submitted
  handleSubmit(event) {
    // Prevent the default submit action
    event.preventDefault();

    // Begin error checking
    if (!this.state.title) {
      this.setState({
        error: "Title must be populated.",
      });
    } else if (!this.state.subtitle) {
      this.setState({
        error: "Subtitle must be populated.",
      });
    } else if (!this.state.body) {
      this.setState({
        error: "Body must be populated.",
      });
    } else if (!this.state.video) {
      this.setState({
        error: "Video must be populated",
      });
    } else if (this.state.title.length < 4 || this.state.title.length > 100) {
      this.setState({
        error: "Title must be between 4 and 100 characters long.",
      });
    } else if (this.state.description.length < 4) {
      this.setState({
        error: "Description must be at least 4 characters long",
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
      <div>
        <Medium>
          <div className="card thin-form no-pad">
            <div className="tabs">
              <Link className="tab" to="/articles/new">Article</Link>
              <Link className="tab" to="/listings/new">Listing</Link>
              <Link className="tab active" to="/videos/new">Video</Link>
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
                rows="1"
                value={ this.state.description }
                onChange={ this.handleChangeDescription }
              />
              <input
                type="submit"
                value="Create Video"
                className={
                  this.state.title && this.state.video && this.state.description ? (
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

export default ArticleForm;
