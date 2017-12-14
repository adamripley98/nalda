import React from 'react';
import Medium from '../../shared/Medium';
import GrayWrapper from '../../shared/GrayWrapper';
import autosize from 'autosize';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

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
      rating: "",
      price: "",
      hours: "",
      error: "",
      redirectToHome: "",
    };

    // Bind this to helper methods
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleChangeImage = this.handleChangeImage.bind(this);
    this.handleChangeHours = this.handleChangeHours.bind(this);
    this.handleChangeRating = this.handleChangeRating.bind(this);
    this.handleChangePrice = this.handleChangePrice.bind(this);
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
      description: event.target.value,
    });
  }

  // Helper method to handle a change to the image state
  handleChangeImage(event) {
    this.setState({
      image: event.target.value,
    });
  }

  // Helper method to handle a change to the rating state
  handleChangeRating(event) {
    this.setState({
      rating: event.target.value,
    });
  }

  // Helper method to handle a change to the price state
  handleChangePrice(event) {
    this.setState({
      price: event.target.value,
    });
  }

  // Helper method to handle a change to the hours state
  handleChangeHours(event) {
    this.setState({
      hours: event.target.value,
    });
  }

  // Helper method to handle when the form is submitted
  handleSubmit(event) {
    // Prevent the default submit action
    event.preventDefault();
    // If request is properly formulated, send request to make a new listing (routes.js)
    if (this.inputValid()) {
      console.log('input valid');
      axios.post('/listings/new', {
        title: this.state.title,
        image: this.state.image,
        description: this.state.description,
        hours: this.state.hours,
        rating: this.state.rating,
        price: this.state.price,
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

  // Helper method to check if all input is valid, returns true or false
  inputValid() {
    // Begin error checking
    // TODO: Error check for url
    if (!this.state.title) {
      this.setState({
        error: "Title must be populated.",
      });
      return false;
    } else if (!this.state.description) {
      this.setState({
        error: "Description must be populated.",
      });
      return false;
    } else if (this.state.title.length < 4 || this.state.title.length > 100) {
      this.setState({
        error: "Title must be between 4 and 100 characters long.",
      });
      return false;
    } else if (this.state.description.length < 4 || this.state.description.length > 2000) {
      this.setState({
        error: "Subtitle must be between 4 and 2000 characters long.",
      });
      return false;
    }
    // Set the error to the empty string if everything is valid
    this.setState({
      error: "",
    });
    return true;
  }

  // Render the component
  // TODO: Make Hours, Rating, and Price sliders, not text input
  render() {
    return (
      <GrayWrapper>
        {this.state.redirectToHome && <Redirect to="/home"/>}
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
              <label>
                Hours
              </label>
              <textarea
                name="body"
                type="text"
                className="form-control marg-bot-1"
                rows="1"
                value={ this.state.hours }
                onChange={ this.handleChangeHours }
              />
              <label>
                Rating
              </label>
              <textarea
                name="body"
                type="text"
                className="form-control marg-bot-1"
                rows="1"
                value={ this.state.rating }
                onChange={ this.handleChangeRating }
              />
              <label>
                Price
              </label>
              <textarea
                name="body"
                type="text"
                className="form-control marg-bot-1"
                rows="1"
                value={ this.state.price }
                onChange={ this.handleChangePrice }
              />
              <input
                type="submit"
                value="Create Listing"
                className={
                  this.state.title && this.state.description && this.state.hours && this.state.rating && this.state.price ? (
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
