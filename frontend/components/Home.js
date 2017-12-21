// Import frameworks
import React from 'react';
import axios from 'axios';
import uuid from 'uuid-v4';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

// Import components
import { openArt } from '../actions/index.js';


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
    axios.get('/home')
    .then((resp) => {
      this.setState({
        articles: resp.data,
      });
    })
    .catch((err) => {
      console.log('err', err);
    });
  }

  openArticle(art) {
    const openCurrentArticle = this.props.openCurrentArticle;
    console.log('open article', art._id);
    axios.post(`/articles/${art._id}`, {
      articleId: art._id
    })
    .then((resp) => {
      console.log('art opened', resp.data);
      openCurrentArticle(resp.data);
      this.setState({
        redirectToArticle: true,
        articleClicked: art._id,
      });
    })
    .catch((err) => {
      if (err) console.log('err', err);
    });
  }

  // Methods renders each individual article
  renderArticles() {
    return this.state.articles.map((art) => (
      <div className="col-6 col-lg-3" onClick={() => this.openArticle(art)} key={ uuid() }>
        <div className="card preview">
          <h2>
            {art.title}
          </h2>
          <img className="img-fluid" alt={art.title} src={art.image} />
          <h7>
            {art.subtitle}
          </h7>
        </div>
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

const mapDispatchToProps = dispatch => {
  return {
    openCurrentArticle: (article) => dispatch(openArt(article))
  };
};

// Redux config
Home = connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);

export default Home;
