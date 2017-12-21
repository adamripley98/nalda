// Import frameworks
import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Component for the homepage of the application
 */
class Home extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      articles: [],
      redirectToArticle: false,
      articleClicked: '',
    };
  }

  // Load articles from Mongo once thre component mounts
  componentDidMount() {
    axios.get('/api/home')
    .then((resp) => {
      this.setState({
        articles: resp.data.data,
      });
    })
    .catch((err) => {
      console.log('err', err);
    });
  }

  // Methods renders each individual article
  renderArticles() {
    return this.state.articles.map((art) => (
      <div className="col-6 col-lg-3" key={ art._id } >
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
      <div className="container">
        {
          this.state.redirectToArticle && (
            <Redirect to={`/articles/${this.state.articleClicked}`} />
          )
        }
        <div className="space-1"/>
        <div className="row">
          { this.renderArticles() }
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  openCurrentArticle: PropTypes.func,
};

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = () => {
  return {};
};

// Redux config
Home = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);

export default Home;
