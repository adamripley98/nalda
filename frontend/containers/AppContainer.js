// Import frameworks
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Import components
import Nav from '../components/shared/Nav';
import Login from '../components/auth/Login';
import Home from '../components/Home';
import About from '../components/About';
import Contact from '../components/Contact';
import Register from '../components/auth/Register';
import Footer from '../components/shared/Footer';
import ArticleForm from '../components/content/forms/ArticleForm';
import ListingForm from '../components/content/forms/ListingForm';
import VideoForm from '../components/content/forms/VideoForm';
import Article from '../components/content/articles/Article';
import Articles from '../components/content/articles/Articles';
import Listing from '../components/content/listings/Listing';
import Video from '../components/content/videos/Video';
import NotFoundSection from '../components/NotFoundSection';
import requireAuth from '../components/auth/Authenticate';

// Component to handle routing on the frontend
class AppContainer extends Component {
  // Render the application
  render() {
    // Some routes require authentication, others don't
    return (
      <div>
        <Router>
          <div>
            <Nav />
            <div className="app-content">
              <Switch>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/register" component={Register}/>
                <Route exact path="/about" component={About}/>
                <Route exact path="/contact" component={Contact}/>
                <Route exact path="/" component={requireAuth(Home)}/>
                <Route exact path="/home" component={requireAuth(Home)}/>
                <Route exact path="/articles/new" component={requireAuth(ArticleForm)} />
                <Route exact path="/listings/new" component={requireAuth(ListingForm)} />
                <Route exact path="/videos/new" component={requireAuth(VideoForm)} />
                <Route exact path="/articles/:id" component={Article} />
                <Route exact path="/articles" component={Articles} />
                <Route exact path="/listings/:id" component={Listing} />
                <Route exact path="/videos/:id" component={Video} />
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
