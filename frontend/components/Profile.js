// Import framworks
import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';


// Import components
import ErrorMessage from './shared/ErrorMessage';
import Button from './shared/Button';
import Loading from './shared/Loading';
import ArticlePreview from './content/articles/ArticlePreview';

/**
 * Component to render a curators profile
 */
class Profile extends Component {
  /**
   * Constructor method
   * TODO: Replace dummy prof pic
   */
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      bio: '',
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
    // TODO: Display nicely
    if (content && content.length) {
      return content.map((art) => (
        <ArticlePreview
          _id={ art._id }
          title={ art.title }
          subtitle={ art.subtitle }
          image={ art.image }
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
      <table className="table account">
        <tbody>
          <tr>
            <td className="bold">
              Name
            </td>
            <td>
              <span style={{ display: this.state.editName && "none" }}>
                { this.state.name }
              </span>
            </td>
          </tr>
          <tr>
            <td className="bold">
              Email
            </td>
            <td>
              { this.state.email }
            </td>
          </tr>
          <tr>
            <td className="bold">
              Bio
            </td>
            <td>
              <span style={{ display: this.state.editBio && "none" }}>
                { this.state.bio || `${this.state.name} has not entered a bio`}
              </span>
            </td>
          </tr>
          <tr>
            <td className="bold">
              Location
            </td>
            <td>
              { this.state.location }
            </td>
          </tr>
          <tr>
            <td className="bold">
              Content created
            </td>
            <td>
              { this.renderContent() }
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  /**
   * Render the component
   */
  render() {
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2">
              <h4 className="bold marg-top-2 marg-bot-1">
                Curator Profile
              </h4>
              { this.state.error && <ErrorMessage error={ this.state.error } /> }
              { this.state.pending ? <Loading /> : this.renderInfo() }
              {
                !this.state.pending && (
                  <div className="marg-top-1">
                    <Button />
                  </div>
                )
              }
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
