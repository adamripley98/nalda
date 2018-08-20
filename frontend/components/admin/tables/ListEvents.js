import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Blurb from '../../shared/Blurb';
import Loading from '../../shared/Loading';
import ErrorMessage from '../../shared/ErrorMessage';

class ListEvents extends Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      pending: true,
      events: [],
      error: "",
    };
  }

  // Pull data
  componentDidMount() {
    axios.get('/api/admin/events')
      .then(res => {
        this.setState({
          pending: false,
          events: res.data.events,
        });
      })
      .catch(() => this.setState({ error: 'Error pulling events.' }));
  }

  // Render the table
  render() {
    if (this.state.pending) return (<Loading />);
    if (this.state.error) return (<ErrorMessage error={this.state.error} />);
    if (this.state.events && this.state.events.length) {
      const events = this.state.events.map((event, i) => (
        <tr key={ event._id }>
          <th scope="row">
            {i + 1}
          </th>
          <td>
            <Link to={`/events/${event._id}`}>
              { event.title }
            </Link>
          </td>
          <td>
            {
              event._id
            }
          </td>
        </tr>
      ));

      return (
        <div>
          <h4 className="bold">
            Events
          </h4>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Event ID</th>
              </tr>
            </thead>
            <tbody>
              {events}
            </tbody>
          </table>
        </div>
      );
    }
    return (
      <Blurb message="There are no events to display." />
    );
  }
}

export default ListEvents;
