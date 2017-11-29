// reducer which handles all events related to user registration
const registerReducer = (state = {'username': '', 'password': '', 'verPassword': ''}, action) => {
    switch (action.type) {
        case 'REGISTER': {
            const newState = Object.assign({}, state);
            return newState;
        }
        case 'REGUSERNAME': {
            const newState = Object.assign({}, state);
            newState.username = action.username;
            return newState;
        }
        case 'REGPASSWORD': {
            const newState = Object.assign({}, state);
            newState.password = action.password;
            return newState;
        }
        case 'VERPASSWORD': {
            const newState = Object.assign({}, state);
            newState.verPassword = action.verPassword;
            return newState;
        }
        default:
            return state;
    }
};

export default registerReducer;
