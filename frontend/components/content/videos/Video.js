// Import frameworks
import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

// Import components
import Button from '../../shared/Button';
import ErrorMessage from '../../shared/ErrorMessage';
import Loading from '../../shared/Loading';

/**
 * Component to render a videos
 */
class Video extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state with dummy data
    this.state = {
      video: {},
      pending: true,
      error: '',
    };

    // Bind this to helper functions
    this.renderVideo = this.renderVideo.bind(this);
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
            error: "",
            video: res.data.data,
            pending: false,
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

  // Helper function to render the video
  renderVideo() {
    // Isolate variables
    const url = this.state.video.url;
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
                  <h1 className="title">
                    { this.state.video.title }
                  </h1>
                </div>
                <p className="description">
                  { this.state.video.description }
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
