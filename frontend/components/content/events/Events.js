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
 * Component for the events of the application
 * TODO filter by amenities
 * TODO filter by open now
 * TODO sort by dates
 */
class Events extends React.Component {
  /**
   * Constructor method
   */
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      events: [],
      pending: true,
      error: "",
      currentSort: "date",
      isAscending: false,
    };

    // Bind this to helper methods
    this.sortByTitle = this.sortByTitle.bind(this);
    this.sortByPrice = this.sortByPrice.bind(this);
  }

  /**
   * Load events from Mongo once the component mounts
   */
  componentDidMount() {
    window.scrollTo(0, 0);

    // Pull data
    axios.get('/api/events')
      .then(resp => {
        // If there was no error
        this.setState({
          events: resp.data.events,
          pending: false,
          error: "",
        });
      })
      .catch(err => {
        // If there was an error with making the request
        this.setState({
          pending: false,
          error: err.response.data.error || err.response.data,
        });
      });
  }

  /**
   * Helper method to sort events by title
   */
  sortByTitle() {
    // Define variable
    const sortedEvents = Object.assign([], this.state.events);

    // Sort based on the state of the application
    if (this.state.currentSort === "title") {
      // If already sorted ascending, reverse to show descending
      sortedEvents.reverse();

      // Set the state
      this.setState({
        events: sortedEvents,
        isAscending: !this.state.isAscending,
      });
    } else {
      // Sort events based off title
      sortedEvents.sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        } else if (a.title > b.title) {
          return 1;
        }

        // Names must be equal
        return 0;
      });

      // Set the state
      this.setState({
        events: sortedEvents,
        isAscending: false,
        currentSort: "title",
      });
    }
  }

  // Helper method to sort events by price
  sortByPrice() {
    // Define variable
    const sortedEvents = Object.assign([], this.state.events);

    // Sort based on the state of the application
    if (this.state.currentSort === "price") {
      // If already sorted ascending, reverse to show descending
      sortedEvents.reverse();

      // Set the state
      this.setState({
        events: sortedEvents,
        isAscending: !this.state.isAscending,
      });
    } else {
      // Sort articles based off price
      sortedEvents.sort((a, b) => {
        return a.price.length - b.price.length;
      });

      // Set the state
      this.setState({
        events: sortedEvents,
        isAscending: false,
        currentSort: "price",
      });
    }
  }

  /**
   * Method renders each individual event
   */
  renderEvents() {
    // If events were pulled from the database
    if (this.state.events && this.state.events.length) {
      return this.state.events.map(event => {
        return (<Preview contentType="event" content={event} key={event._id} />);
      });
    }

    // If no events were found
    return (
      <div className="col-12">
        <Blurb message="No events were found. Check back soon for more content!" />
      </div>
    );
  }

  /**
   * Function to render the component
   */
  render() {
    return (
      <div className="container home">
        <Tags title="Events" description="View all events" />
        <div className="space-1"/>
        <h3 className="title section-title">
          Philadelphia Events
        </h3>
        {
          (this.state.events && this.state.events.length > 1) ? (
            <div className="sort-options">
              <div
                className={ this.state.currentSort === "title" ? "sort-option active" : "sort-option" }
                onClick={this.sortByTitle}
              >
                Sort by title { this.state.currentSort === "title" ? (
                  this.state.isAscending ? (
                    <i className="fa fa-chevron-up" aria-hidden />
                  ) : (
                    <i className="fa fa-chevron-up rotated" aria-hidden />
                  )
                ) : null }
              </div>
              <div
                className={ this.state.currentSort === "price" ? "sort-option active" : "sort-option" }
                onClick={this.sortByPrice}
              >
                Sort by price { this.state.currentSort === "price" ? (
                  this.state.isAscending ? (
                    <i className="fa fa-chevron-up" aria-hidden />
                  ) : (
                    <i className="fa fa-chevron-up rotated" aria-hidden />
                  )
                ) : null }
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
                this.renderEvents()
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

export default Events;
