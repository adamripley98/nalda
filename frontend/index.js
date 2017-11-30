import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import logger from 'redux-logger';

// import { configureStore, history } from './store/configureStore';
import Root from './containers/Root';

import './assets/stylesheets/base.scss';

const store = createStore(rootReducer, applyMiddleware(logger));

render(
    <Root store={store} />,
    document.getElementById('root')
);
