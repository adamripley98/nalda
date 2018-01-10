// Import frameworks
import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Import components
import Loading from '../shared/Loading';

/**
 * Renders the search bar on the navbar
 * TODO clicking search icon should toggle search
 */
class Search extends Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      search: "",
      error: false,
      suggestions: {
        articles: [],
        listings: [],
        videos: [],
        curators: [],
      },
      active: false,
      pending: false,
    };

    // Bindings so 'this' refers to component
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.renderSuggestions = this.renderSuggestions.bind(this);
    this.getSearchResults = this.getSearchResults.bind(this);
  }

  /**
   * When the state changes
   */
  componentDidUpdate(prevProps, prevState) {
    // If there was no change in search state
    if (prevState.search === this.state.search) {
      return;
    }

    // Else, if there was change in search state
    if (!this.state.error && this.state.search) {
      this.getSearchResults();
    }
  }

  /**
   * Helper method to search
   */
  getSearchResults() {
    // Denote that new results are on the way
    this.setState({
      pending: true,
    });

    // Get new search results
    axios.post('/api/search', {
      search: this.state.search,
    })
      .then((resp) => {
        if (!resp.data.success) {
          this.setState({
            error: true,
            pending: false,
          });
        } else {
          // There is no error
          this.setState({
            error: false,
            pending: false,
          });

          // Update the suggestions
          this.setState({
            suggestions: resp.data.data,
          });
        }
      })
      .catch(() => {
        // If there was an error
        this.setState({
          error: true,
          pending: false,
        });
      });
  }

  /**
   * Handle when a user types into search bar
   */
  handleChangeSearch(event) {
    // Isolate the value from the event
    const value = event.target.value;

    // Check if the value is empty and update the state accordingly
    if (!value) {
      this.setState({
        suggestions: {
          articles: [],
          listings: [],
          videos: [],
          curators: [],
        },
        search: "",
      });
    } else {
      this.setState({
        search: value,
      });
    }
  }

  /**
   * Render suggestions to the user
   */
  renderSuggestions() {
    if (this.state.active) {
      return (
        <div className="suggestions">
          <div className="container-fluid">
            <div className="row">
              {
                this.state.suggestions.articles.length ? (
                  <div className="col-12 col-md-6 col-xl-3">
                    <h4>Articles</h4>
                    {
                      this.state.suggestions.articles.map(a => (
                        // NOTE: Tempory fix issue where won't reload page
                        <Link key={ a._id } onClick={location.reload} to={ `/articles/${a._id}` }>
                          { a.title }
                          <div/>
                        </Link>
                      ))
                    }
                  </div>
                ) : null
              }
              {
                this.state.suggestions.listings.length ? (
                  <div className="col-12 col-md-6 col-xl-3">
                    <h4>Listings</h4>
                    {
                      this.state.suggestions.listings.map(l => (
                        // NOTE: Tempory fix issue where won't reload page
                        <Link key={ l._id } onClick={location.reload} to={ `/listings/${l._id}` }>
                          { l.title }
                          <div/>
                        </Link>
                      ))
                    }
                  </div>
                ) : null
              }
              {
                this.state.suggestions.videos.length ? (
                  <div className="col-12 col-md-6 col-xl-3">
                    <h4>Videos</h4>
                    {
                      this.state.suggestions.videos.map(v => (
                        // NOTE: Tempory fix issue where won't reload page
                        <Link key={ v._id } onClick={location.reload} to={ `/videos/${v._id}` }>
                          { v.title }
                          <div/>
                        </Link>
                      ))
                    }
                  </div>
                ) : null
              }
              {
                this.state.suggestions.curators.length ? (
                  <div className="col-12 col-md-6 col-xl-3">
                    <h4>Curators</h4>
                    {
                      this.state.suggestions.curators.map(c => (
                        // NOTE: Tempory fix issue where won't reload page
                        <Link key={ c._id } onClick={location.reload} to={ `/users/${c._id}` }>
                          { c.name }
                          <div/>
                        </Link>
                      ))
                    }
                  </div>
                ) : null
              }
              {
                !this.state.suggestions.articles.length &&
                !this.state.suggestions.listings.length &&
                !this.state.suggestions.videos.length &&
                !this.state.suggestions.curators.length ? (
                  <div className="col-12">
                    <h4 className="gray-text">
                      ...
                    </h4>
                  </div>
                ) : null
              }
            </div>

            { this.state.pending && <Loading /> }
          </div>
        </div>
      );
    }

    return null;
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
          onClick={ () => this.setState({ active: true }) }
          placeholder="Search"
        />
        <input
          className="form-control large"
          value={ this.state.seach }
          onChange={ this.handleChangeSearch }
          onClick={ () => this.setState({ active: true }) }
          placeholder="Search for activities, places, or curators"
        />
        {
          this.renderSuggestions()
        }
        {
          this.state.active && (
            <div
              className="search-shade"
              onClick={ () => this.setState({
                active: false,
              }) }
            />
          )
        }
      </div>
    );
  }
}

export default Search;
