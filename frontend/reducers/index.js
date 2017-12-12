// Frameworks necessary for state persistance
import { persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';

// Import reducers from other files
import authReducer from './authReducer';
import articleReducer from './articleReducer';

// Config necessary for state persistance
const config = {
  key: 'primary',
  storage
};

// Root reducer combines all separate reducers and calls appropriate one
const rootReducer = persistCombineReducers(config, {
  authState: authReducer,
  articleState: articleReducer,
});

export default rootReducer;
