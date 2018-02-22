// Import framworks
import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

// Import components
import ErrorMessage from './shared/ErrorMessage';
import Button from './shared/Button';
import Loading from './shared/Loading';
import Preview from './content/Preview';
import NotFoundSection from './NotFoundSection';
import Blurb from './shared/Blurb';

/**
 * Component to render a curators profile
 */
class Profile extends Component {
  /**
   * Constructor method
   */
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      bio: '',
      userType: 'user',
      location: '',
      profilePicture: '',
      error: '',
      pending: true,
      content: {},
    };

    // Bind this to helper methods
    this.renderInfo = this.renderInfo.bind(this);
    this.renderArticles = this.renderArticles.bind(this);
    this.renderVideos = this.renderVideos.bind(this);
    this.renderListings = this.renderListings.bind(this);
  }

  /**
   * Pull the user's information from the database then render it
   */
  componentDidMount() {
    window.scrollTo(0, 0);
    // Find the id in the url
    const id = this.props.match.params.id;
    // Call to backend to get profile information
    axios.get(`/api/users/${id}`)
    .then((resp) => {
      // If successful, will set state with user's information
      if (resp.data.success) {
        this.setState({
          name: resp.data.data.name,
          email: resp.data.data.username,
          bio: resp.data.data.bio,
          userType: resp.data.data.userType,
          profilePicture: resp.data.data.profilePicture,
          error: "",
          content: {
            articles: resp.data.articles,
            listings: resp.data.listings,
            videos: resp.data.videos,
          },
          location: resp.data.data.location ? resp.data.data.location.name : "",
          pending: false,
        });
      } else {
        this.setState({
          pending: false,
          error: resp.data.error,
        });
      }
    }).catch((err) => {
      this.setState({
        pending: false,
        error: err,
      });
    });
  }

  /**
   * Helper function to render a user's articles
   */
  renderArticles() {
    // Isolate variable
    const articles = this.state.content.articles;

    // Map through and display content
    if (articles && articles.length) {
      return articles.map((art) => (
        <Preview
          key={ art._id }
          _id={ art._id }
          title={ art.title }
          subtitle={ art.subtitle }
          image={ art.image }
          isArticle
          isThin
        />
      ));
    }

    // If no articles were found
    return (
      <div className="col-12">
        <Blurb message="This author hasn't posted any articles yet!" />
      </div>
    );
  }

  /**
   * Helper function to render a user's listings
   */
  renderListings() {
    // Isolate variable
    const listings = this.state.content.listings;

    // Map through and display content
    if (listings && listings.length) {
      return listings.map((listing) => (
        <Preview
          _id={ listing._id }
          title={ listing.title }
          subtitle={ listing.description }
          image={ listing.image }
          key={ listing._id }
          isListing
          isThin
        />
      ));
    }

    // If no listings were found
    return (
      <div className="col-12">
        <Blurb message="This author hasn't posted any listings yet!" />
      </div>
    );
  }

  /**
   * Helper function to render a user's videos
   */
  renderVideos() {
    // Isolate variable
    const videos = this.state.content.videos;

    // Map through and display content
    if (videos && videos.length) {
      return videos.map((video) => (
        <Preview
          _id={ video._id }
          title={ video.title }
          subtitle={ video.description }
          image={ `https://img.youtube.com/vi/${video.url.substring(video.url.indexOf("v=") + 2)}/maxresdefault.jpg` }
          key={ video._id }
          isVideo
          isThin
        />
      ));
    }

    // If no videos were found
    return (
      <div className="col-12">
        <Blurb message="This author hasn't posted any videos yet!" />\
      </div>
    );
  }

  /**
   * Helper function to render a user's information
   */
  renderInfo() {
    return (
      <div className="profile-wrapper">
        <div className="profile">
          <div
            className="profile-picture background-image"
            style={{ backgroundImage: `url(${this.state.profilePicture})` }}
          />
          <div className="profile-content">
            <h4>
              { this.state.name }
            </h4>

            {
              this.state.bio ? (
                <p>
                  { this.state.bio }
                </p>
              ) : (
                <p className="gray-text italic">
                  { `${this.state.name} has not yet entered a bio.` }
                </p>
              )
            }

            <p>
              { this.state.location }
            </p>
          </div>
        </div>

        {/* Render content created by a user if they are an admin or curator */}
        {
          (this.state.userType === 'admin' || this.state.userType === 'curator') ? (
            <div>
              <div className="line" />
              <h5 className="bold marg-bot-1 dark-gray-text">
                Content created
              </h5>
              <div className="row">
                <div className="col-12">
                  <h6>
                    Articles
                  </h6>
                </div>
                { this.renderArticles() }
              </div>
              <div className="row">
                <div className="col-12">
                  <h6>
                    Listings
                  </h6>
                </div>
                { this.renderListings() }
              </div>
              <div className="row">
                <div className="col-12">
                  <h6>
                    Videos
                  </h6>
                </div>
                { this.renderVideos() }
              </div>
            </div>
          ) : null
        }
      </div>
    );
  }

  /**
   * Render the component
   */
  render() {
    // If the content has not yet been pulled
    if (this.state.pending) {
      return (
        <Loading />
      );
    } else if (this.state.error) {
      return (
        <NotFoundSection
          title="Profile not found"
          content="Seems like the user you were looking for was either moved or does not exist."
        />
      );
    }

    // If the info has loaded
    return (
      <div>
        <div className="container marg-top-1">
          <div className="row">
            <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2">
              {
                this.state.error ?
                <ErrorMessage error={ this.state.error } /> :
                this.renderInfo()
              }
              <div className="marg-top-1">
                <Button />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  match: PropTypes.object,
};

export default Profile;
