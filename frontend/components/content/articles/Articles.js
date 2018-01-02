// Import frameworks
import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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
    };
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

  // Methods renders each individual article
  renderArticles() {
    // If articles are pulled from the database
    if (this.state.articles && this.state.articles.length) {
      return this.state.articles.map((art) => (
        <ArticlePreview
          _id={ art._id }
          title={ art.title }
          subtitle={ art.subtitle }
          imag={ art.image }
        />
      ));
    }

    // If no listings were found
    return (
      <div className="col-12">
        <div className="card pad-1 marg-bot-1">
          No listings were found. Check back soon for more content!
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
