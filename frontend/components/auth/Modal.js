// Import framworks
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Import actions
import { login } from '../../actions/index.js';

// Import components
import LoginModalForm from './LoginModalForm';
import RegisterModalForm from './RegisterModalForm';

/**
 * Component to render the form for a user logging in or registering
 */
class Modal extends Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      isLogin: this.props.isLogin,
    };

    // Bind this to helper functions
    this.updateStateToProps = this.updateStateToProps.bind(this);
  }

  /**
   * When the component mounts
   */
  componentDidMount() {
    // Autofocus on the email input when the modal mounts
    $('#loginModal').on('shown.bs.modal', () => {
      console.log("SHOWN");
      const email = $('#emailInput');
      if (email) {
        email.focus();
      } else {
        const firstName = $('#firstNameInput');
        if (firstName) firstName.focus();
      }
    });
  }

  /**
   * Handle when the component updates
   */
  componentDidUpdate(prevProps) {
    // If there was a change in the higher level state
    if (prevProps.isLogin !== this.props.isLogin) {
      this.updateStateToProps();
    }
  }

  /**
   * Update the state to match the props
   */
  updateStateToProps() {
    this.setState({
      isLogin: this.props.isLogin,
    });
  }

  // Renders the component
  render() {
    return (
      <div className="modal fade" id="loginModal" tabIndex="-1" role="dialog" aria-labelledby="loginModal" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content form">
            <div className="modal-header">
              <h5 className="modal-title">
                {
                  this.state.isLogin ? (
                    "Login to continue"
                  ) : (
                    "Register to continue"
                  )
                }
              </h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span className="bars" aria-hidden="true">
                  <span className="bar" />
                  <span className="bar" />
                </span>
              </button>
            </div>

            { this.state.isLogin ? <LoginModalForm /> : <RegisterModalForm /> }

            <div className="modal-footer">
              {
                this.state.isLogin ? (
                  <p className="marg-bot-0 center gray-text">
                    Don't have an account? <a
                      className="link-style"
                      onClick={ () => this.setState({ isLogin: false }) }
                    >
                      Register here.
                    </a>
                  </p>
                ) : (
                  <p className="marg-bot-0 center gray-text">
                    Already have an account? <a
                      className="link-style"
                      onClick={ () => this.setState({ isLogin: true }) }
                    >
                      Login here.
                    </a>
                  </p>
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  isLogin: PropTypes.bool,
  userId: PropTypes.string,
  onLogin: PropTypes.func,
};

// Allows us to access redux state as this.props.userId inside component
const mapStateToProps = state => {
  return {
    userId: state.authState.userId,
  };
};

// Allows us to dispatch a login event by calling this.props.onLogin
const mapDispatchToProps = dispatch => {
  return {
    onLogin: (userId, userType, name, location, profilePicture) => dispatch(login(userId, userType, name, location, profilePicture))
  };
};

// Redux config
Modal = connect(
  mapStateToProps,
  mapDispatchToProps
)(Modal);

export default Modal;
