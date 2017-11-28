const registerReducer = (state = {'username': '', 'password': '', 'confirmPassword': ''}, action) => {
    switch (action.type) {
        case 'REGISTER': {
            const newState = Object.assign({}, state);
            return newState;
        }
        default:
            return state;
    }
};

export default registerReducer;
