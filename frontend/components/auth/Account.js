// Import framworks
import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import autosize from 'autosize';

// Import actions
import {changeFullName} from '../../actions/index.js';

// Import components
import ErrorMessage from '../shared/ErrorMessage';
import Button from '../shared/Button';
import Loading from '../shared/Loading';

/**
 * Component to render a user's account information
  */
class Account extends Component {
  /**
   * Constructor method
   * TODO replace dummy data: prof pic
   * TODO allow changing profile pic, password, location
   * TODO profile pic needs to be shown
   */
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      type: '',
      bio: '',
      location: '',
      profilePicture: '',
      error: '',
      pending: true,
      adminPopover: false,
      editName: false,
      editBio: false,
    };

    // Bind this to helper methods
    this.handleAdminClick = this.handleAdminClick.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleNameClick = this.handleNameClick.bind(this);
    this.handleChangeBio = this.handleChangeBio.bind(this);
    this.handleBioClick = this.handleBioClick.bind(this);
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
          bio: resp.data.data.bio,
          location: resp.data.data.location.name,
          error: "",
          pending: false
        });
      } else {
        this.setState({
          error: resp.data.error,
          pending: false,
        });
      }
    }).catch((err) => {
      this.setState({
        pending: false,
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
    } else if (this.state.editBio) {
      // Focus on the bio text area upon clicking edit
      this.bioInput.focus();

      // Autosize textareas
      autosize(document.querySelectorAll('textarea'));
    }
  }

  /**
   * Handle a change to the name state
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
    // Isolate function
    const changeName = this.props.changeName;

    if (this.state.editName) {
       // Save the updated name
      axios.post('/api/users/name', {
        userId: this.props.userId,
        name: this.state.name,
      })
      .then((resp) => {
        // If there was an error, display it
        if (!resp.data.success) {
          this.setState({
            error: resp.data.error,
          });
        } else {
          // change redux state
          changeName(this.state.name);
        }
      });
    }
    // Update the state
    this.setState({
      editName: !this.state.editName,
    });
  }

  /**
   * Handle a change to the bio state
   */
  handleChangeBio(event) {
    this.setState({
      bio: event.target.value,
    });
  }

  /**
   * Helper method to trigger edit bio
   */
  handleBioClick() {
    if (this.state.editBio) {
      // Save the updated bio
      axios.post('/api/users/bio', {
        userId: this.props.userId,
        bio: this.state.bio,
      })
      .then((resp) => {
        // If there was an error, display it
        if (!resp.data.success) {
          this.setState({
            error: resp.data.error,
          });
        }
      });
    }
    // Update the state
    this.setState({
      editBio: !this.state.editBio,
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
              <span style={{ display: this.state.editName && "none" }}>
                { this.state.name }
              </span>
              <input
                className="form-control"
                id="name"
                ref={(input) => { this.nameInput = input; }}
                value={ this.state.name }
                onChange={ this.handleChangeName }
                style={{ display: !this.state.editName && "none" }}
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
            <td />
          </tr>
          <tr>
            <td className="bold">
              Type
            </td>
            <td>
              { this.state.type }
              <div
                className="gray marg-top-1"
                style={{ display: this.state.adminPopover ? "inherit" : "none" }}>
                A user can either be an admin, curator, or general user. Only Nalda administrators can change your account type.
              </div>
            </td>
            <td>
              <i className="fa fa-question" aria-hidden="true" onClick={ this.handleAdminClick } />
            </td>
          </tr>
          <tr>
            <td className="bold">
              Bio
            </td>
            <td>
              <span style={{ display: this.state.editBio && "none" }}>
                { this.state.bio || <span className="gray-text">Add a bio here...</span> }
              </span>
              <textarea
                className="form-control"
                id="bio"
                ref={(input) => { this.bioInput = input; }}
                value={ this.state.bio }
                onChange={ this.handleChangeBio }
                style={{ display: !this.state.editBio && "none" }}
              />
            </td>
            <td>
              <i
                className="fa fa-pencil"
                aria-hidden="true"
                onClick={ this.handleBioClick }
              />
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
  changeName: PropTypes.func,
};

// Allows us to access redux state as this.props.userId inside component
const mapStateToProps = state => {
  return {
    userId: state.authState.userId,
  };
};

// Allows us to dispatch a changeName event by calling this.props.changeFullName
// NOTE this is necessary because name is stored in redux state to render on nav bar
// TODO Will need to dispatch a changeLocation event as well for same reason
const mapDispatchToProps = (dispatch) => {
  return {
    changeName: (name) => dispatch(changeFullName(name))
  };
};

// Redux config
Account = connect(
    mapStateToProps,
    mapDispatchToProps
)(Account);

export default Account;
