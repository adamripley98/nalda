import React, { Component } from 'react';
import axios from 'axios';

/**
 * Renders the search bar on the navbar
 * TODO search functionality
 */
class Search extends Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      search: "",
    };

    // Bindings so 'this' refers to component
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
  }

  /**
   * Handle when a user types into search bar
   */
  handleChangeSearch(event) {
    this.setState({
      search: event.target.value,
    });
  }

  /**
   * Handle when a user searches for something
   */
  handleSubmitSearch(event) {
    event.preventDefault();
    axios.post('/api/search', {
      search: this.state.search,
    })
    .then((resp) => {
      if (!resp.data.success) {
        // TODO: Display error
        console.log('Error searching', resp.data.error);
      } else {
        // TODO: Display results on the frontend
        // TODO: Clear search input
        console.log('results are:', resp.data.data);
      }
    })
    .catch((err) => {
      // TODO: Display error
      console.log('Error searching:', err);
    });
  }

  /**
   * Render the search bar
   */
  render() {
    return (
      <div className="search">
        <i className="fa fa-search" aria-hidden="true" />
        <input
          className="form-control small"
          value={ this.state.seach }
          onChange={ this.handleChangeSearch }
          placeholder="Search"
        />
        <input
          className="form-control large"
          value={ this.state.seach }
          onChange={ this.handleChangeSearch }
          placeholder="Search for activities, places, or curators"
        />
        <input
          type="submit"
          value="Search"
          onClick={this.handleSubmitSearch}
        />
      </div>
    );
  }
}

export default Search;
