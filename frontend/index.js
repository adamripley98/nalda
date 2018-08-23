// Import frameworks
import React from 'react';
import { render } from 'react-dom';

// Necessary for redux state persistence
import { persistStore } from 'redux-persist';
import { compose, createStore } from 'redux';
import rootReducer from './reducers';
import Root from './containers/Root';

// Imported for styling
import './assets/stylesheets/base.scss';

// Create store for redux
const store = createStore(
  rootReducer,
  undefined,
  compose()
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
    <Root store={store} persistor={persistor} />,
    document.getElementById('root')
);
