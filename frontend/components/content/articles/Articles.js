// Import frameworks
import React from 'react';
import axios from 'axios';

// Import shared components
import Loading from '../../shared/Loading';
import ErrorMessage from '../../shared/ErrorMessage';
import Button from '../../shared/Button';
import Preview from '../Preview';

/**
 * Component for displaying all articles of the application
 * TODO: Only show first 20 or so articles on a page
 */
class Articles extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      articles: [],
      pending: true,
      error: "",
      currentSort: "date",
      isAscending: false,
    };

    // Bind this to helper methods
    this.sortByDate = this.sortByDate.bind(this);
    this.sortByTitle = this.sortByTitle.bind(this);
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

    // Sort depending on the current state
    if (this.state.currentSort === "date") {
      // Reverse the articles
      sortedArticles.reverse();

      // Update the state
      this.setState({
        articles: sortedArticles,
        isAscending: !this.state.isAscending,
      });
    } else {
      // Sort articles based off date
      sortedArticles.sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });

      // Update the state
      this.setState({
        currentSort: "date",
        articles: sortedArticles,
        isAscending: false,
      });
    }
  }

  // Method to sort by title
  sortByTitle() {
    // Define variable
    const sortedArticles = Object.assign([], this.state.articles);

    // Sort depending on the current state
    if (this.state.currentSort === "title") {
      // Reverse the articles
      sortedArticles.reverse();

      // Update the state
      this.setState({
        articles: sortedArticles,
        isAscending: !this.state.isAscending,
      });
    } else {
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

      // Update the state
      this.setState({
        currentSort: "title",
        articles: sortedArticles,
        isAscending: false,
      });
    }
  }

  // Methods renders each individual article
  renderArticles() {
    // If articles are pulled from the database
    if (this.state.articles && this.state.articles.length) {
      return this.state.articles.map((art) => (
        <Preview
          _id={ art._id }
          key={ art._id }
          title={ art.title }
          subtitle={ art.subtitle }
          image={ art.image }
          isArticle
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
        <h3 className="title section-title">
          Articles
        </h3>
        <div className="sort-options">
          <div
            className={ this.state.currentSort === "date" ? "sort-option active" : "sort-option" }
            onClick={ this.sortByDate }
          >
            Sort by date {
              this.state.currentSort === "date" ? (
                this.state.isAscending ? (
                  <i className="fa fa-chevron-up" aria-hidden />
                ) : (
                  <i className="fa fa-chevron-up rotated" aria-hidden />
                )
              ) : null
            }
          </div>
          <div
            className={ this.state.currentSort === "title" ? "sort-option active" : "sort-option" }
            onClick={ this.sortByTitle }
          >
            Sort by title {
              this.state.currentSort === "title" ? (
                this.state.isAscending ? (
                  <i className="fa fa-chevron-up" aria-hidden />
                ) : (
                  <i className="fa fa-chevron-up rotated" aria-hidden />
                )
              ) : null
            }
          </div>
        </div>
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
