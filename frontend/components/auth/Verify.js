// Import frameworks
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

// Import components
import Thin from '../shared/Thin';

/**
 * Component rendered to tell user that they've been verified
 */
class Verify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verified: '',
      error: '',
    };
  }

  componentDidMount() {
    // Isolate token from URL
    const token = this.props.match.params.token;

    axios.get(`/api/verified/${token}`)
    .then((resp) => {
      if (resp.data.success) {
        this.setState({
          verified: true,
        });
      } else {
        this.setState({
          error: resp.data.error,
        });
      }
    })
    .catch((err) => {
      this.setState({
        error: err,
      });
    });
  }

  render() {
    return (
      <Thin>
        <div className="card pad-1 marg-top-1">
          <h2 className="bold marg-bot-1 dark-gray-text">
            Verification
          </h2>
          {
            this.state.verified ? (
              <div className="alert alert-success marg-bot-1">
                Your account has been verified!
              </div>
            ) : null
          }
          <Link to="/" className="btn btn-primary full-width">
            Back to home
          </Link>
        </div>
      </Thin>
    );
  }
}

Verify.propTypes = {
  match: PropTypes.object,
};

export default Verify;
