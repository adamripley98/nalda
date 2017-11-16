import React from 'react';
import PropTypes from 'prop-types';
import { HashRouter, Route, Switch, Redirect, BrowserHistory } from 'react-router-dom';
import Register from './auth/Register.js';
import Login from './auth/Login.js';
import Home from './Home.js';

// const Title = ( { name } ) => {
//     return (
//     );
// };

class Title extends React.Component {
    render() {
        return (
          <HashRouter>
          <Switch>
              <Route exact path="/home" component={Home}/>
              <Route exact path="/signup" component={Register}/>
              <Route exact path="/login" component={Login} />
          </Switch>
          </HashRouter>
        );
    }
}

Title.propTypes = {
    name: PropTypes.string,
};


export default Title;
