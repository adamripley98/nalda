// Import frameworks
import React from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Import components
import Button from '../../shared/Button';
import ErrorMessage from '../../shared/ErrorMessage';
import Loading from '../../shared/Loading';
import Author from '../../shared/Author';
import NotFoundSection from '../../NotFoundSection';

/**
 * Component to render a videos
 * TODO Edit functionality
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
      author: {
        name: "",
        _id: null,
        profilePicture: "",
      },
    };

    // Bind this to helper functions
    this.renderVideo = this.renderVideo.bind(this);
    this.deleteVideo = this.deleteVideo.bind(this);
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
            author: res.data.author,
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
        if (err.response.status === 404) {
          this.setState({
            pending: false,
            notFound: true,
          });
        } else {
          // If there was an error making the request
          this.setState({
            error: err,
            pending: false,
            deleteError: "",
            deletePending: false,
          });
        }
      });
  }

  // Helper method to delete specific video
  deleteVideo() {
    // Update the state to denote the delete is pending
    this.setState({
      deletePending: true,
    });

    // Find the id in the url
    const id = this.props.match.params.id;

    // Post to backend
    axios.delete(`/api/videos/${id}`)
    .then((resp) => {
      if (resp.data.success) {
        // If the request was successful
        // Collapse the modal upon success
        $('#deleteModal').modal('toggle');

        // Update the state
        this.setState({
          redirectToHome: true,
          deletePending: false,
        });
      } else {
        this.setState({
          deleteError: resp.data.error,
          deletePending: false,
        });
      }
    })
    .catch((err) => {
      this.setState({
        deleteError: err,
        deletePending: false,
      });
    });
  }

  // Helper method to render buttons to edit and delete the video
  renderButtons() {
    // If the user is authorized to edit the video
    if (this.state.canModify) {
      return (
        <div className="buttons right marg-bot-1">
          <Link
            className="btn btn-primary btn-sm"
            to={`/videos/${this.state._id}/edit`}
          >
            Edit
          </Link>
          <button
            className="btn btn-danger btn-sm"
            type="button"
            data-toggle="modal"
            data-target="#deleteModal"
          >
            Delete
          </button>

          {/* Render the modal to confirm deleting the listing */}
          <div className="modal fade" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="deleteModal" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Delete video
                  </h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body left">
                  <ErrorMessage error={ this.state.deleteError } />
                  Permanently delete video? This cannot be un-done.
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                  <button
                    type="button"
                    className={ this.state.deletePending ? "btn btn-danger disabled" : "btn btn-danger" }
                    onClick={ this.deleteVideo }
                  >
                    { this.state.deletePending ? "Deleting video..." : "Delete video" }
                  </button>
                </div>
              </div>
            </div>
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
    // If the video is not found
    if (!this.state.pending && this.state.notFound) {
      return (
        <NotFoundSection
          title="Video not found"
          content="Uh-oh! Looks like this video you are looking for was either moved or does not exist."
          url="/videos"
          urlText="Back to all videos"
        />
      );
    }

    // Return the component
    return (
      <div className="video">
        <div className="container">
          <div className="row">
            <ErrorMessage error={ this.state.error } />

            { this.state.pending ? <Loading /> : (
              <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2">
                { this.renderVideo() }
                <div className="header">
                  { this.state.redirectToHome && <Redirect to="/"/> }
                  { this.renderButtons() }
                  <h1 className="title">
                    { this.state.title }
                  </h1>
                  <Author
                    createdAt={ this.state.createdAt }
                    updatedAt={ this.state.updatedAt }
                    name={ this.state.author.name }
                    _id={ this.state.author._id }
                    profilePicture={ this.state.author.profilePicture }
                  />
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
