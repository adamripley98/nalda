import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import Blurb from '../../shared/Blurb';

class ListVideos extends Component {
  render() {
    if (this.props.videos && this.props.videos.length) {
      const videos = this.props.videos.map((video, i) => (
        <tr key={video._id}>
          <th scope="row">
            {i + 1}
          </th>
          <td>
            <Link to={`/videos/${video._id}`}>
              {video.title}
            </Link>
          </td>
          <td>
            {video._id}
          </td>
        </tr>
      ));

      return (
        <div>
          <h4 className="bold">
            Videos
          </h4>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
                <th scope="col">Video ID</th>
              </tr>
            </thead>
            <tbody>
              { videos }
            </tbody>
          </table>
        </div>
      );
    }
    return (
      <Blurb message="There are no videos to display" />
    );
  }
}

ListVideos.propTypes = {
  videos: PropTypes.array,
};

export default ListVideos;
