// Import frameworks
import React from 'react';
import Button from '../../shared/Button';

/**
 * Component to render a listing
 */
class Video extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state with dummy data
    this.state = {
      url: "https://www.youtube.com/watch?v=feFPZXgF9ts",
      title: "Philly's pitch for Amazon",
      description: "Lorem ipsum dolor amet semiotics succulents normcore poutine. Live-edge meh banjo, mixtape unicorn ugh vexillologist lomo single-origin coffee ennui marfa shaman pabst. 90's kinfolk banjo narwhal messenger bag 3 wolf moon tumblr taiyaki salvia hexagon artisan. Poutine forage before they sold out beard ethical iPhone cliche mumblecore direct trade cloud bread tilde chambray knausgaard drinking vinegar. Chartreuse put a bird on it bitters, bespoke salvia ugh XOXO literally.\n\nUgh flexitarian banjo selfies normcore. 3 wolf moon portland kitsch, af squid readymade schlitz. Activated charcoal fam chambray pok pok selvage. Sartorial cornhole church-key ramps bitters. Tumblr salvia fanny pack put a bird on it af shaman.",
    };

    // Bind this to helper functions
    this.renderVideo = this.renderVideo.bind(this);
  }

  // Helper function to render the video
  renderVideo() {
    const videoID = this.state.url.split("=")[1];
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
            <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2">
              { this.renderVideo() }
              <div className="header">
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
          </div>
        </div>
        <div className="space-2" />
      </div>
    );
  }
}

export default Video;
