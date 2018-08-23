import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import Loading from '../shared/Loading';
import Preview from '../content/Preview';
import ArticleSearchResults from './ArticleSearchResults';
import ListingSearchResults from './ListingSearchResults';
import VideoSearchResults from './VideoSearchResults';
import Author from '../shared/Author';

class Search extends Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      search: '',
      error: false,
      suggestions: {
        articles: [],
        listings: [],
        videos: [],
        curators: [],
        events: [],
      },
      active: false,
      pending: false,
    };

    // Bindings so 'this' refers to component
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.renderSuggestions = this.renderSuggestions.bind(this);
    this.getSearchResults = this.getSearchResults.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.areNoResults = this.areNoResults.bind(this);
  }

  /**
   * When the state changes
   */
  componentDidUpdate(prevProps, prevState) {
    // If there was a change in the active state
    if (prevState.active !== this.state.active) {
      // Update the state of the parent nav component
      // Leveraging the callback function supplied from it in the props
      this.props.callback(this.state.active);
    }

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

    // Set timeout ensures that fast typers search won't be missed
    setTimeout(() => {
      if (this.state.search) {
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
    }, 100);
  }

  areNoResults() {
    const {
      articles,
      listings,
      videos,
      events,
      curators,
    } = this.state.suggestions;

    const data = [
      articles,
      listings,
      videos,
      events,
      curators,
    ];

    return !data.some((arr) => (arr && arr.length));
  }

  /**
   * Handle when a user types into search bar
   */
  handleChangeSearch(event) {
    // Isolate the value from the event
    const value = event.target.value;

    if (!value) {
      // If the user deleted what they were searching for
      this.setState({
        suggestions: {
          articles: [],
          listings: [],
          videos: [],
          curators: [],
          events: [],
        },
        search: '',
      });
    } else {
      this.setState({
        search: value,
      });
    }
  }

  handleClick() {
    this.setState({
      active: false,
    });
  }

  /**
   * Handle the user submitting the form by pressing enter
   */
  handleSubmit(event) {
    event.preventDefault();

    window.location.href = `/search?search=${this.state.search}`;
  }

  /**
   * Render suggestions to the user
   */
  renderSuggestions() {
    if (this.state.active) {
      return (
        <div className="suggestions">
          <div className="container-fluid">
            { /* This will only be populated if the user is logged in */
              this.props.location ? (
                <p className="location small">
                  Results in { this.props.location }
                </p>
              ) : null
            }

            <ArticleSearchResults
              handleClick={this.handleClick}
              articles={this.state.suggestions.articles} />

            <ListingSearchResults
              handleClick={this.handleClick}
              listings={this.state.suggestions.listings} />

            <VideoSearchResults
              handleClick={this.handleClick}
              videos={this.state.suggestions.videos} />

            {
              this.state.suggestions.events.length ? (
                <div>
                  <h4>Events</h4>
                  {
                    this.state.suggestions.events.map(e => (
                      <Preview
                        key={`search-event-${e._id}`}
                        content={e}
                        contentType="event"
                        handleClick={this.handleClick}
                      />
                    ))
                  }
                </div>
              ) : null
            }

            {
              this.state.suggestions.curators.length ? (
                <div>
                  <h4>Curators</h4>
                  {
                    this.state.suggestions.curators.map(c => (
                      <Author
                        key={`search-curator-${c._id}`}
                        name={c.name}
                        _id={c._id}
                        handleClick={this.handleClick}
                        profilePicture={c.profilePicture}
                      />
                    ))
                  }
                </div>
              ) : null
            }
            {
              this.areNoResults() ? (
                <div>
                  <h4 className="gray-text">
                    ...
                  </h4>
                </div>
              ) : null
            }

            { this.state.pending && <Loading /> }
          </div>
        </div>
      );
    }

    // If the navbar is not active, show no results
    return null;
  }

  /**
   * Render the search bar
   */
  render() {
    return (
      <div className={this.state.active ? 'search active' : 'search'}>
        <i
          className="fa fa-search cursor small"
          aria-hidden="true"
          onClick={ () => {
            // Focus on the search element
            document.getElementById('search').focus();

            // Update the state for the searchbar to be active
            this.setState({
              active: true,
            });
          }}
        />

        <i
          className="fa fa-search cursor large"
          aria-hidden="true"
          onClick={ () => {
            // Focus on the search element
            document.getElementById('search-large').focus();

            // Update the state for the searchbar to be active
            this.setState({
              active: true,
            });
          }}
        />

        <form onSubmit={this.handleSubmit} className="small">
          <input
            className="form-control"
            id="search"
            value={ this.state.seach }
            onChange={ this.handleChangeSearch }
            onClick={ () => this.setState({ active: true }) }
            ref={(input) => { this.nameInput = input; }}
            placeholder="Search"
          />
        </form>

        <form onSubmit={this.handleSubmit} className="large">
          {
            this.props.location ? (
              <p className="location">
                { this.props.location }
              </p>
            ) : null
          }

          <input
            className="form-control"
            id="search-large"
            value={ this.state.seach }
            onChange={ this.handleChangeSearch }
            onClick={ () => this.setState({ active: true }) }
            placeholder="Search for activities, restaurants, and more"
          />
        </form>

        {this.renderSuggestions()}

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

Search.propTypes = {
  callback: PropTypes.func,
  location: PropTypes.string,
};

export default Search;
