import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

/**
 * Renders the search bar on the navbar
 * TODO Style search button, clear input field when search is done, display errors on frontend, display content somehow
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
    };

    // Bindings so 'this' refers to component
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.renderSuggestions = this.renderSuggestions.bind(this);
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
      axios.post('/api/search', {
        search: this.state.search,
      })
        .then((resp) => {
          if (!resp.data.success) {
            this.setState({
              error: true,
            });
          } else {
            // There is no error
            this.setState({
              error: false,
            });

            // TODO: Display results on the frontend
            // TODO: Clear search input
            console.log('results are:', resp.data.data);

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
          });
        });
    }
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
    if (this.state.suggestions &&
        this.state.active && (
        this.state.suggestions.articles.length ||
        this.state.suggestions.listings.length ||
        this.state.suggestions.videos.length ||
        this.state.suggestions.curators.length
    )) {
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
                        <Link key={ a._id } to={ `/articles/${a._id}` }>
                          { a.title }
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
                        <Link key={ l._id } to={ `/listings/${l._id}` }>
                          { l.title }
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
                        <Link key={ v._id } to={ `/videos/${v._id}` }>
                          { v.title }
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
                        <Link key={ c._id } to={ `/users/${c._id}` }>
                          { c.name }
                        </Link>
                      ))
                    }
                  </div>
                ) : null
              }
            </div>
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
              onClick={ () => this.setState({ active: false }) }
            />
          )
        }
      </div>
    );
  }
}

export default Search;
