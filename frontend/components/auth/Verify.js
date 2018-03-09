// Import frameworks
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

// Import components
import Thin from '../shared/Thin';
import Loading from '../shared/Loading';
import ErrorMessage from '../shared/ErrorMessage';

/**
 * Component rendered to tell user that they've been verified
 */
class Verify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verified: false,
      error: '',
      pending: true,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    // Isolate token from URL
    const token = this.props.match.params.token;

    axios.get(`/api/verified/${token}`)
      .then(resp => {
        if (resp.data.success) {
          this.setState({
            verified: true,
            pending: false,
          });
        } else {
          this.setState({
            error: resp.data.error,
            pending: false,
          });
        }
      })
      .catch(err => {
        this.setState({
          error: err,
          pending: false,
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
            this.state.pending ? <Loading /> : (
              <div>
                { this.state.verified ? (
                  <div className="alert alert-success marg-bot-1">
                    Your account has been verified!
                  </div>
                ) : null }
                <ErrorMessage error={this.state.error} />
                <Link to="/" className="btn btn-primary full-width">
                  Back to home
                </Link>
              </div>
            )
          }
        </div>
      </Thin>
    );
  }
}

Verify.propTypes = {
  match: PropTypes.object,
};

export default Verify;
