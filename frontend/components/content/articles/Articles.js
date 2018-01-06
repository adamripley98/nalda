// Import frameworks
import React from 'react';
import axios from 'axios';
import Loading from '../../shared/Loading';
import ErrorMessage from '../../shared/ErrorMessage';
import Button from '../../shared/Button';
import ArticlePreview from './ArticlePreview';

/**
 * Component for the homepage of the application
 */

 // TODO: Only show first 20 or so articles on a page
class Articles extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      articles: [],
      pending: true,
      error: "",
      currentSort: "",
      titleSortedAscending: false,
      dateSortedAscending: false,
    };

    // Bind this to helper methods
    this.sortByDate = this.sortByDate.bind(this);
    this.sortByTitle = this.sortByTitle.bind(this);
    this.sortByAuthor = this.sortByAuthor.bind(this);
  }

  // Load articles from Mongo once thre component mounts
  componentDidMount() {
    axios.get('/api/articles')
    .then((resp) => {
      if (resp.data.success) {
        this.setState({
          articles: resp.data.data,
          pending: false,
          error: "",
        });
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

  // Method to sort by date
  sortByDate() {
    // Define variable
    const sortedArticles = Object.assign([], this.state.articles);

    if (!this.state.dateSortedAscending) {
      // Sort articles based off date
      sortedArticles.sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
    } else {
      // If already sorted ascending, reverse to show descending
      sortedArticles.reverse();
    }

    // Display sorted articles
    this.setState({
      articles: sortedArticles,
      dateSortedAscending: !this.state.dateSortedAscending,
      titleSortedAscending: false,
    });
  }

  // Method to sort by title
  sortByTitle() {
    // Define variable
    const sortedArticles = Object.assign([], this.state.articles);

    if (!this.state.titleSortedAscending) {
      // Sort articles based off title
      sortedArticles.sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        // names must be equal
        return 0;
      });
    } else {
      // If already sorted ascending, reverse to show descending
      sortedArticles.reverse();
    }

    // Display sorted articles
    this.setState({
      articles: sortedArticles,
      titleSortedAscending: !this.state.titleSortedAscending,
      dateSortedAscending: false,
    });
  }

  // Method to sort by author
  sortByAuthor() {
    // TODO implement
  }

  // Methods renders each individual article
  renderArticles() {
    // If articles are pulled from the database
    if (this.state.articles && this.state.articles.length) {
      console.log('arts', this.state.articles);
      return this.state.articles.map((art) => (
        <ArticlePreview
          _id={ art._id }
          title={ art.title }
          subtitle={ art.subtitle }
          image={ art.image }
        />
      ));
    }

    // If no articles were found
    return (
      <div className="col-12">
        <div className="card pad-1 marg-bot-1">
          No articles were found. Check back soon for more content!
        </div>
      </div>
    );
  }

  // Function to render the component
  render() {
    return (
      <div className="container home">
        <div className="space-1"/>
        <h3 className="title">
          Articles
        </h3>
        <div onClick={this.sortByTitle}>Sort by title</div>
        <div onClick={this.sortByDate}>Sort by date</div>
        <div className="row">
          {
            this.state.pending ? (
              <Loading />
            ) : (
              this.state.error ? (
                <ErrorMessage error={ this.state.error } />
              ) : (
                this.renderArticles()
              )
            )
          }
          {
            !this.state.pending && (
              <div className="col-12 marg-top-1">
                <Button />
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default Articles;
