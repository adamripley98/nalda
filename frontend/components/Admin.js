// Import frameworks
import React, { Component } from 'react';
import autosize from 'autosize';
import axios from 'axios';
import uuid from 'uuid-v4';
import { Link } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import async from 'async';

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
      contentId: '',
      imageToAdd: '',
      pending: true,
      curator: [],
      admin: [],
      users: [],
      banner: [],
    };

    // Bind this to helper methods
    this.onDrop = this.onDrop.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangeContentId = this.handleChangeContentId.bind(this);
    this.onSubmitAdmin = this.onSubmitAdmin.bind(this);
    this.onSubmitCurator = this.onSubmitCurator.bind(this);
    this.onSubmitRemoveCurator = this.onSubmitRemoveCurator.bind(this);
    this.onSubmitRemoveBannerContent = this.onSubmitRemoveBannerContent.bind(this);
    this.onSubmitChangeBanner = this.onSubmitChangeBanner.bind(this);
    this.displayCurators = this.displayCurators.bind(this);
    this.displayAdmins = this.displayAdmins.bind(this);
    this.displayUsers = this.displayUsers.bind(this);
    this.displayUserData = this.displayUserData.bind(this);
    this.displayArticles = this.displayArticles.bind(this);
    this.displayListings = this.displayListings.bind(this);
    this.displayVideos = this.displayVideos.bind(this);
    this.displayBanner = this.displayBanner.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
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
          banner: resp.data.data.homepageContent ? resp.data.data.homepageContent.banner : null,
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

  // Handle when admin types into content to add field
  handleChangeContentId(event) {
    this.setState({
      contentId: event.target.value,
    });
  }

  // Helper method to change which images are on the banner
  onSubmitChangeBanner(event) {
    event.preventDefault();
    const contentId = this.state.contentId;
    const imageToAdd = this.state.imageToAdd;
    if (!contentId) {
      this.setState({
        error: 'Enter a content Id.',
      });
    } else if (!imageToAdd) {
      this.setState({
        error: 'Select an image to upload.',
      });
    } else {
      // Post to backend to add content to banner
      axios.post('/api/home/banner/add', {
        contentId,
        imageToAdd,
      })
      .then((resp) => {
        if (resp.data.error) {
          this.setState({
            error: resp.data.error,
            contentId: '',
            imageToAdd: '',
          });
        } else {
          this.setState({
            error: '',
            success: 'Banner content updated.',
            banner: resp.data.data,
            contentId: '',
            imageToAdd: '',
          });
        }
      })
      .catch((err) => {
        this.setState({
          error: err,
          success: '',
          contentId: '',
          imageToAdd: '',
        });
      });
    }
  }

  // Helper method to remove a banner item
  onSubmitRemoveBannerContent(contentId) {
    axios.post(`/api/home/banner/remove/${contentId}`)
    .then((resp) => {
      if (!resp.data.success) {
        this.setState({
          error: resp.data.error,
        });
      } else {
        this.setState({
          error: '',
          banner: resp.data.data,
        });
      }
    })
    .catch((err) => {
      this.setState({
        error: err,
      });
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
        // Make copies of existing user types
        const newAdmins = this.state.admins.slice();
        // Add new admin
        newAdmins.push(resp.data.data.newAdmin);
        const newUsers = this.state.users.filter((user) => {
          return user.userId !== resp.data.data.newAdmin.userId;
        });
        const newCurators = this.state.curators.filter((user) => {
          return user.userId !== resp.data.data.newAdmin.userId;
        });
        this.setState({
          error: "",
          success: "Successfully added new admin.",
          admins: newAdmins,
          users: newUsers,
          curators: newCurators,
          email: '',
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
        // Make copies of existing user types
        const newCurators = this.state.curators.slice();
        // Add new admin
        newCurators.push(resp.data.data.newCurator);
        const newUsers = this.state.users.filter((user) => {
          return user.userId !== resp.data.data.newCurator.userId;
        });
        const newAdmins = this.state.curators.filter((user) => {
          return user.userId !== resp.data.data.newCurator.userId;
        });
        this.setState({
          error: "",
          success: "Successfully added curator.",
          admins: newAdmins,
          users: newUsers,
          curators: newCurators,
          email: '',
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
        const newUsers = this.state.users.slice();

        // Add new user (revoke from curator)
        newUsers.push(resp.data.data.removedCurator);
        // Remove curator
        const newCurators = this.state.curators.filter((user) => {
          return user.userId !== resp.data.data.removedCurator.userId;
        });
        this.setState({
          error: "",
          success: "Successfully removed curator.",
          curators: newCurators,
          users: newUsers,
          email: '',
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
            <a href={`mailto:${curator.username}`}>{ curator.username }</a>
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
            <a href={`mailto:${admin.username}`}>{admin.username }</a>
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
              { user.name }
          </td>
          <td>
            <a href={`mailto:${user.username}`}>{ user.username }</a>
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
              article._id
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
              <th scope="col">Article ID</th>
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
              listing._id
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
              <th scope="col">Listing ID</th>
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
              video._id
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
              <th scope="col">Video ID</th>
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

  // Helper method for image uploads
  // TODO some sort of frontend display that image has been uploaded
  onDrop(acceptedFiles, rejectedFiles) {
    // Ensure at leat one valid image was uploaded
    if (acceptedFiles.length) {
      const image = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (upload) => {
        // Set images to state
        this.setState({
          imageToAdd: upload.target.result,
          error: '',
        });
      };
      // File reader set up
      reader.onabort = () => this.setState({error: "File read aborted."});
      reader.onerror = () => this.setState({error: "File read error."});
      reader.readAsDataURL(image);
    }
    if (rejectedFiles.length) {
      // Display error with wrong file type
      this.setState({
        error: rejectedFiles[0].name + ' is not an image.',
      });
    }
  }

  // Helper method to display banner options
  displayBanner() {
    if (this.state.banner && this.state.banner.length) {
      const banner = this.state.banner.map((item) => (
        <div>
          <img alt="idk" src={`${item.contentImage}`}/>
          <div onClick={() => this.onSubmitRemoveBannerContent(item.contentId)}>DELETE </div>
        </div>
      ));
      return (
        <div className="col-6">
          <textarea
            type="text"
            placeholder="Content Id"
            className="form-control marg-bot-1 border"
            value={ this.state.contentId }
            onChange={ this.handleChangeContentId}
            rows="1"
          />
          <button
            onClick={(e) => this.onSubmitChangeBanner(e)}
            className={
              this.state.contentId ? (
                "btn btn-primary full-width cursor"
              ) : (
                "btn btn-primary full-width disabled"
              )
            }
          >
            Add content to homepage banner
          </button>
          { banner }
        </div>
      );
    }
    return (
      <div className="col-6">
        <textarea
          type="text"
          placeholder="Content Id"
          className="form-control marg-bot-1 border"
          value={ this.state.contentId }
          onChange={ this.handleChangeContentId}
          rows="1"
        />
        <Dropzone
          onDrop={(acceptedFiles, rejectedFiles) => this.onDrop(acceptedFiles, rejectedFiles)}
          accept="image/*"
          style={{ marginBottom: "1rem" }}
          >
          <p className="dropzone">
            <i className="fa fa-file-o" aria-hidden="true" />
            Try dropping an image here, or click to select image to upload.
          </p>
        </Dropzone>
        <button
          onClick={(e) => this.onSubmitChangeBanner(e)}
          className={
            this.state.contentId ? (
              "btn btn-primary full-width cursor"
            ) : (
              "btn btn-primary full-width disabled"
            )
          }
        >
          Add content to homepage banner
        </button>
      </div>
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
            {this.displayBanner()}
          </div>
        )}
        <div className="space-2" />
      </div>
    );
  }
}

export default Admin;
