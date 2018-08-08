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
import Tags from './shared/Tags';

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
    .then(resp => {
      // If successful, will set state with user's information
      this.setState({
        name: resp.data.user.name,
        email: resp.data.user.username,
        bio: resp.data.user.bio,
        userType: resp.data.user.userType,
        profilePicture: resp.data.user.profilePicture,
        error: "",
        content: {
          articles: resp.data.content ? resp.data.content.articles : [],
          listings: resp.data.content ? resp.data.content.listings : [],
          videos: resp.data.content ? resp.data.content.videos : [],
        },
        location: resp.data.user.location ? resp.data.user.location.name : "",
        pending: false,
      });
    }).catch(err => {
      this.setState({
        pending: false,
        error: err.response.data.error || err.response.data,
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
      return articles.map(art => (
        <Preview
          key={ art._id }
          _id={ art._id }
          title={ art.title }
          subtitle={ art.subtitle }
          image={ art.imagePreview ? art.imagePreview : art.image }
          isArticle
          isThin
        />
      ));
    }

    // If no articles were found
    return (
      <div className="col-12 marg-bot-1">
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
          image={ listing.imagePreview ? listing.imagePreview : listing.image }
          key={ listing._id }
          isListing
          isThin
        />
      ));
    }

    // If no listings were found
    return (
      <div className="col-12 marg-bot-1">
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
      <div className="col-12 marg-bot-1">
        <Blurb message="This author hasn't posted any videos yet!" />
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
              <div className="row">
                <div className="col-12">
                  <h5 className="dark-gray-text marg-bot-1">
                    Articles
                  </h5>
                </div>
                { this.renderArticles() }
              </div>
              <div className="line" />
              <div className="row">
                <div className="col-12">
                  <h5 className="dark-gray-text marg-bot-1">
                    Listings
                  </h5>
                </div>
                { this.renderListings() }
              </div>
              <div className="line" />
              <div className="row">
                <div className="col-12">
                  <h5 className="dark-gray-text marg-bot-1">
                    Videos
                  </h5>
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
      <div className="container marg-top-1">
        <Tags title={this.state.name} description={this.state.bio} />
        <div className="row">
          <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2">
            <div className="space-1 hidden-md-down" />
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
    );
  }
}

Profile.propTypes = {
  match: PropTypes.object,
};

export default Profile;
