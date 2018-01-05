// Import frameworks
import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Import components
import Loading from './shared/Loading';
import ErrorMessage from './shared/ErrorMessage';
import Button from './shared/Button';
import ArticlePreview from './content/articles/ArticlePreview';

/**
 * Component for the search results of the application
 */
class  SearchResults extends React.Component {
  /**
   * Constructor method
   */
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      articles: [],
      listings: [],
      videos: [],
      curators: [],
    };
  }

  /**
   * Load data once the component mounts
   * Pulls articles, listings, videos, and curators simultaneously
   */
  componentDidMount() {
    // Pull all articles from the database
    axios.get('/api/search')
      .then((resp) => {
        if (resp.data.success) {
          // TODO update state with data
        } else {
          this.setState({
            pending: false,
            error: resp.data.error,
          });
        }
      })
      .catch(err => {
        this.setState({
          pending: false,
          error: err,
        });
      });
  }

  // Function to render the component
  render() {
    return (
      <div className="container home">
        <div className="space-1"/>
        { this.state.error && <ErrorMessage error={ this.state.error } /> }
        <h1>this is a test component</h1>
        <div className="space-2" />
      </div>
    );
  }
}

SearchResults.propTypes = {
  openCurrentArticle: PropTypes.func,
};

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = () => {
  return {};
};

// Redux config
SearchResults = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchResults);

export default SearchResults;
