import React, {Component} from 'react';
import axios from 'axios';
import ErrorMessage from '../shared/ErrorMessage';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
// Import actions
import {notifyMessage} from '../../actions/notification';

// Form to add a new component to the homepage
class NewComponent extends Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the initial state
    this.state = {
      title: "",
      subtitle: "",
      contentType: "Listings",
      error: '',
    };

    // Bind this to helper methods
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // Handle a change to one of the fields
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  // Handle the user submitting the form
  handleSubmit(event) {
    // Prevent the default form submission
    event.preventDefault();

    // Pull relevant into from the state
    const {title, subtitle, contentType} = this.state;

    // Error checking
    if (!title || !subtitle || !contentType) {
      this.setState({error: 'All fields must be populated.'});
      return;
    }

    axios.post('/api/home/component/add', {title, subtitle, contentType})
      .then(resp => {
        if (resp.data.error) {
          this.setState({error: resp.data.error});
        } else {
          this.props.notifyMessage("Successfully added component.");
          // TODO refresh
        }
      })
      .catch(error => this.setState({error}));
  }

  // Render the component
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <ErrorMessage error={this.state.error} />
        <div className="line" />
        <h4 className="marg-bot-1">
          Add a new homepage component
        </h4>
        <label>
          Title
        </label>
        <input
          name="title"
          placeholder="Section title"
          value={this.state.title}
          onChange={this.handleChange}
          className="form-control marg-bot-1"
        />
        <label>
          Subtitle
        </label>
        <input
          name="subtitle"
          placeholder="Section subtitle"
          onChange={this.handleChange}
          value={this.state.subtitle}
          className="form-control marg-bot-1"
        />

        <label>
          Content Type
        </label>
        <select
          name="contentType"
          placeholder="Section subtitle"
          onChange={this.handleChange}
          value={this.state.contentType}
          className="form-control marg-bot-1"
        >
          <option>Listings</option>
          <option>Articles</option>
          <option>Videos</option>
        </select>
        <input
          className="btn btn-primary marg-bot-1"
          value="Submit section"
          type="submit"
        />
      </form>
    );
  }
}
// Prop validations
NewComponent.propTypes = {
  notifyMessage: PropTypes.func,
};

const mapStateToProps = () => {
  return {
  };
};

// Redux
const mapDispatchToProps = dispatch => {
  return {
    notifyMessage: (message) => dispatch(notifyMessage(message)),
  };
};

NewComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewComponent);

export default NewComponent;
