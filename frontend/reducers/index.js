import { combineReducers } from 'redux';

// import reducers from other files
import loginReducer from './loginReducer';
import registerReducer from './registerReducer';

// root reducer combines all separate reducers and calls appropriate one
const rootReducer = combineReducers({
    loginState: loginReducer,
    registerState: registerReducer,
});

export default rootReducer;
