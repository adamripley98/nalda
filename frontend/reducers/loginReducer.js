// reducer which handles all events related to user login process
const loginReducer = (state = {'username': '', 'password': ''}, action) => {
    switch (action.type) {
        case 'LOGIN': {
            const newState = Object.assign({}, state);
            return newState;
        }
        case 'LOGINUSERNAME': {
            const newState = Object.assign({}, state);
            newState.username = action.username;
            return newState;
        }
        case 'LOGINPASSWORD': {
            const newState = Object.assign({}, state);
            newState.password = action.password;
            return newState;
        }
        default:
            return state;
    }
};

export default loginReducer;
