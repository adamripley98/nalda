import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import ErrorMessage from '../shared/ErrorMessage';
import Button from '../shared/Button';
import Loading from '../shared/Loading';
import NotFoundSection from '../NotFoundSection';
import Tags from '../shared/Tags';
import ProfileContent from './ProfileContent';

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
    this.init = this.init.bind(this);
  }

  /**
   * Pull the user's information from the database then render it
   */
  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.init();
    }
  }

  init() {
    window.scrollTo(0, 0);

    // Find the id in the url
    const id = this.props.match.params.id;

    this.setState({ pending: true });

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

              <ProfileContent content={this.state.content.articles} title="Articles" />

              <div className="line" />

              <ProfileContent content={this.state.content.listings} title="Listings" />

              <div className="line" />

              <ProfileContent content={this.state.content.videos} title="Videos" />
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
    }

    if (this.state.error) {
      return (
        <NotFoundSection
          title="Profile not found"
          content="Seems like the user you were looking for was either moved or does not exist."
        />
      );
    }

    // If the info has loaded
    return (
      <div className="container">
        <Tags title={this.state.name} description={this.state.bio} />

        <div className="row">
          <div className="col-12 col-md-10 offset-md-1">
            <div className="space-1" />
            <div className="space-1 hidden-md-down" />

            {
              this.state.error ? (
                <ErrorMessage error={ this.state.error } />
              ) : (
                this.renderInfo()
              )
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
