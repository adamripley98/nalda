// Import framworks
import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import Button from './shared/Button';
import Loading from './shared/Loading';

// Import components
import ErrorMessage from './shared/ErrorMessage';

/**
 * Component to render a curators profile
 */
class Profile extends Component {
  /**
   * Constructor method
   * TODO: Replace dummy location, prof pic, and bio data
   */
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      bio: 'Hello this is my bio. It describes who I am and what I am passionate for.',
      location: 'University City, PA',
      profilePicture: '',
      error: '',
      pending: false,
      content: 'dummy content',
    };
  }

  /**
   * Pull the user's information from the database then render it
   */
  componentDidMount() {
    // Find the id in the url
    const id = this.props.match.params.id;

    axios.get(`/api/users/${id}`)
    .then((resp) => {
      console.log('responds', resp.data);
      // If successful, will set state with user's information
      if (resp.data.success) {
        console.log('ddata', resp.data);
        this.setState({
          name: resp.data.data.name,
          email: resp.data.data.username,
          error: "",
        });
      } else {
        this.setState({
          error: resp.data.error,
        });
      }
    }).catch((err) => {
      this.setState({
        error: err,
      });
    });
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
                { this.state.bio }
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
              { this.state.content }
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

const mapStateToProps = () => {
  return {
  };
};

const mapDispatchToProps = () => {
  return {};
};

// Redux config
Profile = connect(
    mapStateToProps,
    mapDispatchToProps
)(Profile);

export default Profile;
