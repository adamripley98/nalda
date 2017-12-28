// Import frameworks
import React from 'react';
import ErrorMessage from '../../shared/ErrorMessage';
import autosize from 'autosize';

/**
 * Component to render the form to review applications
 * TODO handle submit
 */
class ReviewForm extends React.Component {
  /**
   * Constructor method
   */
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

  /**
   * Handle when the component mounts
   */
  componentDidMount() {
    autosize(document.querySelectorAll('textarea'));
  }

  /**
   * Handle change to rating state
   */
  handleChangeRating(event) {
    this.setState({
      rating: event.target.value,
    });
  }

  /**
   * Handle change to title state
   */
  handleChangeTitle(event) {
    this.setState({
      title: event.target.value,
    });
  }

  /**
   * Handle change to content state
   */
  handleChangeContent(event) {
    this.setState({
      content: event.target.value,
    });
  }

  /**
   * Handle when the form is first clicked
   */
  handleClickForm() {
    this.setState({
      active: true,
    });
  }

  /**
   * Handle when a user submits the form
   * TODO
   */
  handleSubmit(event) {
    // Prevent the default form action
    event.preventDefault();

    // TODO
  }

  /**
   * Function to render the component
   */
  render() {
    return (
      <form onSubmit={ this.handleSubmit } className="thin-form">
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
            <div onClick={ this.handleClickForm }>
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

export default ReviewForm;
