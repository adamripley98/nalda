// Import frameworks
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Shared and general components
import Nav from '../components/shared/Nav';
import Footer from '../components/shared/Footer';

// Authorization components
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import requireAuth from '../components/auth/Authenticate';

// Content viewing compontents
import Home from '../components/Home';
import Article from '../components/content/articles/Article';
import Articles from '../components/content/articles/Articles';
import Listing from '../components/content/listings/Listing';
import Listings from '../components/content/listings/Listings';
import Video from '../components/content/videos/Video';

// Content editing components
import ArticleForm from '../components/content/forms/ArticleForm';
import ListingForm from '../components/content/forms/ListingForm';
import VideoForm from '../components/content/forms/VideoForm';

// Other components
import About from '../components/About';
import Contact from '../components/Contact';
import NotFoundSection from '../components/NotFoundSection';

/**
 * Component to handle routing on the frontend
 * When necessary, these components will pull data from the backend
 * Backend routes are prefixed with 'api/' and reside in '../backend/routes.js'
 *
 * TODO make a call to the backend to sync the backend session with the frontend
 * session. This can be on component did mount or component did update
 */
class AppContainer extends Component {
  // Render the application
  render() {
    // Some routes require authentication, others don't
    return (
      <div>
        <Router>
          <div>
            <Nav />
            <div className="nav-space" />
            <div className="app-content">
              <Switch>
                { /* User registration routes */ }
                <Route exact path="/login" component={Login}/>
                <Route exact path="/register" component={Register}/>

                { /* General routes */ }
                <Route exact path="/about" component={About}/>
                <Route exact path="/contact" component={Contact}/>
                <Route exact path="/" component={requireAuth(Home)}/>

                { /* Routes for articles */ }
                <Route exact path="/articles/new" component={requireAuth(ArticleForm)} />
                <Route exact path="/articles/:id" component={Article} />
                <Route exact path="/articles" component={Articles} />

                { /* Routes for listings */ }
                <Route exact path="/listings/new" component={requireAuth(ListingForm)} />
                <Route exact path="/listings" components={Listings} />
                <Route exact path="/listings/:id" component={Listing} />

                { /* Routes for videos */ }
                <Route exact path="/videos/new" component={requireAuth(VideoForm)} />
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
};

const mapStateToProps = (state) => {
  return {
    userId: state.authState.userId
  };
};

const mapDispatchToProps = (/* dispatch */) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainer);
