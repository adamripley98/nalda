// Import frameworks
import React, { Component } from 'react';
import autosize from 'autosize';
import axios from 'axios';

// Import components
import Thin from './shared/Thin';
import ErrorMessage from './shared/ErrorMessage';

/**
 * Component for contacting Nalda
 * TODO link this to Sendgrid?
 */
class Contact extends Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      name: "",
      email: "",
      message: "",
      error: "",
    };

    // Bind this to helper methods
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangeMessage = this.handleChangeMessage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Resize textarea to fit input
  componentDidMount() {
    autosize(document.querySelectorAll('textarea'));
  }

  // Handle when a user types into the name field
  handleChangeName(event) {
    this.setState({
      name: event.target.value,
    });
  }

  // Handle when a user types into the email field
  handleChangeEmail(event) {
    this.setState({
      email: event.target.value,
    });
  }

  // Handle when a user types into the message field
  handleChangeMessage(event) {
    this.setState({
      message: event.target.value,
    });
  }

  // Handle a user submitting the form
  // TODO: implement on the backend
  handleSubmit(event) {
    // Prevent the default action
    event.preventDefault();

    // Error checking
    if (!this.state.name || !this.state.email || !this.state.message) {
      this.setState({
        error: "All fields must be populated."
      });
    } else {
      // Remove any errors from a prior attempt
      this.setState({
        error: "",
      });
      // Send request to backend
      axios.post('/api/contact', {
        name: this.state.name,
        email: this.state.email,
        message: this.state.message,
      })
      .then((resp) => {
        console.log(resp.data);
        this.setState({
          error: resp.data.error + ' For now contact us at contact@naldaeasytravel.com',
        });
      })
      .catch((err) => {
        this.setState({
          error: err,
        });
      });
    }
  }

  // Render the component
  render() {
    return (
      <Thin>
        <form className="thin-form" onSubmit={this.handleSubmit}>
          <h2 className="bold marg-bot-1">Contact us</h2>
          <p className="marg-bot-1">
            Questions or comments about the app? Interested in joining the Nalda team? Reach out and we will get back to you shortly.
          </p>
          <ErrorMessage error={ this.state.error } />
          <div className="row">
            <div className="col-12 col-sm-6">
              <label>
                Name
              </label>
              <input
                type="text"
                className="form-control marg-bot-1"
                value={ this.state.name }
                onChange={ this.handleChangeName }
              />
            </div>
            <div className="col-12 col-sm-6">
              <label>
                Email
              </label>
              <input
                type="text"
                className="form-control marg-bot-1"
                value={ this.state.email }
                onChange={ this.handleChangeEmail }
              />
            </div>
          </div>
          <label>
            Message
          </label>
          <textarea
            type="text"
            className="form-control marg-bot-1"
            value={ this.state.message }
            onChange={ this.handleChangeMessage }
            rows="1"
          />
          <input
            type="submit"
            value="Send message"
            className={
              this.state.name && this.state.email && this.state.message ? (
                "btn btn-primary full-width cursor"
              ) : (
                "btn btn-primary full-width disabled"
              )
            }
          />
        </form>
      </Thin>
    );
  }
}

export default Contact;
