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

/**
 * Component to render a curators profile
 * TODO load all articles, listings, and videos by the curator
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
      content: [],
    };
  }

  /**
   * Pull the user's information from the database then render it
   */
  componentDidMount() {
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
          content: resp.data.articles,
          location: resp.data.data.location.name,
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
   * Helper function to render a user's content
   */
  renderContent() {
    // Isolate variable
    const content = this.state.content;

    // Map through and display content
    if (content && content.length) {
      return content.map((art) => (
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
        <div className="card pad-1 marg-bot-1">
          This author hasn't posted any articles yet!
        </div>
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
                { this.renderContent() }
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
          title="Curator not found"
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
