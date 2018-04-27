import React, {Component} from 'react';

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
    console.log("SUBMITTED");
  }

  // Render the component
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
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
        <button className="btn btn-primary marg-bot-1">
          Submit section
        </button>
      </form>
    );
  }
}

export default NewComponent;
