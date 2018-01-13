// Import frameworks
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

// Import shared components
import Button from '../../shared/Button';
import Loading from '../../shared/Loading';
import NotFoundSection from '../../NotFoundSection';
import ErrorMessage from '../../shared/ErrorMessage';
import Author from '../../shared/Author';

/**
 * Component to render an article
 * TODO edit functionality
 */
class Article extends React.Component {
  /**
   * Constructor method
   */
  constructor(props) {
    super(props);

    this.state = {
      error: "",
      author: {
        name: "",
        _id: "",
        profilePicture: "",
      },
      title: "",
      subtitle: "",
      image: "",
      body: [],
      pending: true,
      canModify: false,
      redirectToHome: false,
      deleteError: "",
      pendingDelete: false,
    };

    // Bind this to helper methods
    this.deleteArticle = this.deleteArticle.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
  }

  /**
   * Pull the article data from the database
   */
  componentDidMount() {
    // Find the id in the url
    const id = this.props.match.params.id;

    // Find the article
    axios.get(`/api/articles/${id}`)
      .then(res => {
        if (res.data.success) {
          this.setState({
            error: "",
            ...res.data.data,
            author: res.data.author,
            pending: false,
            canModify: res.data.canModify,
          });
        } else {
          // If there was an error with the request
          this.setState({
            error: res.data.error,
            pending: false,
          });
        }
      })
      .catch(err => {
        // If there was an error making the request
        this.setState({
          error: err,
          pending: false,
        });
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
      if (resp.data.success) {
        // If the request was successful
        // Collapse the modal upon success
        $('#deleteModal').modal('toggle');

        // Update the state and redirect to home
        this.setState({
          redirectToHome: true,
          pendingDelete: false,
        });
      } else {
        this.setState({
          deleteError: resp.data.error,
          pendingDelete: false,
        });
      }
    })
    .catch(err => {
      this.setState({
        deleteError: err,
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
            to={`/articles/${this.state._id}/edit`}
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
                  <h5 className="modal-title" id="exampleModalLabel">
                    Delete article
                  </h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
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
    if (!this.state.pending && !this.state.title) {
      return (
        <NotFoundSection
          title="Article not found"
          content="Uh-oh! Looks like this article you are looking for was either moved or does not exist."
          url="/articles"
          urlText="Back to all articles"
        />
      );
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2 article">
            {
              (this.state.pending) ? (
                <Loading />
              ) : (
                this.state.error ? (
                  <NotFoundSection
                    title="Article not found"
                    content="Uh-oh! Looks like the article you were looking for was either removed or does not exist."
                    url="/articles"
                    urlText="Back to all articles"
                  />
                ) : (
                  <div>
                    { this.state.redirectToHome && <Redirect to="/"/> }
                    { this.renderButtons() }
                    <h1>
                      { this.state.title }
                    </h1>
                    <h3>
                      { this.state.subtitle }
                    </h3>

                    <Author
                      createdAt={ this.state.createdAt }
                      updatedAt={ this.state.updatedAt }
                      name={ this.state.author.name }
                      profilePicture={ this.state.author.profilePicture }
                      _id={ this.state.author._id }
                    />

                    <img src={ this.state.image } alt={ this.state.title } className="img-fluid" />
                    {
                      this.state.body.map((component, index) => {
                        if (component.componentType === "text") {
                          return (
                            <p key={ index }>
                              { component.body }
                            </p>
                          );
                        } else if (component.componentType === "image") {
                          return (
                            <img
                              key={ index }
                              src={ component.body }
                              alt={ this.state.title }
                              className="img-fluid"
                            />
                          );
                        } else if (component.componentType === "quote") {
                          return (
                            <p key={ index } className="quote">
                              { component.body }
                            </p>
                          );
                        }

                        // If there was not a component type match
                        return null;
                      })
                    }
                    <div className="space-1" />
                    <Button />
                  </div>
                )
              )
            }
          </div>
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
