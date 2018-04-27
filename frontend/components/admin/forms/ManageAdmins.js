import React, {Component} from 'react';
import axios from 'axios';
import ErrorMessage from '../../shared/ErrorMessage';

class ManageAdmins extends Component {
  constructor(props) {
    super(props);

    // Set the default state
    this.state = {
      success: '',
      error: '',
      email: '',
      users: [],
      curators: [],
      admins: [],
    };

    // Bind this to helper methods
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSubmitAdmin = this.onSubmitAdmin.bind(this);
    this.onSubmitCurator = this.onSubmitCurator.bind(this);
    this.onSubmitRemoveCurator = this.onSubmitRemoveCurator.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    axios.get('/api/admin/admins')
    .then(resp1 => {
      axios.get('/api/admin/curators')
      .then(resp2 => {
        axios.get('/api/admin/users')
        .then(resp3 => {
          if (resp1.data.success && resp2.data.success && resp3.data.success) {
            this.setState({
              admins: resp1.data.admins,
              curators: resp2.data.curators,
              users: resp3.data.users,
            });
          } else {
            this.setState({error: 'Error pulling users.'});
          }
        });
      });
    })
    .catch(error => {
      this.setState({error});
    });
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  // Handle a user submitting the form to add an admin
  onSubmitAdmin(event) {
    // Prevent the default action
    event.preventDefault();
    if (!this.state.email) return;

    // Posts to routes.js
    axios.post('/api/admin/new', {
      userToAdd: this.state.email,
    })
    .then((resp) => {
      // Shows any errors
      if (resp.data.error) {
        this.setState({
          error: resp.data.error,
          success: '',
        });
        return;
      }
      this.setState({
        error: '',
        success: 'Successfully added new admin',
        email: '',
      });
    }).catch(err => {
      this.setState({
        error: err,
        success: '',
      });
    });
  }

  // Handle a user submitting the form to add a content curator
  onSubmitCurator(event) {
    // Prevent the default action
    event.preventDefault();
    if (!this.state.email) return;

    // Posts to routes.js
    axios.post('/api/curator/new', {
      userToAdd: this.state.email,
    })
    .then((resp) => {
      // Shows any errors
      if (resp.data.error) {
        this.setState({
          error: resp.data.error,
          success: '',
        });
        return;
      }
      this.setState({
        error: '',
        success: "Successfully added curator.",
        email: '',
      });
    }).catch((err) => {
      this.setState({
        error: err,
        success: '',
      });
    });
  }

  onSubmitRemoveCurator(event) {
    // Prevent the default action
    event.preventDefault();
    if (!this.state.email) return;

    // Posts to routes.js
    axios.post('/api/curator/remove', {
      userToAdd: this.state.email,
    })
    .then((resp) => {
      // Shows any errors
      if (resp.data.error) {
        this.setState({
          error: resp.data.error,
          success: '',
        });
      } else {
        const newUsers = this.state.users.slice();

        // Add new user (revoke from curator)
        newUsers.push(resp.data.data.removedCurator);
        // Remove curator
        const newCurators = this.state.curators.filter((user) => {
          return user.userId !== resp.data.data.removedCurator.userId;
        });
        this.setState({
          error: "",
          success: 'Successfully removed curator',
          curators: newCurators,
          users: newUsers,
          email: '',
        });
      }
    }).catch((err) => {
      this.setState({
        error: err,
        success: '',
      });
    });
  }

  render() {
    return(
      <form onSubmit={this.handleSubmit}>
        <h4 className="bold marg-bot-1">
          Manage Admins
        </h4>
        <p className="marg-bot-1">
          Enter a user's email address in order to add them as an admin or as a content curator or to remove them as a content creator.
        </p>
        <ErrorMessage error={this.state.error} />
        {
          this.state.success ? (
            <div className="alert alert-success marg-bot-1">
              { this.state.success }
            </div>
          ) : null
        }

        <input
          type="text"
          name="email"
          placeholder="Email"
          className="form-control marg-bot-1 border"
          value={this.state.email}
          onChange={this.handleChange}
          rows="1"
        />

        <div className="row">
          <div className="col-6">
            <button
              onClick={this.onSubmitAdmin}
              className={
                this.state.email ? (
                  "btn btn-primary full-width cursor"
                ) : (
                  "btn btn-primary full-width disabled"
                )
              }
            >
              Add as admin
            </button>
          </div>
          <div className="col-6">
            <button
              onClick={this.onSubmitCurator}
              className={
                this.state.email ? (
                  "btn btn-primary full-width cursor"
                ) : (
                  "btn btn-primary full-width disabled"
                )
              }
            >
              Add as curator
            </button>
          </div>
          <div className="col-12 marg-top-1">
            <button
              onClick={this.onSubmitRemoveCurator}
              className={
                this.state.email ? (
                  "btn btn-primary full-width cursor"
                ) : (
                  "btn btn-primary full-width disabled"
                )
              }
            >
              Remove curator
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export default ManageAdmins;
