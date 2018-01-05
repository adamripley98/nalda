// Import frameworks
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import Button from '../../shared/Button';
import axios from 'axios';
import Loading from '../../shared/Loading';
import ErrorMessage from '../../shared/ErrorMessage';

/**
 * Component to render an article
 * TODO error handling
 * TODO remove dummy state
 */
class Article extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);

    // TODO: Remove dummy state
    this.state = {
      error: "",
      author: {
        name: "",
        _id: "",
        profilePicture: "https://scontent-lga3-1.xx.fbcdn.net/v/t31.0-8/19800933_1555674071163224_6756529645784213707_o.jpg?oh=d3ce5cc19160312229b760b7448d3c67&oe=5A8FEE3B",
      },
      article: {},
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
            article: res.data.data,
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
          <Link className="name" to={`/users/${this.state.article.author._id}`}>
            { this.state.article.author.name }
          </Link>
          <p className="timestamp">
            {this.state.time}
          </p>
        </div>
      </div>
    );
  }

  // Render the component
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2 article">
            {
              (this.state.pending) ? (
                <Loading />
              ) : (
                <div>
                  {
                    this.state.error && <ErrorMessage error={this.state.error} />
                  }
                  <h1>
                    { this.state.article.title }
                  </h1>
                  <h3>
                    { this.state.subtitle }
                  </h3>
                  { this.renderAuthor() }
                  <img src={ this.state.article.image } alt={ this.state.article.title } className="img-fluid" />
                  <p>
                    { this.state.article.body }
                  </p>
                  <div className="space-1" />
                  <Button />
                </div>
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

const mapStateToProps = () => {
  return {
  };
};

const mapDispatchToProps = () => {
  return {};
};

// Redux config
Article = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Article);

export default Article;
