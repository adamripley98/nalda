// Import frameworks
import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

// Import components
import Button from '../../shared/Button';
import ErrorMessage from '../../shared/ErrorMessage';
import Loading from '../../shared/Loading';

/**
 * Component to render a videos
 * TODO Edit functionality
 * TODO Delete functionality
 */
class Video extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state with dummy data
    this.state = {
      title: "",
      url: "",
      description: "",
      pending: true,
      error: '',
      canModify: false,
      redirectToHome: false,
    };

    // Bind this to helper functions
    this.renderVideo = this.renderVideo.bind(this);
    this.deleteVideo = this.deleteVideo.bind(this);
    this.editVideo = this.editVideo.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
  }

  // Pull the video data from the database
  componentDidMount() {
    // Find the id in the url
    const id = this.props.match.params.id;

    // Find the video
    axios.get(`/api/videos/${id}`)
      .then(res => {
        if (res.data.success) {
          this.setState({
            ...res.data.data,
            error: "",
            pending: false,
            canModify: res.data.canModify,
          });
        } else {
          // If there was an error with the request
          this.setState({
            error: res.data.error,
            pending: false,
          });
        }
      })
      .catch(err => {
        // If there was an error making the request
        this.setState({
          error: err,
          pending: false,
        });
      });
  }

  // Helper method to delete specific video
  deleteVideo() {
    // Find the id in the url
    const id = this.props.match.params.id;
    // Post to backend
    axios.post(`/api/videos/${id}/delete`)
    .then((resp) => {
      if (resp.data.success) {
        this.setState({
          redirectToHome: true,
        });
      } else {
        this.setState({
          error: resp.data.error,
        });
      }
    })
    .catch((err) => {
      this.setState({
        error: err,
      });
    });
  }

  // Helper method to edit specific video
  editVideo() {
    // TODO implement
    // TODO need to do frontend and backend error checks
    console.log('edit');
  }

  // Helper method to render buttons to edit and delete the video
  renderButtons() {
    // If the user is authorized to edit the video
    if (this.state.canModify) {
      return (
        <div className="buttons right marg-bot-1">
          <div
            className="btn btn-primary btn-sm"
            onClick={ () => this.editVideo() }
          >
            Edit
          </div>
          <div
            className="btn btn-danger btn-sm"
            onClick={ () => this.deleteVideo() }
          >
            Delete
          </div>
        </div>
      );
    }

    // Else, return nothing
    return null;
  }

  // Helper function to render the video
  renderVideo() {
    // Isolate variables
    const url = this.state.url;
    let videoID = '';
    if (url) {
      videoID = url.split("=")[1];
    }
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoID}`}
        frameBorder="0"
        allowFullScreen
      />
    );
  }

  // Render the component
  render() {
    // Return the component
    return (
      <div className="video">
        <div className="container">
          <div className="row">
            { this.state.error && <ErrorMessage error={ this.state.error } /> }
            { this.state.pending ? <Loading /> : (
              <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2">
                { this.renderVideo() }
                <div className="header">
                  { this.state.redirectToHome && <Redirect to="/"/> }
                  { this.renderButtons() }
                  <h1 className="title">
                    { this.state.title }
                  </h1>
                </div>
                <p className="description">
                  { this.state.description }
                </p>
                <div className="space-1" />
                <Button />
              </div>
            )}
          </div>
        </div>
        <div className="space-2" />
      </div>
    );
  }
}

Video.propTypes = {
  match: PropTypes.object,
};

export default Video;
