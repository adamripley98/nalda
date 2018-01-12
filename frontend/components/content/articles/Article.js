// Import frameworks
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import axios from 'axios';

// Import shared components
import Button from '../../shared/Button';
import Loading from '../../shared/Loading';
import NotFoundSection from '../../NotFoundSection';

/**
 * Component to render an article
 * TODO error handling
 * TODO remove dummy state for profile picture
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
        profilePicture: "https://scontent-lga3-1.xx.fbcdn.net/v/t31.0-8/19800933_1555674071163224_6756529645784213707_o.jpg?oh=d3ce5cc19160312229b760b7448d3c67&oe=5A8FEE3B",
      },
      title: "",
      subtitle: "",
      image: "",
      body: [],
      pending: true,
    };
    // Bind this to helper methods
    this.renderAuthor = this.renderAuthor.bind(this);
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
                    <div className="buttons right marg-bot-1">
                      <div
                        className="btn btn-primary btn-sm"
                        onClick={ () => console.log("edit") }
                      >
                        Edit
                      </div>
                      <div
                        className="btn btn-danger btn-sm"
                        onClick={ () => console.log("delete") }
                      >
                        Delete
                      </div>
                    </div>
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
};

export default Article;
