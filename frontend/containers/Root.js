import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import AppContainer from './AppContainer.js';
import { PersistGate } from 'redux-persist/es/integration/react';

// Wrapper component
const Root = ({ store, persistor }) => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <AppContainer />
    </PersistGate>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
  persistor: PropTypes.object.isRequired,
};

export default Root;
