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
import requireAuth from '../components/auth/Authenticate';

/**
 * Component to handle routing on the frontend
 *
 * TODO handle not found (404)
 */
let isLoggedIn = false;

class AppContainer extends Component {

    componentWillMount() {
        if (this.props.userId) {
            isLoggedIn = true;
        }
    }

    render() {
        console.log('WHAT IS PROPS OF APP CONTAINER', this.props);
        return (
          <div>
              <Router>
                <div>
                  <Switch>
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/register" component={Register}/>
                    <Route exact path="/" component={Home}/>
                    {/* <Route exact path="/home" render={() => (
                      !isLoggedIn ? (
                        <Redirect to="/login"/>
                      ) : (
                        <Home/>
                      )
                    )}/> */}
                    <Route exact path="/home" component={requireAuth(Home)}/>
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
