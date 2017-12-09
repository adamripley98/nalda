// Import framworks
import React, { Component } from 'react';
import autosize from 'autosize';

// Import components
import Thin from './shared/Thin';
import GrayWrapper from './shared/GrayWrapper';

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
  handleSubmit(event) {
    // Prevent the default action
    event.preventDefault();

    // Error checking
    if (!this.state.name || this.state.email || this.state.message) {
      this.setState({
        error: "All fields must be populated."
      });
    } else {
      /**
       * TODO
       */
    }
  }

  // Render the component
  render() {
    return (
      <GrayWrapper>
        <Thin>
          <form className="thin-form">
            <h2 className="bold marg-bot-1">Contact us</h2>
            <p className="marg-bot-1">
              Questions or comments about the app? Interested in joining the Nalda team? Reach out and we will get back to you shortly.
            </p>
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
      </GrayWrapper>
    );
  }
}

export default Contact;
