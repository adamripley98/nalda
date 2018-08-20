// Import frameworks
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';

// Import actions
import { logout } from '../actions/index.js';
import { login } from '../actions/index.js';

// Shared and general components
import Nav from '../components/nav/Nav';
import Footer from '../components/footer/Footer';
import Notification from '../components/shared/Notification';

// Authorization components
import Login from '../components/auth/Login';
import requireCurator from '../components/auth/RequireCurator';
import requireAdmin from '../components/auth/RequireAdmin';
import requireLogin from '../components/auth/RequireLogin';
import Account from '../components/auth/Account';
import EditPassword from '../components/auth/EditPassword';
import ResetPassword from '../components/auth/ResetPassword';
import Verify from '../components/auth/Verify';

// Content viewing components
import Home from '../components/home/Home';
import ComponentPage from '../components/home/ComponentPage';
import Article from '../components/content/articles/Article';
import Articles from '../components/content/articles/Articles';
import Listing from '../components/content/listings/Listing';
import Listings from '../components/content/listings/Listings';
import Events from '../components/content/events/Events';
import Event from '../components/content/events/Event';
import Video from '../components/content/videos/Video';
import Videos from '../components/content/videos/Videos';
import Categories from '../components/content/listings/Categories';

// Content creation components
import ArticleForm from '../components/content/forms/ArticleForm';
import ListingForm from '../components/content/forms/ListingForm';
import VideoForm from '../components/content/forms/VideoForm';
import EventForm from '../components/content/forms/EventForm';

// Content editing components
import EditArticleForm from '../components/content/forms/EditArticleForm';
import EditListingForm from '../components/content/forms/EditListingForm';
import EditVideoForm from '../components/content/forms/EditVideoForm';
import EditEventForm from '../components/content/forms/EditEventForm';

// Other components
import About from '../components/About';
import Contact from '../components/Contact';
import Credits from '../components/Credits';
import Terms from '../components/Terms';
import Privacy from '../components/Privacy';
import NotFoundSection from '../components/NotFoundSection';
import Profile from '../components/profile/Profile';
import SearchResults from '../components/content/SearchResults';

// Admin routes
import Admin from '../components/admin/Admin';
import AdminWrapper from '../components/admin/AdminWrapper';
import ListAdmins from '../components/admin/tables/ListAdmins';
import ListCurators from '../components/admin/tables/ListCurators';
import ListUsers from '../components/admin/tables/ListUsers';
import ListArticles from '../components/admin/tables/ListArticles';
import ListListings from '../components/admin/tables/ListListings';
import ListVideos from '../components/admin/tables/ListVideos';
import ListEvents from '../components/admin/tables/ListEvents';
import ManageAdmins from '../components/admin/forms/ManageAdmins';
import ManageHomepage from '../components/admin/forms/ManageHomepage';

// Import routes
import {
  adminPath,
  adminAdminsPath,
  adminCuratorsPath,
  adminUsersPath,
  adminArticlesPath,
  adminListingsPath,
  adminVideosPath,
  adminEventsPath,
  manageAdminsPath,
  manageHomepagePath,
  searchResultsPath,
  componentPath,
} from '../routes';

/**
 * Component to handle routing on the frontend
 * When necessary, these components will pull data from the backend
 * Backend routes are prefixed with 'api/' and reside in '../backend/routes.js'
 *
 */

