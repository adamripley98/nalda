import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Title from '../components/Title';
import Login from '../components/auth/Login';
import Home from '../components/Home';
import Register from '../components/auth/Register';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const AppContainer = ({ name }) => {
    return (
        <div>
            <Router>
              <div>
                <Title name={name} />
                <Switch>
                  <Route exact path="/" component={Login}/>
                  <Route exact path="/login" component={Login}/>
                  <Route exact path="/home" component={Home}/>
                  <Route exact path="/register" component={Register}/>
                </Switch>
              </div>
          </Router>
        </div>
    );
};

AppContainer.propTypes = {
    name: PropTypes.string,
};

const mapStateToProps = (state) => {
    return {
        name: state.name
    };
};

const mapDispatchToProps = (/* dispatch */) => {
    return {
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppContainer);
