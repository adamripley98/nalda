// Import frameworks
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

// Import components
import Nav from '../components/shared/Nav';
import Login from '../components/auth/Login';
import Home from '../components/Home';
import Register from '../components/auth/Register';
import Footer from '../components/shared/Footer';
import ArticleForm from '../components/content/forms/ArticleForm';
import ListingForm from '../components/content/forms/ListingForm';
import VideoForm from '../components/content/forms/VideoForm';
import Article from '../components/content/articles/Article';
import NotFoundSection from '../components/NotFoundSection';
import requireAuth from '../components/auth/Authenticate';

/**
 * Component to handle routing on the frontend
 *
 * TODO handle not found (404)
 */
class AppContainer extends Component {
  // Render the application
  render() {
    return (
      <div>
        <Router>
          <div>
            <Nav />
            <Switch>
              <Route exact path="/login" component={Login}/>
              <Route exact path="/register" component={Register}/>
              <Route exact path="/" component={requireAuth(Home)}/>
              <Route exact path="/home" component={requireAuth(Home)}/>
              <Route exact path="/articles/new" component={requireAuth(ArticleForm)} />
              <Route exact path="/listings/new" component={requireAuth(ListingForm)} />
              <Route exact path="/videos/new" component={requireAuth(VideoForm)} />
              <Route exact path="/articles/:id" component={requireAuth(Article)} />
              <Route exact path="/404" component={NotFoundSection}/>
              <Redirect from="*" to="/404" push/>
            </Switch>
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
