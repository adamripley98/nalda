// Import frameworks
import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Loading from './shared/Loading';
import ErrorMessage from './shared/ErrorMessage';
import Button from './shared/Button';

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
      pendingArticles: true,
      articlesError: "",
      listings: [],
      pendingListings: true,
      listingsError: "",
    };
  }

  // Load data once the component mounts
  componentDidMount() {
    // Pull all articles from the database
    axios.get('/api/articles')
      .then((resp) => {
        if (resp.data.success) {
          // Limit to the first four articles
          this.setState({
            articles: resp.data.data.slice(0, 4),
            pendingArticles: false,
            articlesError: "",
          });
        } else {
          this.setState({
            pendingArticles: false,
            articlesError: resp.data.error,
          });
        }
      })
      .catch(err => {
        this.setState({
          pendingArticles: false,
          articlesError: err,
        });
      });

    // Pull all listings from the database
    axios.get('/api/listings')
      .then((resp) => {
        if (resp.data.success) {
          // Limit to the first four listings
          this.setState({
            listings: resp.data.data.slice(0, 4),
            pendingListings: false,
            listingsError: "",
          });
        } else {
          this.setState({
            pendingListings: false,
            listingsError: resp.data.error,
          });
        }
      })
      .catch(err => {
        this.setState({
          pendingListings: false,
          listingsError: err,
        });
      });
  }

  // Helper method to render each individual article
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

  // Helper method to render each individual listing
  renderListings() {
    return this.state.listings.map((listing) => (
      <div className="col-6 col-lg-3" key={ listing._id } >
        <Link to={ `/articles/${listing._id}` } >
          <div className="article-preview">
            <img className="img-fluid" alt={listing.name} src={listing.image} />
            <h2 className="title">
              {listing.name}
            </h2>
            <h6 className="subtitle">
              {listing.description}
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
          Recent articles
        </h3>
        <div className="row">
          {
            this.state.pendingArticles ? (
              <Loading />
            ) : (
              this.state.articlesError ? (
                <ErrorMessage error={ this.state.articlesError } />
              ) : (
                this.renderArticles()
              )
            )
          }
        </div>
        {
          !this.state.pendingArticles && (
            <div>
              <div className="space-1" />
              <Button to="/articles" text="View all articles" />
            </div>
          )
        }
        <div className="line marg-0" />
        <div className="space-1"/>
        <h3 className="title">
          Recent listings
        </h3>
        <div className="row">
          {
            this.state.pendingListings ? (
              <Loading />
            ) : (
              this.state.listingsError ? (
                <ErrorMessage error={ this.state.listingsError } />
              ) : (
                this.renderListings()
              )
            )
          }
        </div>
        {
          !this.state.pendingListings && (
            <div>
              <div className="space-1" />
              <Button to="/listings" text="View all listings" />
            </div>
          )
        }
        <div className="line marg-0" />
        <div className="space-1"/>
        <h3 className="title">
          Recent videos
        </h3>
        <div className="row">
          <Loading />
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
