import React from 'react';
import Medium from '../shared/Medium';
import GrayWrapper from '../shared/GrayWrapper';
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
      subtitle: "",
      image: "",
      body: "",
      error: "",
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

    /**
     * TODO error checking
     */

    /**
     * TODO make the request
     */
  }

  // Render the component
  render() {
    return (
      <GrayWrapper>
        <Medium>
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
                Image
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
                className="btn btn-primary full-width"
              />
            </form>
          </div>
        </Medium>
      </GrayWrapper>
    );
  }
}

export default ArticleForm;
