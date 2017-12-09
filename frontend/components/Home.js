// Import frameworks
import React from 'react';
import GrayWrapper from './shared/GrayWrapper';
import axios from 'axios';
import uuid from 'uuid-v4';
import { Redirect } from 'react-router-dom';


/**
 * Component for the homepage of the application
 */
class Home extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      redirectToArticle: false,
      articleClicked: '',
    };
  }

  // Load articles from Mongo
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
    console.log('open article', art._id);
    this.setState({
      redirectToArticle: true,
      articleClicked: art._id,
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
          <img height="200" width="200" src={art.image}/>
          <h7>
            {art.subtitle}
          </h7>
        </div>
      </div>
    ));
  }

  // Function to render the component
  render() {
    if (this.state.redirectToArticle) {
      return (
        <Redirect to={`/articles/${this.state.articleClicked}`}/>
      );
    }
    return (
      <GrayWrapper>
        <div className="container">
          <div className="space-1"/>
          <div className="row">
            {
              this.renderArticles()
            }
          </div>
        </div>
      </GrayWrapper>
    );
  }
}

export default Home;
