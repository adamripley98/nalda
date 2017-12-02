// Frameworks necessary for state persistance
import { persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';

// Import reducers from other files
import loginReducer from './loginReducer';
import registerReducer from './registerReducer';

// Config necessary for state persistance
const config = {
  key: 'primary',
  storage
};

// Root reducer combines all separate reducers and calls appropriate one
const rootReducer = persistCombineReducers(config, {
  loginState: loginReducer,
  registerState: registerReducer,
});

export default rootReducer;
