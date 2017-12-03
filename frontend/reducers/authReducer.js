// reducer which handles all events related to user login process
const authReducer = (state = {}, action) => {
  switch (action.type) {
      // When login event is called, will update redux state with userId so we know who is logged in
    case 'LOGIN': {
      const newState = Object.assign({}, state);
      newState.userId = action.userId;
      return newState;
    }
    // When logout event is called, will remove user from redux state
    case 'LOGOUT': {
      const newState = Object.assign({}, state);
      newState.userId = null;
      return newState;
    }
    // When register event is called, doesn't update redux state for now
    case 'REGISTER': {
      const newState = Object.assign({}, state);
      return newState;
    }
    default:
      return state;
  }
};

export default authReducer;
