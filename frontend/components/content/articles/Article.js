// Import frameworks
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
/**
 * Component to render an article
 */
class Article extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);
    // TODO: Remove dummy state
    this.state = {
      user: {
        name: "Adam Ripley",
        profilePicture: "https://scontent-lga3-1.xx.fbcdn.net/v/t31.0-8/19800933_1555674071163224_6756529645784213707_o.jpg?oh=d3ce5cc19160312229b760b7448d3c67&oe=5A8FEE3B",
      }
    };
    // Bind this to helper methods
    this.renderAuthor = this.renderAuthor.bind(this);
  }

  // Helper method to render the author
  renderAuthor() {
    return(
      <div className="author">
        <div className="author-img" style={{ backgroundImage: `url(${this.state.user.profilePicture})` }}/>
        <div className="text">
          <p className="name">
            { this.state.user.name }
          </p>
          <p className="timestamp">
            A few hours ago
          </p>
        </div>
      </div>
    );
  }

  // Render the component
  // TODO: Style the 'Back to home' link
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2">
            <div className="card article pad-1">
              <h1>
                { this.props.article.title }
              </h1>
              <h3>
                { this.state.subtitle }
              </h3>
              { this.renderAuthor() }
              <img src={ this.props.article.image } alt={ this.props.article.title } className="img-fluid" />
              <p>
                { this.props.article.body }
              </p>
            </div>
            <div className="space-1" />
            <p className="marg-top-1 marg-bot-0">
              <Link to="/">Head back to home</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

Article.propTypes = {
  article: PropTypes.object,
};

const mapStateToProps = state => {
  return {
    article: state.articleState.article
  };
};

const mapDispatchToProps = () => {
  return {};
};

// Redux config
Article = connect(
    mapStateToProps,
    mapDispatchToProps
)(Article);

export default Article;
