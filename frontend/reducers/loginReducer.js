// reducer which handles all events related to user login process
const loginReducer = (state = {userId: ''}, action) => {
    switch (action.type) {
        case 'LOGIN': {
            const newState = Object.assign({}, state);
            newState.userId = action.userId;
            return newState;
        }
        default:
            return state;
    }
};

export default loginReducer;
