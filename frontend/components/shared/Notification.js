// Import frameworks
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Import actions
import { clearNotification } from '../../actions/notification';

/**
 * Class to render error and message notifications
 */
class Notification extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      hidden: true,
    };

    // Bind this to helper functions
    this.hide = this.hide.bind(this);
    this.reveal = this.reveal.bind(this);
  }

  // When the component updates
  componentDidUpdate(prevProps) {
    // If there is a new message or error, wipe the state after 3 seconds
    if (
      (this.props.message || this.props.error) &&
      (prevProps.message !== this.props.message || prevProps.error !== this.props.error)
    ) {
      // Reveal the notification
      this.reveal();

      // Hide the notification after just under 3 seconds
      setTimeout(() => {
        this.hide();
      }, 2800);

      // Wipe the redux state
      setTimeout(() => {
        this.props.clearNotification();
      }, 3000);
    }
  }

  // Reveal the notification
  reveal() {
    this.setState({
      hidden: false,
    });
  }

  // Hide the notification
  hide() {
    this.setState({
      hidden: true,
    });
  }

  // Render the component
  render() {
    return (
      <div className={ this.state.hidden ? "notification hidden" : "notification" } id="notification">
        <div className={ this.props.error ? "alert alert-danger" : "alert alert-success" }>
          <p>
            { this.props.error && this.props.error }
            { this.props.message && this.props.message }
          </p>
        </div>
      </div>
    );
  }
}

// Prop validations
Notification.propTypes = {
  error: PropTypes.string,
  message: PropTypes.string,
  clearNotification: PropTypes.func,
};

const mapStateToProps = ({ notificationState }) => {
  return {
    error: notificationState.error,
    message: notificationState.message,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearNotification: () => dispatch(clearNotification()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
