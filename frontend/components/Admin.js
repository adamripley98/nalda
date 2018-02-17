// Import frameworks
import React, { Component } from 'react';
import autosize from 'autosize';
import axios from 'axios';
import uuid from 'uuid-v4';
import { Link } from 'react-router-dom';

// Import components
import ErrorMessage from './shared/ErrorMessage';
import Loading from './shared/Loading';
import Blurb from './shared/Blurb';

/**
 * Component for Admin only, allows them to add and remove other admins and content curators
 */
class Admin extends Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      email: "",
      error: "",
      success: "",
      pending: true,
      curator: [],
      admin: [],
      users: [],
    };

    // Bind this to helper methods
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.onSubmitAdmin = this.onSubmitAdmin.bind(this);
    this.onSubmitCurator = this.onSubmitCurator.bind(this);
    this.onSubmitRemoveCurator = this.onSubmitRemoveCurator.bind(this);
    this.displayCurators = this.displayCurators.bind(this);
    this.displayAdmins = this.displayAdmins.bind(this);
    this.displayUsers = this.displayUsers.bind(this);
    this.displayUserData = this.displayUserData.bind(this);
    this.displayArticles = this.displayArticles.bind(this);
    this.displayListings = this.displayListings.bind(this);
    this.displayVideos = this.displayVideos.bind(this);
  }

  componentDidMount() {
    // Resize textarea to fit input
    autosize(document.querySelectorAll('textarea'));
    // Pull data to display on admin panel
    axios.get('/api/admin')
    .then((resp) => {
      if (resp.data.success) {
        this.setState({
          curators: resp.data.data.curators,
          admins: resp.data.data.admins,
          users: resp.data.data.users,
          userData: resp.data.data.userData,
          articles: resp.data.data.articles,
          listings: resp.data.data.listings,
          videos: resp.data.data.videos,
          pending: false,
        });
      } else {
        this.setState({
          error: resp.data.error,
          pending: false,
        });
      }
    })
    .catch((err) => {
      this.setState({
        error: err,
        pending: false,
      });
    });
  }

  // Handle when a user types into the email field
  handleChangeEmail(event) {
    this.setState({
      email: event.target.value,
    });
  }

  // Handle a user submitting the form to add an admin
  onSubmitAdmin(event) {
    // Prevent the default action
    event.preventDefault();

    // Posts to routes.js
    axios.post('/api/admin/new', {
      userToAdd: this.state.email,
    })
    .then((resp) => {
      // Shows any errors
      if (resp.data.error) {
        this.setState({
          error: resp.data.error,
          success: "",
        });
      } else {
        this.setState({
          error: "",
          success: "Successfully added new admin."
        });
      }
    }).catch(err => {
      this.setState({
        error: err,
        success: "",
      });
    });
  }

  // Handle a user submitting the form to add a content curator
  onSubmitCurator(event) {
    // Prevent the default action
    event.preventDefault();
    // Posts to routes.js
    axios.post('/api/curator/new', {
      userToAdd: this.state.email,
    })
    .then((resp) => {
      // Shows any errors
      if (resp.data.error) {
        this.setState({
          error: resp.data.error,
          success: "",
        });
      } else {
        this.setState({
          error: "",
          success: "Successfully added curator.",
        });
      }
    }).catch((err) => {
      this.setState({
        error: err,
        success: "",
      });
    });
  }

  onSubmitRemoveCurator(event) {
    // Prevent the default action
    event.preventDefault();

    // Posts to routes.js
    axios.post('/api/curator/remove', {
      userToAdd: this.state.email,
    })
    .then((resp) => {
      // Shows any errors
      if (resp.data.error) {
        this.setState({
          error: resp.data.error,
          success: "",
        });
      } else {
        this.setState({
          error: "",
          success: "Successfully removed curator",
        });
      }
    }).catch((err) => {
      this.setState({
        error: err,
        success: "",
      });
    });
  }

  // Helper method to display all curators
  // TODO display nicer
  displayCurators() {
    if (this.state.curators && this.state.curators.length) {
      const curators = this.state.curators.map((curator, i) => (
        <tr key={ uuid() }>
          <th scope="row">
            {i + 1}
          </th>
          <td>
            <Link key={ uuid() } to={`/users/${curator.userId}`}>
              { curator.name }
            </Link>
          </td>
          <td>
            { curator.username }
          </td>
        </tr>
      ));

      return (
        <div className="marg-top-1 marg-bot-1">
          <h4 className="bold">
            Curators
          </h4>
          <table className="table">
            <thead>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
            </thead>
            <tbody>
              { curators }
            </tbody>
          </table>
        </div>
      );
    }
    return (
      <Blurb message="There are no curators to display." />
    );
  }

  // Helper method to display all admins
  displayAdmins() {
    if (this.state.admins && this.state.admins.length) {
      const admins = this.state.admins.map((admin, i) => (
        <tr key={ uuid() }>
          <th scope="row">
            {i + 1}
          </th>
          <td>
            <Link key={ uuid() } to={`/users/${admin.userId}`}>
              { admin.name }
            </Link>
          </td>
          <td>
            { admin.username }
          </td>
        </tr>
      ));

      return (
        <div className="marg-top-1 marg-bot-1">
          <h4 className="bold">
            Admins
          </h4>
          <table className="table">
            <thead>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
            </thead>
            <tbody>
              { admins }
            </tbody>
          </table>
        </div>
      );
    }
    return (
      <Blurb message="There are no admins to show." />
    );
  }

  // Helper method to display all users
  displayUsers() {
    if (this.state.users && this.state.users.length) {
      const users = this.state.users.map((user, i) => (
        <tr key={ uuid() }>
          <th scope="row">
            {i + 1}
          </th>
          <td>
            <Link key={ uuid() } to={`/users/${user.userId}`}>
              { user.name }
            </Link>
          </td>
          <td>
            { user.username }
          </td>
        </tr>
      ));

      return (
        <div className="marg-top-1 marg-bot-1">
          <h4 className="bold">
            Users
          </h4>
          <table className="table">
            <thead>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
            </thead>
            <tbody>
              { users }
            </tbody>
          </table>
        </div>
      );
    }
    return (
      <Blurb message="There are no users to display." />
    );
  }

  displayUserData() {
    return (
      <div className="tags big">
        <div className="space-1" />
        <span className="tag">
          <strong>Total users:</strong> {this.state.userData.totalUsers}
        </span>
        <span className="tag">
          <strong>New users this week:</strong> {this.state.userData.weeklyRegisters}
        </span>
      </div>
    );
  }

  // Helper method to display list of articles
  displayArticles() {
    if (this.state.articles && this.state.articles.length) {
      const articles = this.state.articles.map((article, i) => (
        <tr key={ uuid() }>
          <th scope="row">
            {i + 1}
          </th>
          <td>
            <Link key={ uuid() } to={`/articles/${article._id}`}>
              { article.title }
            </Link>
          </td>
          <td>
            {
              (article.subtitle.length > 50) ? (
                article.subtitle.substring(0, 50) + "..."
              ) : (
                article.subtitle
              )
            }
          </td>
        </tr>
      ));

      return (
        <div className="marg-top-1 marg-bot-1">
          <h4 className="bold">
            Articles
          </h4>
          <table className="table">
            <thead>
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">Subtitle</th>
            </thead>
            <tbody>
              { articles }
            </tbody>
          </table>
        </div>
      );
    }
    return (
      <Blurb message="There are no articles to display." />
    );
  }

  // Helper method to display list of listings
  displayListings() {
    if (this.state.listings && this.state.listings.length) {
      const listings = this.state.listings.map((listing, i) => (
        <tr key={ uuid() }>
          <th scope="row">
            {i + 1}
          </th>
          <td>
            <Link key={ uuid() } to={`/listings/${listing._id}`}>
              { listing.title }
            </Link>
          </td>
          <td>
            {
              (listing.description.length > 50) ? (
                listing.description.substring(0, 50) + "..."
              ) : (
                listing.description
              )
            }
          </td>
        </tr>
      ));

      return (
        <div className="marg-top-1 marg-bot-1">
          <h4 className="bold">
            Listings
          </h4>
          <table className="table">
            <thead>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
            </thead>
            <tbody>
              { listings }
            </tbody>
          </table>
        </div>
      );
    }
    return (
      <Blurb message="There are no listings to display." />
    );
  }

  // Helper method to display list of videos
  displayVideos() {
    if (this.state.videos && this.state.videos.length) {
      const videos = this.state.videos.map((video, i) => (
        <tr key={ uuid() }>
          <th scope="row">
            {i + 1}
          </th>
          <td>
            <Link key={ uuid() } to={`/videos/${video._id}`}>
              { video.title }
            </Link>
          </td>
          <td>
            {
              (video.description.length > 50) ? (
                video.description.substring(0, 50) + "..."
              ) : (
                video.description
              )
            }
          </td>
        </tr>
      ));

      return (
        <div className="marg-top-1 marg-bot-1">
          <h4 className="bold">
            Videos
          </h4>
          <table className="table">
            <thead>
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">Description</th>
            </thead>
            <tbody>
              { videos }
            </tbody>
          </table>
        </div>
      );
    }
    return (
      <Blurb message="There are no videos to display" />
    );
  }

  // Render the component
  render() {
    return (
      <div className="container">
        <div className="space-1" />
        <div className="row">
          <div className="col-12 col-md-10 col-lg-8 col-xl-6">
            <form>
              <h4 className="bold marg-bot-1">
                Admin panel
              </h4>
              <p className="marg-bot-1">
                Enter a user's email address in order to add them as an admin or as a content curator or to remove them as a content creator.
              </p>
              <ErrorMessage error={ this.state.error } />
              {
                this.state.success ? (
                  <div className="alert alert-success marg-bot-1">
                    { this.state.success }
                  </div>
                ) : null
              }

              <textarea
                type="text"
                placeholder="Email"
                className="form-control marg-bot-1 border"
                value={ this.state.email }
                onChange={ this.handleChangeEmail }
                rows="1"
              />

              <div className="row">
                <div className="col-6">
                  <button
                    onClick={(e) => this.onSubmitAdmin(e)}
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
                    onClick={(e) => this.onSubmitCurator(e)}
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
                    onClick={(e) => this.onSubmitRemoveCurator(e)}
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
            <div className="space-1" />
          </div>
        </div>
        { this.state.pending ? <Loading /> : (
          <div>
            {this.displayUserData()}
            {this.displayAdmins()}
            {this.displayCurators()}
            {this.displayUsers()}
            {this.displayArticles()}
            {this.displayListings()}
            {this.displayVideos()}
          </div>
        )}
        <div className="space-2" />
      </div>
    );
  }
}

export default Admin;
