import React from 'react';
import Medium from '../../shared/Medium';
import autosize from 'autosize';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

// Import components
import ErrorMessage from '../../shared/ErrorMessage';

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
    };

    // Bind this to helper methods
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeVideo = this.handleChangeVideo.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Handle resizing textarea
   */
  componentDidMount() {
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
   * Helper method to handle when the form is submitted
   */
  handleSubmit(event) {
    // Prevent the default submit action
    event.preventDefault();

    // Begin error checking
    if (!this.state.title) {
      this.setState({
        error: "Title must be populated.",
      });
    } else if (!this.state.url) {
      this.setState({
        error: "Video url must be populated",
      });
    } else if (this.state.title.length < 4 || this.state.title.length > 100) {
      this.setState({
        error: "Title must be between 4 and 100 characters long.",
      });
    } else if (this.state.description.length < 4) {
      this.setState({
        error: "Description must be at least 4 characters long",
      });
    } else if (this.state.description.length > 10000) {
      this.setState({
        error: "Description must be less than 10000 characters long.",
      });
    } else if (!this.state.url.startsWith("https://www.youtube.com/watch?v=")) {
      this.setState({
        error: "Video URL must be properly formatted. That is, it must begin with \"https://www.youtube.com/watch?v=\" followed by the video ID.",
      });
    } else {
      // Otherwise, the request is properly formulated
      this.setState({
        error: "",
      });
      // Post to backend creating new video
      axios.post('/api/videos/new', {
        title: this.state.title,
        description: this.state.description,
        url: this.state.url,
      })
      .then((resp) => {
        if (!resp.data.success) {
          // Display error on frontend
          this.setState({
            error: resp.data.error,
          });
        } else {
          // Redirect to home after successful submission
          this.setState({
            videoId: resp.data.data._id,
            redirectToHome: true,
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
            <div className="tabs">
              <Link className="tab" to="/articles/new">Article</Link>
              <Link className="tab" to="/listings/new">Listing</Link>
              <Link className="tab active" to="/videos/new">Video</Link>
            </div>
            <form className="pad-1" onSubmit={ this.handleSubmit }>
              <ErrorMessage error={ this.state.error } />
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
                  this.state.title && this.state.url && this.state.description ? (
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

export default VideoForm;
