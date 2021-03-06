// Import frameworks
import React from 'react';
import autosize from 'autosize';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

// Import components
import ErrorMessage from '../../shared/ErrorMessage';
import Blurb from '../../shared/Blurb';

// Component to render the form to review applications
class ReviewForm extends React.Component {
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      rating: 0.0,
      title: "",
      content: "",
      active: false,
      error: "",
    };

    // Bind this to helper methods
    this.handleChangeRating = this.handleChangeRating.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeContent = this.handleChangeContent.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClickForm = this.handleClickForm.bind(this);
  }

  componentDidMount() {
    autosize(document.querySelectorAll('textarea'));
  }

  handleChangeRating(event) {
    this.setState({
      rating: event.target.value,
    });
  }

  handleChangeTitle(event) {
    this.setState({
      title: event.target.value,
    });
  }

  handleChangeContent(event) {
    this.setState({
      content: event.target.value,
    });
  }

  handleClickForm() {
    this.setState({
      active: true,
    });
  }

  handleSubmit(event) {
    // Prevent the default form action
    event.preventDefault();
    // Post to backend
    if (!this.state.title) {
      this.setState({
        error: "Title must be populated.",
      });
    } else if (!this.state.content) {
      this.setState({
        error: "Content must be populated.",
      });
    } else {
      axios.post('/api/reviews/new', {
        rating: this.state.rating,
        title: this.state.title,
        content: this.state.content,
        userId: this.props.userId,
        listingId: this.props.listingId,
      })
        .then(() => {
          // Calls parent component (Listing.js) method to display new review
          this.props.updateReviews();

          // Clear fields after submission
          this.setState({
            rating: 0.0,
            title: '',
            content: '',
          });
        })
        .catch((err) => {
          this.setState({
            error: err.response.data.error || err.response.data,
          });
        });
    }
  }

  render() {
    // If the user is not logged in, they cannot leave a review.
    // Thus, the form does not display but rather text prompting the user
    // to log in (or create an account).
    if (!this.props.userId) {
      return (
        <Blurb message="You must be logged in to leave a review." margBot />
      );
    }

    // Else, if the user is logged in, render the form
    return (
      <form onSubmit={ this.handleSubmit } id="reviewForm" className="thin-form border">
        <ErrorMessage error={ this.state.error } />

        {
          this.state.active ? (
            <div>
              <div className="row">
                <div className="col-8 col-md-6 col-lg-4">
                  <select
                    className="form-control marg-bot-1"
                    value={ this.state.rating }
                    onChange={ this.handleChangeRating }
                  >
                    <option>0.0</option>
                    <option>0.5</option>
                    <option>1.0</option>
                    <option>1.5</option>
                    <option>2.0</option>
                    <option>2.5</option>
                    <option>3.0</option>
                    <option>3.5</option>
                    <option>4.0</option>
                    <option>4.5</option>
                    <option>5.0</option>
                  </select>
                </div>
              </div>
              <input
                placeholder="Review title..."
                className="form-control marg-bot-1 bold"
                value={ this.state.title }
                onChange={ this.handleChangeTitle }
                type="text"
              />
              <textarea
                placeholder="Review content..."
                rows="1"
                className="form-control marg-bot-1"
                value={ this.state.content }
                onChange={ this.handleChangeContent }
                type="text"
              />

              <input
                type="submit"
                value="Submit review"
                className={
                  this.state.title && this.state.content ? (
                    "btn btn-primary right"
                  ) : (
                    "btn btn-primary disabled right"
                  )
                }
              />
            </div>
          ) : (
            <div onClick={ this.handleClickForm } className="cursor">
              <p className="gray">
                Leave your own review...
              </p>
            </div>
          )
        }
      </form>
    );
  }
}

ReviewForm.propTypes = {
  userId: PropTypes.string,
  listingId: PropTypes.string,
  updateReviews: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    userId: state.authState.userId,
  };
};

// Redux config
ReviewForm = connect(
  mapStateToProps,
)(ReviewForm);

export default ReviewForm;
