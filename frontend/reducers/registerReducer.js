// reducer which handles all events related to user registration
const registerReducer = (state = {}, action) => {
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
