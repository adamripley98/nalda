// Import typical frameworks
import React from 'react';
import { render } from 'react-dom';

// Necessary for redux state persistence
import { persistStore } from 'redux-persist';
import { compose, createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import logger from 'redux-logger';
import Root from './containers/Root';

// Imported for styling
import './assets/stylesheets/base.scss';

// Create store for redux
const store = createStore(
   rootReducer,
   undefined,
   compose(
     applyMiddleware(logger),
   )
 );

// Allows persisting between refreshes
const persistor = persistStore(store);

// Persist Store allows redux state to not reset when page refresh
persistStore(
  store,
  null,
  () => store.getState()
);

render(
    <Root store={store} persistor={persistor}/>,
    document.getElementById('root')
);
