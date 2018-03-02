// Import frameworks
import React from 'react';
import axios from 'axios';

// Import components
import Loading from '../../shared/Loading';
import ErrorMessage from '../../shared/ErrorMessage';
import Button from '../../shared/Button';
import Preview from '../Preview';
import Blurb from '../../shared/Blurb';
import Tags from '../../shared/Tags';

/**
 * Component for the homepage of the application
 * TODO sort by time properly
 * TODO add button to sort by date
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
      currentSort: "date",
      isAscending: false,
    };

    // Bind this for helper methods
    this.sortByTitle = this.sortByTitle.bind(this);
  }

  /**
   * Load listings from Mongo once the component mounts
   */
  componentDidMount() {
    window.scrollTo(0, 0);

    // Pull the data
    axios.get('/api/videos')
      .then((resp) => {
        if (resp.data.success) {
          // If everything was successful
          this.setState({
            videos: resp.data.data,
            pending: false,
            error: "",
          });
        } else {
          // If an error was sent back from the database
          this.setState({
            pending: false,
            error: resp.data.error,
          });
        }
      })
      .catch(err => {
        // If there was an error with the request
        this.setState({
          pending: false,
          error: err,
        });
      });
  }

  /**
   * Method to sort by title
   */
  sortByTitle() {
    // Define variable
    const sortedVideos = Object.assign([], this.state.videos);

    if (this.state.currentSort === "title") {
      // If already sorted ascending, reverse to show descending
      sortedVideos.reverse();

      // Set the state
      this.setState({
        videos: sortedVideos,
        isAscending: !this.state.isAscending,
      });
    } else {
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

      // Set the state
      this.setState({
        videos: sortedVideos,
        isAscending: false,
        currentSort: "title",
      });
    }
  }

  /**
   * Method renders each individual video
   */
  renderVideos() {
    // If there were videos pulled from the backend
    if (this.state.videos && this.state.videos.length) {
      return this.state.videos.map((video) => {
        const videoId = video.url.substring(video.url.indexOf("v=") + 2);
        return (
          <Preview
            _id={ video._id }
            title={ video.title }
            subtitle={ video.description }
            image={ `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` }
            key={ video._id }
            isVideo
          />
        );
      });
    }

    // If there were no videos found
    return (
      <div className="col-12">
        <Blurb message="No videos were found. Check back soon for more content!" />
      </div>
    );
  }

  /**
   * Function to render the component
   */
  render() {
    return (
      <div className="container home">
        <Tags title="Videos" description="List of all videos" />
        <div className="space-1"/>
        <h3 className="title section-title">
          Videos
        </h3>
        {
          (this.state.videos && this.state.videos.length > 1) ? (
            <div className="sort-options">
              <div
                className={ this.state.currentSort === "title" ? "sort-option active" : "sort-option" }
                onClick={ this.sortByTitle }>
                Sort by title {
                  this.state.currentSort === "title" ? (
                    this.state.isAscending ? (
                      <i className="fa fa-chevron-up" aria-hidden />
                    ) : (
                      <i className="fa fa-chevron-up rotated" aria-hidden />
                    )
                  ) : null
                }
              </div>
            </div>
          ) : null
        }

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
