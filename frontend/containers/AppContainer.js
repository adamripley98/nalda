// Import frameworks
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Redirect } from 'react-router-dom';
import axios from 'axios';

// Import actions
import { logout } from '../actions/index.js';

// Shared and general components
import Nav from '../components/nav/Nav';
import Footer from '../components/shared/Footer';

// Authorization components
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import requireCurator from '../components/auth/RequireCurator';
import requireAdmin from '../components/auth/RequireAdmin';
import requireLogin from '../components/auth/RequireLogin';
import Account from '../components/auth/Account';
import EditPassword from '../components/auth/EditPassword';

// Content viewing components
import Home from '../components/Home';
import Article from '../components/content/articles/Article';
import Articles from '../components/content/articles/Articles';
import Listing from '../components/content/listings/Listing';
import Listings from '../components/content/listings/Listings';
import Video from '../components/content/videos/Video';
import Videos from '../components/content/videos/Videos';

// Content creation components
import ArticleForm from '../components/content/forms/ArticleForm';
import ListingForm from '../components/content/forms/ListingForm';
import VideoForm from '../components/content/forms/VideoForm';

// Other components
import About from '../components/About';
import Contact from '../components/Contact';
import Admin from '../components/Admin';
import NotFoundSection from '../components/NotFoundSection';

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
    * Note: could not be done in componentDidMount because this fired before this.props.userId was set (redux persist issue)
   */
  checkSynced(userId) {
    const onLogout = this.props.onLogout;
    // Call to backend (routes.js)
    axios.get('/api/sync', {
      params: {
        userId,
      }
    })
    .then((resp) => {
      // Redux persist and backend state are NOT synced. Need to wipe redux state and redirect to login
      if (!resp.data.success) {
        // Dispatch the action
        onLogout();
        // Set the state to redirect to login
        this.setState({
          redirectToLogin: true,
        });
      }
    })
    .catch((err) => {
      console.log('Error with syncing state', err);
    });
  }

  // Render the application
  render() {
    // Waits to call this until this.props has been populated (not immediate with redux persist)
    if (this.props.userId) {
      this.checkSynced(this.props.userId);
    }
    return (
      <div>
        <Router>
          <div>
            <Nav />
            <div className="nav-space" />
            <div className="app-content">
              <Switch>

                {/* Redirect to the login page when the user signs out */}
                { this.state.redirectToLogin && (<Redirect to="/login"/>) }

                { /* User registration routes */ }
                <Route exact path="/login" component={Login}/>
                <Route exact path="/register" component={Register}/>

                { /* Other user routes */ }
                <Route exact path="/account" component={Account} />
                <Route exact path="/password" component={EditPassword} />

                { /* General routes */ }
                <Route exact path="/about" component={About}/>
                <Route exact path="/contact" component={Contact}/>
                <Route exact path="/" component={requireLogin(Home)}/>

                { /* Admin routes */ }
                <Route exact path="/admin" component={requireAdmin(Admin)}/>

                { /* Routes for articles */ }
                <Route exact path="/articles" component={Articles} />
                <Route exact path="/articles/new" component={requireCurator(ArticleForm)} />
                <Route exact path="/articles/:id" component={Article} />

                { /* Routes for listings */ }
                <Route exact path="/listings" component={Listings} />
                <Route exact path="/listings/new" component={requireCurator(ListingForm)} />
                <Route exact path="/listings/:id" component={Listing} />

                { /* Routes for videos */ }
                <Route exact path="/videos" component={Videos} />
                <Route exact path="/videos/new" component={requireCurator(VideoForm)} />
                <Route exact path="/videos/:id" component={Video} />

                { /* 404 if no other route was matched */ }
                <Route exact path="/*" component={NotFoundSection}/>
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
  userType: PropTypes.string,
  onLogout: PropTypes.func,
};

// Necessary so we can access this.props.userId and this.props.userType
const mapStateToProps = (state) => {
  return {
    userId: state.authState.userId,
    userType: state.authState.userType,
  };
};

// Necessary so we can access this.props.onLogout()
const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch(logout()),
  };
};

// Redux config
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainer);
