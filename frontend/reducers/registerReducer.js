// reducer which handles all events related to user registration
const registerReducer = (state = {}, action) => {
    switch (action.type) {
        // TODO: doesn't change state currently, might eventually if we add userId
        case 'REGISTER': {
            const newState = Object.assign({}, state);
            return newState;
        }
        default:
            return state;
    }
};

export default registerReducer;
