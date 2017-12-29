// Import frameworks
import React, { Component } from 'react';
import autosize from 'autosize';
import axios from 'axios';

// Import components
import Thin from './shared/Thin';
import ErrorMessage from './shared/ErrorMessage';

/**
 * Component for Admin only, allows them to add and remove other admins and content curators
 * TODO Add removing functionality
 */
class Admin extends Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      email: "",
      error: "",
    };

    // Bind this to helper methods
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
  }

  // Resize textarea to fit input
  componentDidMount() {
    autosize(document.querySelectorAll('textarea'));
  }

  // Handle when a user types into the email field
  handleChangeEmail(event) {
    this.setState({
      email: event.target.value,
    });
  }

  // Handle a user submitting the form to add an admin
  onSubmitAdmin(event) {
    // Prevent the default action
    event.preventDefault();
    // Posts to routes.js
    axios.post('/api/admin/new', {
      userToAdd: this.state.email,
    })
    .then((resp) => {
      // Shows any errors
      if (resp.data.error) {
        this.setState({error: resp.data.error});
      } else {
        this.setState({error: ''});
        // TODO: Notify of successful change
      }
    }).catch((err) => {
      console.log('err', err);
    });
  }

  // Handle a user submitting the form to add a content curator
  onSubmitCurator(event) {
    // Prevent the default action
    event.preventDefault();
    // Posts to routes.js
    axios.post('/api/curator/new', {
      userToAdd: this.state.email,
    })
    .then((resp) => {
      // Shows any errors
      if (resp.data.error) {
        this.setState({error: resp.data.error});
      } else {
        this.setState({error: ''});
        // TODO: Notify of successful change
      }
    }).catch((err) => {
      console.log('err', err);
    });
  }

  // Render the component
  render() {
    return (
      <Thin>
        <form className="thin-form">
          <h2 className="bold marg-bot-1">Admin panel</h2>
          <p className="marg-bot-1">
            Enter a user's email address in order to add them as an admin or as a content curator.
          </p>
          <ErrorMessage error={ this.state.error } />
          <label>
            Email address
          </label>
          <textarea
            type="text"
            className="form-control marg-bot-1"
            value={ this.state.email }
            onChange={ this.handleChangeEmail }
            rows="1"
          />
          <button
            onClick={(e) => this.onSubmitAdmin(e)}
            className={
              this.state.email ? (
                "btn btn-primary full-width cursor"
              ) : (
                "btn btn-primary full-width disabled"
              )
            }
          >Add as admin</button>
          <button
            onClick={(e) => this.onSubmitCurator(e)}
            className={
              this.state.email ? (
                "btn btn-primary full-width cursor"
              ) : (
                "btn btn-primary full-width disabled"
              )
            }
          >Add as content curator</button>
        </form>
      </Thin>
    );
  }
}

export default Admin;
