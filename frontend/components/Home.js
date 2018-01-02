// Import frameworks
import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Loading from './shared/Loading';
import ErrorMessage from './shared/ErrorMessage';
import Button from './shared/Button';


// TODO: Should standardize the size of all the pictures
/**
 * Component for the homepage of the application
 */
class Home extends React.Component {
  /**
   * Constructor method
   */
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      articles: [],
      listings: [],
      videos: [],
      pending: true,
      error: "",
    };
  }

  /**
   * Load data once the component mounts
   * Pulls articles, listings, and videos simulatneously
   * TODO custom route to pull all of this data
   */
  componentDidMount() {
    // Pull all articles from the database
    axios.get('/api/home')
      .then((resp) => {
        if (resp.data.success) {
          // Limit to the first four articles
          this.setState({
            ...resp.data.data,
            pending: false,
            error: "",
          });
        } else {
          this.setState({
            pending: false,
            error: resp.data.error,
          });
        }
      })
      .catch(err => {
        this.setState({
          pending: false,
          error: err,
        });
      });
  }

  /**
   * Helper method to render each individual article
   */
  renderArticles() {
    // If there are articles to render
    if (this.state.articles && this.state.articles.length) {
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

    // If there are no articles
    return (
      <div className="col-6 col-lg-3">
        <div className="card marg-bot-1 pad-1">
          Looks like there are no articles yet. Check back soon, we're working hard to create some great content!
        </div>
      </div>
    );
  }

  /**
   * Helper method to render each individual listing
   */
  renderListings() {
    // If there are listings to render
    if (this.state.listings && this.state.listings.length) {
      return this.state.listings.map((listing) => (
        <div className="col-6 col-lg-3" key={ listing._id } >
          <Link to={ `/listings/${listing._id}` } >
            <div className="article-preview">
              <img className="img-fluid" alt={listing.name} src={listing.image} />
              <h2 className="title">
                {listing.title}
              </h2>
              <h6 className="subtitle">
                {listing.description}
              </h6>
            </div>
          </Link>
        </div>
      ));
    }

    // If there are no listings
    return (
      <div className="col-6 col-lg-3">
        <div className="card marg-bot-1 pad-1">
          Looks like there are no listings yet. Check back soon, we're working hard to create some great content!
        </div>
      </div>
    );
  }

  /**
   * Helper method to render each individual video
   * TODO render preview?
   */
  renderVideos() {
    // If there are vidoes to render
    if (this.state.videos && this.state.videos.length) {
      return this.state.videos.map((video) => (
        <div className="col-6 col-lg-3" key={ video._id } >
          <Link to={ `/videos/${video._id}` } >
            <div className="article-preview">
              <img className="img-fluid" alt={video.name} src={video.url} />
              <h2 className="title">
                {video.name}
              </h2>
              <h6 className="subtitle">
                {video.description}
              </h6>
            </div>
          </Link>
        </div>
      ));
    }

    // If there are no listings
    return (
      <div className="col-6 col-lg-3">
        <div className="card marg-bot-1 pad-1">
          Looks like there are no videos yet. Check back soon, we're working hard to create some great content!
        </div>
      </div>
    );
  }

  // Function to render the component
  render() {
    return (
      <div className="container home">
        <div className="space-1"/>
        { this.state.error && <ErrorMessage error={ this.state.error } /> }
        <h3 className="title">
          Recent articles
        </h3>
        <div className="row">
          {
            this.state.pending ? (
              <Loading />
            ) : (
              this.renderArticles()
            )
          }
        </div>
        {
          !this.state.pending && (
            <div>
              <div className="space-1" />
              <Button to="/articles" text="View all articles" right />
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
            this.state.pending ? (
              <Loading />
            ) : (
              this.renderListings()
            )
          }
        </div>
        {
          !this.state.pending && (
            <div>
              <div className="space-1" />
              <Button to="/listings" text="View all listings" right />
            </div>
          )
        }
        <div className="line marg-0" />
        <div className="space-1"/>
        <h3 className="title">
          Recent videos
        </h3>
        <div className="row">
          {
            this.state.pending ? (
              <Loading />
            ) : (
              this.renderVideos()
            )
          }
        </div>
        {
          !this.state.pending && (
            <div>
              <div className="space-1" />
              <Button to="/videos" text="View all videos" right />
            </div>
          )
        }
        <div className="space-2" />
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
