import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Blurb from '../../shared/Blurb';
import Loading from '../../shared/Loading';
import ErrorMessage from '../../shared/ErrorMessage';

class ListVideos extends Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      pending: true,
      videos: [],
      error: "",
    };
  }

  // Pull data
  componentDidMount() {
    axios.get('/api/admin/videos')
      .then(res => {
        if (res.data.error) {
          this.setState({
            pending: false,
            error: res.data.error,
          });
          return;
        }
        this.setState({
          pending: false,
          videos: res.data.videos,
        });
      })
      .catch(err => this.setState({ error: err.message }));
  }

  // Render the table
  render() {
    if (this.state.pending) return (<Loading />);
    if (this.state.error) return (<ErrorMessage error={this.state.error} />);
    if (this.state.videos && this.state.videos.length) {
      const videos = this.state.videos.map((video, i) => (
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

export default ListVideos;
