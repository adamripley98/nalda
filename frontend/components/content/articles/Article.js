/* global $ */
// Import frameworks
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

// Import shared components
import Loading from '../../shared/Loading';
import ArticleNotFound from './ArticleNotFound';
import ErrorMessage from '../../shared/ErrorMessage';
import Author from '../../shared/Author';
import Tags from '../../shared/Tags';
import ArticleBody from './ArticleBody';

/**
 * Component to render an article
 */
class Article extends React.Component {
  /**
   * Constructor method
   */
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      author: {},
      article: {},
      pending: true,
      canModify: false,
      redirectToHome: false,
      deleteError: '',
      pendingDelete: false,
    };

    // Bind this to helper methods
    this.deleteArticle = this.deleteArticle.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
    this.init = this.init.bind(this);
  }

  /**
   * Pull the article data from the database
   */
  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.init();
    }
  }

  init() {
    window.scrollTo(0, 0);

    this.setState({
      pending: true,
    });

    // Find the id in the url
    const id = this.props.match.params.id;

    // Find the article
    axios.get(`/api/articles/${id}`)
      .then(res => {
        this.setState({
          error: '',
          article: res.data.article || {},
          author: res.data.author || {},
          pending: false,
          canModify: res.data.canModify || false,
        });
      })
      .catch(err => {
        if (err && err.response && err.response.status === 404) {
          this.setState({
            pending: false,
            notFound: true,
          });
        } else {
          // If there was an error making the request
          this.setState({
            error: (err && err.message) ? err.message : err,
            pending: false,
          });
        }
      });
  }

  /**
   * Helper method to delete specific article
   */
  deleteArticle() {
    // Set the state to denote the article is being deleted
    this.setState({
      pendingDelete: true,
    });

    // Find the id in the url
    const id = this.props.match.params.id;

    // Post to backend
    axios.delete(`/api/articles/${id}`)
      .then(resp => {
        // If the request was successful
        // Collapse the modal upon success
        $('#deleteModal').modal('toggle');

        // Update the state and redirect to home
        this.setState({
          redirectToHome: true,
          pendingDelete: false,
        });
      })
      .catch(error => {
        let errMessage = 'Something went wrong. Please try again.';

        if (error && error.response) {
          errMessage = error.response.data && error.response.data.error;
        }

        this.setState({
          deleteError: errMessage,
          pendingDelete: false,
        });
      });
  }

  /**
   * Helper method to render buttons to edit and the article
   */
  renderButtons() {
    // If the user is authorized to edit the article
    if (this.state.canModify) {
      return (
        <div className="buttons right marg-bot-1">
          <Link
            className="btn btn-primary btn-sm"
            to={`/articles/${this.state.article._id}/edit`}
          >
            Edit
          </Link>
          <button
            className="btn btn-danger btn-sm"
            type="button"
            data-toggle="modal"
            data-target="#deleteModal"
          >
            Delete
          </button>

          {/* Render the modal to confirm deleting the article */}
          <div className="modal fade" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="deleteModal" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Delete article
                  </h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span className="bars" aria-hidden="true">
                      <span className="bar" />
                      <span className="bar" />
                    </span>
                  </button>
                </div>
                <div className="modal-body left">
                  <ErrorMessage error={ this.state.deleteError } />
                  Permanently delete article? This cannot be un-done.
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                  <button
                    type="button"
                    className={ this.state.deletePending ? "btn btn-danger disabled" : "btn btn-danger" }
                    onClick={ this.deleteArticle }
                  >
                    { this.state.deletePending ? "Deleting article..." : "Delete article" }
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Else, return nothing
    return null;
  }

  // Render the component
  render() {
    // If the article is not found
    if (this.state.pending) return (<Loading />);
    if ((!this.state.pending && this.state.notFound) || this.state.error) return (<ArticleNotFound />);

    return (
      <div className="container">
        <Tags
          title={this.state.article.title}
          description={this.state.article.subtitle}
          image={this.state.article.image}
        />

        <div className="row article">
          <div className="col-12 col-md-10 offset-md-1">
            { this.state.redirectToHome && (<Redirect to="/"/>) }

            { this.renderButtons() }

            <h1 className="title">
              { this.state.article.title }
            </h1>
            <h3 className="subtitle">
              { this.state.article.subtitle }
            </h3>

            <Author
              createdAt={ this.state.article.createdAt }
              updatedAt={ this.state.article.updatedAt }
              name={ this.state.author.name }
              profilePicture={ this.state.author.profilePicture }
              _id={ this.state.author._id }
            />

            <img
              src={ this.state.article.image }
              alt={ this.state.article.title }
              className="img-fluid"
            />
          </div>

          <ArticleBody body={this.state.article.body} />
        </div>
      </div>
    );
  }
}

Article.propTypes = {
  match: PropTypes.object,
  userId: PropTypes.string,
};

export default Article;
