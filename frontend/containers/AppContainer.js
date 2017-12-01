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
import ArticleForm from '../components/content/ArticleForm';
import ListingForm from '../components/content/ListingForm';
import VideoForm from '../components/content/VideoForm';
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
                  <Switch>
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/register" component={Register}/>
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/home" component={requireAuth(Home)}/>
                    <Route exact path="/articles/new" component={ArticleForm} />
                    <Route exact path="/listings/new" component={ListingForm} />
                    <Route exact path="/videos/new" component={VideoForm} />
                  </Switch>
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
    console.log('state insides app contin', state);
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
