// Import frameworks
import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import uuid from 'uuid-v4';
import { Link, Redirect } from 'react-router-dom';
import moment from 'moment';

// Import components
import Loading from '../../shared/Loading';
import Button from '../../shared/Button';
import NotFoundSection from '../../NotFoundSection';
import Carousel from './Carousel';
import ErrorMessage from '../../shared/ErrorMessage';
import Tags from '../../shared/Tags';
import Location from './Location';
import EventHeader from './EventHeader';

/**
 * Component to render a event
 */
class Event extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state with dummy data
    this.state = {
      error: '',
      event: {},
      pending: true,
      infoTrigger: false,
      canModify: false,
      redirectToHome: false,
      deleteError: "",
      deletePending: false,
      author: {
        name: "",
        _id: "",
        profilePicture: "",
      },
      eventId: '',
    };

    // Bind this to helper methods
    this.handleClickInfoTrigger = this.handleClickInfoTrigger.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
  }

  // Pull the event data from the database
  componentDidMount() {
    // Scroll to the top of the screen
    window.scrollTo(0, 0);

    // Find the id in the url
    const id = this.props.match.params.id;

    // Find the event
    axios.get(`/api/events/${id}`)
      .then(res => {
        // Set the state
        this.setState({
          error: '',
          event: res.data.event,
          reviews: res.data.reviews,
          author: res.data.author,
          time: moment(res.data.timestamp).fromNow(),
          pending: false,
          canModify: res.data.canModify,
          eventId: id,
        });

        // If there is a location
        if (res.data.event.location.lng && res.data.event.location.lat) {
          $(document).ready(() => {
            var map = new google.maps.Map(document.getElementById('map'), {
              zoom: 17,
              center: res.data.event.location,
            });
            var marker = new google.maps.Marker({
              position: res.data.event.location,
              map: map
            });
          });
        }
      })
      .catch(err => {
        if (err && err.response && err.response.status === 404) {
          // If the event was not found
          this.setState({
            notFound: true,
            pending: false,
          });
        } else {
          // If there was an error making the request
          this.setState({
            error: err,
            pending: false,
          });
        }
      });

    // Style parallax scrolling
    $(document).ready(() => {
      $(window).scroll(() => {
        const pos = - $(window).scrollTop() / 4;
        $('#parallax').css("transform", `translateY(${pos}px)`);
      });
    });
  }

  // Helper method to delete specific event
  deleteEvent() {
    // Set the state
    this.setState({
      deletePending: true,
    });

    // Find the id in the url
    const id = this.props.match.params.id;

    // Post to backend
    axios.delete(`/api/events/${id}`)
    .then(() => {
      // Collapse the modal upon success
      $('#deleteModal').modal('toggle');

      // Update the state and direct the user away
      this.setState({
        redirectToHome: true,
        deletePending: false,
      });
    })
    .catch((err) => {
      this.setState({
        deleteError: err.response.data.error || err.response.data,
        deletePending: false,
      });
    });
  }

  // Helper method to handle a user clicking on the info trigger
  handleClickInfoTrigger() {
    this.setState({
      infoTrigger: !this.state.infoTrigger,
    });
  }

  // Helper method to render buttons to edit and delete the event
  renderButtons() {
    // If the user is authorized to edit the event
    if (this.state.canModify) {
      return (
        <div className="buttons right marg-bot-1">
          <Link
            className="btn btn-primary btn-sm"
            to={`/events/${this.state.eventId}/edit`}
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

          {/* Render the modal to confirm deleting the event */}
          <div className="modal fade" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="deleteModal" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Delete event
                  </h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body left">
                  <ErrorMessage error={ this.state.deleteError } />
                  Permanently delete event? This cannot be un-done.
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                  <button
                    type="button"
                    className={ this.state.deletePending ? "btn btn-danger disabled" : "btn btn-danger" }
                    onClick={ this.deleteEvent }
                  >
                    { this.state.deletePending ? "Deleting event..." : "Delete event" }
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

  // Render the component
  render() {
    if (this.state.pending) {
      return (<Loading />);
    }

    if (this.state.notFound) {
      return (
        <NotFoundSection
          title="Event not found"
          content="Uh-oh! Looks like the event you were looking for was either removed or does not exist."
          url="/events"
          urlText="Back to all events"
        />
      );
    }

    // Return the component
    return (
      <div className="event">
        {/* Render the head */}
        <Tags title={this.state.title} description={this.state.description} />

        <div className="parallax-wrapper">
          <div className="background-image img" style={{backgroundImage: `url(${this.state.event.image})`}} id="parallax" />
        </div>

        { this.state.redirectToHome && <Redirect to="/"/> }

        <div className="container content">
          <div className="row">
            <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-0">
              { this.renderButtons() }

              <EventHeader
                event={this.state.event}
                error={(this.state.error && this.state.error.message) ? this.state.error.message : this.state.error }
                author={this.state.author}
              />

              <Carousel images={this.state.event.images}/>

              <div className="hidden-lg-up">
                <div className="line" />
                <h5 className="subtitle">
                  Date:
                </h5>
                <strong>Start: </strong>{moment(this.state.event.startDate).format("dddd, M/D/YY, h:mm a")}
                <br/>
                <strong>End: </strong>{moment(this.state.event.endDate).format("dddd, M/D/YY, h:mm a")}
              </div>

              <Location location={this.state.event && this.state.event.location  ? this.state.event.location : {}} />


              { /* Render a back to home button */ }
              <div className="space-1" />
              <Button />
            </div>

            {/* Contains overview aboute the event */}
            <div
              id="listing-preview"
              className={
                this.state.infoTrigger ? (
                  "col-12 col-lg-4 listing-preview active"
                ) : (
                  "col-12 col-lg-4 listing-preview"
                )
              }
              style={{
                top: this.state.infoTrigger ? (window.innerHeight - document.getElementById('listing-preview').offsetHeight) : (window.innerHeight - 64)
              }}
            >
              <div className="card">
                <i
                  className={
                    this.state.infoTrigger ? (
                      "fa fa-chevron-down hidden-lg-up fa-lg info-trigger"
                    ) : (
                      "fa fa-chevron-down hidden-lg-up fa-lg info-trigger active"
                    )
                  }
                  aria-hidden="true"
                  onClick={ this.handleClickInfoTrigger }
                />
                <h2 className="title">
                  { this.state.event.title }
                </h2>
                <p className="description">
                  { this.state.event.description }
                </p>
                {
                  this.state.event.website && (
                    <a
                      href={ this.state.event.website }
                      className="website"
                      target="_blank">
                      <i className="fa fa-globe" aria-hidden="true" />
                      &nbsp;
                      Visit website
                    </a>
                  )
                }
                {
                  this.state.event.startDate && this.state.event.endDate && (
                    <div className="price hidden-md-down">
                      <p>
                        <strong>
                          Start:&nbsp;
                        </strong> {moment(this.state.event.startDate).format("dddd, M/D/YY, h:mm a")}
                        <br/>
                        <strong>
                          End:&nbsp;
                        </strong> {moment(this.state.event.endDate).format("dddd, M/D/YY, h:mm a")}
                      </p>
                    </div>
                  )
                }
                {
                  this.state.event.price && (
                    <p className="price">
                      <strong>
                        Price:&nbsp;
                      </strong>
                      { this.state.event.price }
                    </p>
                  )
                }
              </div>
            </div>
          </div>
        </div>
        <div className="space-2" />
      </div>
    );
  }
}

Event.propTypes = {
  match: PropTypes.object,
};

export default Event;
