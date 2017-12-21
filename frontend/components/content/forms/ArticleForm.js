// Import frameworks
import React from 'react';
import Medium from '../../shared/Medium';
import autosize from 'autosize';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

/**
 * Component to render the new article form
 */
class ArticleForm extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      subtitle: "",
      image: "",
      body: "",
      error: "",
      redirectToHome: false,
    };

    // Bind this to helper methods
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeSubtitle = this.handleChangeSubtitle.bind(this);
    this.handleChangeImage = this.handleChangeImage.bind(this);
    this.handleChangeBody = this.handleChangeBody.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Handle resizing textarea
  componentDidMount() {
    autosize(document.querySelectorAll('textarea'));
  }

  redirectToHome() {
    console.log('goes into redirect');
    return (
      <Redirect to="/"/>
    );
  }

  // Helper method to handle a change to the title state
  handleChangeTitle(event) {
    this.setState({
      title: event.target.value,
    });
  }

  // Helper method to handle a change to the subtitle state
  handleChangeSubtitle(event) {
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

  // Helper method to handle a change to the body state
  handleChangeBody(event) {
    this.setState({
      body: event.target.value,
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
    } else if (this.state.title.length < 4 || this.state.title.length > 100) {
      this.setState({
        error: "Title must be between 4 and 100 characters long.",
      });
    } else if (this.state.subtitle.length < 4 || this.state.subtitle.length > 200) {
      this.setState({
        error: "Subtitle must be between 4 and 200 characters long.",
      });
    } else if (this.state.body.length < 4) {
      this.setState({
        error: "Body must be at least 4 characters long",
      });
    } else {
      // Set the error to the empty string
      this.setState({
        error: "",
      });
      // Otherwise, the request is properly formulated. Post request to routes.js
      axios.post('/articles/new', {
        title: this.state.title,
        subtitle: this.state.subtitle,
        image: this.state.image,
        body: this.state.body,
      })
      .then((resp) => {
        console.log('what is resp', resp.data);
        this.setState({
          redirectToHome: true,
        });
      })
      .catch((err) => {
        console.log('there was an error', err);
      });
    }
  }

  // Render the component
  render() {
    return (
      <Medium>
        { this.state.redirectToHome && <Redirect to="/home"/> }
        <div className="card thin-form no-pad">
          <div className="tabs">
            <Link className="tab active" to="/articles/new">Article</Link>
            <Link className="tab" to="/listings/new">Listing</Link>
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
              Subtitle
            </label>
            <input
              name="subtitle"
              type="text"
              className="form-control marg-bot-1"
              value={ this.state.subtitle }
              onChange={ this.handleChangeSubtitle }
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
              Body
            </label>
            <textarea
              name="body"
              type="text"
              className="form-control marg-bot-1"
              rows="1"
              value={ this.state.body }
              onChange={ this.handleChangeBody }
            />
            <input
              type="submit"
              value="Create Article"
              className={
                this.state.title && this.state.subtitle && this.state.body ? (
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
    );
  }
}

export default ArticleForm;
