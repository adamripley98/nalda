// Import frameworks
import React from 'react';
import axios from 'axios';

// Import components
import Loading from './shared/Loading';
import ErrorMessage from './shared/ErrorMessage';
import Button from './shared/Button';
import Preview from './content/Preview';
import Blurb from './shared/Blurb';

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
   */
  componentDidMount() {
    // Janky way of dealing with Facebook Oauth url issue
    if (window.location.hash === '#_=_') {
      history.replaceState
        ? history.replaceState(null, null, window.location.href.split('#')[0])
        : window.location.hash = '';
    }

    // Pull all articles, listings, and videos from the database
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
   * When the component updates
   */
  componentDidUpdate() {
    // Update the page title
    document.title = "Nalda";
  }

  /**
   * Helper method to render each individual article
   */
  renderArticles() {
    // If there are articles to render
    if (this.state.articles && this.state.articles.length) {
      return this.state.articles.map((art) => (
        <Preview
          _id={ art._id }
          title={ art.title }
          subtitle={ art.subtitle }
          image={ art.image }
          key={ art._id }
          timestamp={ art.createdAt }
          isArticle
        />
      ));
    }

    // If there are no articles
    return (
      <div className="col-6 col-lg-3">
        <Blurb message="Looks like there are no articles yet. Check back soon, we're working hard to create some great content!" />
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
        <Preview
          _id={ listing._id }
          title={ listing.title }
          subtitle={ listing.description }
          image={ listing.image }
          key={ listing._id }
          isListing
        />
      ));
    }

    // If there are no listings
    return (
      <div className="col-6 col-lg-3">
        <Blurb message="Looks like there are no listings yet. Check back soon, we're working hard to create some great content!" />
      </div>
    );
  }

  /**
   * Helper method to render each individual video
   */
  renderVideos() {
    // If there are videos to render
    if (this.state.videos && this.state.videos.length) {
      return this.state.videos.map((video) => {
        const videoId = video.url.substring(video.url.indexOf("v=") + 2);
        return (
          <Preview
            _id={ video._id }
            title={ video.title }
            subtitle={ video.description }
            image={ `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` }
            key={ video._id }
            isVideo
          />
        );
      });
    }

    // If there are no listings
    return (
      <div className="col-6 col-lg-3">
        <Blurb message="Looks like there are no videos yet. Check back soon, we're working hard to create some great content!" />
      </div>
    );
  }

  // Function to render the component
  render() {
    return (
      <div className="container home">
        <div className="space-1"/>
        <ErrorMessage error={ this.state.error } />

        <h3 className="title section-title">
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
        <h3 className="title section-title">
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
        <h3 className="title section-title">
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

export default Home;
