// Import frameworks
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

// Import components
import Tags from '../shared/Tags';
import Loading from '../shared/Loading';
import ErrorMessage from '../shared/ErrorMessage';
import Blurb from '../shared/Blurb';
import Preview from './Preview';
import Author from '../shared/Author';

/**
 * Component to render search results in it's own page
 */
class SearchResults extends Component {
  constructor(props) {
    super(props);

    // Parse the URL
    const query = this.props.location.search;
    const string = decodeURIComponent(query.substring(query.indexOf('=') + 1));

    // Set the initial state
    this.state = {
      pending: true,
      error: '',
      articles: [],
      listings: [],
      events: [],
      videos: [],
      curators: [],
      search: string,
    };

    // Bind this to helper methods
    this.renderResults = this.renderResults.bind(this);
    this.isEmpty = this.isEmpty.bind(this);
  }

  componentDidMount() {
    // Make a request for search data
    axios.post('/api/search', {search: this.state.search})
      .then(res => {
        if (!res.data.success) {
          this.setState({
            error: res.data.error,
            pending: false,
          });
          return;
        }

        // If data was pulled successfully
        this.setState({
          pending: false,
          articles: res.data.data.articles,
          listings: res.data.data.listings,
          videos: res.data.data.videos,
          curators: res.data.data.curators,
          events: res.data.data.events,
        });
      })
      .catch(err => this.setState({error: err.message}));
  }

  // Helper method to return if there is any data in the passed in array
  isEmpty(array) {
    return (!array || array.length === 0);
  }

  renderResults() {
    // Check if there are any search results at all
    if (this.isEmpty(this.state.articles) &&
        this.isEmpty(this.state.videos) &&
        this.isEmpty(this.state.listings) &&
        this.isEmpty(this.state.events) &&
        this.isEmpty(this.state.curators)
    ) {
      return (<Blurb message={`No search results for \"${this.state.search}\"`} />);
    }

    // If there is data
    return (
      <div>
        {this.isEmpty(this.state.listings) ? null : (
          <div>
            <h4 className="title section-title">Listings</h4>
            {
              this.state.listings.map(l => (
                <Preview
                  content={l}
                  contentType="listing"
                  key={l._id}
                />
              ))
            }
            <div className="space-2" />
          </div>
        )}
        {this.isEmpty(this.state.events) ? null : (
          <div>
            <h4 className="title section-title">Events</h4>
            {
              this.state.events.map(e => (
                <Preview
                  content={e}
                  contentType="listing"
                  key={e._id}
                />
              ))
            }
            <div className="space-2" />
          </div>
        )}
        {this.isEmpty(this.state.articles) ? null : (
          <div>
            <h4 className="title section-title">Articles</h4>
            {
              this.state.articles.map(a => (
                <Preview
                  content={a}
                  contentType="article"
                  key={a._id}
                />
              ))
            }
            <div className="space-2" />
          </div>
        )}
        {this.isEmpty(this.state.videos) ? null : (
          <div>
            <h4 className="title section-title">Videos</h4>
            {
              this.state.videos.map(v => (
                <Preview
                  content={v}
                  contentType="video"
                  key={v._id}
                />
              ))
            }
            <div className="space-2" />
          </div>
        )}
        {this.isEmpty(this.state.curators) ? null : (
          <div>
            <h4 className="title section-title">Curators</h4>
            {
              this.state.curators.map(c => (
                <Author
                  name={c.name}
                  profilePicture={c.profilePicture}
                  _id={c._id}
                  key={c._id}
                />
              ))
            }
          </div>
        )}
      </div>
    );
  }

  render() {
    // If data is still being pulled
    if (this.state.pending) return (<Loading />);

    // If data has been pulled
    return (
      <div className="container home">
        <Tags title="Listings" description="View all listings" />
        <div className="space-1"/>
        <h3 className="title section-title">
          Search results
        </h3>
        <ErrorMessage error={this.state.error} />
        {this.renderResults()}
      </div>
    );
  }
}

SearchResults.propTypes = {
  location: PropTypes.object,
};

export default SearchResults;
