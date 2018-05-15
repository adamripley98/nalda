import React, {Component} from 'react';
import Tags from '../shared/Tags';

/**
 * Component to render search results
 */
class SearchResults extends Component {
  render() {
    return (
      <div className="container home">
        <Tags title="Listings" description="View all listings" />
        <div className="space-1"/>
        <h3 className="title section-title">
          Search results
        </h3>
      </div>
    );
  }
}

export default SearchResults;
