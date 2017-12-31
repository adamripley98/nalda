// Import framworks
import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import Button from '../shared/Button';
import Loading from '../shared/Loading';

// Import components
import ErrorMessage from '../shared/ErrorMessage';

/**
 * Component to render a user's account information
 * TODO pull user data from the backend
 */
class Account extends Component {
  /**
   * Constructor method
   * TODO replace dummy data: bio, location, prof pic, etc.
   * TODO allow changing name, profile pic, password, location, and bio
   */
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      type: '',
      bio: 'Hello this is my bio. It describes who I am and what I am passionate for.',
      location: 'University City, PA',
      profilePicture: '',
      error: '',
      pending: false,
      adminPopover: false,
      editName: false,
    };

    // Bind this to helper methods
    this.handleAdminClick = this.handleAdminClick.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleNameClick = this.handleNameClick.bind(this);
  }

  /**
   * Pull the user's information from the database then render it
   */
  componentDidMount() {
    axios.get('/api/account', {
      params: {
        userId: this.props.userId,
      }
    })
    .then((resp) => {
      // If successful, will set state with user's information
      if (resp.data.success) {
        this.setState({
          name: resp.data.data.name,
          email: resp.data.data.username,
          type: resp.data.data.userType,
          error: "",
        });
      }
    }).catch((err) => {
      this.setState({
        error: err,
      });
    });
  }

  /**
   * When the component updates
   */
  componentDidUpdate() {
    if (this.state.editName) {
      // Focus on the name input upon clicking edit
      this.nameInput.focus();
    }
  }

  /**
   * Handle change name
   */
  handleChangeName(event) {
    this.setState({
      name: event.target.value,
    });
  }

  /**
   * Helper method to trigger edit name
   */
  handleNameClick() {
    if (this.state.editName) {
      /**
       * TODO save the updated name
       */
    }

    // Update the state
    this.setState({
      editName: !this.state.editName,
    });
  }

  /**
   * Helper method to trigger popup
   */
  handleAdminClick() {
    this.setState({
      adminPopover: !this.state.adminPopover,
    });
  }

  /**
   * Helper function to render a user's information
   */
  renderInfo() {
    return (
      <table className="table account">
        <tbody>
          <tr>
            <td className="bold">
              Name
            </td>
            <td>
              <span style={{ display: this.state.editName ? "none" : "inherit" }}>
                { this.state.name }
              </span>
              <input
                className="form-control"
                id="name"
                ref={(input) => { this.nameInput = input; }}
                value={ this.state.name }
                onChange={ this.handleChangeName }
                style={{ display: this.state.editName ? "inherit" : "none" }}
              />
            </td>
            <td>
              <i
                className="fa fa-pencil"
                aria-hidden="true"
                onClick={ this.handleNameClick }
              />
            </td>
          </tr>
          <tr>
            <td className="bold">
              Email
            </td>
            <td>
              { this.state.email }
            </td>
            <td>
              <i className="fa fa-pencil" aria-hidden="true" />
            </td>
          </tr>
          <tr>
            <td className="bold">
              Type
            </td>
            <td>
              { this.state.type }
            </td>
            <td>
              <i className="fa fa-question" aria-hidden="true" onClick={ this.handleAdminClick } />
              <div
                className="popover right"
                style={{ display: this.state.adminPopover ? "inherit" : "none" }}>
                A user can either be an admin, curator, or general user.
              </div>
            </td>
          </tr>
          <tr>
            <td className="bold">
              Bio
            </td>
            <td>
              { this.state.bio }
            </td>
            <td>
              <i className="fa fa-pencil" aria-hidden="true" />
            </td>
          </tr>
          <tr>
            <td className="bold">
              Location
            </td>
            <td>
              { this.state.location }
            </td>
            <td>
              <i className="fa fa-pencil" aria-hidden="true" />
            </td>
          </tr>
          <tr>
            <td className="bold">
              Password
            </td>
            <td>
              ●●●●●●●
            </td>
            <td>
              <Link to="/password">
                <i className="fa fa-pencil" aria-hidden="true" />
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  /**
   * Render the component
   */
  render() {
    // If user is logged in or if user successfully logs in, redirects to home
    return (
      <div>
        { /* Redirect the user to home if they are not logged in */ }
        { !this.props.userId && <Redirect to="/login" /> }

        <div className="container">
          <div className="row">
            <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2">
              <h4 className="bold marg-top-2 marg-bot-1">
                Account information
              </h4>
              { this.state.error && <ErrorMessage error={ this.state.error } /> }
              { this.state.pending ? <Loading /> : this.renderInfo() }
              {
                !this.state.pending && (
                  <div className="marg-top-1">
                    <Button />
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Account.propTypes = {
  userId: PropTypes.string,
};

// Allows us to access redux state as this.props.userId inside component
const mapStateToProps = state => {
  return {
    userId: state.authState.userId,
  };
};

// Allows us to dispatch a login event by calling this.props.onLogin
const mapDispatchToProps = () => {
  return {};
};

// Redux config
Account = connect(
    mapStateToProps,
    mapDispatchToProps
)(Account);

export default Account;
