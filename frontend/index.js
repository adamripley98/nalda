import React from 'react';
import { render } from 'react-dom';
import { compose, createStore, applyMiddleware } from 'redux';
// import { autoRehydrate, persistStore } from 'redux-persist';
import { persistStore } from 'redux-persist';

import rootReducer from './reducers';
import logger from 'redux-logger';

// import { configureStore, history } from './store/configureStore';
import Root from './containers/Root';

import './assets/stylesheets/base.scss';

const store = createStore(
   rootReducer,
   undefined,
   compose(
     applyMiddleware(logger),
   )
 );

persistStore(
  store,
  null,
  () => store.getState()
);

render(
    <Root store={store} />,
    document.getElementById('root')
);
