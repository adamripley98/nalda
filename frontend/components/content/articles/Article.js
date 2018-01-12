// Import frameworks
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import axios from 'axios';
import {connect} from 'react-redux';


// Import shared components
import Button from '../../shared/Button';
import Loading from '../../shared/Loading';
import NotFoundSection from '../../NotFoundSection';

/**
 * Component to render an article
 * TODO error handling
 * TODO edit functionality
 */
class Article extends React.Component {
  // Constructor method
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
    };
    // Bind this to helper methods
    this.renderAuthor = this.renderAuthor.bind(this);
    this.deleteArticle = this.deleteArticle.bind(this);
    this.editArticle = this.editArticle.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
  }

  // Pull the article data from the database
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
            time: moment(res.data.timestamp).fromNow(),
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

  // Helper method to delete specific article
  deleteArticle() {
    // Find the id in the url
    const id = this.props.match.params.id;
    // Post to backend
    axios.post(`/api/articles/${id}/delete`)
    .then((resp) => {
      if (resp.data.success) {
        this.setState({
          redirectToHome: true,
        });
      } else {
        this.setState({
          error: resp.data.error,
        });
      }
    })
    .catch((err) => {
      this.setState({
        error: err,
      });
    });
  }

  // Helper method to edit specific article
  editArticle() {
    // TODO implement
    // TODO need to do frontend and backend error checks
    console.log('edit');
  }

  // Helper method to render the author
  renderAuthor() {
    return(
      <div className="author">
        <div className="author-img" style={{ backgroundImage: `url(${this.state.author.profilePicture})` }}/>
        <div className="text">
          <Link className="name" to={`/users/${this.state.author._id}`}>
            { this.state.author.name }
          </Link>
          <p className="timestamp">
            { this.state.time }
          </p>
        </div>
      </div>
    );
  }

  // Helper method to render buttons to edit and the article
  renderButtons() {
    // If the user is authorized to edit the article
    if (this.state.canModify) {
      return (
        <div className="buttons right marg-bot-1">
          <div
            className="btn btn-primary btn-sm"
            onClick={ () => this.editArticle() }
          >
            Edit
          </div>
          <div
            className="btn btn-danger btn-sm"
            onClick={ () => this.deleteArticle() }
          >
            Delete
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
                    { this.renderAuthor() }
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
