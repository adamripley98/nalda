// Import frameworks
import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loading from '../../shared/Loading';
import ErrorMessage from '../../shared/ErrorMessage';
import Button from '../../shared/Button';

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
    return this.state.articles.map((art) => (
      <div className="col-6 col-lg-4 col-xl-3" key={ art._id } >
        <Link to={ `/articles/${art._id}` } >
          <div className="article-preview">
            <img className="img-fluid" alt={art.title} src={art.image} />
            <h2 className="title">
              {art.title}
            </h2>
            <h6 className="subtitle">
              {art.subtitle}
            </h6>
          </div>
        </Link>
      </div>
    ));
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
