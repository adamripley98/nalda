import React, { Component } from 'react';

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
  }

  /**
   * Handle when a user searches for something
   */
  handleChangeSearch(event) {
    this.setState({
      search: event.target.value,
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
      </div>
    );
  }
}

export default Search;
