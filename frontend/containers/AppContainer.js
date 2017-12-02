// Import frameworks
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

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
              <Route exact path="/" component={Home}/>
              <Route exact path="/home" component={requireAuth(Home)}/>
              <Route exact path="/articles/new" component={ArticleForm} />
              <Route exact path="/listings/new" component={ListingForm} />
              <Route exact path="/videos/new" component={VideoForm} />
              <Route exact path="/articles/:id" component={Article} />
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
    userId: state.loginState.userId
  };
};

const mapDispatchToProps = (/* dispatch */) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainer);
