// import { combineReducers } from 'redux';
import { REHYDRATE, PURGE, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';
// import reducers from other files
import loginReducer from './loginReducer';
import registerReducer from './registerReducer';

const config = {
    key: 'primary',
    storage
};

// root reducer combines all separate reducers and calls appropriate one
const rootReducer = persistCombineReducers(config, {
    loginState: loginReducer,
    registerState: registerReducer,
});

export default rootReducer;