class AppContainer extends Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      redirectToLogin: false,
    };
  }

  /**
    * This method ensures that the state stored in redux persist does not outlast the backend setState.
    * If the backend and frontend states aren't synced, redirects to login and wipes redux state.
    * If the user attempted to login with facebook/google, will dispatch login action
   */
  componentDidMount() {
    window.scrollTo(0, 0);
    // Isolate variables
    const userId = this.props.userId;

    // Call to backend (routes.js)
    axios.get('/api/sync', {
      params: {
        userId,
      }
    })
      .then(resp => {
        // Redux persist and backend state are NOT synced. Need to wipe redux state and redirect to login
        if (!resp.data.success) {
          // Dispatch the logout action
          this.props.onLogout();
        } else {
          // Get the user from the response
          const user = resp.data.user;

          // If user is logged in through facebook on backend, update on Frontend
          if (resp.data.oAuthLogin) {
            // Send redux event
            this.props.onLogin(user.userId, user.userType, user.name, user.location || null, user.profilePicture);
          }
        }
      })
      .catch(() => {/* do nothing */});
  }

  // Render the application
  render() {
    return (
      <div>
        <Router>
          <div>
            <Nav />
            <Notification />
            <div className="nav-space" />
            <div className="app-content">
              <Switch>

                { /* User registration routes */ }
                <Route exact path="/login" component={Login}/>

                { /* Other user routes */ }
                <Route exact path="/account" component={requireLogin(Account)} />
                <Route exact path="/password" component={requireLogin(EditPassword)} />
                <Route exact path="/reset/:token" component={ResetPassword} />
                <Route exact path="/verify/:token" component={requireLogin(Verify)} />

                { /* Routes for viewing profiles */ }
                <Route exact path="/users/:id" component={Profile} />

                { /* General routes */ }
                <Route exact path="/about" component={About}/>
                <Route exact path="/contact" component={Contact}/>
                <Route exact path="/terms" component={Terms}/>
                <Route exact path="/privacy" component={Privacy}/>
                <Route exact path="/credits" component={Credits}/>
                <Route exact path={searchResultsPath} component={SearchResults}/>
                <Route exact path="/" component={Home}/>
                <Route exact path={componentPath} component={ComponentPage}/>

                { /* Admin routes */ }
                <Route
                  exact path={adminPath}
                  component={requireAdmin(() => (
                    <AdminWrapper>
                      <Admin />
                    </AdminWrapper>
                  ))}
                />
                <Route
                  exact path={adminAdminsPath}
                  component={requireAdmin(() => (
                    <AdminWrapper>
                      <ListAdmins />
                    </AdminWrapper>
                  ))}
                />
                <Route
                  exact path={adminCuratorsPath}
                  component={requireAdmin(() => (
                    <AdminWrapper>
                      <ListCurators />
                    </AdminWrapper>
                  ))}
                />
                <Route
                  exact path={adminUsersPath}
                  component={requireAdmin(() => (
                    <AdminWrapper>
                      <ListUsers />
                    </AdminWrapper>
                  ))}
                />
                <Route
                  exact path={adminArticlesPath}
                  component={requireAdmin(() => (
                    <AdminWrapper>
                      <ListArticles />
                    </AdminWrapper>
                  ))}
                />
                <Route
                  exact path={adminListingsPath}
                  component={requireAdmin(() => (
                    <AdminWrapper>
                      <ListListings />
                    </AdminWrapper>
                  ))}
                />
                <Route
                  exact path={adminVideosPath}
                  component={requireAdmin(() => (
                    <AdminWrapper>
                      <ListVideos />
                    </AdminWrapper>
                  ))}
                />
                <Route
                  exact path={adminEventsPath}
                  component={requireAdmin(() => (
                    <AdminWrapper>
                      <ListEvents />
                    </AdminWrapper>
                  ))}
                />
                <Route
                  exact path={manageAdminsPath}
                  component={requireAdmin(() => (
                    <AdminWrapper>
                      <ManageAdmins />
                    </AdminWrapper>
                  ))}
                />
                <Route
                  exact path={manageHomepagePath}
                  component={requireAdmin(() => (
                    <AdminWrapper>
                      <ManageHomepage />
                    </AdminWrapper>
                  ))}
                />

                { /* Routes for articles */ }
                <Route exact path="/articles" component={Articles} />
                <Route exact path="/articles/new" component={requireCurator(ArticleForm)} />
                <Route exact path="/articles/:id" component={Article} />
                <Route exact path="/articles/:id/edit" component={requireCurator(EditArticleForm)} />

                { /* Routes for listings */ }
                <Route exact path="/listings" component={Listings} />
                <Route exact path="/listings/new" component={requireCurator(ListingForm)} />
                <Route exact path="/listings/:id" component={Listing} />
                <Route exact path="/listings/:id/edit" component={requireCurator(EditListingForm)} />
                <Route exact path="/listings/categories/:categoryName" component={Categories} />

                { /* Routes for videos */ }
                <Route exact path="/videos" component={Videos} />
                <Route exact path="/videos/new" component={requireCurator(VideoForm)} />
                <Route exact path="/videos/:id" component={Video} />
                <Route exact path="/videos/:id/edit" component={requireCurator(EditVideoForm)} />

                { /* Routes for events */ }
                <Route exact path="/events/new" component={requireCurator(EventForm)} />
                <Route exact path="/events/:id/edit" component={requireCurator(EditEventForm)} />
                <Route exact path="/events" component={Events} />
                <Route exact path="/events/:id" component={Event} />

                { /* 404 if no other route was matched */ }
                <Route exact path="/*" component={NotFoundSection}/>

                {/* Redirect to the login page when the user signs out */}
                { (this.state.redirectToLogin && window.location.pathname !== "/login") && (<Redirect to="/login"/>) }
              </Switch>
            </div>
            <Footer />
          </div>
        </Router>
      </div>
    );
  }
}

AppContainer.propTypes = {
  userId: PropTypes.string,
  onLogout: PropTypes.func,
  onLogin: PropTypes.func,
  match: PropTypes.object,
};

// Necessary so we can access this.props.userId
const mapStateToProps = (state) => {
  return {
    userId: state.authState.userId,
  };
};

// Necessary so we can access this.props.onLogout()
const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch(logout()),
    onLogin: (userId, userType, name, location, profilePicture) => dispatch(login(userId, userType, name, location, profilePicture)),
  };
};

// Redux config
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainer);
