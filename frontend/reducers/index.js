import { combineReducers } from 'redux';

// import reducers from other files
import loginReducer from './loginReducer';
import registerReducer from './registerReducer';

const rootReducer = combineReducers({
    loginState: loginReducer,
    registerState: registerReducer,
});

export default rootReducer;
