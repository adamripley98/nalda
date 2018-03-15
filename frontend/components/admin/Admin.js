// Import frameworks
import React, { Component } from 'react';
import autosize from 'autosize';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

// Import components
import ErrorMessage from '../shared/ErrorMessage';
import Loading from '../shared/Loading';
import Blurb from '../shared/Blurb';
import Sidebar from './Sidebar';

// Import actions
import {notifyMessage} from '../../actions/notification';

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
      manageHomepageSuccess: '',
      manageAdminSuccess: '',
      bannerContentId: '',
      bannerImageToAdd: '',
      bannerImagePreview: '',
      bannerImageName: '',
      recommendedContentId: '',
      fromTheEditorsContentId: '',
      naldaVideosContentId: '',
      pending: true,
      curator: [],
      admin: [],
      users: [],
      banner: [],
      recommended: [],
      fromTheEditors: [],
      naldaVideos: [],
    };

    // Bind this to helper methods
    this.onDrop = this.onDrop.bind(this);
    this.editHomepage = this.editHomepage.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangeBannerContentId = this.handleChangeBannerContentId.bind(this);
    this.handleChangeRecommended = this.handleChangeRecommended.bind(this);
    this.handleChangeFromTheEditors = this.handleChangeFromTheEditors.bind(this);
    this.handleChangeNaldaVideos = this.handleChangeNaldaVideos.bind(this);
    this.onSubmitAdmin = this.onSubmitAdmin.bind(this);
    this.onSubmitCurator = this.onSubmitCurator.bind(this);
    this.onSubmitRemoveCurator = this.onSubmitRemoveCurator.bind(this);
    this.onSubmitRemoveBannerContent = this.onSubmitRemoveBannerContent.bind(this);
    this.onSubmitChangeBanner = this.onSubmitChangeBanner.bind(this);
    this.onSubmitChangeRecommended = this.onSubmitChangeRecommended.bind(this);
    this.onSubmitRemoveRecommendedContent = this.onSubmitRemoveRecommendedContent.bind(this);
    this.onSubmitRemoveFromTheEditorsContent = this.onSubmitRemoveFromTheEditorsContent.bind(this);
    this.onSubmitChangeFromTheEditors = this.onSubmitChangeFromTheEditors.bind(this);
    this.onSubmitChangeNaldaVideos = this.onSubmitChangeNaldaVideos.bind(this);
    this.displayCurators = this.displayCurators.bind(this);
    this.displayAdmins = this.displayAdmins.bind(this);
    this.displayUsers = this.displayUsers.bind(this);
    this.displayUserData = this.displayUserData.bind(this);
    this.displayArticles = this.displayArticles.bind(this);
    this.displayListings = this.displayListings.bind(this);
    this.displayVideos = this.displayVideos.bind(this);
    this.displayBanner = this.displayBanner.bind(this);
    this.sidebarCallback = this.sidebarCallback.bind(this);
    this.displayAdminForm = this.displayAdminForm.bind(this);
  }

  componentDidMount() {
    // Scroll to the top of the screen
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
          recommended: resp.data.data.homepageContent ? resp.data.data.homepageContent.recommended : null,
          fromTheEditors: resp.data.data.homepageContent ? resp.data.data.homepageContent.fromTheEditors : null,
          naldaVideos: resp.data.data.homepageContent ? resp.data.data.homepageContent.naldaVideos : null,
          pending: false,
          to: "",
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
  handleChangeBannerContentId(event) {
    this.setState({
      bannerContentId: event.target.value,
    });
  }

  // Handle when admin types into recommended field
  handleChangeRecommended(event) {
    this.setState({
      recommendedContentId: event.target.value,
    });
  }

  // Handle when admin types into from the editors field
  handleChangeFromTheEditors(event) {
    this.setState({
      fromTheEditorsContentId: event.target.value,
    });
  }

  // Handle when admin types into videos field
  handleChangeNaldaVideos(event) {
    this.setState({
      naldaVideosContentId: event.target.value,
    });
  }

  // Handle a callback to the sidebar
  sidebarCallback(to) {
    this.setState({
      to,
      error: "",
    });
  }

  // Helper method to change which images are on the banner
  onSubmitChangeBanner(event) {
    event.preventDefault();
    const bannerContentId = this.state.bannerContentId;
    const bannerImageToAdd = this.state.bannerImageToAdd;
    if (!bannerContentId) {
      this.setState({
        error: 'Enter a content Id.',
      });
    } else if (!bannerImageToAdd) {
      this.setState({
        error: 'Select an image to upload.',
      });
    } else {
      // Post to backend to add content to banner
      axios.post('/api/home/banner/add', {
        bannerContentId,
        bannerImageToAdd,
      })
      .then((resp) => {
        if (!resp.data.success) {
          this.setState({
            error: resp.data.error,
            bannerContentId: '',
            bannerImageToAdd: '',
            bannerImageName: '',
            bannerImagePreview: '',
          });
        } else {
          // Notify success
          this.props.notifyMessage("Successfully added banner image.");

          // Set the state
          this.setState({
            error: '',
            manageHomepageSuccess: 'Banner content updated.',
            banner: resp.data.data,
            bannerContentId: '',
            bannerImageToAdd: '',
            bannerImageName: '',
            bannerImagePreview: '',
          });
        }
      })
      .catch((err) => {
        this.setState({
          error: err,
          manageHomepageSuccess: '',
          bannerContentId: '',
          bannerImageToAdd: '',
        });
      });
    }
  }

  // Helper method to remove a banner item
  onSubmitRemoveBannerContent(bannerContentId) {
    axios.post(`/api/home/banner/remove/${bannerContentId}`)
    .then((resp) => {
      if (!resp.data.success) {
        this.setState({
          error: resp.data.error,
        });
      } else {
        this.props.notifyMessage("Successfully removed banner image");
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

  // Helper method to remove an item from recommended section
  onSubmitRemoveRecommendedContent(recommendedContentId) {
    axios.post(`/api/home/recommended/remove/${recommendedContentId}`)
    .then((resp) => {
      if (!resp.data.success) {
        this.setState({
          error: resp.data.error,
        });
      } else {
        this.setState({
          error: '',
          recommended: resp.data.data,
        });
      }
    })
    .catch((err) => {
      this.setState({
        error: err,
      });
    });
  }

  // Helper method to remove an item from the from the editors section
  onSubmitRemoveFromTheEditorsContent(fromTheEditorsContentId) {
    axios.post(`/api/home/fromTheEditors/remove/${fromTheEditorsContentId}`)
    .then((resp) => {
      if (!resp.data.success) {
        this.setState({
          error: resp.data.error,
        });
      } else {
        this.setState({
          error: '',
          fromTheEditors: resp.data.data,
        });
      }
    })
    .catch((err) => {
      this.setState({
        error: err,
      });
    });
  }

  // Helper method to remove an item from the nalda videos section
  onSubmitRemoveNaldaVideosContent(naldaVideosContentId) {
    axios.post(`/api/home/naldaVideos/remove/${naldaVideosContentId}`)
    .then((resp) => {
      if (!resp.data.success) {
        this.setState({
          error: resp.data.error,
        });
      } else {
        this.setState({
          error: '',
          naldaVideos: resp.data.data,
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
          manageAdminSuccess: "",
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
          manageAdminSuccess: "Successfully added new admin.",
          admins: newAdmins,
          users: newUsers,
          curators: newCurators,
          email: '',
        });
      }
    }).catch(err => {
      this.setState({
        error: err,
        manageAdminSuccess: "",
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
          manageAdminSuccess: "",
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
          manageAdminSuccess: "Successfully added curator.",
          admins: newAdmins,
          users: newUsers,
          curators: newCurators,
          email: '',
        });
      }
    }).catch((err) => {
      this.setState({
        error: err,
        manageAdminSuccess: "",
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
          manageAdminSuccess: "",
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
          manageAdminSuccess: "Successfully removed curator.",
          curators: newCurators,
          users: newUsers,
          email: '',
        });
      }
    }).catch((err) => {
      this.setState({
        error: err,
        manageAdminSuccess: "",
      });
    });
  }

  // Helper method to handle changing recommended content on homepage
  onSubmitChangeRecommended(event) {
    event.preventDefault();
    axios.post('/api/home/recommended/add', {
      contentId: this.state.recommendedContentId,
    })
    .then((resp) => {
      if (resp.data.success) {
        // TODO Show on frontend that item has been added
        this.setState({
          error: '',
          manageHomepageSuccess: 'Content added to Recommended.',
          recommended: resp.data.data,
          recommendedContentId: '',
        });
      } else {
        this.setState({
          error: resp.data.error,
          recommendedContentId: '',
        });
      }
    })
    .catch((err) => {
      this.setState({
        error: err,
      });
    });
  }

  // Helper method to handle changing from the editors content on homepage
  onSubmitChangeFromTheEditors(event) {
    event.preventDefault();
    axios.post('/api/home/fromTheEditors/add', {
      contentId: this.state.fromTheEditorsContentId,
    })
    .then((resp) => {
      if (resp.data.success) {
        // TODO Show on frontend that item has been added
        this.setState({
          error: '',
          manageHomepageSuccess: 'Content added to From the Editors.',
          fromTheEditors: resp.data.data,
          fromTheEditorsContentId: '',
        });
      } else {
        this.setState({
          error: resp.data.error,
          fromTheEditorsContentId: '',
        });
      }
    })
    .catch((err) => {
      this.setState({
        error: err,
        fromTheEditorsContentId: '',
      });
    });
  }

  // Helper method to handle changing videos content on homepage
  onSubmitChangeNaldaVideos(event) {
    event.preventDefault();
    axios.post('/api/home/naldaVideos/add', {
      contentId: this.state.naldaVideosContentId,
    })
    .then((resp) => {
      if (resp.data.success) {
        // TODO Show on frontend that item has been added
        this.setState({
          error: '',
          manageHomepageSuccess: 'Content added to Nalda Videos.',
          naldaVideos: resp.data.data,
          naldaVideosContentId: '',
        });
      } else {
        this.setState({
          error: resp.data.error,
          naldaVideosContentId: '',
          manageHomepageSuccess: '',
        });
      }
    })
    .catch((err) => {
      this.setState({
        error: err,
        naldaVideosContentId: '',
        manageHomepageSuccess: '',
      });
    });
  }

  // Helper method to display all curators
  displayCurators() {
    if (this.state.curators && this.state.curators.length) {
      const curators = this.state.curators.map((curator, i) => (
        <tr key={ curator.userId }>
          <th scope="row">
            {i + 1}
          </th>
          <td>
            <Link to={`/users/${curator.userId}`}>
              {curator.name}
            </Link>
          </td>
          <td>
            <a href={`mailto:${curator.username}`}>{ curator.username }</a>
          </td>
        </tr>
      ));

      return (
        <div>
          <h4 className="bold">
            Curators
          </h4>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
              </tr>
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
        <tr key={admin.userId}>
          <th scope="row">
            {i + 1}
          </th>
          <td>
            <Link to={`/users/${admin.userId}`}>
              {admin.name}
            </Link>
          </td>
          <td>
            <a href={`mailto:${admin.username}`}>{admin.username }</a>
          </td>
        </tr>
      ));

      return (
        <div>
          <h4 className="bold">
            Admins
          </h4>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
              </tr>
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
        <tr key={ user.userId }>
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
        <div>
          <h4 className="bold">
            Users
          </h4>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
              </tr>
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
        <tr key={ article._id }>
          <th scope="row">
            {i + 1}
          </th>
          <td>
            <Link to={`/articles/${article._id}`}>
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
        <div>
          <h4 className="bold">
            Articles
          </h4>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
                <th scope="col">Article ID</th>
              </tr>
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
        <tr key={ listing._id }>
          <th scope="row">
            {i + 1}
          </th>
          <td>
            <Link to={`/listings/${listing._id}`}>
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
        <div>
          <h4 className="bold">
            Listings
          </h4>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Listing ID</th>
              </tr>
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
        <tr key={video._id}>
          <th scope="row">
            {i + 1}
          </th>
          <td>
            <Link to={`/videos/${video._id}`}>
              {video.title}
            </Link>
          </td>
          <td>
            {video._id}
          </td>
        </tr>
      ));

      return (
        <div>
          <h4 className="bold">
            Videos
          </h4>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
                <th scope="col">Video ID</th>
              </tr>
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
  onDrop(acceptedFiles, rejectedFiles) {
    // Ensure at leat one valid image was uploaded
    if (acceptedFiles.length) {
      const image = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (upload) => {
        // Set images to state
        this.setState({
          bannerImageToAdd: upload.target.result,
          bannerImagePreview: image.preview,
          bannerImageName: image.name,
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
    let banner = null;
    if (this.state.banner && this.state.banner.length) {
      banner = this.state.banner.map((image, i) => {
        return (
          <li key={image.contentId}>
            <img
              src={image.contentImage}
              alt={"banner image " + i}
            />
            <div onClick={() => this.onSubmitRemoveBannerContent(image.contentId)}>
              <i className="fa fa-close" aria-hidden="true" />
            </div>
          </li>
        );
      });
    }

    return (
      <div>
        {
          this.state.manageHomepageSuccess ? (
            <div className="alert alert-success marg-bot-1">
              { this.state.manageHomepageSuccess }
            </div>
          ) : null
        }
        <h4>Banner</h4>
        <input
          type="text"
          placeholder="Content ID"
          className="form-control marg-bot-1 border"
          value={ this.state.bannerContentId }
          onChange={ this.handleChangeBannerContentId}
          rows="1"
        />
        {
          (this.state.bannerImageToAdd && this.state.bannerImagePreview) ? (
            <img src={this.state.bannerImagePreview} alt="Banner preview" className="img-fluid img" style={{width: "10rem"}} />
          ) : null
        }
        <Dropzone
          onDrop={(acceptedFiles, rejectedFiles) => this.onDrop(acceptedFiles, rejectedFiles)}
          accept="image/*"
          style={{ marginBottom: "1rem" }}
        >
          <p className="dropzone">
            <i className="fa fa-file-o" aria-hidden="true" />
            {
              this.state.bannerImageName ? (
                this.state.bannerImageName
              ) : ("Try dropping an image here, or click to select image to upload.")
            }
          </p>
        </Dropzone>
        <button
          onClick={e => this.onSubmitChangeBanner(e)}
          className={
            this.state.bannerContentId ? (
              "btn btn-primary cursor marg-bot-1"
            ) : (
              "btn btn-primary disabled marg-bot-1"
            )
          }
        >
          Add content to homepage banner
        </button>

        {
          (banner && banner.length) ? (
            <ul className="carousel-preview">
              {banner}
            </ul>
          ) : null
        }

        <div className="line" />
      </div>
    );
  }

  // Helper method to edit what is seen on homepage
  editHomepage() {
    let recommended = '';
    let fromTheEditors = '';
    let naldaVideos = '';
    if (this.state.recommended && this.state.recommended.length) {
      recommended = this.state.recommended.map((item, i) => (
        <tr key={item.contentId + "recommended"}>
          <th>{i + 1}</th>
          <td>{item.contentId}</td>
          <td onClick={() => this.onSubmitRemoveRecommendedContent(item.contentId)}>
            <i className="fa fa-close" aria-hidden="true" />
          </td>
        </tr>
      ));
    }
    if (this.state.fromTheEditors && this.state.fromTheEditors.length) {
      fromTheEditors = this.state.fromTheEditors.map((item, i) => (
        <tr key={item.contentId + "fromTheEditors"}>
          <th>{i + 1}</th>
          <td>{item.contentId}</td>
          <td onClick={() => this.onSubmitRemoveFromTheEditorsContent(item.contentId)}>
            <i className="fa fa-close" aria-hidden="true" />
          </td>
        </tr>
      ));
    }
    if (this.state.naldaVideos && this.state.naldaVideos.length) {
      naldaVideos = this.state.naldaVideos.map((item, i) => (
        <tr key={item.contentId + "naldaVideos"}>
          <th>{i + 1}</th>
          <td>{item.contentId}</td>
          <td onClick={() => this.onSubmitRemoveNaldaVideosContent(item.contentId)}>
            <i className="fa fa-close" aria-hidden="true" />
          </td>
        </tr>
      ));
    }
    return (
      <div>
        <form>
          <h4 className="bold marg-bot-1">
            Recommended
          </h4>
          <p className="marg-bot-1">
            Enter the content Id of the content you would like to appear in the recommended section of the homepage.
          </p>

          <div className="inline-field">
            <input
              type="text"
              placeholder="Content ID"
              className="form-control border"
              value={ this.state.recommendedContentId }
              onChange={ this.handleChangeRecommended }
              rows="1"
            />
            <button
              onClick={(e) => this.onSubmitChangeRecommended(e)}
              className={
                this.state.recommendedContentId ? (
                  "btn btn-primary cursor"
                ) : (
                  "btn btn-primary disabled"
                )
              }
            >
              Add
            </button>
          </div>
        </form>

        <div className="space-1" />

        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Content ID</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {recommended}
          </tbody>
        </table>

        <div className="line" />

        <form>
          <h4 className="bold marg-bot-1">
            From the Editors
          </h4>
          <p className="marg-bot-1">
            Enter the content Id of the content you would like to appear in the from the editors section of the homepage.
          </p>

          <div className="inline-field">
            <input
              type="text"
              placeholder="Content Id"
              className="form-control border"
              value={ this.state.fromTheEditorsContentId }
              onChange={ this.handleChangeFromTheEditors }
              rows="1"
            />
            <button
              onClick={(e) => this.onSubmitChangeFromTheEditors(e)}
              className={
                this.state.fromTheEditorsContentId ? (
                  "btn btn-primary cursor"
                ) : (
                  "btn btn-primary disabled"
                )
              }
            >
              Add
            </button>
          </div>
        </form>

        <div className="space-1" />

        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Content ID</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {fromTheEditors}
          </tbody>
        </table>

        <div className="line" />

        <form>
          <h4 className="bold marg-bot-1">
            Nalda Videos
          </h4>
          <p className="marg-bot-1">
            Enter the content Id of the content you would like to appear in the Nalda videos section of the homepage.
          </p>

          <div className="inline-field">
            <input
              type="text"
              placeholder="Content ID"
              className="form-control border"
              value={ this.state.naldaVideosContentId }
              onChange={ this.handleChangeNaldaVideos }
              rows="1"
            />
            <button
              onClick={(e) => this.onSubmitChangeNaldaVideos(e)}
              className={
                this.state.naldaVideosContentId ? (
                  "btn btn-primary cursor"
                ) : (
                  "btn btn-primary disabled"
                )
              }
            >
              Add
            </button>
          </div>
        </form>

        <div className="space-1" />

        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Content ID</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {naldaVideos}
          </tbody>
        </table>
      </div>
    );
  }

  // Display the form to manage admins
  displayAdminForm() {
    return (
      <form>
        <h4 className="bold marg-bot-1">
          Manage Admins
        </h4>
        <p className="marg-bot-1">
          Enter a user's email address in order to add them as an admin or as a content curator or to remove them as a content creator.
        </p>
        {
          this.state.manageAdminSuccess ? (
            <div className="alert alert-success marg-bot-1">
              { this.state.manageAdminSuccess }
            </div>
          ) : null
        }

        <input
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
    );
  }

  // Render the component
  render() {
    // If the app is pending
    if (this.state.pending) return (<Loading />);
    return (
      <div className="container-fluid">
        <div className="row">
          <Sidebar cb={(to) => this.sidebarCallback(to)} />
            <div className="col-12 col-md-8 col-lg-8 col-xl-7">
              <div className="space-1" />
              <ErrorMessage error={ this.state.error } />
              { this.state.to === "" && (
                <div>
                  <h4>Admin panel</h4>
                  Welcome to the admin panel; through this portion of the application you can keep track of your user base, recommended content, and created content.
                  { this.displayUserData() }
                </div>
              )}
              { this.state.to === "admins" && this.displayAdmins() }
              { this.state.to === "curators" && this.displayCurators() }
              { this.state.to === "users" && this.displayUsers() }
              { this.state.to === "manage-admins" && this.displayAdminForm() }
              { this.state.to === "listings" && this.displayListings() }
              { this.state.to === "articles" && this.displayArticles() }
              { this.state.to === "videos" && this.displayVideos() }
              { this.state.to === "homepage" && (
                <div>
                  {this.displayBanner()}
                  {this.editHomepage()}
                </div>
              )}
              <div className="space-2" />
            </div>
        </div>
      </div>
    );
  }
}

// Prop validations
Admin.propTypes = {
  notifyMessage: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    userId: state.authState.userId,
  };
};

// Redux
const mapDispatchToProps = dispatch => {
  return {
    notifyMessage: (message) => dispatch(notifyMessage(message)),
  };
};

Admin = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Admin);
export default Admin;
