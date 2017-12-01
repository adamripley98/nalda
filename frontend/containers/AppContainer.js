// Import frameworks
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Import components
import Nav from '../components/shared/Nav';
import Login from '../components/auth/Login';
import Home from '../components/Home';
import Register from '../components/auth/Register';
import Footer from '../components/shared/Footer';
import ArticleForm from '../components/content/ArticleForm';
import ListingForm from '../components/content/ListingForm';
import VideoForm from '../components/content/VideoForm';

/**
 * Component to handle routing on the frontend
 *
 * TODO handle not found (404)
 */
const AppContainer = ({ name }) => {
    return (
        <div>
            <Router>
              <div>
                <Nav />
                <Switch>
                  <Route exact path="/" component={Home}/>
                  <Route exact path="/login" component={Login}/>
                  <Route exact path="/register" component={Register}/>
                  <Route exact path="/articles/new" component={ArticleForm} />
                  <Route exact path="/listings/new" component={ListingForm} />
                  <Route exact path="/videos/new" component={VideoForm} />
                </Switch>
                <Footer />
              </div>
          </Router>
        </div>
    );
};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (/* dispatch */) => {
  return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppContainer);
