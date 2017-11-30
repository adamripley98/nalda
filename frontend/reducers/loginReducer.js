// reducer which handles all events related to user login process
const loginReducer = (state = {userId: ''}, action) => {
    switch (action.type) {
        // when login event is called, will update redux state with userId so we know who is logged in
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
