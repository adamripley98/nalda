// Import frameworks
import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loading from '../../shared/Loading';
import ErrorMessage from '../../shared/ErrorMessage';
import Button from '../../shared/Button';

/**
 * Component for the homepage of the application
 */
class Videos extends React.Component {
  /**
   * Constructor method
   */
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      videos: [],
      pending: true,
      error: "",
      titleSortedAscending: false,
    };

    // Bind this for helper methods
    this.sortByTitle = this.sortByTitle.bind(this);
  }

  /**
   * Load listings from Mongo once the component mounts
   */
  componentDidMount() {
    axios.get('/api/videos')
      .then((resp) => {
        if (resp.data.success) {
          this.setState({
            videos: resp.data.data,
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

  // Method to sort by title
  sortByTitle() {
    // Define variable
    const sortedVideos = Object.assign([], this.state.videos);

    if (!this.state.titleSortedAscending) {
      // Sort videos based off title
      sortedVideos.sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        // names must be equal
        return 0;
      });
    } else {
      // If already sorted ascending, reverse to show descending
      sortedVideos.reverse();
    }

    // Display sorted articles
    this.setState({
      videos: sortedVideos,
      titleSortedAscending: !this.state.titleSortedAscending,
    });
  }

  /**
   * Method renders each individual video
   */
  renderVideos() {
    // If there were videos pulled from the backend
    if (this.state.videos && this.state.videos.length) {
      return this.state.videos.map((video) => (
        <div className="col-6 col-lg-4 col-xl-3" key={ video._id } >
          <Link to={ `/videos/${video._id}` } >
            <div className="article-preview">
              <img className="img-fluid" alt={video.title} src={`https://img.youtube.com/vi/${video.url.substring(video.url.indexOf("v=") + 2)}/0.jpg`} />
              <h2 className="title">
                {video.title}
              </h2>
              <h6 className="subtitle">
                {video.description}
              </h6>
            </div>
          </Link>
        </div>
      ));
    }

    // If there were no videos found
    return (
      <div className="col-12">
        <div className="card pad-1 marg-bot-1">
          No videos were found. Check back soon for more content!
        </div>
      </div>
    );
  }

  /**
   * Function to render the component
   */
  render() {
    return (
      <div className="container home">
        <div className="space-1"/>
        <h3 className="title">
          Videos
        </h3>
        <div onClick={this.sortByTitle}>Sort by title</div>
        <div className="row">
          {
            this.state.pending ? (
              <Loading />
            ) : (
              this.state.error ? (
                <ErrorMessage error={ this.state.error } />
              ) : (
                this.renderVideos()
              )
            )
          }
          {
            !this.state.pending && (
              <div className="col-12 marg-top-1">
                <Button />
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default Videos;
